"""
pdf_extractor.py
----------------
Step 1 & 2: Extract raw text from a PDF and clean it.
"""

import re
import pdfplumber


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract all text from a PDF file using pdfplumber."""
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


def clean_text(text: str) -> str:
    """
    Clean raw extracted text:
    - Collapse multiple whitespace / newlines into single spaces
    - Remove non-printable characters
    - Strip leading/trailing whitespace
    """
    # Replace newlines and tabs with a space
    text = re.sub(r"[\r\n\t]+", " ", text)
    # Collapse multiple spaces
    text = re.sub(r" {2,}", " ", text)
    # Remove non-printable / control characters
    text = re.sub(r"[^\x20-\x7E°]", "", text)
    return text.strip()


def extract_and_clean(pdf_path: str) -> str:
    """Full pipeline: PDF path → cleaned text string."""
    raw = extract_text_from_pdf(pdf_path)
    return clean_text(raw)
