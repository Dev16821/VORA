import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('Testing with API Key starting with:', apiKey ? apiKey.substring(0, 8) + '...' : 'MISSING');
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    const result = await model.generateContent('Verify connection');
    const response = await result.response;
    console.log('SUCCESS:', response.text());
  } catch (error) {
    console.error('DIAGNOSTIC_ERROR:', error.message);
    if (error.message.includes('API_KEY_INVALID')) {
      console.error('REASON: The provided API key is invalid or has expired.');
    }
  }
}

testGemini();
