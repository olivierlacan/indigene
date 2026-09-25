#!/bin/bash
# Build one cut of the film end to end, from committed sources only.
#
#   ./build.sh          # English  → out/indigene-film.mp4
#   ./build.sh fr       # French   → out/indigene-film.fr.mp4
#
# Steps: render every frame (headless Chromium) → synthesize the foley from the
# ink laid down per frame → mix voice, music and foley → mux the film → encode
# the soundtrack the live player (index.html?lang=…) uses. About 5 minutes.
set -euo pipefail
cd "$(dirname "$0")"
LANG_CODE=${1:-en}
export FILM_LANG=$LANG_CODE
SUF=$([ "$LANG_CODE" = en ] && echo "" || echo ".$LANG_CODE")
mkdir -p out
echo "▸ picture ($LANG_CODE)"
node render.mjs video 30 0 60 "frames$SUF.mp4" > "out/render$SUF.log"
echo "▸ foley"
node audio/sfx.mjs "out/ink$SUF.json" "audio/sfx$SUF.wav"
echo "▸ mix"
audio/mix.sh
echo "▸ mux"
ffmpeg -loglevel error -y -i "out/frames$SUF.mp4" -i "assets/soundtrack$SUF.wav" \
  -c:v copy -c:a aac -b:a 256k -movflags +faststart "out/indigene-film$SUF.mp4"
ffmpeg -loglevel error -y -i "assets/soundtrack$SUF.wav" -c:a aac -b:a 160k "assets/soundtrack$SUF.m4a"
echo "✓ out/indigene-film$SUF.mp4"
