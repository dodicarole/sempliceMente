"""Genera le icone PWA di SempliceMente Bimbi dalla stella del logo.

Uso:
    pip install Pillow
    python3 scripts/generate-icons.py

Riscrive public/icons/, public/apple-touch-icon.png e public/favicon.ico.
I colori qui sotto rispecchiano --blue di app/globals.css e la 🌟 di
components/AuthScreen.tsx: se cambia la palette, aggiornali e rilancia.
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
ICONS = PUBLIC / "icons"

BLUE_TOP = (123, 141, 232)   # schiarita di --blue #6B7FE3
BLUE_BOT = (90, 111, 216)    # scurita di --blue
STAR = (255, 212, 77)        # giallo della 🌟
STAR_HI = (255, 233, 150)    # luce in alto sulla stella

SS = 4  # fattore di supersampling per l'antialiasing della stella


def vertical_gradient(size, top, bottom):
    """Quadrato size×size con gradiente verticale da top a bottom."""
    strip = Image.new("RGB", (1, size))
    d = ImageDraw.Draw(strip)
    for y in range(size):
        t = y / max(1, size - 1)
        d.point((0, y), tuple(round(a + (b - a) * t) for a, b in zip(top, bottom)))
    return strip.resize((size, size), Image.NEAREST)


def star_points(cx, cy, outer, inner, points=5):
    pts = []
    for i in range(points * 2):
        r = outer if i % 2 == 0 else inner
        a = -math.pi / 2 + i * math.pi / points
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


def star_layer(size, ratio):
    """Stella antialiasata su layer trasparente, con leggera luce in alto."""
    s = size * SS
    mask = Image.new("L", (s, s), 0)
    outer = s * ratio / 2
    # centro ottico: una stella a 5 punte "pesa" verso il basso
    ImageDraw.Draw(mask).polygon(
        star_points(s / 2, s / 2 + outer * 0.06, outer, outer * 0.47), fill=255
    )

    layer = vertical_gradient(s, STAR_HI, STAR).convert("RGBA")
    layer.putalpha(mask)
    return layer.resize((size, size), Image.LANCZOS)


def build(size, ratio):
    """Icona full-bleed: fondo blu + stella che occupa `ratio` del lato."""
    base = vertical_gradient(size, BLUE_TOP, BLUE_BOT).convert("RGBA")
    base.alpha_composite(star_layer(size, ratio))
    return base.convert("RGB")


def save(img, path):
    img.save(path, "PNG", optimize=True)
    print(f"  {path.relative_to(ROOT)}  {img.size[0]}x{img.size[1]}")


def main():
    ICONS.mkdir(parents=True, exist_ok=True)

    # purpose "any": l'OS applica il proprio mascheramento agli angoli
    for px in (192, 512):
        save(build(px, 0.62), ICONS / f"icon-{px}.png")

    # purpose "maskable": stella più piccola, dentro la safe zone circolare (80%)
    save(build(512, 0.46), ICONS / "icon-maskable-512.png")

    # iOS arrotonda gli angoli da solo: serve full-bleed e senza trasparenza
    save(build(180, 0.62), PUBLIC / "apple-touch-icon.png")

    # favicon multi-risoluzione
    favicon = PUBLIC / "favicon.ico"
    build(256, 0.66).save(
        favicon, sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    )
    print(f"  {favicon.relative_to(ROOT)}  16→256")


if __name__ == "__main__":
    main()
