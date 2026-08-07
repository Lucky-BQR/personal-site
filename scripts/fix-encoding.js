const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'app');
let count = 0;

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) { walk(full); continue; }
    if (!f.endsWith('page.tsx')) continue;
    let c = fs.readFileSync(full, 'utf8');
    c = c.replace(/text-\[clamp\(1\.75rem,5vw,2\.5rem\)\]/g, 'text-[clamp(1.35rem,4vw,2rem)]');
    c = c.replace(/text-\[clamp\(2rem,6vw,3\.25rem\)\]/g, 'text-[clamp(1.35rem,4vw,2rem)]');
    c = c.replace(/fontWeight:\s*700,/g, 'fontWeight: 600,');
    c = c.replace(/letterSpacing:\s*'-0\.035em'/g, "letterSpacing: '-0.02em'");
    fs.writeFileSync(full, c, 'utf8');
    count++;
  }
}

walk(dir);
console.log(`Updated ${count} files`);
