#!/usr/bin/env python3
"""
make_qr.py — generate a high-fidelity QR code with the MedAgentLab
logo embedded at center.

Why this script exists, and what makes it different from `qrcode --logo`:

  * Uses error-correction level H (≈ 30% redundancy) so that the
    embedded logo block does not break scannability.
  * Renders modules as **rounded squares** (StyledPilImage) — matches
    the editorial / clinical aesthetic of the site instead of the
    default chunky black grid.
  * Embeds a **circular** logo cutout with anti-aliased mask, so the
    SVG `public/favicon.svg` of the site reads as a real "lab seal"
    rather than a pasted-on rectangle.
  * Outputs both PNG (for print/posters) and SVG (for the site /
    contact section) from one source of truth.

Dependencies:
  pip install "qrcode[pil]>=7.4" pillow cairosvg

Usage:
  python scripts/make_qr.py \\
      --url https://medagentlab.example.com \\
      --logo public/favicon.svg \\
      --out  public/qr

Will produce:
  public/qr.png
  public/qr.svg
"""

from __future__ import annotations

import argparse
import io
import os
from pathlib import Path

import qrcode
from PIL import Image, ImageDraw
from qrcode.constants import ERROR_CORRECT_H
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.colormasks import SolidFillColorMask
from qrcode.image.styles.moduledrawers.pil import RoundedModuleDrawer

# Site palette (kept in sync with tailwind.config.js)
INK = (15, 23, 42)        # #0F172A — deep navy
PAPER = (250, 250, 247)   # #FAFAF7 — off-white
CYAN_MED = (45, 183, 200)  # #2DB7C8 — single accent (used for logo ring)


def rasterize_logo(logo_path: Path, size: int) -> Image.Image:
    """Load an SVG/PNG logo and return an RGBA Pillow image at `size`x`size`."""
    if logo_path.suffix.lower() == ".svg":
        try:
            import cairosvg
        except ImportError as e:  # pragma: no cover
            raise SystemExit(
                "Logo is SVG — install cairosvg: pip install cairosvg"
            ) from e
        png_bytes = cairosvg.svg2png(
            url=str(logo_path),
            output_width=size,
            output_height=size,
            background_color="rgba(255,255,255,0)",
        )
        return Image.open(io.BytesIO(png_bytes)).convert("RGBA")

    return Image.open(logo_path).convert("RGBA").resize(
        (size, size), Image.LANCZOS
    )


def build_logo_seal(logo_img: Image.Image, ring_px: int = 8) -> Image.Image:
    """Compose a circular seal: paper disk → cyan ring → logo at center."""
    size = logo_img.width
    canvas_size = size + ring_px * 4
    seal = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))

    # Paper disk
    draw = ImageDraw.Draw(seal)
    draw.ellipse((0, 0, canvas_size, canvas_size), fill=(*PAPER, 255))
    # Cyan accent ring
    draw.ellipse(
        (ring_px, ring_px, canvas_size - ring_px, canvas_size - ring_px),
        outline=(*CYAN_MED, 255),
        width=ring_px // 2,
    )

    # Circular logo mask
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size, size), fill=255)
    seal.paste(logo_img, (ring_px * 2, ring_px * 2), mask)

    return seal


def make_qr(url: str, logo_path: Path | None, out_stem: Path) -> None:
    """Generate `<out_stem>.png` and `<out_stem>.svg` for the given URL."""
    qr = qrcode.QRCode(
        version=None,                       # auto-fit
        error_correction=ERROR_CORRECT_H,   # required to survive logo overlay
        box_size=18,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)

    # ---------- PNG (rounded modules, navy on paper) ------------------
    img: Image.Image = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(radius_ratio=1.0),
        color_mask=SolidFillColorMask(front_color=INK, back_color=PAPER),
    ).convert("RGBA")

    if logo_path is not None and logo_path.exists():
        # Logo footprint — keep ≤ 22% of QR area so EC-H still recovers.
        logo_size = int(img.width * 0.22)
        logo_raw = rasterize_logo(logo_path, logo_size)
        seal = build_logo_seal(logo_raw)
        cx = (img.width - seal.width) // 2
        cy = (img.height - seal.height) // 2
        img.alpha_composite(seal, (cx, cy))

    out_stem.parent.mkdir(parents=True, exist_ok=True)
    png_path = out_stem.with_suffix(".png")
    img.save(png_path, "PNG", optimize=True)
    print(f"  → {png_path}  ({img.width}×{img.height})")

    # ---------- SVG (vector, no logo overlay — for the site) ----------
    from qrcode.image.svg import SvgPathImage

    svg_qr = qrcode.QRCode(
        error_correction=ERROR_CORRECT_H, box_size=10, border=2,
    )
    svg_qr.add_data(url)
    svg_qr.make(fit=True)
    svg = svg_qr.make_image(image_factory=SvgPathImage)
    svg_path = out_stem.with_suffix(".svg")
    svg.save(svg_path)
    print(f"  → {svg_path}")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawTextHelpFormatter)
    p.add_argument("--url", required=True, help="Target URL the QR should resolve to.")
    p.add_argument("--logo", default="public/favicon.svg", help="Path to logo (SVG or PNG).")
    p.add_argument("--out", default="public/qr", help="Output stem (without extension).")
    return p.parse_args()


def main() -> None:
    args = parse_args()
    logo = Path(args.logo) if args.logo else None

    if logo is not None and not logo.exists():
        print(f"⚠ logo not found at {logo} — generating QR without center seal.")
        logo = None

    out = Path(args.out)
    print(f"Encoding   : {args.url}")
    print(f"EC level   : H  (≈30% redundancy)")
    print(f"Logo       : {logo if logo else '(none)'}")
    print()
    make_qr(args.url, logo, out)
    print()
    print("Done. Test the PNG with any phone camera before publishing.")


if __name__ == "__main__":
    main()
