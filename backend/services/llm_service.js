// backend/services/llmService.js
require('dotenv').config();
const { GoogleGenAI, Type } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const ALLOWED_DOMAINS = [
  'business', 'crime', 'culture', 'education', 
  'entertainment', 'environment', 'health', 'politics', 
  'science', 'sports', 'technology', 'weather'
];

// Helper delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateProjectIdea(newsTitle, newsSnippet, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const prompt = `
        Analyze this news headline and snippet:
        News Title: "${newsTitle}"
        News Snippet: "${newsSnippet}"

        Task:
        1. Extract an operational or technical friction point from the news.
        2. Transform that friction point into a realistic software portfolio project idea.
        3. Categorize the project into EXACTLY ONE of these domains: ${ALLOWED_DOMAINS.join(', ')}.
        4. Provide coreFeatures: Exactly 4 distinct, production-ready software features needed to implement this application.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              domain: { 
                type: Type.STRING,
                enum: ALLOWED_DOMAINS
              },
              problemStatement: { type: Type.STRING },
              coreFeatures: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of exactly 4 software functionalities without using jargons in simple terms'
              }
            },
            required: ['title', 'domain', 'problemStatement', 'coreFeatures']
          }
        }
      });

      return JSON.parse(response.text);

    } catch (error) {
      console.warn(`⚠️ Gemini Attempt ${attempt}/${retries} failed: ${error.message}`);
      
      // If server is 503 / busy, wait 4 seconds before trying again
      if (attempt < retries) {
        console.log('⏳ Waiting 4 seconds before retrying Gemini...');
        await delay(4000);
      } else {
        console.error('❌ Max retries reached for article generation.');
        return null;
      }
    }
  }
}

module.exports = { generateProjectIdea };