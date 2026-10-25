const fs = require('fs');
const path = require('path');
const dir = 'D:\\niyoiremeunitltd\\client\\public\\assets\\team';
const members = [
  { id: 'cyuzuzo-ella-kevine', initials: 'CEK' },
  { id: 'niyoshuti-izaac', initials: 'NI' },
  { id: 'niyonsenga-claude', initials: 'NC' },
  { id: 'mouse', initials: 'MO' },
  { id: 'kontabure', initials: 'KO' },
  { id: 'paskali', initials: 'PA' },
  { id: 'samuel', initials: 'SA' },
  { id: 'shimiyimana-samwer', initials: 'SS' },
  { id: 'hahirwa-basenga-saimoni-pitabyukusenge', initials: 'HBSP' },
];
const colors = ['#0b1b3d', '#ff5b00', '#1e293b', '#475569', '#0f172a', '#334155', '#1e293b', '#475569', '#0b1b3d'];
members.forEach((m, i) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'>
  <rect width='400' height='400' fill='${colors[i]}' rx='20' ry='20'/>
  <text x='200' y='210' font-family='Arial, sans-serif' font-size='96' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'>${m.initials}</text>
</svg>`;
  fs.writeFileSync(path.join(dir, `${m.id}.svg`), svg);
  console.log('Created: ' + m.id + '.svg');
});
