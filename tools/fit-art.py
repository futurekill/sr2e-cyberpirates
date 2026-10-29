#!/usr/bin/env python3
"""Fit generated art (_work/out/<key>.png, from tools/gen-art.sh) into assets/<key>.webp:
  item_icons/*          256x256, centre square crop, opaque
  creature_portraits/*  1024x1024, square crop from the TOP (keeps heads), opaque
  vehicle_portraits/*   transparent, trimmed to the vehicle + a 12 px margin, longest side <= 1024.
                        Refused (left out) when the art has no real transparency: a vehicle token
                        drawn on an opaque square renders as a box on the map.
Existing assets are left alone unless --force. Then re-run the generators (they pick art up by file)
and `npm run build-packs`."""
import glob, os, sys
from PIL import Image

FORCE = "--force" in sys.argv
made, refused = 0, []
for src in sorted(glob.glob("_work/out/**/*.png", recursive=True)):
    key = os.path.relpath(src, "_work/out")[:-4]
    dst = f"assets/{key}.webp"
    if os.path.exists(dst) and not FORCE: continue
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im = Image.open(src)
    if key.startswith("vehicle_portraits/"):
        im = im.convert("RGBA"); a = im.getchannel("A")
        if a.getextrema()[0] > 250:  # no transparent pixels at all
            refused.append(key); continue
        box = a.point(lambda v: 255 if v > 16 else 0).getbbox()
        m = 12; box = (max(0, box[0] - m), max(0, box[1] - m), min(im.width, box[2] + m), min(im.height, box[3] + m))
        im = im.crop(box); s = min(1.0, 1024 / max(im.size))
        if s < 1: im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        im.save(dst, quality=86, method=6)
    else:
        im = im.convert("RGB"); w, h = im.size; m = min(w, h)
        top = 0 if key.startswith("creature_portraits/") else (h - m) // 2
        im = im.crop(((w - m) // 2, top, (w - m) // 2 + m, top + m))
        size = 1024 if key.startswith("creature_portraits/") else 256
        im.resize((size, size), Image.LANCZOS).save(dst, quality=82 if size == 1024 else 86, method=6)
    made += 1
print(f"{made} image(s) written")
if refused: print("NOT transparent (regenerate or key out the background):\n  " + "\n  ".join(refused))
