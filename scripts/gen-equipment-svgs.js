const fs = require('fs');
const path = require('path');
const dir = 'D:\\niyoiremeunitltd\\client\\public\\assets\\equipment';
const items = [
  { id: 'paint-brush', label: 'Paint Brush' },
  { id: 'paint-roller', label: 'Paint Roller' },
  { id: 'paint-tray', label: 'Paint Tray' },
  { id: 'paint-bucket', label: 'Paint Bucket' },
  { id: 'putty-knife', label: 'Putty Knife' },
  { id: 'paint-scraper', label: 'Paint Scraper' },
  { id: 'paint-edger', label: 'Paint Edger' },
  { id: 'extension-pole', label: 'Extension Pole' },
  { id: 'sandpaper', label: 'Sandpaper' },
  { id: 'paint-mixer', label: 'Paint Mixer' },
  { id: 'masking-tape', label: 'Masking Tape' },
  { id: 'drop-cloth', label: 'Drop Cloth' },
  { id: 'paint-sprayer', label: 'Paint Sprayer' },
  { id: 'ladder', label: 'Ladder' },
  { id: 'wire-brush', label: 'Wire Brush' },
  { id: 'sponge', label: 'Sponge' },
  { id: 'air-compressor', label: 'Air Compressor' },
  { id: 'ibikawa', label: 'Ibikawa' },
];
const colors = ['#ff5b00', '#0b1b3d', '#ff5b00', '#0b1b3d', '#ff5b00', '#0b1b3d', '#ff5b00', '#0b1b3d', '#ff5b00', '#0b1b3d', '#ff5b00', '#0b1b3d', '#ff5b00', '#0b1b3d', '#ff5b00', '#0b1b3d', '#ff5b00', '#0b1b3d'];
items.forEach((it, i) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'>
  <rect width='400' height='300' fill='${colors[i]}' rx='16' ry='16'/>
  <text x='200' y='140' font-family='Arial, sans-serif' font-size='28' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'>${it.label}</text>
  <text x='200' y='180' font-family='Arial, sans-serif' font-size='16' fill='rgba(255,255,255,0.8)' text-anchor='middle' dominant-baseline='middle'>Photo to be added</text>
</svg>`;
  fs.writeFileSync(path.join(dir, `${it.id}.svg`), svg);
  console.log('Created: ' + it.id + '.svg');
});
