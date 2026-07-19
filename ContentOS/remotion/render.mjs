#!/usr/bin/env node
/**
 * Deterministic Remotion render for Content OS.
 *
 * Usage:
 *   node render.mjs --composition TitleReveal --out ../Output/graphics/title.mov \
 *     --props '{"title":"MY TITLE","accentColor":"#ff5a1f"}' [--codec prores|h264]
 *
 * prores → ProRes 4444 with alpha (Premiere/FFmpeg-compatible transparent asset)
 * h264   → opaque preview MP4
 * Honors CONTENTOS_BROWSER_EXECUTABLE (e.g. /opt/pw-browsers/chromium) when a
 * system Chromium should be used instead of Remotion's downloaded browser.
 */
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const argv = process.argv.slice(2);
const arg = (name, fallback = undefined) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : fallback;
};

const compositionId = arg("composition", "TitleReveal");
const outPath = path.resolve(arg("out", "out/title_reveal.mov"));
const codec = arg("codec", "prores");
const inputProps = JSON.parse(arg("props", "{}"));

const dirname = path.dirname(fileURLToPath(import.meta.url));

const main = async () => {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const bundled = await bundle({
    entryPoint: path.join(dirname, "src", "index.js"),
    onProgress: () => {},
  });
  // A system Chromium (new-headless only) needs chromeMode
  // "chrome-for-testing"; without an override Remotion downloads its own
  // headless shell.
  const browserExecutable =
    process.env.CONTENTOS_BROWSER_EXECUTABLE || undefined;
  const chromeMode = browserExecutable ? "chrome-for-testing" : undefined;
  const composition = await selectComposition({
    serveUrl: bundled,
    id: compositionId,
    inputProps,
    browserExecutable,
    chromeMode,
  });
  const renderOptions =
    codec === "prores"
      ? {
          codec: "prores",
          proResProfile: "4444",
          pixelFormat: "yuva444p10le",
          imageFormat: "png",
        }
      : { codec: "h264", imageFormat: "jpeg" };
  await renderMedia({
    composition,
    serveUrl: bundled,
    outputLocation: outPath,
    inputProps,
    browserExecutable,
    chromeMode,
    ...renderOptions,
  });
  console.log(
    JSON.stringify({
      ok: true,
      composition: compositionId,
      codec,
      output: outPath,
      durationInFrames: composition.durationInFrames,
      fps: composition.fps,
      width: composition.width,
      height: composition.height,
    })
  );
};

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, error: String(err) }));
  process.exit(1);
});
