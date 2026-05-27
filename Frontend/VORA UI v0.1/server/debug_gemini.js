import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

let log = "";
function addLog(msg) { log += msg + "\n"; console.log(msg); }

async function generateWithRetry(prompt, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      const isRateLimit = error.status === 429 || (error.message && error.message.includes('429'));
      if (isRateLimit && attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt + 1) * 1000;
        addLog("Rate limited. Waiting " + (waitTime/1000) + "s before retry " + (attempt+1) + "...");
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
}

(async () => {
  addLog("Testing gemini-2.0-flash with retry logic...");
  try {
    const reply = await generateWithRetry("Say hello in one sentence.");
    addLog("SUCCESS: " + reply.trim().substring(0, 200));
  } catch (error) {
    addLog("FINAL FAILURE: " + error.message.substring(0, 300));
    addLog("Status: " + (error.status || "N/A"));
  }
  fs.writeFileSync("debug_output3.txt", log);
  addLog("Done.");
})();
