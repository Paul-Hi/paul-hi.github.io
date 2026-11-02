#!/usr/bin/env bash
set -euo pipefail

if ! command -v magick &>/dev/null && ! command -v convert &>/dev/null; then
    echo "Error: ImageMagick ('magick' or 'convert') is required." >&2
    exit 1
fi

CMD="magick"
if ! command -v magick &>/dev/null; then
    CMD="convert"
fi

if [ "$#" -eq 0 ]; then
    echo "Usage: $(basename "$0") <image1> [image2 ...]"
    echo "Compresses images to WebP (max 1200x1200px, quality 85) alongside original."
    exit 1
fi

for src in "$@"; do
    if [ ! -f "$src" ]; then
        echo "Warning: '$src' not found, skipping." >&2
        continue
    fi
    out="${src%.*}.webp"
    echo "Compressing: $src -> $out"
    "$CMD" "$src" -resize '1200x1200>' -quality 85 "$out"
done
