// Focused companion to process-images.mjs: rebuild only the three hero portraits.
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'public/images/hero');
const portraits = [
  { name: 'mohit', source: 'doctor-mohit-desk-portrait.jpg', focalX: 0.52 },
  { name: 'parul', source: 'doctor-parul-clinic-portrait.png', focalX: 0.46 },
  { name: 'amit', source: 'doctor-amit-armchair-portrait.png', focalX: 0.52 },
];

await mkdir(output, { recursive: true });

for (const portrait of portraits) {
  const source = resolve(root, 'resources/images/new', portrait.source);
  const metadata = await sharp(source).metadata();
  const { width: sw, height: sh } = metadata.autoOrient;
  const height = Math.min(sh, Math.floor(sw * 5 / 4));
  const width = Math.min(sw, Math.floor(height * 4 / 5));
  const left = Math.max(0, Math.min(sw - width, Math.round(sw * portrait.focalX - width / 2)));

  // Crop from the originals, retaining their native height instead of enlarging a thumbnail.
  const result = await sharp(source)
    .rotate()
    .extract({ left, top: 0, width, height })
    .resize({ width: 1200, withoutEnlargement: true })
    .toColourspace('srgb')
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile(resolve(output, `doctor-${portrait.name}-portrait.jpg`));

  console.log(`${portrait.name}: ${result.width}x${result.height}, ${Math.round(result.size / 1024)} KB`);
}
