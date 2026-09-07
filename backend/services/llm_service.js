// backend/services/llmService.js
require('dotenv').config();
const { GoogleGenAI, Type } = require('@google/genai');
const Groq = require('groq-sdk');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ALLOWED_DOMAINS = [
  'business', 'crime', 'culture', 'education', 
  'entertainment', 'environment', 'health', 'politics', 
  'science', 'sports', 'technology', 'weather'
];

// Helper to construct uniform prompt instructions
function buildPrompt(newsTitle, newsSnippet) {
  return `
    Analyze this news headline and snippet:
    News Title: "${newsTitle}"
    News Snippet: "${newsSnippet}"

    Task:
    1. Extract an operational or technical friction point from the news.
    2. Transform that friction point into a realistic software portfolio project idea.
    3. Categorize the project into EXACTLY ONE of these domains: ${ALLOWED_DOMAINS.join(', ')}.
    4. Provide coreFeatures: Exactly 4 distinct, production-ready software features needed to implement this application.
  `;
}

// 1. Try Primary: Gemini 3.6 Flash
async function generateWithGemini(newsTitle, newsSnippet) {
  const prompt = buildPrompt(newsTitle, newsSnippet);
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          domain: { type: Type.STRING, enum: ALLOWED_DOMAINS },
          problemStatement: { type: Type.STRING },
          coreFeatures: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'List of exactly 4 actionable software features'
          }
        },
        required: ['title', 'domain', 'problemStatement', 'coreFeatures']
      }
    }
  });

  return JSON.parse(response.text);
}

// 2. Secondary Fallback: Groq (Llama 3.3 70B)
async function generateWithGroq(newsTitle, newsSnippet) {
  const prompt = `${buildPrompt(newsTitle, newsSnippet)}
  Return ONLY a raw valid JSON object with keys: title, domain, problemStatement, coreFeatures (array of 4 strings).`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You generate JSON project briefs for software developers. Output raw JSON only."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}

// Main Orchestrator Function
async function generateProjectIdea(newsTitle, newsSnippet) {
  // Try Gemini first
  try {
    console.log('🤖 Attempting generation with Gemini 3.6 Flash...');
    const result = await generateWithGemini(newsTitle, newsSnippet);
    if (result) return result;
  } catch (geminiError) {
    console.warn(`⚠️ Gemini failed: ${geminiError.message}`);
    console.log('🔄 Switching to Groq (Llama-3.3-70b) fallback...');
  }

  // Fallback to Groq
  try {
    const groqResult = await generateWithGroq(newsTitle, newsSnippet);
    if (groqResult) {
      console.log('⚡ Successfully generated idea using Groq!');
      return groqResult;
    }
  } catch (groqError) {
    console.error(`❌ Groq fallback also failed: ${groqError.message}`);
    return null;
  }
}

module.exports = { generateProjectIdea };