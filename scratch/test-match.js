const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'src/content/posts');
const localData = JSON.parse(fs.readFileSync('public/data/local-info.json', 'utf8'));

function getSortedPostsData() {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      return {
        slug,
        title: matterResult.data.title || '',
        content: matterResult.content,
      };
    });
}

const allPosts = getSortedPostsData();
const targetName = "용인 와이페이 '우리 동네 골목상권' 영수증 이벤트";
const item = allPosts.find(p => p.title.includes(targetName) || targetName.includes(p.title) || p.content.includes(targetName));

if (item) {
  console.log(`Matched! Slug: ${item.slug}`);
} else {
  console.log("No match found.");
}
