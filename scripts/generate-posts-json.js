const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'src/content/posts');
const outputFile = path.join(process.cwd(), 'public/data/posts-data.json');

function generate() {
  if (!fs.existsSync(postsDirectory)) {
    console.log('No posts directory found.');
    return;
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      let date = matterResult.data.date;
      if (date instanceof Date) {
        date = date.toISOString().split('T')[0];
      } else if (typeof date !== 'string') {
        date = '';
      }

      return {
        slug,
        title: matterResult.data.title || '',
        date,
        summary: matterResult.data.summary || '',
        category: matterResult.data.category || '',
        tags: matterResult.data.tags || [],
        content: matterResult.content,
      };
    });

  const sorted = allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
  
  if (!fs.existsSync(path.dirname(outputFile))) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(sorted, null, 2), 'utf8');
  console.log(`Successfully generated ${sorted.length} posts to ${outputFile}`);
}

generate();
