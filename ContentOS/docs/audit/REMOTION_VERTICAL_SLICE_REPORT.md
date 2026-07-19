# Remotion vertical slice report

Status: **implemented and rendered** (build container, 2026-07-19).
Windows re-render is a one-command step in the playbook.

## What exists
- `remotion/` — real Remotion 4.0.410 project: `TitleReveal` (1920×1080) and
  `TitleRevealVertical` (1080×1920) compositions with editable props
  (`title`, `subtitle`, `accentColor`, `textColor`, `backgroundColor`),
  deterministic animation (spring/interpolate only — no clock or randomness).
- `remotion/render.mjs` — bundler + renderer CLI supporting
  `--codec prores` (ProRes **4444 with alpha**, `yuva444p12le` — drops onto
  any Premiere/FFmpeg timeline as a transparent overlay) and `--codec h264`
  preview. Honors `CONTENTOS_BROWSER_EXECUTABLE` for a system Chromium
  (chrome-for-testing mode).
- `services/remotion_service.py` — availability-honest integration:
  `render_title_reveal()` renders, ffprobe-verifies (video stream, alpha,
  duration), and `add_to_manifest()` records the graphic on a job. Missing
  Node/deps → `ProviderUnavailable`, never a fake render.

## Executed proof (this container)
```
node render.mjs --composition TitleReveal --codec prores \
  --props '{"title":"CONTENT OS","subtitle":"verified render"}'
→ ok, 90 frames @30fps
ffprobe: prores, 1920x1080, pix_fmt=yuva444p12le (ALPHA), 3.000s + pcm_s16le
```
Covered by `tests/integration/test_sound_remotion_resolver.py::
test_remotion_title_reveal_renders_with_alpha` (skips gracefully where
Remotion deps are absent) and an honesty test that unavailable environments
refuse rather than pretend.

## Not yet done
- Windows re-render (playbook step; `npm install` then `npm run render`).
- Ocular sound synchronization is composed at the timeline level via
  `sound_placement_service` (implemented + tested), not baked into the
  Remotion render — by design, so the same graphic reuses across edits.
