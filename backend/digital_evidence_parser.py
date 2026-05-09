"""
digital_evidence_parser.py
--------------------------
Parses structured digital evidence JSON (CCTV, Mobile, GPS, System Logs)
into the unified event schema required by the forensic engine.

Accepted JSON format:
{
  "case_id": "...",
  "events": [
    {
      "timestamp": "2025-03-14T23:12:00Z",
      "event_type": "cctv | mobile | gps | witness | system",
      "source": "CAM-114",
      "entity_id": "subject-001",
      "location": "Westbridge & 4th",
      "description": "...",
      "metadata": {}
    }
  ]
}

GPS events may also use:
  "latitude": 40.7388, "longitude": -73.962

Mobile events may also use:
  "activity_type": "call | sms | app",
  "tower_location": "BR-22"
"""

from __future__ import annotations
import uuid
from typing import Any

VALID_EVENT_TYPES = {"cctv", "mobile", "gps", "witness", "system", "forensic"}


def _safe_str(val: Any) -> str:
    return str(val).strip() if val is not None else ""


def normalize_event(raw: dict, case_id: str) -> dict:
    """
    Normalize a raw event dict into the unified event schema.
    Unknown fields are preserved under 'metadata'.
    """
    known_fields = {
        "timestamp", "event_type", "source", "entity_id",
        "location", "description", "latitude", "longitude",
        "activity_type", "tower_location", "metadata", "id",
    }
    ev_type = _safe_str(raw.get("event_type")).lower()
    if ev_type not in VALID_EVENT_TYPES:
        ev_type = "unknown"

    # Location: prefer explicit field, fall back to tower_location for mobile
    location = _safe_str(raw.get("location"))
    if not location and raw.get("tower_location"):
        location = f"Cell Tower: {raw['tower_location']}"

    # Description: prefer explicit, fall back to activity_type
    description = _safe_str(raw.get("description"))
    if not description and raw.get("activity_type"):
        description = f"{ev_type.upper()} activity: {raw['activity_type']}"

    extra_meta = {k: v for k, v in raw.items() if k not in known_fields}
    if raw.get("metadata"):
        extra_meta.update(raw["metadata"])

    unified = {
        "id": _safe_str(raw.get("id")) or f"ev-{uuid.uuid4().hex[:8]}",
        "case_id": case_id,
        "timestamp": _safe_str(raw.get("timestamp")),
        "event_type": ev_type,
        "source": _safe_str(raw.get("source")),
        "entity_id": _safe_str(raw.get("entity_id")) or "unknown",
        "location": location,
        "description": description,
    }

    # Attach GPS coords if present
    if raw.get("latitude") is not None:
        unified["latitude"] = float(raw["latitude"])
    if raw.get("longitude") is not None:
        unified["longitude"] = float(raw["longitude"])

    if extra_meta:
        unified["metadata"] = extra_meta

    return unified


def parse_digital_evidence(payload: dict) -> dict:
    """
    Main entry point.
    Input: raw JSON payload from the user.
    Output: { case_id, events: [UnifiedEvent], parse_errors: [] }
    """
    case_id = _safe_str(payload.get("case_id")) or "UNKNOWN"
    raw_events = payload.get("events", [])

    if not isinstance(raw_events, list):
        return {
            "case_id": case_id,
            "events": [],
            "parse_errors": ["'events' field must be a JSON array."],
        }

    unified_events = []
    errors = []

    for i, raw in enumerate(raw_events):
        if not isinstance(raw, dict):
            errors.append(f"Event[{i}] is not an object — skipped.")
            continue
        if not raw.get("timestamp"):
            errors.append(f"Event[{i}] missing 'timestamp' — skipped.")
            continue
        try:
            unified_events.append(normalize_event(raw, case_id))
        except Exception as e:
            errors.append(f"Event[{i}] parse error: {e}")

    return {
        "case_id": case_id,
        "events": unified_events,
        "parse_errors": errors,
        "event_count": len(unified_events),
    }
