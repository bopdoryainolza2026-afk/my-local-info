const fs = require('fs');
const path = require('path');

const replacements = {
  '2026-05-01-youth-rent-interest.md': ['[ITEM_ID: ben-2026-001]', '[ITEM_ID: ben-2026-003]'],
  '2026-05-01-multichild-jeonse-interest.md': ['[ITEM_ID: ben-2026-002]', '[ITEM_ID: ben-2026-005]'],
  '2026-05-01-senior-basic-pension.md': ['[ITEM_ID: ben-2026-003]', '[ITEM_ID: ben-2026-006]'],
  '2026-05-01-yongin-birth-grant.md': ['[ITEM_ID: ben-2026-004]', '[ITEM_ID: ben-2026-002]'],
  '2026-05-01-yongin-pregnant-transport.md': ['[ITEM_ID: ben-2026-005]', '[ITEM_ID: ben-2026-001]'],
  '2026-05-01-yongin-child-allowance.md': ['[ITEM_ID: ben-2026-006]', '[ITEM_ID: ben-2026-014]'],
  '2026-05-01-yongin-youth-suit.md': ['[ITEM_ID: ben-2026-010]', '[ITEM_ID: ben-2026-004]'],
  '2026-05-01-yongin-housing-benefit.md': ['[ITEM_ID: ben-2026-014]', '[ITEM_ID: ben-2026-015]'],
  '2026-05-01-yongin-disability-support.md': ['[ITEM_ID: ben-2026-015]', '[ITEM_ID: ben-2026-016]'],
};

for (const [file, [from, to]] of Object.entries(replacements)) {
  const filepath = path.join('src/content/posts', file);
  if (fs.existsSync(filepath)) {
    let content = fs.readFileSync(filepath, 'utf8');
    content = content.replace(from, to);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated ${file}: ${from} -> ${to}`);
  }
}
