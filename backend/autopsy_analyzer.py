"""
autopsy_analyzer.py
--------------------
Extracts structured autopsy data from cleaned text.

Provider: Featherless AI (OpenAI-compatible API, free tier available)
  Base URL : https://api.featherless.ai/v1
  Model    : Qwen/Qwen3-32B  (strong JSON extraction, instruction-following)
  Sign up  : https://featherless.ai  (free — Google/GitHub login)

Fallback: Regex-based extraction if API key is missing or unavailable.
"""

import os
import json
import re
from openai import OpenAI, AuthenticationError, RateLimitError
from dotenv import load_dotenv
from fallback_extractor import extract_autopsy_fallback

load_dotenv()

# ── Featherless AI client (OpenAI-compatible) ────────────────────────────────
FEATHERLESS_MODEL = os.getenv("FEATHERLESS_MODEL", "Qwen/Qwen3-32B")

client = OpenAI(
    api_key=os.getenv("FEATHERLESS_API_KEY", ""),
    base_url="https://api.featherless.ai/v1",
)

STRUCTURE_PROMPT = """
You are a forensic data extraction assistant.

Your task is to extract structured information from an autopsy report.

⚠️ STRICT RULES:
- Return ONLY valid JSON
- Do NOT include explanations, comments, or extra text
- If a field is missing, return null

FORMAT:
{{
  "case_id": null,
  "body_temperature": null,
  "rigor_mortis": null,
  "livor_mortis": null,
  "decomposition_stage": null,
  "cause_of_death": null,
  "toxicity": null
}}

AUTOPSY REPORT:
{text}
"""

SUMMARY_PROMPT = """
You are a forensic investigation analyst.
Given the structured data extracted from an autopsy report (JSON), write a concise professional summary.

Include:
1. A brief overview of the deceased and circumstances
2. Key forensic findings (temperature, rigor mortis, injuries)
3. Cause and manner of death
4. Any notable anomalies or toxicology findings
5. Estimated time of death (if available)

Be factual. Do not speculate beyond what the data shows.

Structured Data:
{json_data}
"""


def _parse_openai_json(raw: str) -> dict:
    """Strip fences and parse JSON from OpenAI response."""
    raw = re.sub(r"^```(?:json)?\s*", "", raw, flags=re.MULTILINE)
    raw = re.sub(r"\s*```$", "", raw, flags=re.MULTILINE)
    raw = raw.strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass

    match = re.search(r"\{[\s\S]*\}", raw)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Could not parse JSON from OpenAI response:\n{raw[:400]}")


def structure_autopsy(cleaned_text: str) -> dict:
    """
    Extract structured autopsy fields from cleaned text.
    Tries Featherless AI first; falls back to regex if key is missing or API error.
    """
    api_key = os.getenv("FEATHERLESS_API_KEY", "")

    # Skip if key is missing or placeholder
    if not api_key or api_key.startswith("your-") or len(api_key) < 10:
        print("[Autopsy] No valid Featherless API key — using regex fallback.")
        return extract_autopsy_fallback(cleaned_text)

    try:
        prompt = STRUCTURE_PROMPT.format(text=cleaned_text)
        response = client.chat.completions.create(
            model=FEATHERLESS_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
        )
        result = _parse_openai_json(response.choices[0].message.content.strip())
        result["extraction_method"] = f"featherless:{FEATHERLESS_MODEL}"
        return result

    except (RateLimitError, AuthenticationError) as e:
        print(f"[Autopsy] Featherless unavailable ({type(e).__name__}) — using regex fallback.")
        result = extract_autopsy_fallback(cleaned_text)
        result["featherless_fallback_reason"] = str(e)[:120]
        return result

    except Exception as e:
        print(f"[Autopsy] Featherless error: {e} — using regex fallback.")
        result = extract_autopsy_fallback(cleaned_text)
        result["featherless_fallback_reason"] = str(e)[:120]
        return result


def generate_summary(structured_data: dict) -> str:
    """
    Generate a forensic narrative summary.
    Uses Featherless AI if available; returns a rule-based summary if not.
    """
    api_key = os.getenv("FEATHERLESS_API_KEY", "")

    if not api_key or api_key.startswith("your-") or len(api_key) < 10:
        return _rule_based_summary(structured_data)

    try:
        prompt = SUMMARY_PROMPT.format(json_data=json.dumps(structured_data, indent=2))
        response = client.chat.completions.create(
            model=FEATHERLESS_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        return response.choices[0].message.content.strip()

    except (RateLimitError, AuthenticationError):
        return _rule_based_summary(structured_data)
    except Exception:
        return _rule_based_summary(structured_data)


def _rule_based_summary(data: dict) -> str:
    """Build a factual summary from structured data without AI."""
    lines = ["FORENSIC ANALYSIS SUMMARY", "=" * 40]

    if data.get("cause_of_death"):
        lines.append(f"Cause of Death: {data['cause_of_death']}")
    else:
        lines.append("Cause of Death: Not determined from provided data.")

    if data.get("body_temperature"):
        lines.append(f"Body Temperature: {data['body_temperature']}")
    if data.get("rigor_mortis"):
        lines.append(f"Rigor Mortis: {data['rigor_mortis']}")
    if data.get("livor_mortis"):
        lines.append(f"Livor Mortis: {data['livor_mortis']}")
    if data.get("decomposition_stage"):
        lines.append(f"Decomposition: {data['decomposition_stage']}")
    if data.get("toxicity"):
        lines.append(f"Toxicology: {data['toxicity']}")

    method = data.get("extraction_method", "unknown")
    if method == "regex_fallback":
        lines.append("")
        lines.append("⚠ Note: Data extracted via regex pattern matching (OpenAI unavailable). Manual review recommended.")

    analysis = data.get("analysis", {})
    tod = (analysis or {}).get("time_of_death", {})
    if tod.get("estimated_window"):
        lines.append(f"Estimated TOD Window: {tod['estimated_window']}")

    risk = (analysis or {}).get("risk", {})
    if risk.get("risk_level"):
        lines.append(f"Risk Level: {risk['risk_level'].upper()} (Score: {risk.get('risk_score', 0)}/100)")

    return "\n".join(lines)
