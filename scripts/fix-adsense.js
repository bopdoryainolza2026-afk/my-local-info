const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../src/content/posts');

// 1. Delete duplicates
const duplicatesToDelete = [
  '2026-06-02-calliope-special.md',
  '2026-06-02-cheoingu-solsol-udon.md',
  '2026-06-02-yongin-aloafslicepiece.md'
];

duplicatesToDelete.forEach(file => {
  const p = path.join(postsDir, file);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log(`Deleted duplicate: ${file}`);
  }
});

// 2. Add missing ITEM_IDs
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
let missingCounter = 1;

files.forEach(file => {
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  const idMatch = content.match(/<!--\s*\[ITEM_ID:\s*([^\]]+)\]\s*-->/);
  if (!idMatch) {
    const newId = `blog-only-${String(missingCounter).padStart(3, '0')}`;
    content = content.trim() + `\n\n<!-- [ITEM_ID: ${newId}] -->\n`;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added ID ${newId} to ${file}`);
    missingCounter++;
  }
});
console.log('Done fixing ITEM_IDs!');
