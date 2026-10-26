import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'public/assets/Logo/Niyo_Ireme_Unit_ltd_Logo-removed_bg.png');
const output = path.join(root, 'public/assets/brand');
if (!fs.existsSync(source)) throw new Error(`Approved logo asset is missing: ${source}`);
fs.mkdirSync(output, { recursive: true });

const mark = sharp(source);
const { width, height } = await mark.metadata();
const headerHeight = Math.round(386 * height / width);
await mark.clone().resize(386, headerHeight).png().toFile(path.join(output, 'niyoireme-header.png'));
for (const size of [192, 512]) {
  await mark.clone().resize(size, size, { fit: 'contain', background: '#0e224e' }).flatten({ background: '#0e224e' }).png().toFile(path.join(output, `niyoireme-icon-${size}.png`));
}

const background = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#07111e"/><path d="M0 0h14v630H0z" fill="#f4bd35"/><circle cx="970" cy="320" r="360" fill="#111d2a"/><path d="M40 500h600" stroke="#f4bd35" stroke-width="3"/><text x="58" y="170" font-family="Arial,sans-serif" font-size="54" font-weight="700" fill="#fff">NIYO IREME UNIT LTD</text><text x="60" y="240" font-family="Arial,sans-serif" font-size="26" font-weight="600" fill="#f4bd35">PRO FINISH • HOME RENOVATION</text><text x="60" y="310" font-family="Arial,sans-serif" font-size="22" fill="#d7dee8">FINISHING WORKS &amp; INTERIOR DESIGN</text><text x="60" y="560" font-family="Arial,sans-serif" font-size="24" font-weight="600" fill="#fff">Quality. Precision. Excellence.</text></svg>`);
const logo = await mark.clone().resize(470, 290, { fit: 'contain' }).png().toBuffer();
await sharp(background).composite([{ input: logo, left: 690, top: 170 }]).png().toFile(path.join(output, 'niyoireme-og.png'));
