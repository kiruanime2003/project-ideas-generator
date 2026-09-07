// backend/services/newsService.js
const RssParser = require('rss-parser');
const parser = new RssParser();


const RSS_FEEDS = [
  // Business & Finance
  'https://www.cnbc.com/id/100003114/device/rss/rss.html',
  
  // Technology
  'https://techcrunch.com/feed/',
  'https://www.theverge.com/rss/index.xml', 
  
  // Science & Weather
  'https://phys.org/rss-feed/',
  
  'https://medicalxpress.com/rss-feed/', 
  'https://news.google.com/rss/search?q=health',
  
  // Environment
  'https://grist.org/feed/',
  
  // World & Politics
  'http://feeds.bbci.co.uk/news/world/rss.xml',
  
  // Culture & Education
  'https://feeds.npr.org/1008/rss.xml',
  
  // Sports
  'https://www.espn.com/espn/rss/news',
  
  'https://variety.com/feed/' 
];

/**
 *
 * @returns {Promise<Array>} 
 */
async function fetchLatestNews() {
  let allArticles = [];

  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      
      const items = feed.items.slice(0, 5).map(item => ({
        title: item.title,
        link: item.link,
        snippet: item.contentSnippet || item.content || item.title,
        pubDate: item.pubDate || new Date().toISOString()
      }));

      allArticles.push(...items);
    } catch (error) {
      console.error(`Error fetching RSS feed (${feedUrl}):`, error.message);
    }
  }

  return allArticles;
}

module.exports = { fetchLatestNews };