/**
 * Converts public/icons/icon.svg → icon-192.png and icon-512.png
 * Run once: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svgBuf = readFileSync(join(root, "public/icons/icon.svg"));

for (const size of [192, 512]) {
  await sharp(svgBuf)
    .resize(size, size)
    .png()
    .toFile(join(root, `public/icons/icon-${size}.png`));
  console.log(`✓ icon-${size}.png`);
}
console.log("Done — icons saved to public/icons/");
