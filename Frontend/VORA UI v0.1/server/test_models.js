import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // Note: The SDK doesn't have a direct listModels helper that's commonly used, 
    // but we can try to fetch from the API directly or check documentation names.
    // Usually, gemini-1.5-flash is correct. 
    // Let's try to test gemini-1.5-flash-latest and gemini-1.5-flash.
    
    const modelsToTest = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];
    
    for (const modelName of modelsToTest) {
      console.log(`Testing model: ${modelName}...`);
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('test');
        const response = await result.response;
        console.log(`✅ ${modelName} works!`);
        process.exit(0);
      } catch (e) {
        console.log(`❌ ${modelName} failed: ${e.message}`);
      }
    }
  } catch (error) {
    console.error('LIST_MODELS_ERROR:', error.message);
  }
}

listModels();
