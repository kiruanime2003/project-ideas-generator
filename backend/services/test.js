// backend/testNews.js
const { fetchLatestNews } = require('./news_service');

async function test() {
  console.log('Fetching live news feeds...\n');
  const news = await fetchLatestNews();
  
  console.log(`Found ${news.length} articles:\n`);
  news.forEach((article, idx) => {
    console.log(`${idx + 1}. [${article.title}]`);
    console.log(`   Link: ${article.link}`);
    console.log(`   Snippet: ${article.snippet.slice(0, 100)}...`);
    console.log('--------------------------------------------------');
  });
}

test();