import { GoogleGenAI } from '@google/genai';
import { env } from './env.js';

let geminiClient: GoogleGenAI | null = null;

if (env.GEMINI_API_KEY) {
  geminiClient = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY,
  });
  console.log('✅ Gemini API Client initialized successfully.');
} else {
  if (env.NODE_ENV === 'production') {
    console.error('❌ CRITICAL: GEMINI_API_KEY is required in production environment.');
  } else {
    console.warn('⚠️ WARNING: GEMINI_API_KEY is not set. Development mock fallback mode is enabled for local testing.');
  }
}

export { geminiClient };
