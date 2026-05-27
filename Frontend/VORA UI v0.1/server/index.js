import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { detectAlgorithm, detectLanguage } from './detector.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Groq client (OpenAI-compatible SDK)
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

const CODE_ANALYSIS_PROMPT = `You are NexaBot AI, an advanced coding assistant for the CodeNova platform.

When a user submits code, you must perform the following analysis. Return your response in clear, structured markdown sections exactly matching these headers:

1. **Programming Language**: Detect the programming language (C++, Java, Python, JavaScript, C, TypeScript, etc.).
2. **Syntax Errors**: Check if the code contains missing semicolons, unmatched brackets, or other syntax errors.
3. **Logical Errors**: Detect logical bugs, incorrect conditions, infinite loops, missing variables, or unhandled edge cases.
4. **Bug Explanation**: Explain the errors clearly. If no errors exist, state that the code is correct.
5. **Corrected Code**: Provide the corrected or fully working version of the code.
6. **Optimization Suggestions**: Suggest improvements, best practices, or optimizations.
7. **Algorithm Used**: Detect the algorithm type or data structure if applicable.
8. **Time Complexity**: Analyze the time (O notation) and space complexity.`;

const FILE_ANALYSIS_PROMPT = `You are an automated code analyzer. 
You are given a fully complete program or folder containing uploaded files (supports C++, Java, Python, and JavaScript). 
You must automatically read the contents and analyze the code directly.
Detect the type of issue automatically, including Syntax errors, Runtime errors, Logical errors, Missing imports/modules, Incorrect variable usage, Compilation errors, and Bad coding practices.

CRITICAL RULES:
- You must NOT ask the user for additional information (no asking for error type, operating system, error message, or folder details).
- Assume the uploaded file or folder contains the full code and immediately start analyzing it.
- Prioritize analyzing uploaded code instead of asking the user for more information.
- If multiple files exist, analyze each file, detect which file contains the error, and provide the corrected code for that file specifically.
- DO NOT output any introductory or conversational text. Your response must strictly and only use the headers below.

Your response format MUST ALWAYS strictly be:

**File with Error:**
(Name of the file containing the error, if applicable)

**Error Type:**
(e.g., Syntax Error, Runtime Error, Logical Error, or None)

**Error Explanation:**
(Brief explanation of the issue detected in the code. If no error exists, output exactly: "No critical errors detected. Here are suggested improvements." and list them.)

**Corrected Code:**
\`\`\`<language>
<Return the fully corrected version of the code>
\`\`\`
`;

const GENERAL_PROMPT = `You are NexaBot AI, an advanced coding assistant for the CodeNova platform. You are currently in general conversation mode. Answer the user's questions clearly, concisely, and accurately using a technical but friendly tone.`;

function containsCode(text) {
  // Heuristic to detect programming syntax
  const patterns = [
    /[{}();]/g,
    /for\s*\(/i,
    /while\s*\(/i,
    /if\s*\(/i,
    /function\s/i,
    /def\s+\w+/i,
    /class\s+\w+/i,
    /import\s/i,
    /#include/i,
    /console\.log|print|cout|System\.out/i,
    /return\s/i,
    /=>/
  ];
  
  // If we match at least 2 common syntax patterns, treat it as code
  let score = 0;
  for (const p of patterns) {
    if (p.test(text)) score++;
  }
  return score >= 2 || (text.includes('{') && text.includes('}'));
}

app.use(cors());
app.use(express.json());

// Log startup config
console.log("Groq API Key loaded:", process.env.GROQ_API_KEY ? `${process.env.GROQ_API_KEY.substring(0, 10)}...` : "MISSING!");
console.log("Base URL:", "https://api.groq.com/openai/v1");
console.log("Model:", "llama-3.3-70b-versatile");

app.get('/', (req, res) => {
  res.send({ status: 'CodeNova AI Backend (NexaBot) is active — Powered by Groq' });
});

// Debug test route - hit http://localhost:5000/test-ai to verify Groq independently
app.get('/test-ai', async (req, res) => {
  try {
    console.log("[TEST-AI] Sending test request to Groq...");
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: "Explain binary search in one sentence." }
      ],
      max_tokens: 100,
    });
    console.log("[TEST-AI] Success!");
    res.json({ 
      status: "success", 
      reply: completion.choices[0].message.content,
      model: completion.model 
    });
  } catch (error) {
    console.error("[TEST-AI] Failed:", error.message);
    res.status(500).json({ status: "error", error: error.message });
  }
});

app.post('/chat', async (req, res) => {
  try {
    const { message, files } = req.body;
    console.log("[CHAT] Incoming message:", message?.substring(0, 100));
    
    // We can allow either message or files, but one must exist
    if (!message && (!files || files.length === 0)) {
      return res.status(400).json({ error: "Message or files are required" });
    }

    const hasFiles = files && files.length > 0;
    const isCode = containsCode(message || "");
    
    // Determine mode based on whether files are attached, or if message contains code syntax
    let selectedPrompt = GENERAL_PROMPT;
    if (hasFiles) {
      selectedPrompt = FILE_ANALYSIS_PROMPT;
      console.log(`[CHAT] Mode: File Analysis Mode`);
    } else if (isCode) {
      selectedPrompt = CODE_ANALYSIS_PROMPT;
      console.log(`[CHAT] Mode: Code Analysis (Syntax Detected)`);
    } else {
      console.log(`[CHAT] Mode: General Conversation`);
    }

    // Compile file contents into the prompt
    let contextStr = "";
    if (hasFiles) {
      contextStr = "Uploaded Files:\n\n";
      files.forEach(f => {
        contextStr += `--- START OF FILE: ${f.name} ---\n${f.content}\n--- END OF FILE ---\n\n`;
      });
      console.log(`[CHAT] Attached ${files.length} file(s) to prompt.`);
    }

    // Wrap the user's message with file context if any exists
    let finalMessage = message || "";
    if (hasFiles) {
      finalMessage = `${contextStr}${message ? `\nUser's message about the files: ${message}` : "Analyze the uploaded file(s)."}`;
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: selectedPrompt },
        { role: "user", content: finalMessage }
      ],
      temperature: 0.2, // Lower temp for code/analysis stability
      max_tokens: 4096,
    });

    console.log("[CHAT] Groq response received, length:", completion.choices[0].message.content.length);
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("[CHAT] Groq API Error:", error.message || error);
    console.error("[CHAT] Error status:", error.status);
    
    res.json({ 
      reply: `⚠️ Backend Error: ${error.message || "Unknown error"}. Check the server console for details.`
    });
  }
});

app.post('/api/analyze', async (req, res) => {
  const { code, language } = req.body;
  
  if (!code || !code.trim()) {
    return res.status(400).json({ error: 'Code is required' });
  }

  const prompt = `You are a strict, highly accurate code analyzer. 
The user claims the code is written in: "${language}".
Analyze the provided code and return ONLY a valid JSON object matching exactly this structure:

{
  "detectedLang": "LanguageName e.g. Python, Java, JavaScript, C++",
  "languageMatch": true or false,
  "algorithm": "Specific Algorithm Name (e.g. Binary Search, Quick Sort), 'Custom Logic', or 'None' if non-algorithmic",
  "explanation": "If 'None', explain that the code simply prints/assigns and does not contain algorithmic logic. Else leave empty.",
  "complexity": {
    "time": "O(...) or 'Unknown / Depends on input'",
    "space": "O(...)"
  },
  "bugs": [
    { "type": "critical" | "warning", "message": "Explanation of syntax, logical error, or undefined variable." }
  ],
  "visualization": [
    { "array": [1, 2, 3], "L": 0, "R": 1, "M": 0, "label": "Step 1 logic matching the code..." }
  ],
  "suggestions": [ "Suggestion 1", "Suggestion 2" ],
  "refactoring": [ "Refactoring idea 1", "Refactoring idea 2" ]
}

CRITICAL RULES:
- If the detected language does not match the user's claimed "${language}" (e.g. claiming C++ but writing Python), set "languageMatch" to false. Do not perform the rest of the analysis if it heavily violates the language.
- Ensure Time Complexity explicitly factors in nested loops vs single loops vs recursion. Do not guess. If No loops format as O(1).
- Evaluate Space Complexity focusing on memory allocation sizes (arrays, recursion stacks).
- If the code contains no sorting, traversals, or recursion logic (e.g. just a basic 'print'), return: "algorithm": "None", "visualization": [], "complexity": {"time": "O(1)", "space": "O(1)"}, and populate "explanation".
- Check for missing semicolons, undefined variables, incorrect loop conditions, or infinite loops mapping them to "bugs".
- Visualization steps MUST accurately reflect the exact operations happening in the code (e.g., index iteration for loops, mid updates for binary searches, swap ops for sorting). Generate 3 to 6 logical steps mimicking execution. Leave 'visualization' empty "[]" if no algorithm is present.
- Output MUST be strictly parseable JSON formatted output.`;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: code }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    
    // Polyfill selectedAlgo object for the frontend PerformanceSimulator to read correctly
    result.selectedAlgo = {
      name: result.algorithm,
      complexity: result.complexity.time,
      color: '#00f0ff'
    };

    res.json(result);
  } catch (error) {
    console.error('[ANALYZE] Error:', error);
    res.status(500).json({ error: 'Failed to complete AI analysis.' });
  }
});

app.post('/api/simulate', (req, res) => {
  const { inputSize, complexity } = req.body;
  
  let timeFactor = 0.001;
  let memoryFactor = 0.0005;

  if (complexity === 'O(n²)') {
    timeFactor = 0.0001;
  } else if (complexity === 'O(n log n)') {
    timeFactor = 0.0005;
  } else if (complexity === 'O(log n)') {
    timeFactor = 0.01;
  }

  // Calculate base time based on complexity
  let baseTime = 0;
  if (complexity === 'O(n²)') baseTime = Math.pow(inputSize, 2) * timeFactor;
  else if (complexity === 'O(n log n)') baseTime = inputSize * Math.log2(inputSize) * timeFactor;
  else if (complexity === 'O(log n)') baseTime = Math.log2(inputSize) * timeFactor;
  else baseTime = inputSize * timeFactor; // O(n) default

  const time = baseTime + (Math.random() * (baseTime * 0.1));
  const memory = (inputSize * memoryFactor) + 2 + (Math.random() * 0.5);
  
  res.json({
    time: time.toFixed(2),
    memory: memory.toFixed(1),
    bottlenecks: inputSize > 5000 && complexity === 'O(n²)' ? ['Quadratic time complexity spike', 'Cache miss ratio increasing'] : [],
    steps: [
      'Input size: ' + inputSize,
      'Algorithm Complexity: ' + complexity,
      'Calculating instruction count...',
      'Measuring heap allocation...',
      'Finalizing benchmarking report.'
    ]
  });
});

app.post('/api/interview', async (req, res) => {
  const { action, messages, code, language, problemTitle, description } = req.body;
  
  try {
    if (action === 'chat') {
       // Regular interview chat
       const systemContent = `You are an expert technical interviewer at a top tech company. The candidate is solving: "${problemTitle}". Problem Description: "${description}". Discuss their approaches, ask about time/space complexity, and gently guide them if they struggle. Keep responses concise, supportive, but rigorous.`;
       
       const completion = await client.chat.completions.create({
         model: "llama-3.3-70b-versatile",
         messages: [ { role: "system", content: systemContent }, ...messages ],
         temperature: 0.5,
         max_tokens: 1024,
       });
       return res.json({ reply: completion.choices[0].message.content });
    } else if (action === 'evaluate') {
       // Code evaluation after submit
       const systemContent = `You are a technical interviewer evaluating a coding solution.
Problem: "${problemTitle}"
Description: "${description}"

Candidate Code (${language}):
\`\`\`
${code}
\`\`\`

Evaluate the candidate's code and provide a JSON response EXACTLY matching this structure:
{
  "score": "Score out of 10 (e.g., '8.5/10')",
  "timeComplexity": "O(n), etc.",
  "spaceComplexity": "O(n), etc.",
  "qualityScore": "Score out of 10 (e.g., '9/10')",
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement 1", "Improvement 2"],
  "feedback": "Overall evaluation summary",
  "followUp": "A deep follow up interview question to ask them"
}
Ensure the output is strictly valid JSON without Markdown blocks wrapping it.`;

       const completion = await client.chat.completions.create({
         model: "llama-3.3-70b-versatile",
         messages: [ { role: "user", content: systemContent } ],
         temperature: 0.2,
         response_format: { type: "json_object" }
       });
       
       return res.json(JSON.parse(completion.choices[0].message.content));
    } else if (action === 'hint') {
       const prompt = `The candidate is struggling with "${problemTitle}". Provide a short progressive hint without giving away the exact code implementation. Keep it brief.`;
       const completion = await client.chat.completions.create({
         model: "llama-3.3-70b-versatile",
         messages: [ { role: "user", content: prompt } ],
         temperature: 0.5,
         max_tokens: 150,
       });
       return res.json({ hint: completion.choices[0].message.content });
    }
  } catch (error) {
     console.error('[INTERVIEW API ERROR]:', error);
     return res.status(500).json({ error: 'Interview Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
