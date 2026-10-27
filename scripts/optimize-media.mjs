import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const media = [
  { basename: "hero-resilience-atlas-ai", quality: 78 },
  { basename: "cinema-portal-ai", quality: 84 },
  { basename: "contact-sheet-ai", quality: 84 },
];

for (const { basename, quality } of media) {
  const input = resolve("assets", "source-media", `${basename}.jpg`);
  const output = resolve("public", "media", `${basename}.webp`);

  await sharp(input)
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(output);

  const [before, after] = await Promise.all([stat(input), stat(output)]);
  const reduction = Math.round((1 - after.size / before.size) * 100);
  console.log(`[optimize-media] ${basename}: ${before.size} -> ${after.size} bytes (-${reduction}%)`);
}
