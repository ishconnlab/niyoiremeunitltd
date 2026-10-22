import fs from 'node:fs';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'assets', 'brand');

const ORANGE = '#FF5B00';
const NAVY = '#0B1B3D';
const NAVY_CARD = '#0E224E';
const SLATE = '#F1F5F9';
const WHITE = '#FFFFFF';

const COMPANY_LINE_1 = 'NIYO IREME UNIT';
const COMPANY_LINE_2 = 'COMPANY LTD';
const SLOGAN = "Ubwiza, Ubunyamwuga n'Ireme mu Mirimo Yacu!";
const SERVICES = 'Construction \u2022 House Finishing \u2022 Painting \u2022 Workforce \u2014 Kigali, Rwanda';

const FONT = 'Arial, Helvetica, sans-serif';

type Style = {
  capH: number;
  stemW: number;
  nW: number;
  iW: number;
  uW: number;
  gap: number;
};

const STYLE_WIDE: Style = { capH: 100, stemW: 26, nW: 92, iW: 26, uW: 92, gap: 18 };
const STYLE_TIGHT: Style = { capH: 100, stemW: 22, nW: 70, iW: 22, uW: 70, gap: 12 };
const DIAG_START = 38;

const ACCENT_RATIO = 0.26;
const GAP_RATIO = 0.16;
const WEIGHT_RATIO = 0.085;

function markWidth(s: Style): number {
  return s.nW + s.gap + s.iW + s.gap + s.uW;
}

function lettersSvg(s: Style, color: string, uid: string): string {
  const { capH, stemW, nW, iW, uW, gap } = s;
  const xI = nW + gap;
  const xU = xI + iW + gap;
  const dX = nW - 2 * stemW;
  const dY = capH - DIAG_START;
  const len = Math.sqrt(dX * dX + dY * dY);
  const nx = dY / len;
  const ny = -dX / len;
  const c0x = stemW + (stemW / 2) * nx;
  const c0y = DIAG_START + (stemW / 2) * ny;
  const c1x = nW - stemW + (stemW / 2) * nx;
  const c1y = capH + (stemW / 2) * ny;
  const ex = (c1x - c0x) * 0.4;
  const ey = (c1y - c0y) * 0.4;
  const clipId = `niu-clip-n-${uid}`;
  return [
    `<defs><clipPath id="${clipId}"><rect x="0" y="0" width="${nW}" height="${capH}"/></clipPath></defs>`,
    `<g clip-path="url(#${clipId})">`,
    `<rect x="0" y="0" width="${stemW}" height="${capH}" fill="${color}"/>`,
    `<rect x="${nW - stemW}" y="0" width="${stemW}" height="${capH}" fill="${color}"/>`,
    `<path d="M ${(c0x - ex).toFixed(2)} ${(c0y - ey).toFixed(2)} L ${(c1x + ex).toFixed(2)} ${(c1y + ey).toFixed(2)}" stroke="${color}" stroke-width="${stemW}" stroke-linecap="butt" fill="none"/>`,
    `</g>`,
    `<rect x="${xI}" y="0" width="${iW}" height="${capH}" fill="${color}"/>`,
    `<rect x="${xU}" y="0" width="${stemW}" height="${capH}" fill="${color}"/>`,
    `<rect x="${xU + uW - stemW}" y="0" width="${stemW}" height="${capH}" fill="${color}"/>`,
    `<rect x="${xU}" y="${capH - stemW}" width="${uW}" height="${stemW}" fill="${color}"/>`,
  ].join('');
}

function chevronSvg(width: number, height: number, stroke: number, color: string, opacity = 1): string {
  const half = width / 2;
  return `<path d="M 0 ${height.toFixed(2)} L ${half.toFixed(2)} 0 L ${width.toFixed(2)} ${height.toFixed(2)}" fill="none" stroke="${color}" stroke-width="${stroke.toFixed(2)}" stroke-linejoin="miter" stroke-linecap="butt" opacity="${opacity}"/>`;
}

function roofBandSvg(width: number, height: number, thickness: number, color: string): string {
  const half = width / 2;
  const flat = width * 0.07;
  const pts = [
    [0, height - thickness],
    [half - flat, 0],
    [half + flat, 0],
    [width, height - thickness],
    [width, height],
    [half + flat, thickness],
    [half - flat, thickness],
    [0, height],
  ]
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ');
  return `<polygon points="${pts}" fill="${color}"/>`;
}

type BlockOpts = {
  x: number;
  top: number;
  width: number;
  style: Style;
  letters: string;
  accent: string;
  uid: string;
  accentRatio?: number;
  gapRatio?: number;
  weightRatio?: number;
  accentShape?: 'chevron' | 'band';
};

function blockHeight(width: number, style: Style, accentRatio: number, gapRatio: number, weightRatio: number, shape: 'chevron' | 'band'): number {
  const letterH = style.capH * (width / markWidth(style));
  const accentH = accentRatio * letterH;
  const gap = gapRatio * letterH;
  const stroke = weightRatio * letterH;
  return accentH + gap + letterH + (shape === 'chevron' ? stroke : 0);
}

function blockMarkup(o: BlockOpts): string {
  const accentRatio = o.accentRatio ?? ACCENT_RATIO;
  const gapRatio = o.gapRatio ?? GAP_RATIO;
  const weightRatio = o.weightRatio ?? WEIGHT_RATIO;
  const shape = o.accentShape ?? 'chevron';
  const scale = o.width / markWidth(o.style);
  const letterH = o.style.capH * scale;
  const stroke = weightRatio * letterH;
  const accentH = accentRatio * letterH;
  const gap = gapRatio * letterH;
  const accentSvg = shape === 'band' ? roofBandSvg(o.width, accentH, stroke, o.accent) : chevronSvg(o.width, accentH, stroke, o.accent);
  const accentTop = shape === 'band' ? o.top : o.top + stroke / 2;
  const lettersTop = o.top + (shape === 'band' ? 0 : stroke) + accentH + gap;
  return [
    `<g transform="translate(${o.x.toFixed(2)} ${accentTop.toFixed(2)})">${accentSvg}</g>`,
    `<g transform="translate(${o.x.toFixed(2)} ${lettersTop.toFixed(2)}) scale(${scale.toFixed(4)})">${lettersSvg(o.style, o.letters, o.uid)}</g>`,
  ].join('');
}

function badgeSvg(opts: {
  size: number;
  bg: string;
  letters: string;
  accent: string;
  radius: number;
  style: Style;
  uid: string;
  border?: string;
  borderWidth?: number;
}): string {
  const size = opts.size;
  const lettersW = size * 0.76;
  const blockH = blockHeight(lettersW, opts.style, ACCENT_RATIO, GAP_RATIO, WEIGHT_RATIO, 'chevron');
  const top = (size - blockH) / 2;
  const x = (size - lettersW) / 2;
  const border = opts.border
    ? `<rect x="${opts.borderWidth! / 2}" y="${opts.borderWidth! / 2}" width="${size - opts.borderWidth!}" height="${size - opts.borderWidth!}" rx="${opts.radius - opts.borderWidth! / 2}" fill="none" stroke="${opts.border}" stroke-width="${opts.borderWidth!}"/>`
    : '';
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="NIYO IREME UNIT COMPANY LTD">`,
    `<title>NIYO IREME UNIT COMPANY LTD</title>`,
    `<rect x="0" y="0" width="${size}" height="${size}" rx="${opts.radius}" fill="${opts.bg}"/>`,
    border,
    blockMarkup({ x, top, width: lettersW, style: opts.style, letters: opts.letters, accent: opts.accent, uid: opts.uid }),
    `</svg>`,
  ].join('');
}

function wordmarkSvg(dark: boolean): string {
  const w = 700;
  const h = 150;
  const badgeSize = 120;
  const badgeX = 16;
  const badgeY = 15;
  const lettersW = badgeSize * 0.76;
  const blockH = blockHeight(lettersW, STYLE_WIDE, ACCENT_RATIO, GAP_RATIO, WEIGHT_RATIO, 'chevron');
  const top = (badgeSize - blockH) / 2;
  const t1 = dark ? WHITE : NAVY;
  const t2 = dark ? SLATE : NAVY;
  const textX = 170;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="NIYO IREME UNIT COMPANY LTD">`,
    `<title>NIYO IREME UNIT COMPANY LTD</title>`,
    dark
      ? `<rect x="${badgeX}" y="${badgeY}" width="${badgeSize}" height="${badgeSize}" rx="26" fill="${NAVY_CARD}" stroke="${ORANGE}" stroke-width="4"/>`
      : `<rect x="${badgeX}" y="${badgeY}" width="${badgeSize}" height="${badgeSize}" rx="26" fill="${NAVY}"/>`,
    blockMarkup({ x: badgeX + (badgeSize - lettersW) / 2, top: badgeY + top, width: lettersW, style: STYLE_WIDE, letters: WHITE, accent: ORANGE, uid: dark ? 'wmd' : 'wml' }),
    `<text x="${textX}" y="62" font-family="${FONT}" font-size="44" font-weight="700" fill="${t1}">NIYO IREME</text>`,
    `<text x="${textX}" y="98" font-family="${FONT}" font-size="24" font-weight="700" fill="${t2}" letter-spacing="3">UNIT COMPANY LTD</text>`,
    `<text x="${textX}" y="128" font-family="${FONT}" font-size="18" font-weight="400" fill="${ORANGE}">${SLOGAN}</text>`,
    `</svg>`,
  ].join('');
}

function markSvg(): string {
  const size = 120;
  const lettersW = size * 0.76;
  const blockH = blockHeight(lettersW, STYLE_WIDE, ACCENT_RATIO, GAP_RATIO, WEIGHT_RATIO, 'chevron');
  const top = (size - blockH) / 2;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="NIYO IREME UNIT COMPANY LTD">`,
    `<title>NIYO IREME UNIT COMPANY LTD</title>`,
    `<rect x="0" y="0" width="${size}" height="${size}" rx="26" fill="${NAVY}"/>`,
    blockMarkup({ x: (size - lettersW) / 2, top, width: lettersW, style: STYLE_WIDE, letters: WHITE, accent: ORANGE, uid: 'mark' }),
    `</svg>`,
  ].join('');
}

function horizontalLogoSvg(dark: boolean): string {
  const w = 640;
  const h = 120;
  const badgeSize = 120;
  const lettersW = badgeSize * 0.76;
  const blockH = blockHeight(lettersW, STYLE_WIDE, ACCENT_RATIO, GAP_RATIO, WEIGHT_RATIO, 'chevron');
  const top = (badgeSize - blockH) / 2;
  const t1 = dark ? WHITE : NAVY;
  const t2 = dark ? SLATE : NAVY;
  const textX = 150;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="NIYO IREME UNIT COMPANY LTD">`,
    `<title>NIYO IREME UNIT COMPANY LTD</title>`,
    dark
      ? `<rect x="0" y="0" width="${badgeSize}" height="${badgeSize}" rx="26" fill="${NAVY_CARD}" stroke="${ORANGE}" stroke-width="4"/>`
      : `<rect x="0" y="0" width="${badgeSize}" height="${badgeSize}" rx="26" fill="${NAVY}"/>`,
    blockMarkup({ x: (badgeSize - lettersW) / 2, top, width: lettersW, style: STYLE_WIDE, letters: WHITE, accent: ORANGE, uid: dark ? 'hlmd' : 'hlml' }),
    `<text x="${textX}" y="52" font-family="${FONT}" font-size="42" font-weight="700" fill="${t1}">NIYO IREME</text>`,
    `<text x="${textX}" y="88" font-family="${FONT}" font-size="23" font-weight="700" fill="${t2}" letter-spacing="3">UNIT COMPANY LTD</text>`,
    `</svg>`,
  ].join('');
}

function faviconSvg(): string {
  const size = 100;
  const lettersW = size * 0.86;
  const blockH = blockHeight(lettersW, STYLE_TIGHT, 0.26, 0.14, WEIGHT_RATIO, 'band');
  const top = (size - blockH) / 2;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="NIU">`,
    `<title>NIU</title>`,
    `<rect x="0" y="0" width="${size}" height="${size}" rx="20" fill="${NAVY}"/>`,
    blockMarkup({ x: (size - lettersW) / 2, top, width: lettersW, style: STYLE_TIGHT, letters: WHITE, accent: ORANGE, uid: 'fav', accentRatio: 0.26, gapRatio: 0.14, accentShape: 'band' }),
    `</svg>`,
  ].join('');
}

function maskableSvg(size: number): string {
  const lettersW = size * 0.56;
  const blockH = blockHeight(lettersW, STYLE_WIDE, ACCENT_RATIO, GAP_RATIO, WEIGHT_RATIO, 'chevron');
  const top = (size - blockH) / 2;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="NIYO IREME UNIT COMPANY LTD">`,
    `<title>NIYO IREME UNIT COMPANY LTD</title>`,
    `<rect x="0" y="0" width="${size}" height="${size}" fill="${NAVY}"/>`,
    blockMarkup({ x: (size - lettersW) / 2, top, width: lettersW, style: STYLE_WIDE, letters: WHITE, accent: ORANGE, uid: `msk${size}` }),
    `</svg>`,
  ].join('');
}

function appleTouchSvg(size: number): string {
  const lettersW = size * 0.66;
  const blockH = blockHeight(lettersW, STYLE_WIDE, ACCENT_RATIO, GAP_RATIO, WEIGHT_RATIO, 'chevron');
  const top = (size - blockH) / 2;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="NIYO IREME UNIT COMPANY LTD">`,
    `<title>NIYO IREME UNIT COMPANY LTD</title>`,
    `<rect x="0" y="0" width="${size}" height="${size}" fill="${NAVY}"/>`,
    blockMarkup({ x: (size - lettersW) / 2, top, width: lettersW, style: STYLE_WIDE, letters: WHITE, accent: ORANGE, uid: `apt${size}` }),
    `</svg>`,
  ].join('');
}

function ogSvg(): string {
  const w = 1200;
  const h = 630;
  const badgeSize = 132;
  const badgeX = 88;
  const badgeY = 74;
  const lettersW = badgeSize * 0.76;
  const blockH = blockHeight(lettersW, STYLE_WIDE, ACCENT_RATIO, GAP_RATIO, WEIGHT_RATIO, 'chevron');
  const textX = 88;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="NIYO IREME UNIT COMPANY LTD - Construction, House Finishing and Painting in Kigali, Rwanda">`,
    `<title>NIYO IREME UNIT COMPANY LTD</title>`,
    `<defs>`,
    `<pattern id="hazard" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">`,
    `<rect x="0" y="0" width="32" height="64" fill="${ORANGE}"/>`,
    `</pattern>`,
    `</defs>`,
    `<rect x="0" y="0" width="${w}" height="${h}" fill="${NAVY}"/>`,
    `<rect x="0" y="0" width="${w}" height="${h}" fill="url(#hazard)" opacity="0.055"/>`,
    `<g fill="none" stroke="${WHITE}" stroke-width="9" opacity="0.09" stroke-linejoin="round">`,
    `<path d="M 762 397 A 158 158 0 0 1 1078 397"/>`,
    `<rect x="700" y="393" width="440" height="54" rx="27"/>`,
    `<path d="M 920 241 L 920 391"/>`,
    `</g>`,
    `<path d="M 752 208 L 920 70 L 1088 208" fill="none" stroke="${ORANGE}" stroke-width="11" opacity="0.16" stroke-linejoin="round" stroke-linecap="round"/>`,
    `<g transform="translate(${badgeX} ${badgeY})">`,
    `<rect x="0" y="0" width="${badgeSize}" height="${badgeSize}" rx="30" fill="${ORANGE}"/>`,
    blockMarkup({ x: (badgeSize - lettersW) / 2, top: (badgeSize - blockH) / 2, width: lettersW, style: STYLE_WIDE, letters: WHITE, accent: WHITE, uid: 'og' }),
    `</g>`,
    `<text x="${textX}" y="302" font-family="${FONT}" font-size="66" font-weight="700" fill="${WHITE}">${COMPANY_LINE_1}</text>`,
    `<text x="${textX}" y="384" font-family="${FONT}" font-size="66" font-weight="700" fill="${WHITE}" letter-spacing="4">${COMPANY_LINE_2}</text>`,
    `<rect x="${textX}" y="422" width="104" height="7" fill="${ORANGE}"/>`,
    `<text x="${textX}" y="488" font-family="${FONT}" font-size="34" font-weight="700" fill="${ORANGE}">${SLOGAN}</text>`,
    `<text x="${textX}" y="540" font-family="${FONT}" font-size="22" font-weight="400" fill="${SLATE}">${SERVICES}</text>`,
    `<rect x="0" y="${h - 10}" width="${w}" height="10" fill="${ORANGE}"/>`,
    `</svg>`,
  ].join('');
}

function buildIco(images: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries: Buffer[] = [];
  let offset = 6 + 16 * images.length;
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += img.data.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

type Written = { name: string; file: string; bytes: number; width: number; height: number; dims?: string };

async function writeSvg(name: string, svg: string, out: Written[]): Promise<string> {
  const file = path.join(OUT_DIR, name);
  fs.writeFileSync(file, svg, 'utf8');
  out.push({ name, file, bytes: fs.statSync(file).size, width: 0, height: 0 });
  return file;
}

async function writePng(name: string, svg: string, out: Written[]): Promise<string> {
  const file = path.join(OUT_DIR, name);
  await sharp(Buffer.from(svg, 'utf8')).png({ compressionLevel: 9 }).toFile(file);
  const meta = await sharp(file).metadata();
  out.push({ name, file, bytes: fs.statSync(file).size, width: meta.width ?? 0, height: meta.height ?? 0 });
  return file;
}

async function main(): Promise<void> {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const out: Written[] = [];

  const logoSvg = wordmarkSvg(false);
  const logoDarkSvg = wordmarkSvg(true);
  const favicon = faviconSvg();

  await writeSvg('logo.svg', logoSvg, out);
  await writeSvg('logo-dark.svg', logoDarkSvg, out);
  await writeSvg('logo-mark.svg', markSvg(), out);
  await writeSvg('logo-horizontal.svg', horizontalLogoSvg(false), out);
  await writeSvg('logo-horizontal-dark.svg', horizontalLogoSvg(true), out);
  await writeSvg('favicon.svg', favicon, out);

  await writePng('icon-192.png', badgeSvg({ size: 192, bg: NAVY, letters: WHITE, accent: ORANGE, radius: 42, style: STYLE_WIDE, uid: 'i192' }), out);
  await writePng('icon-512.png', badgeSvg({ size: 512, bg: NAVY, letters: WHITE, accent: ORANGE, radius: 112, style: STYLE_WIDE, uid: 'i512' }), out);
  await writePng('maskable-192.png', maskableSvg(192), out);
  await writePng('maskable-512.png', maskableSvg(512), out);
  await writePng('apple-touch-icon.png', appleTouchSvg(180), out);
  await writePng('og-image.png', ogSvg(), out);

  const icoSizes = [16, 32, 48];
  const icoImages: { size: number; data: Buffer }[] = [];
  for (const s of icoSizes) {
    const png = await sharp(Buffer.from(favicon, 'utf8')).resize(s, s, { fit: 'fill' }).png().toBuffer();
    icoImages.push({ size: s, data: png });
  }
  const icoFile = path.join(OUT_DIR, 'favicon.ico');
  fs.writeFileSync(icoFile, buildIco(icoImages));
  out.push({ name: 'favicon.ico', file: icoFile, bytes: fs.statSync(icoFile).size, width: 0, height: 0, dims: '16/32/48' });

  for (const item of out) {
    if (item.width === 0 && !item.dims) {
      const meta = await sharp(item.file).metadata();
      item.width = meta.width ?? 0;
      item.height = meta.height ?? 0;
    }
  }

  const nameWidth = Math.max(...out.map((i) => i.name.length));
  console.log('');
  console.log('NIYO IREME UNIT COMPANY LTD - brand assets written to public/assets/brand');
  console.log('');
  console.log(`${'FILE'.padEnd(nameWidth)}  ${'DIMENSIONS'.padEnd(12)}  ${'BYTES'.padStart(10)}`);
  console.log('-'.repeat(nameWidth + 28));
  for (const item of out) {
    const dims = item.dims ?? `${item.width}x${item.height}`;
    console.log(`${item.name.padEnd(nameWidth)}  ${dims.padEnd(12)}  ${String(item.bytes).padStart(10)}`);
  }
  console.log('');
  console.log(`${out.length} files generated.`);
}

main().catch((err) => {
  console.error(err);
  throw err;
});
