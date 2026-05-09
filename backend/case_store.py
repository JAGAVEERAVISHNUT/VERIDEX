"""
case_store.py
-------------
File-based case storage.
Each case is stored as a JSON file: cases/{case_id}.json
No database required — portable and simple.
"""

from __future__ import annotations
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

CASES_DIR = Path(__file__).parent / "cases"
CASES_DIR.mkdir(exist_ok=True)


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _case_path(case_id: str) -> Path:
    return CASES_DIR / f"{case_id}.json"


def generate_case_id() -> str:
    year = datetime.now(timezone.utc).year
    short = uuid.uuid4().hex[:5].upper()
    return f"VX-{year}-{short}"


def create_case(title: str | None = None) -> dict:
    """Create a new empty case and persist it."""
    case_id = generate_case_id()
    case = {
        "case_id": case_id,
        "case_title": title or f"New Case — {case_id}",
        "status": "active",
        "created_at": _now(),
        "updated_at": _now(),
        "autopsy": None,
        "events": [],
        "analysis": None,
        "summary": None,
    }
    _case_path(case_id).write_text(json.dumps(case, indent=2), encoding="utf-8")
    return case


def get_case(case_id: str) -> dict | None:
    p = _case_path(case_id)
    if not p.exists():
        return None
    return json.loads(p.read_text(encoding="utf-8"))


def save_case(case: dict) -> dict:
    case["updated_at"] = _now()
    _case_path(case["case_id"]).write_text(json.dumps(case, indent=2), encoding="utf-8")
    return case


def list_cases() -> list[dict]:
    cases = []
    for p in CASES_DIR.glob("*.json"):
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
            cases.append({
                "case_id": data.get("case_id"),
                "case_title": data.get("case_title"),
                "status": data.get("status"),
                "created_at": data.get("created_at"),
                "updated_at": data.get("updated_at"),
                "has_autopsy": data.get("autopsy") is not None,
                "event_count": len(data.get("events", [])),
                "has_analysis": data.get("analysis") is not None,
                "risk_level": data.get("analysis", {}).get("risk", {}).get("risk_level") if data.get("analysis") else None,
                "risk_score": data.get("analysis", {}).get("risk", {}).get("risk_score") if data.get("analysis") else None,
                "confidence_score": data.get("analysis", {}).get("confidence", {}).get("confidence_score") if data.get("analysis") else None,
            })
        except Exception:
            continue
    cases.sort(key=lambda c: c.get("updated_at") or "", reverse=True)
    return cases


def delete_case(case_id: str) -> bool:
    p = _case_path(case_id)
    if p.exists():
        p.unlink()
        return True
    return False
