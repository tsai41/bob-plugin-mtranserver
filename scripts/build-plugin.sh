#!/usr/bin/env bash
# Package Bob plugin into a versioned .bobplugin (zip) at repo root.
set -euo pipefail

cd "$(dirname "$0")/.."

VERSION=$(/usr/bin/grep -E '"version"' info.json | head -n1 | sed -E 's/.*"version"[^"]*"([^"]+)".*/\1/')
OUT="mtranserver-v${VERSION}.bobplugin"

rm -f "$OUT"

FILES=(info.json main.js lang.js)
[ -f icon.png ] && FILES+=(icon.png)

zip -q "$OUT" "${FILES[@]}"
echo "Built: $OUT"
