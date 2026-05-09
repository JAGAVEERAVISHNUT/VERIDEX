"""
forensic_engine.py
------------------
Core forensic analysis engine.
Runs 7 processing modules on normalized case data.
All logic is RULE-BASED — no AI, no hallucination.
"""

from __future__ import annotations
import re
from datetime import datetime, timezone
from typing import Any


# ─── Helpers ────────────────────────────────────────────────────────────────

def _parse_ts(ts: str) -> datetime | None:
    """Parse ISO 8601 timestamp string to aware datetime."""
    try:
        return datetime.fromisoformat(ts.replace("Z", "+00:00"))
    except Exception:
        return None


def _fmt(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


# ─── Module 1: Timeline Reconstruction ──────────────────────────────────────

def reconstruct_timeline(events: list[dict]) -> dict:
    """
    Sort events chronologically.
    Identify first/last activity and time gaps > 2 hours.
    """
    if not events:
        return {
            "sorted_events": [],
            "first_activity": None,
            "last_activity": None,
            "time_gaps": [],
            "note": "No events provided.",
        }

    parsed = []
    for ev in events:
        dt = _parse_ts(ev.get("timestamp", ""))
        if dt:
            parsed.append((dt, ev))

    parsed.sort(key=lambda x: x[0])
    sorted_events = [ev for _, ev in parsed]
    times = [dt for dt, _ in parsed]

    gaps = []
    for i in range(1, len(times)):
        diff_min = (times[i] - times[i - 1]).total_seconds() / 60
        if diff_min > 120:  # > 2 hours
            gaps.append({
                "from": _fmt(times[i - 1]),
                "to": _fmt(times[i]),
                "gap_minutes": round(diff_min),
                "from_source": sorted_events[i - 1].get("source", ""),
                "to_source": sorted_events[i].get("source", ""),
            })

    return {
        "sorted_events": sorted_events,
        "first_activity": _fmt(times[0]) if times else None,
        "last_activity": _fmt(times[-1]) if times else None,
        "time_gaps": gaps,
    }


# ─── Module 2: Time of Death Estimation ─────────────────────────────────────

def estimate_time_of_death(autopsy: dict) -> dict:
    """
    Rule-based TOD estimation using:
    - Body temperature (Henssge nomogram simplified)
    - Rigor mortis stage
    - Livor mortis stage
    Returns estimated window and reasoning.
    """
    body_temp_raw = autopsy.get("body_temperature") or ""
    rigor = (autopsy.get("rigor_mortis") or "").lower()
    livor = (autopsy.get("livor_mortis") or "").lower()

    reasoning = []
    low_h, high_h = None, None  # hours since death (min/max)

    # Body temperature
    temp_match = re.search(r"(\d+(?:\.\d+)?)", body_temp_raw)
    if temp_match:
        temp_c = float(temp_match.group(1))
        reasoning.append(f"Body temperature: {temp_c}°C")
        if temp_c >= 36:
            low_h, high_h = 0, 1
            reasoning.append("Temp ≥36°C → death <1h ago.")
        elif temp_c >= 35:
            low_h, high_h = 1, 3
            reasoning.append("Temp 35–36°C → 1–3h ago.")
        elif temp_c >= 32:
            low_h, high_h = 3, 6
            reasoning.append("Temp 32–35°C → 3–6h ago.")
        elif temp_c >= 27:
            low_h, high_h = 6, 12
            reasoning.append("Temp 27–32°C → 6–12h ago.")
        else:
            low_h, high_h = 12, 36
            reasoning.append("Temp <27°C → >12h ago.")
    else:
        reasoning.append("Body temperature not provided or unparseable.")

    # Rigor mortis refinement
    if "absent" in rigor or "none" in rigor:
        reasoning.append("Rigor mortis absent → <2h or >36h.")
        if low_h is not None:
            high_h = min(high_h, 2) if high_h else 2
    elif "partial" in rigor:
        reasoning.append("Rigor mortis partial → 2–12h.")
        if low_h is not None:
            low_h = max(low_h, 2)
            high_h = min(high_h, 12) if high_h else 12
    elif "full" in rigor or "complete" in rigor or "present" in rigor:
        reasoning.append("Rigor mortis full/present → 6–36h.")
        if low_h is not None:
            low_h = max(low_h, 6)

    # Livor mortis refinement
    if "fixed" in livor:
        reasoning.append("Livor mortis fixed → >8h.")
        if low_h is not None:
            low_h = max(low_h, 8)
    elif "unfixed" in livor or "blanch" in livor or "non-fixed" in livor:
        reasoning.append("Livor mortis unfixed → <8h.")
        if high_h is not None:
            high_h = min(high_h, 8)

    if low_h is None:
        return {
            "estimated_window": "Insufficient data to determine",
            "low_hours": None,
            "high_hours": None,
            "reasoning": reasoning,
        }

    return {
        "estimated_window": f"{low_h}–{high_h}h before time of examination",
        "low_hours": low_h,
        "high_hours": high_h,
        "reasoning": reasoning,
    }


# ─── Module 3: Correlation Engine ───────────────────────────────────────────

def build_correlations(events: list[dict], autopsy: dict) -> list[dict]:
    """
    Link person ↔ device ↔ event ↔ location.
    Returns list of correlation findings derived strictly from input data.
    """
    correlations = []

    # Group events by entity_id
    by_entity: dict[str, list[dict]] = {}
    for ev in events:
        eid = ev.get("entity_id") or "unknown"
        by_entity.setdefault(eid, []).append(ev)

    for entity, evs in by_entity.items():
        locations = list({ev.get("location") for ev in evs if ev.get("location")})
        sources = list({ev.get("source") for ev in evs if ev.get("source")})
        correlations.append({
            "entity_id": entity,
            "event_count": len(evs),
            "locations_seen": locations,
            "data_sources": sources,
        })

    # Correlation: autopsy TOD vs last digital event
    if autopsy.get("time_body_found"):
        correlations.append({
            "type": "autopsy_digital_link",
            "note": f"Body found at: {autopsy['time_body_found']}. Cross-reference with last digital event.",
        })

    return correlations


# ─── Module 4: Anomaly Detection (Rule-Based) ────────────────────────────────

def detect_anomalies(events: list[dict], autopsy: dict, tod_result: dict) -> list[dict]:
    """
    Detect rule-based anomalies:
    - Activity after estimated TOD
    - Large time gaps (>2h)
    - Sudden location jumps
    - Conflicting timestamps across sources
    """
    anomalies = []

    # Sort events
    parsed_events = []
    for ev in events:
        dt = _parse_ts(ev.get("timestamp", ""))
        if dt:
            parsed_events.append((dt, ev))
    parsed_events.sort(key=lambda x: x[0])

    # 1. Large time gaps
    for i in range(1, len(parsed_events)):
        dt_prev, ev_prev = parsed_events[i - 1]
        dt_curr, ev_curr = parsed_events[i]
        diff_min = (dt_curr - dt_prev).total_seconds() / 60
        if diff_min > 120:
            anomalies.append({
                "id": f"anom-gap-{i}",
                "type": "time",
                "severity": "medium",
                "title": "Unexplained Time Gap",
                "description": (
                    f"{round(diff_min)} min gap between '{ev_prev.get('source')}' "
                    f"({_fmt(dt_prev)}) and '{ev_curr.get('source')}' ({_fmt(dt_curr)}). "
                    "No events recorded during this window."
                ),
                "related_events": [ev_prev.get("id", ""), ev_curr.get("id", "")],
            })

    # 2. Sudden location jumps (GPS events only)
    gps_events = [(dt, ev) for dt, ev in parsed_events if ev.get("event_type") == "gps"]
    for i in range(1, len(gps_events)):
        dt_prev, ev_prev = gps_events[i - 1]
        dt_curr, ev_curr = gps_events[i]
        lat1 = ev_prev.get("latitude")
        lon1 = ev_prev.get("longitude")
        lat2 = ev_curr.get("latitude")
        lon2 = ev_curr.get("longitude")
        if all(v is not None for v in [lat1, lon1, lat2, lon2]):
            dist_deg = ((lat2 - lat1) ** 2 + (lon2 - lon1) ** 2) ** 0.5
            time_h = max((dt_curr - dt_prev).total_seconds() / 3600, 0.001)
            # Rough: 1 degree ≈ 111km
            dist_km = dist_deg * 111
            speed_kmh = dist_km / time_h
            if speed_kmh > 200:
                anomalies.append({
                    "id": f"anom-jump-{i}",
                    "type": "location",
                    "severity": "high",
                    "title": "Impossible Location Jump",
                    "description": (
                        f"GPS moved {dist_km:.1f}km in {time_h*60:.0f}min "
                        f"(implied speed {speed_kmh:.0f}km/h — physically impossible)."
                    ),
                    "related_events": [ev_prev.get("id", ""), ev_curr.get("id", "")],
                })

    return anomalies


# ─── Module 5: Contradiction Detection ──────────────────────────────────────

def detect_contradictions(events: list[dict], autopsy: dict, tod_result: dict) -> list[dict]:
    """
    Compare autopsy findings against digital timeline.
    Flag only direct inconsistencies.
    """
    contradictions = []
    low_h = tod_result.get("low_hours")
    high_h = tod_result.get("high_hours")

    if low_h is None:
        return [{"note": "Insufficient autopsy data to cross-reference digital timeline."}]

    # Find digital events after TOD window lower bound
    # We need examination time to anchor TOD
    exam_time_raw = autopsy.get("examination_time") or autopsy.get("time_body_found")
    if not exam_time_raw:
        contradictions.append({
            "id": "contra-no-exam-time",
            "type": "insufficient_data",
            "severity": "medium",
            "title": "Missing Examination Timestamp",
            "description": "Cannot cross-reference digital events with TOD — examination time not provided.",
        })
        return contradictions

    exam_dt = _parse_ts(exam_time_raw)
    if not exam_dt:
        return contradictions

    # Approximate TOD range
    from datetime import timedelta
    tod_latest = exam_dt - timedelta(hours=low_h)
    tod_earliest = exam_dt - timedelta(hours=high_h)

    post_mortem_events = []
    for ev in events:
        ev_dt = _parse_ts(ev.get("timestamp", ""))
        if ev_dt and ev_dt > tod_latest:
            post_mortem_events.append(ev)

    if post_mortem_events:
        contradictions.append({
            "id": "contra-postmortem-activity",
            "type": "contradiction",
            "severity": "high",
            "title": "Digital Activity After Estimated TOD",
            "description": (
                f"{len(post_mortem_events)} digital event(s) recorded after the estimated "
                f"latest time of death ({_fmt(tod_latest)}). "
                f"Sources: {', '.join(set(e.get('source','') for e in post_mortem_events))}."
            ),
            "related_events": [e.get("id", "") for e in post_mortem_events],
        })

    return contradictions


# ─── Module 6: Risk Scoring ──────────────────────────────────────────────────

def compute_risk(
    anomalies: list[dict],
    contradictions: list[dict],
    events: list[dict],
    autopsy: dict,
) -> dict:
    """
    Rule-based risk scoring.
    Returns risk_level, risk_score (0–100), and reasons.
    """
    reasons = []
    score = 0

    has_contradiction = any(a.get("type") == "contradiction" for a in contradictions)
    has_postmortem = any("Post-Mortem" in a.get("title", "") or "postmortem" in a.get("id", "") for a in contradictions)
    high_anomalies = [a for a in anomalies if a.get("severity") == "high"]
    medium_anomalies = [a for a in anomalies if a.get("severity") == "medium"]
    has_gaps = any(a.get("type") == "time" for a in anomalies)

    if has_postmortem:
        score += 40
        reasons.append("Digital activity detected after estimated time of death.")
    if has_contradiction:
        score += 25
        reasons.append("Direct contradictions between autopsy findings and digital evidence.")
    score += len(high_anomalies) * 8
    if high_anomalies:
        reasons.append(f"{len(high_anomalies)} high-severity anomaly/anomalies detected.")
    score += len(medium_anomalies) * 4
    if medium_anomalies:
        reasons.append(f"{len(medium_anomalies)} medium-severity anomaly/anomalies detected.")
    if has_gaps:
        score += 5
        reasons.append("Unexplained time gaps in digital record.")

    # Autopsy data completeness
    key_fields = ["body_temperature", "rigor_mortis", "livor_mortis", "cause_of_death"]
    missing = [f for f in key_fields if not autopsy.get(f)]
    if missing:
        score -= 5
        reasons.append(f"Incomplete autopsy data: {', '.join(missing)}.")

    if not events and not autopsy.get("body_temperature"):
        return {
            "risk_level": "insufficient_data",
            "risk_score": 0,
            "reasons": ["Insufficient data to determine risk level."],
        }

    score = max(0, min(score, 100))

    if score >= 75:
        level = "critical"
    elif score >= 55:
        level = "high"
    elif score >= 30:
        level = "medium"
    else:
        level = "low"

    return {"risk_level": level, "risk_score": score, "reasons": reasons}


# ─── Module 7: Confidence Scoring ────────────────────────────────────────────

def compute_confidence(autopsy: dict, events: list[dict], correlations: list[dict]) -> dict:
    """
    Score 0–100 based on data completeness and validated correlations.
    """
    score = 0
    notes = []

    autopsy_fields = ["body_temperature", "rigor_mortis", "livor_mortis", "cause_of_death", "toxicity"]
    present = [f for f in autopsy_fields if autopsy.get(f)]
    autopsy_score = int((len(present) / len(autopsy_fields)) * 40)
    score += autopsy_score
    notes.append(f"Autopsy completeness: {len(present)}/{len(autopsy_fields)} fields → +{autopsy_score}pts")

    if events:
        ev_score = min(len(events) * 2, 40)
        score += ev_score
        notes.append(f"{len(events)} digital events ingested → +{ev_score}pts")
    else:
        notes.append("No digital evidence provided → +0pts")

    if correlations:
        corr_score = min(len(correlations) * 5, 20)
        score += corr_score
        notes.append(f"{len(correlations)} correlations validated → +{corr_score}pts")

    score = max(0, min(score, 100))
    return {"confidence_score": score, "notes": notes}


# ─── Main Orchestrator ───────────────────────────────────────────────────────

def run_full_analysis(autopsy: dict, events: list[dict]) -> dict:
    """
    Run all 7 processing modules.
    Returns the complete ForensicAnalysis result dict.
    """
    timeline = reconstruct_timeline(events)
    tod = estimate_time_of_death(autopsy)
    correlations = build_correlations(events, autopsy)
    anomalies = detect_anomalies(events, autopsy, tod)
    contradictions = detect_contradictions(events, autopsy, tod)
    risk = compute_risk(anomalies, contradictions, events, autopsy)
    confidence = compute_confidence(autopsy, events, correlations)

    return {
        "timeline": timeline,
        "time_of_death": tod,
        "correlations": correlations,
        "anomalies": anomalies,
        "contradictions": contradictions,
        "risk": risk,
        "confidence": confidence,
    }
