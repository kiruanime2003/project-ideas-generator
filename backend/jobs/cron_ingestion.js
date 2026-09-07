// backend/jobs/cronIngestion.js
const cron = require('node-cron');
const ProblemIdea = require('../models/problem_idea');
const { fetchLatestNews } = require('../services/news_service');
const { generateProjectIdea } = require('../services/llm_service');

// Adjusted to 5 ideas per cycle to stay well within 20 RPD cap
const TARGET_IDEAS_PER_BATCH = 5;

async function runBatchIngestion(isMorningRun = false) {
  console.log(`\n==================================================`);
  console.log(`⏰ Starting ${isMorningRun ? 'MORNING (6 AM)' : 'EVENING (6 PM)'} Batch Ingestion...`);
  console.log(`==================================================\n`);

  try {
    // Morning run: Wipe existing items to keep DB fresh
    if (isMorningRun) {
      console.log('🧹 [Morning Reset] Wiping database clean...');
      await ProblemIdea.deleteMany({});
      console.log('✅ Database wiped successfully.\n');
    }

    console.log('📰 Fetching RSS feeds...');
    const newsList = await fetchLatestNews();

    if (!newsList || newsList.length === 0) {
      console.log('❌ No articles fetched from RSS feeds.');
      return;
    }

    let newIdeasCount = 0;

    for (const article of newsList) {
      // Stop exactly when we hit 5 generated ideas
      if (newIdeasCount >= TARGET_IDEAS_PER_BATCH) {
        console.log(`\n🎯 Target reached! Created ${TARGET_IDEAS_PER_BATCH} new ideas for this batch.`);
        break;
      }

      // Skip already processed articles
      const existingDoc = await ProblemIdea.findOne({ articleUrl: article.link });
      if (existingDoc) continue;

      console.log(`🤖 [3.6-Flash] Processing [${newIdeasCount + 1}/${TARGET_IDEAS_PER_BATCH}]: "${article.title}"`);
      const ideaJSON = await generateProjectIdea(article.title, article.snippet);

      // Stop immediately if quota is hit
      if (ideaJSON?.error === 'QUOTA_EXHAUSTED') {
        console.log('🛑 Aborting run: Daily quota exhausted.');
        break;
      }

      if (!ideaJSON) continue;

      const newProject = new ProblemIdea({
        title: ideaJSON.title,
        domain: ideaJSON.domain,
        problemStatement: ideaJSON.problemStatement,
        coreFeatures: ideaJSON.coreFeatures,
        articleUrl: article.link
      });

      await newProject.save();
      newIdeasCount++;
      console.log(`💾 Saved: "${newProject.title}" [${newProject.domain}]`);

      // 3-second buffer between API calls
      await new Promise((res) => setTimeout(res, 3000));
    }

    const totalDocs = await ProblemIdea.countDocuments();
    console.log(`\n✅ Batch complete. Current Total in DB: ${totalDocs} ideas.\n`);

  } catch (error) {
    console.error('❌ Error during batch ingestion:', error.message);
  }
}

function startCronJob() {
  // 6:00 AM Run (Wipe DB + Generate 5 ideas)
  cron.schedule('0 6 * * *', () => {
    runBatchIngestion(true);
  });

  // 6:00 PM Run (Append 5 more ideas = 10 total)
  cron.schedule('0 18 * * *', () => {
    runBatchIngestion(false);
  });

  console.log('⏰ Cron tasks active: 06:00 AM (Wipe + 5 Ideas) & 06:00 PM (Append 5 Ideas).');
}

module.exports = { startCronJob, runBatchIngestion };