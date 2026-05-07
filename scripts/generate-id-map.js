const path = require('path');
const data = require(path.join(__dirname, '../public/data/posts-data.json'));
const localData = require(path.join(__dirname, '../public/data/local-info.json'));

const allItems = [
  ...localData.events, 
  ...localData.benefits, 
  ...localData.restaurants,
  ...(localData.education || []),
  ...(localData.jobs || []),
  ...(localData.culture || []),
  ...(localData.realEstate || []),
  ...(localData.hotTopics || [])
];


const map = {};
const missing = [];

allItems.forEach(item => {
  const searchId = '[ITEM_ID:' + item.id + ']';
  const matched = data.find(p => {
    if (!p.content) return false;
    const cleanContent = p.content.replace(/\s+/g, '');
    return cleanContent.includes('[ITEM_ID:' + item.id + ']');
  });
  if (matched) {
    map[item.id] = matched.slug;
  } else {
    missing.push({ id: item.id, name: item.name });
  }
});

console.log('=== 매핑 성공:', Object.keys(map).length, '개 ===');
console.log(JSON.stringify(map, null, 2));
console.log('=== 블로그 없음:', missing.length, '개 ===');
missing.forEach(m => console.log('-', m.id, ':', m.name));
