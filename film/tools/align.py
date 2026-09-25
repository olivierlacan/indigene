# Word-level timings for a voice take, to set the cues in js/i18n.js.
#
#   python3 -m venv .venv && .venv/bin/pip install faster-whisper
#   .venv/bin/python tools/align.py assets/voice.fr.flac fr
#
# Prints "start:word" for every word. Each cue in i18n.js is the start of the
# phrase it names (e.g. `sun` is where "It reads the sun…" begins), in seconds
# into the voice file — timeline.js adds the 1.8 s before the voice comes in.
import sys
from faster_whisper import WhisperModel

path, lang = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else "en")
model = WhisperModel("small", device="cpu", compute_type="int8")
segments, _ = model.transcribe(path, language=lang, word_timestamps=True)
print(" ".join(f"{w.start:.2f}:{w.word.strip()}" for s in segments for w in s.words))
