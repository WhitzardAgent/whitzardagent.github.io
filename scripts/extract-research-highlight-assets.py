"""Extract original AgentCyberRange artwork and logo crops from the supplied DOCX.

Usage: python scripts/extract-research-highlight-assets.py /path/to/AgentCyberRange-v1.docx
Requires Pillow. No logos are redrawn or generated.
"""
import sys
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile
from PIL import Image, ImageChops

out = Path("public/assets/research/agentcyberrange")
out.mkdir(parents=True, exist_ok=True)
names = ["alibaba", "amazon", "bytedance", "cisco", "columbia", "crowdstrike", "georgia-tech", "deepmind", "johns-hopkins", "jpmorgan", "mit", "microsoft", "moonshot", "nus", "nvidia", "openai", "optiver", "purdue", "qwen", "stepfun", "tencent", "oxford", "wiz"]
with ZipFile(sys.argv[1]) as source:
    flow = Image.open(BytesIO(source.read("word/media/image2.png"))).convert("RGB")
    flow.save(out / "attack-flow.webp", "WEBP", quality=90)
    flow.thumbnail((1280, 1280))
    flow.save(out / "attack-flow-1280.webp", "WEBP", quality=90)
    wall = Image.open(BytesIO(source.read("word/media/image3.png"))).convert("RGB")
    for i, name in enumerate(names):
        col, row = i % 4, i // 4
        tile = wall.crop((round((col * 588 + 65)), round(row * 336 + 75), round(col * 588 + 575), round(row * 336 + 315)))
        diff = ImageChops.difference(tile, Image.new("RGB", tile.size, "white")).convert("L").point(lambda v: 255 if v > 35 else 0)
        box = diff.getbbox()
        if not box:
            raise ValueError(f"Empty logo crop: {name}")
        logo = tile.crop(box)
        logo.thumbnail((360, 120))
        logo.save(out / f"{name}.webp", "WEBP", quality=95)
print(f"Extracted flow and {len(names)} original logos into {out}")
