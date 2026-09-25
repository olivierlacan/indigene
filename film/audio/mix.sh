#!/bin/bash
# Mix the soundtrack: voice (cleaned, placed at 1.8 s), score ducked under the
# voice, synthesized foley — then loudness-normalized for the web (-16 LUFS).
set -euo pipefail
cd "$(dirname "$0")"
LANG_SUFFIX=$([ "${FILM_LANG:-en}" = en ] && echo "" || echo ".${FILM_LANG}")
# The one loud breath in each take, pulled down (seconds into the voice file).
# A new take: find it by ear or in the waveform, and add a case here.
case "${FILM_LANG:-en}" in
  fr) BREATH=${BREATH:-14.29}; BREATH_END=${BREATH_END:-14.6} ;;
esac
VO=../assets/voice${LANG_SUFFIX}.flac
MUSIC=../assets/music.mp3
SFX=sfx${LANG_SUFFIX}.wav
OUT=${1:-../assets/soundtrack${LANG_SUFFIX}.wav}
MUSIC_DB=${MUSIC_DB:--9}
ffmpeg -y -loglevel error \
  -i "$VO" -i "$MUSIC" -i "$SFX" -filter_complex "
  [0:a]aresample=48000,
       volume=enable='between(t,${BREATH:-14.84},${BREATH_END:-15.27})':volume=0.22,
       highpass=f=75,
       equalizer=f=220:t=q:w=1.0:g=-3,
       equalizer=f=3400:t=q:w=1.4:g=2.2,
       highshelf=f=9500:g=2.5,
       deesser=i=0.35:m=0.5:f=0.5,
       acompressor=threshold=-21dB:ratio=3:attack=6:release=140:makeup=2.5,
       pan=stereo|c0=c0|c1=c0,
       adelay=1800|1800,apad=whole_dur=60.5,asplit=2[vo][key];
  [1:a]aresample=48000,atrim=0:60.5,volume=${MUSIC_DB}dB,equalizer=f=360:t=q:w=1.2:g=-2.5,equalizer=f=2800:t=q:w=1.5:g=-2,
       afade=t=out:st=58.9:d=1.6[mus];
  [mus][key]sidechaincompress=threshold=0.02:ratio=3:attack=120:release=1400:knee=8[duck];
  [2:a]aresample=48000,equalizer=f=4200:t=q:w=1.5:g=-3,aecho=0.85:0.6:35|61|97:0.22|0.14|0.08,apad=whole_dur=60.5[fx];
  [vo][duck][fx]amix=inputs=3:normalize=0:duration=first,
       atrim=0:60,afade=t=out:st=59.3:d=0.7,
       loudnorm=I=-16:TP=-1.5:LRA=11[out]" \
  -map "[out]" -ar 48000 -c:a pcm_s16le "$OUT"
echo "mixed -> $OUT"
