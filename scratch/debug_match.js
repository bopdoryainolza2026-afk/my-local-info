const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/data/posts-data.json', 'utf8'));
const post = data.find(p => p.slug === '2026-05-06-yongin-platform-city-2026');
const content = post.content;

const itemIdMatch = content.match(/<!--\s*\[ITEM_ID:\s*(.*?)\s*\]\s*-->/);
const extractedItemId = itemIdMatch ? itemIdMatch[1].trim() : null;

console.log('Extracted ID:', extractedItemId);

const localData = JSON.parse(fs.readFileSync('public/data/local-info.json', 'utf8'));
const allItems = [
    ...(localData.educationNews || []),
    ...(localData.events || []), 
    ...(localData.benefits || []), 
    ...(localData.restaurants || []),
    ...(localData.education || []),
    ...(localData.jobs || []),
    ...(localData.culture || []),
    ...(localData.realEstate || []),
    ...(localData.hotTopics || [])
];

const matchedItem = allItems.find(item => item.id.toLowerCase() === extractedItemId.toLowerCase());
console.log('Matched Item Name:', matchedItem ? matchedItem.name : 'Not Found');
console.log('Matched Item Link:', matchedItem ? matchedItem.link : 'N/A');
