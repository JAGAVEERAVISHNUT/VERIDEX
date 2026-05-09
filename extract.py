import zipfile
import os

try:
    with zipfile.ZipFile('Dataset/Dataset.rar', 'r') as zf:
        zf.extractall('Dataset')
    print("Extraction successful.")
except Exception as e:
    print(f"Extraction failed: {e}")
