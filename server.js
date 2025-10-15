// Import necessary libraries
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Express app and Google AI
const app = express();
const port = 3000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- CORS Configuration ---
const corsOptions = {
  origin: 'https://kristina-hanxhara9.github.io'
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Define the API endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'userMessage is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const fullPrompt = `${prompt}\n\nUser Question: "${userMessage}"\n\nAI Assistant Response:`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to generate response from AI' });
  }
});

// --- Vercel Deployment Export ---
// This allows Vercel to use your Express app.
module.exports = app;

// --- Local Development Server ---
// This part only runs when you start the file directly (e.g., `node server.js`)
// It is ignored by Vercel.
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`✅ Server is running locally at http://localhost:${port}`);
  });
}