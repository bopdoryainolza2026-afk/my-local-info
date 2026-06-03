const fs = require('fs');

const localData = require('./public/data/local-info.json');
const postsData = require('./public/data/posts-data.json');

// Get slug from item id using postsData
function getItemBlogLink(itemId) {
  let matched = postsData.find(p => p.content && p.content.includes(`[ITEM_ID: ${itemId}]`));
  if (!matched) {
    matched = postsData.find(p => p.content && p.content.includes(`[ITEM_ID:${itemId}]`));
  }
  if (matched) return `/blog/${matched.slug}`;
  return `/blog/auto-post/${itemId}`;
}

// Function to sort an array by post date descending
function sortArrayByPostDate(items) {
  return [...items].sort((a, b) => {
    const linkA = getItemBlogLink(a.id);
    const linkB = getItemBlogLink(b.id);
    const slugA = linkA.replace('/blog/', '');
    const slugB = linkB.replace('/blog/', '');
    const postA = postsData.find(p => p.slug === slugA);
    const postB = postsData.find(p => p.slug === slugB);
    
    const dateA = postA ? new Date(postA.date).getTime() : 0;
    const dateB = postB ? new Date(postB.date).getTime() : 0;
    
    if (dateA !== dateB) {
      return dateB - dateA; // Descending
    }
    return 0;
  });
}

// Sort all main arrays in localData
localData.events = sortArrayByPostDate(localData.events || []);
localData.benefits = sortArrayByPostDate(localData.benefits || []);
localData.restaurants = sortArrayByPostDate(localData.restaurants || []);
localData.education = sortArrayByPostDate(localData.education || []);
localData.jobs = sortArrayByPostDate(localData.jobs || []);
localData.culture = sortArrayByPostDate(localData.culture || []);
if (localData.realEstate) localData.realEstate = sortArrayByPostDate(localData.realEstate);

// Write back to file
fs.writeFileSync('./public/data/local-info.json', JSON.stringify(localData, null, 2), 'utf8');
console.log('Successfully sorted local-info.json arrays by post date.');
