// backend/services/testDbPipeline.js
require('dotenv').config();
const connectDB = require('../config/db');
const ProblemIdea = require('../models/problem_idea');
const { fetchLatestNews } = require('./news_service');
const { generateProjectIdea } = require('./llm_service');

async function runPipeline() {
  await connectDB();

  console.log('\n1. Fetching live news articles...');
  const newsList = await fetchLatestNews();

  if (newsList.length === 0) {
    console.log('No news articles returned.');
    process.exit(0);
  }

  console.log(`Fetched ${newsList.length} articles. Processing first 2 articles...\n`);

  for (const article of newsList.slice(0, 2)) {
    console.log(`--------------------------------------------------`);
    console.log(`📰 Article: "${article.title}"`);

    // 1. Check if we already processed this article URL
    const existingDoc = await ProblemIdea.findOne({ articleUrl: article.link });
    if (existingDoc) {
      console.log('⚠️ Article already processed and present in MongoDB. Skipping Gemini call.');
      continue;
    }

    // 2. Generate idea with Gemini if not in database
    console.log('🤖 Generating project idea with Gemini...');
    const ideaJSON = await generateProjectIdea(article.title, article.snippet);

    if (!ideaJSON) {
      console.log('❌ Failed to generate project idea.');
      continue;
    }

    // 3. Save to MongoDB
    const newProject = new ProblemIdea({
      title: ideaJSON.title,
      domain: ideaJSON.domain,
      problemStatement: ideaJSON.problemStatement,
      coreFeatures: ideaJSON.coreFeatures,
      articleUrl: article.link
    });

    await newProject.save();
    console.log('💾 Successfully saved new project idea to MongoDB!');
    console.log(`    Title: "${newProject.title}" [Domain: ${newProject.domain}]`);
  }

  process.exit(0);
}

runPipeline();