"""
fallback_extractor.py
----------------------
Regex-based autopsy data extractor — used when OpenAI is unavailable.
Extracts key forensic fields using pattern matching on the cleaned text.
No AI, no external APIs required.
"""

from __future__ import annotations
import re


def _search(patterns: list[str], text: str, flags: int = re.IGNORECASE) -> str | None:
    for pat in patterns:
        m = re.search(pat, text, flags)
        if m:
            return m.group(1).strip()
    return None


def extract_autopsy_fallback(text: str) -> dict:
    """
    Extract autopsy fields from raw cleaned text using regex patterns.
    Returns None for fields that cannot be found.
    """

    # Body temperature
    body_temp = _search([
        r"body\s+temp(?:erature)?\s*[:\-–]?\s*([\d.]+\s*°?[CF]?)",
        r"core\s+temp(?:erature)?\s*[:\-–]?\s*([\d.]+\s*°?[CF]?)",
        r"rectal\s+temp(?:erature)?\s*[:\-–]?\s*([\d.]+\s*°?[CF]?)",
        r"hepatic\s+temp(?:erature)?\s*[:\-–]?\s*([\d.]+\s*°?[CF]?)",
        r"temp(?:erature)?\s+was\s+([\d.]+\s*°?[CF]?)",
        r"([\d.]+\s*°[CF])\s+(?:core|rectal|hepatic|body)",
    ], text)

    # Rigor mortis
    rigor = _search([
        r"rigor\s+mortis\s*[:\-–]?\s*([^.;\n]{3,60})",
        r"rigor\s*[:\-–]\s*([^.;\n]{3,60})",
        r"((?:absent|present|partial|full|complete|developing|resolving)[^.;\n]{0,40}rigor)",
        r"rigor\s+(?:was\s+)?(absent|present|partial|full|complete|developing)",
    ], text)

    # Livor mortis
    livor = _search([
        r"livor\s+mortis\s*[:\-–]?\s*([^.;\n]{3,80})",
        r"lividity\s*[:\-–]?\s*([^.;\n]{3,80})",
        r"post(?:mortem)?\s+(?:hypostasis|lividity)\s*[:\-–]?\s*([^.;\n]{3,80})",
        r"livor\s+(?:was\s+)?(fixed|unfixed|blanching|non-fixed|present|absent)",
    ], text)

    # Decomposition
    decomp = _search([
        r"decomposition\s*[:\-–]?\s*([^.;\n]{3,80})",
        r"decompos(?:ed|ing|ition)\s+([^.;\n]{3,60})",
        r"putrefaction\s*[:\-–]?\s*([^.;\n]{3,60})",
        r"(no\s+signs?\s+of\s+decomposition)",
    ], text)

    # Cause of death
    cause = _search([
        r"cause\s+of\s+death\s*[:\-–]?\s*([^.;\n]{5,120})",
        r"immediate\s+cause\s*[:\-–]?\s*([^.;\n]{5,120})",
        r"death\s+(?:was\s+)?(?:caused|due)\s+(?:by|to)\s+([^.;\n]{5,100})",
        r"final\s+cause\s*[:\-–]?\s*([^.;\n]{5,100})",
    ], text)

    # Toxicology
    tox = _search([
        r"toxicolog(?:y|ical)[^:\-–]*[:\-–]\s*([^.;\n]{5,200})",
        r"drug\s+screen\s*[:\-–]?\s*([^.;\n]{5,100})",
        r"blood\s+alcohol\s*[:\-–]?\s*([^.;\n]{5,60})",
        r"(positive\s+for\s+[^.;\n]{5,80})",
        r"(negative\s+for\s+[^.;\n]{5,80})",
        r"toxicology\s+(?:results?\s+)?(?:were\s+)?([^.;\n]{5,100})",
    ], text)

    # Case ID
    case_id = _search([
        r"case\s+(?:no|number|#|id)\s*[:\-–]?\s*([A-Z0-9\-]{3,20})",
        r"(?:autopsy|case)\s+#?\s*([A-Z0-9\-]{4,20})",
        r"file\s+(?:no|number|#)\s*[:\-–]?\s*([A-Z0-9\-]{3,20})",
    ], text)

    return {
        "case_id": case_id,
        "body_temperature": body_temp,
        "rigor_mortis": rigor,
        "livor_mortis": livor,
        "decomposition_stage": decomp,
        "cause_of_death": cause,
        "toxicity": tox,
        "extraction_method": "regex_fallback",
        "note": "Extracted using regex pattern matching (OpenAI unavailable). Review fields manually.",
    }
