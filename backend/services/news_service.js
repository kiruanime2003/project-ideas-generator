// backend/services/newsService.js
const RssParser = require('rss-parser');
const parser = new RssParser();

// Popular tech RSS feeds
// backend/services/news_service.js

const RSS_FEEDS = [
  // Business, Tech & Science
  'https://www.cnbc.com/id/100003114/device/rss/rss.html', // Business
  'https://techcrunch.com/feed/',                          // Technology
  'https://phys.org/rss-feed/',                             // Science

  // Health, Environment & Weather
  'https://www.medicalnewstoday.com/feed',                 // Health
  'https://grist.org/feed/',                                // Environment
  'https://www.spc.noaa.gov/products/spcrss.xml',           // Weather

  // World, Politics, Crime, Education, Culture, Sports, Entertainment
  'http://feeds.bbci.co.uk/news/world/rss.xml',             // Politics / Crime
  'https://feeds.npr.org/1008/rss.xml',                     // Culture / Education
  'https://www.espn.com/espn/rss/news',                     // Sports
  'https://www.theverge.com/entertainment/rss/index.xml'   // Entertainment
];

/**
 * Fetches recent news articles from configured RSS feeds
 * @returns {Promise<Array>} Array of clean article objects
 */
async function fetchLatestNews() {
  let allArticles = [];

  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      
      // Extract key info from top 5 items per feed
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