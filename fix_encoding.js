const fs = require('fs');
const files = fs.readdirSync('src/content/posts').filter(f => f.startsWith('2026-05-01-'));

files.forEach(f => {
  const p = 'src/content/posts/' + f;
  const buf = fs.readFileSync(p);
  
  // If it's UTF-16 LE (BOM is FF FE)
  if (buf[0] === 0xFF && buf[1] === 0xFE) {
    const text = buf.toString('utf16le');
    fs.writeFileSync(p, text, 'utf8');
    console.log('Fixed:', f);
  } else {
    // Maybe it's missing BOM but has null bytes?
    if (buf.includes(0x00)) {
      const text = buf.toString('utf16le');
      fs.writeFileSync(p, text, 'utf8');
      console.log('Fixed (no BOM):', f);
    }
  }
});
console.log('Done');
