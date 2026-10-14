"""Re-render manually curated figures; needs PyMuPDF and Pillow, not site dependencies.

Usage: python scripts/render-research-teasers.py --pdf-dir /path/to/verified-pdfs
PDF filenames must be their manifest pdfSha256 followed by .pdf.
This does not auto-select figures or modify the source manifest.
"""
import argparse
import hashlib
import json
from pathlib import Path
import pymupdf
from PIL import Image

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--pdf-dir', type=Path, required=True)
args = parser.parse_args()
repo = Path(__file__).resolve().parent.parent
records = json.loads((repo/'src/data/researchTeasers.json').read_text())
for record in records:
    source = args.pdf_dir/f"{record['pdfSha256']}.pdf"
    if hashlib.sha256(source.read_bytes()).hexdigest() != record['pdfSha256']:
        raise ValueError(f"Source hash mismatch: {record['title']}")
    with pymupdf.open(source) as document:
        pixmap = document[record['page']-1].get_pixmap(
            matrix=pymupdf.Matrix(2.5, 2.5),
            clip=pymupdf.Rect(record['cropPdfPoints']), alpha=False)
        image = Image.frombytes('RGB', (pixmap.width, pixmap.height), pixmap.samples)
    image.thumbnail((1280, 10000))
    if image.size != (record['width'], record['height']):
        raise ValueError(f"Unexpected dimensions: {record['title']}")
    image.save(repo/f"public{record['assetPath']}", quality=88, method=6)
    image.thumbnail((640, 10000))
    image.save(repo/f"public{record['thumbnailPath']}", quality=86, method=6)
print(f'Rendered {len(records)} verified figures.')
