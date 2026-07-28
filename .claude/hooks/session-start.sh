#!/bin/bash
# SessionStart hook for Claude Code on the web: make the ephemeral container
# ready to build the app and take faithful screenshots.
#
# Faithful means phone-metric fonts. This is a mobile-first PWA and the font
# stack is `system-ui, ..., Roboto, sans-serif`; on a bare Linux container
# every named font is missing and fontconfig serves DejaVu Sans, whose wider
# letters change layout (~10% wider text than a real phone — the header that
# fits an iPhone at 390px overflowed under DejaVu). Installing Roboto and
# pointing the generic families at it renders exactly like an Android phone.
set -euo pipefail

# Web sessions only — never touch fonts on someone's own machine.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR/app"
npm install --no-audit --no-fund

# Phone-metric fonts (best effort — a font hiccup shouldn't block a session;
# CLAUDE.md's screenshot procedure re-checks before any capture).
if ! fc-list | grep -qi roboto; then
  apt-get install -y fonts-roboto || echo "warn: could not install fonts-roboto" >&2
fi
mkdir -p "$HOME/.config/fontconfig"
cat > "$HOME/.config/fontconfig/fonts.conf" <<'XML'
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <!-- Resolve generic families to Roboto so headless Chromium renders with
       real phone metrics (Android). `system-ui` must be mapped explicitly:
       it sits first in the app's font stack, and fontconfig otherwise
       resolves it to DejaVu before Roboto ever gets a chance. -->
  <alias><family>sans-serif</family><prefer><family>Roboto</family></prefer></alias>
  <match target="pattern">
    <test name="family"><string>system-ui</string></test>
    <edit name="family" mode="prepend" binding="strong"><string>Roboto</string></edit>
  </match>
</fontconfig>
XML
fc-cache -f >/dev/null
