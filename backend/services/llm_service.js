require('dotenv').config(); 
const { GoogleGenAI, Type } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is missing from process.env!");
}

const ai = new GoogleGenAI({ apiKey });

const ALLOWED_DOMAINS = [
  'business', 'crime', 'culture', 'education', 
  'entertainment', 'environment', 'health', 'politics', 
  'science', 'sports', 'technology', 'weather'
];

async function generateProjectIdea(newsTitle, newsSnippet) {
  try {
    const prompt = `
      Analyze this news headline and snippet. Extract an operational or technical friction point.
      Transform that friction point into a realistic software portfolio project idea.

      News Title: "${newsTitle}"
      News Snippet: "${newsSnippet}"

      Categorize the project into EXACTLY ONE of these domains: ${ALLOWED_DOMAINS.join(', ')}.
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
              description: 'List of exactly 4 core features'
            }
          },
          required: ['title', 'domain', 'problemStatement', 'coreFeatures']
        }
      }
    });

    return JSON.parse(response.text);

  } catch (error) {
    console.error('Error generating project idea with Gemini:', error.message);
    return null;
  }
}

module.exports = { generateProjectIdea };