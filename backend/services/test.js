const { fetchLatestNews } = require('./news_service');
const { generateProjectIdea } = require('./llm_service');

async function testPipeline() {
  console.log('1. Fetching live news headlines...');
  const newsList = await fetchLatestNews();

  if (newsList.length === 0) {
    console.log('No news articles found.');
    return;
  }

  
  const sampleArticle = newsList[0];
  console.log(`\n2. Processing article: "${sampleArticle.title}"\n`);

  console.log('3. Sending to Gemini LLM to generate project idea...');
  const idea = await generateProjectIdea(sampleArticle.title, sampleArticle.snippet);

  console.log('\n================ GENERATED PROJECT IDEA ================');
  console.log(JSON.stringify(idea, null, 2));
  console.log('========================================================\n');
}

testPipeline();