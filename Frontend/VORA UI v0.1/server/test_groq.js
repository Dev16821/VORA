import dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

let log = "";
function addLog(msg) { log += msg + "\n"; console.log(msg); }

(async () => {
  addLog("Testing Groq API with llama-3.3-70b-versatile...");
  
  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: "Say hello in one sentence." }
      ],
      max_tokens: 100,
    });
    
    addLog("SUCCESS: " + completion.choices[0].message.content);
    addLog("Model: " + completion.model);
  } catch (error) {
    addLog("FAILED: " + (error.message || String(error)));
    addLog("Status: " + (error.status || "N/A"));
  }
  
  fs.writeFileSync("groq_test_output.txt", log);
  addLog("Done.");
})();
