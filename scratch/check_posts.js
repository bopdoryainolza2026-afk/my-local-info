const fs = require('fs');
const path = require('path');

const postsDirPath = 'c:\\Users\\무영CM\\Desktop\\AI Project\\my-local-info\\src\\content\\posts';
const files = fs.readdirSync(postsDirPath).filter(f => f.endsWith('.md'));

console.log('--- Post Status ---');
files.forEach(file => {
    const filePath = path.join(postsDirPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const length = content.length;
    const status = length > 1500 ? '✅ Upgraded' : '❌ Short';
    console.log(`${file.padEnd(50)} | ${length.toString().padStart(6)} chars | ${status}`);
});
