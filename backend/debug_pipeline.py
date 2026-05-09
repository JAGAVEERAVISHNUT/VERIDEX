"""
debug_pipeline.py
-----------------
Run this to see exactly what OpenAI returns for the autopsy PDF.
Usage: python debug_pipeline.py autopsyreportsample.pdf
"""
import sys
import json
from pdf_extractor import extract_and_clean
from autopsy_analyzer import client, STRUCTURE_PROMPT
import re

pdf_path = sys.argv[1] if len(sys.argv) > 1 else "autopsyreportsample.pdf"

print("=" * 60)
print("STEP 1: Extracting + cleaning text...")
text = extract_and_clean(pdf_path)
print(f"Text length: {len(text)} chars")
print("--- First 800 chars ---")
print(text[:800])

print("\n" + "=" * 60)
print("STEP 2: Sending to OpenAI...")

prompt = STRUCTURE_PROMPT.format(text=text)
response = client.chat.completions.create(
    model="gpt-4.1-mini",
    messages=[{"role": "user", "content": prompt}],
    temperature=0,
)
raw = response.choices[0].message.content
print("--- Raw OpenAI response ---")
print(raw)

print("\n" + "=" * 60)
print("STEP 3: Parsing JSON...")

# Try direct
try:
    parsed = json.loads(raw.strip())
    print("✅ Direct parse succeeded!")
    print(json.dumps(parsed, indent=2))
    sys.exit(0)
except json.JSONDecodeError as e:
    print(f"❌ Direct parse failed: {e}")

# Try stripping fences
cleaned = re.sub(r"^```(?:json)?\s*", "", raw.strip(), flags=re.MULTILINE)
cleaned = re.sub(r"\s*```$", "", cleaned, flags=re.MULTILINE).strip()
try:
    parsed = json.loads(cleaned)
    print("✅ After fence-strip parse succeeded!")
    print(json.dumps(parsed, indent=2))
    sys.exit(0)
except json.JSONDecodeError as e:
    print(f"❌ After fence-strip parse failed: {e}")

# Try regex extraction
match = re.search(r"\{[\s\S]*\}", cleaned)
if match:
    try:
        parsed = json.loads(match.group())
        print("✅ Regex extraction succeeded!")
        print(json.dumps(parsed, indent=2))
        sys.exit(0)
    except json.JSONDecodeError as e:
        print(f"❌ Regex extraction failed: {e}")

print("❌ All parsing strategies failed.")
