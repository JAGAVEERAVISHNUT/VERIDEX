"""
main.py
-------
VERIDEX Forensic Intelligence API
Full pipeline: Ingest → Analyze → Store → Retrieve

Endpoints:
  POST /cases                     — Create empty case
  GET  /cases                     — List all cases
  GET  /cases/{id}                — Get full case
  DELETE /cases/{id}              — Delete case
  POST /cases/{id}/autopsy        — Upload autopsy PDF → analyze → attach to case
  POST /cases/{id}/evidence       — Upload digital evidence JSON → parse → attach to case
  POST /cases/{id}/process        — Run full forensic engine on case
  GET  /health                    — Health check
"""

import os
import json
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from pdf_extractor import extract_and_clean
from autopsy_analyzer import structure_autopsy, generate_summary
from digital_evidence_parser import parse_digital_evidence
from forensic_engine import run_full_analysis
from case_store import create_case, get_case, save_case, list_cases, delete_case

load_dotenv()

app = FastAPI(
    title="VERIDEX Forensic Intelligence API",
    description="AI-powered forensic investigation system — evidence ingestion, rule-based analysis, explainable insights.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health ───────────────────────────────────────────────────────────────────

@app.get("/health", tags=["System"])
def health():
    return {"status": "ok", "service": "VERIDEX Forensic API", "version": "2.0.0"}


# ── Cases ────────────────────────────────────────────────────────────────────

@app.post("/cases", tags=["Cases"])
def create_new_case(body: dict = Body(default={})):
    """Create a new empty case."""
    title = body.get("title") if body else None
    case = create_case(title)
    return JSONResponse(content=case, status_code=201)


@app.get("/cases", tags=["Cases"])
def list_all_cases():
    """List all cases with summary info."""
    return {"cases": list_cases(), "total": len(list_cases())}


@app.get("/cases/{case_id}", tags=["Cases"])
def get_full_case(case_id: str):
    """Get a full case by ID."""
    case = get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")
    return JSONResponse(content=case)


@app.delete("/cases/{case_id}", tags=["Cases"])
def delete_existing_case(case_id: str):
    """Delete a case."""
    if not delete_case(case_id):
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")
    return {"message": f"Case '{case_id}' deleted."}


# ── Autopsy Ingestion ─────────────────────────────────────────────────────────

@app.post("/cases/{case_id}/autopsy", tags=["Ingestion"])
async def upload_autopsy(case_id: str, file: UploadFile = File(...)):
    """
    Upload an autopsy PDF for a case.
    Extracts text, sends to OpenAI for structuring, attaches to case.
    """
    case = get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted for autopsy reports.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        print(f"[Autopsy] Extracting text from {file.filename}...")
        cleaned_text = extract_and_clean(tmp_path)

        if not cleaned_text:
            raise HTTPException(
                status_code=422,
                detail="Could not extract text from PDF. It may be image-based (scanned).",
            )

        print("[Autopsy] Sending to OpenAI for structuring...")
        structured = structure_autopsy(cleaned_text)
        structured["source_file"] = file.filename
        structured["raw_text_preview"] = cleaned_text[:300] + "..." if len(cleaned_text) > 300 else cleaned_text

        case["autopsy"] = structured
        save_case(case)

        return JSONResponse(content={
            "message": "Autopsy report processed and attached to case.",
            "case_id": case_id,
            "autopsy": structured,
        })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Autopsy pipeline error: {str(e)}")
    finally:
        os.unlink(tmp_path)


# ── Digital Evidence Ingestion ────────────────────────────────────────────────

@app.post("/cases/{case_id}/evidence", tags=["Ingestion"])
async def upload_evidence(case_id: str, file: UploadFile = File(...)):
    """
    Upload a digital evidence JSON file (CCTV, mobile, GPS logs).
    Parses and normalizes events, attaches to case.
    """
    case = get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")

    if not file.filename.lower().endswith(".json"):
        raise HTTPException(status_code=400, detail="Only JSON files are accepted for digital evidence.")

    content = await file.read()
    try:
        payload = json.loads(content)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {e}")

    result = parse_digital_evidence(payload)
    new_events = result.get("events", [])

    # Merge with existing events (dedup by id)
    existing_ids = {ev["id"] for ev in case.get("events", [])}
    merged = case.get("events", []) + [ev for ev in new_events if ev["id"] not in existing_ids]
    case["events"] = merged
    save_case(case)

    return JSONResponse(content={
        "message": f"Digital evidence parsed. {len(new_events)} events ingested.",
        "case_id": case_id,
        "events_ingested": len(new_events),
        "total_events": len(merged),
        "parse_errors": result.get("parse_errors", []),
    })


# ── Full Analysis ─────────────────────────────────────────────────────────────

@app.post("/cases/{case_id}/process", tags=["Analysis"])
async def process_case(case_id: str):
    """
    Run the full forensic engine on an existing case.
    Requires at least autopsy data or digital events.
    """
    case = get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")

    autopsy = case.get("autopsy") or {}
    events = case.get("events") or []

    if not autopsy and not events:
        raise HTTPException(
            status_code=422,
            detail="Insufficient data: upload at least an autopsy report or digital evidence before processing.",
        )

    print(f"[Process] Running forensic engine on case {case_id}...")
    analysis = run_full_analysis(autopsy, events)

    # Generate AI summary if autopsy is available
    ai_summary = None
    if autopsy:
        try:
            print("[Process] Generating AI narrative summary...")
            ai_summary = generate_summary({**autopsy, "analysis": analysis})
        except Exception as e:
            ai_summary = f"Summary generation failed: {e}"

    case["analysis"] = analysis
    case["summary"] = ai_summary
    case["status"] = "active"
    save_case(case)

    return JSONResponse(content={
        "message": "Forensic analysis complete.",
        "case_id": case_id,
        "risk_level": analysis["risk"]["risk_level"],
        "risk_score": analysis["risk"]["risk_score"],
        "confidence_score": analysis["confidence"]["confidence_score"],
        "anomaly_count": len(analysis["anomalies"]),
        "contradiction_count": len(analysis["contradictions"]),
        "analysis": analysis,
        "summary": ai_summary,
    })
