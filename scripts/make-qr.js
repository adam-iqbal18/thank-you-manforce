// Writes print/qr.svg and print/qr.png for the deployed site URL.
// Usage: npm run qr -- https://your-name.github.io/thank-you-manforce/
import QRCode from 'qrcode';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const url = process.argv[2];

function fail(message) {
  console.error(message);
  console.error('Usage: npm run qr -- https://example.com/');
  process.exit(1);
}

if (!url) fail('Missing URL.');
try {
  const parsed = new URL(url);
  if (!['http:', 'https:'].includes(parsed.protocol)) fail('The URL must start with http:// or https://');
} catch {
  fail(`Not a valid URL: ${url}`);
}

const outDir = fileURLToPath(new URL('../print/', import.meta.url));
const options = {
  errorCorrectionLevel: 'M',
  margin: 2,
  color: { dark: '#10302A', light: '#FFFFFF' },
};

const svgPath = join(outDir, 'qr.svg');
const pngPath = join(outDir, 'qr.png');

await mkdir(outDir, { recursive: true });
await writeFile(svgPath, await QRCode.toString(url, { ...options, type: 'svg' }));
await QRCode.toFile(pngPath, url, { ...options, type: 'png', width: 1200 });

console.log(`QR code for ${url}`);
console.log(`  ${svgPath}`);
console.log(`  ${pngPath} (1200 x 1200 px)`);
