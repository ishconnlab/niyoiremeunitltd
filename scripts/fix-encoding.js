const fs = require('fs');
const path = require('path');
const dir = 'D:\\niyoiremeunitltd';
const replacements = [
  ['•','•'], ['•','•'], ['',''], ['✔','✔'], ['←','←'],
  ['”','—'], ['“','–'], ['™',"'"], ['˜',"'"], ['œ','"'],
  ['\u009d','"'], ['ž','"'], ['©','©'], ['²','²'],
  ['½','½'], ['¼','¼'], ['¾','¾']
];
const exts = ['.ts','.tsx','.js','.json','.html','.css','.md','.txt','.svg'];
let fixed = 0;
function scan(dir){
  for(const f of fs.readdirSync(dir)){
    const full = path.join(dir,f);
    if(fs.statSync(full).isDirectory()){ scan(full); continue; }
    if(!exts.some(ext=>f.endsWith(ext)))continue;
    let c = fs.readFileSync(full,'utf8');
    const orig = c;
    for(const [bad,good] of replacements){
      c = c.split(bad).join(good);
    }
    if(c !== orig){
      fs.writeFileSync(full, c);
      fixed++;
      console.log('Fixed:', full);
    }
  }
}
scan(dir);
console.log('Total fixed:', fixed);
