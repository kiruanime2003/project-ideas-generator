// backend/jobs/cronIngestion.js

const cron = require('node-cron');
const ProblemIdea = require('../models/problem_idea');
const { fetchLatestNews } = require('../services/news_service');
const { generateProjectIdea } = require('../services/llm_service');

const TARGET_IDEAS_PER_BATCH = 10;

async function runBatchIngestion(isMorningRun = false) {
  console.log(`\n==================================================`);
  console.log(`⏰ Starting ${isMorningRun ? 'MORNING (6 AM)' : 'EVENING (6 PM)'} Batch Ingestion...`);
  console.log(`==================================================\n`);

  try {
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
      if (newIdeasCount >= TARGET_IDEAS_PER_BATCH) {
        console.log(`\n🎯 Target reached! Created ${TARGET_IDEAS_PER_BATCH} new ideas for this batch.`);
        break;
      }

      const existingDoc = await ProblemIdea.findOne({ articleUrl: article.link });
      if (existingDoc) continue;

      console.log(`🤖 Processing [${newIdeasCount + 1}/${TARGET_IDEAS_PER_BATCH}]: "${article.title}"`);
      const ideaJSON = await generateProjectIdea(article.title, article.snippet);

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

      await new Promise((res) => setTimeout(res, 2000));
    }

    const totalDocs = await ProblemIdea.countDocuments();
    console.log(`\n✅ Batch complete. Current Total in DB: ${totalDocs} ideas.\n`);

  } catch (error) {
    console.error('❌ Error during batch ingestion:', error.message);
  }
}

function startCronJob() {
  const cronOptions = {
    scheduled: true,
    timezone: "Asia/Kolkata" // 👈 Forces schedule to India Standard Time (IST)
  };

  cron.schedule('0 6 * * *', () => runBatchIngestion(true));
  cron.schedule('0 18 * * *', () => runBatchIngestion(false));
  console.log('⏰ Cron tasks scheduled for 06:00 AM & 06:00 PM.');
}

// ⚠️ MAKE SURE THIS EXACT EXPORT IS AT THE VERY BOTTOM ⚠️
module.exports = { 
  startCronJob, 
  runBatchIngestion 
};

