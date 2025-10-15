// Import necessary libraries
require('dotenv').config(); // Loads environment variables from .env file
const express = require('express');
const cors = require('cors'); // <-- ADD THIS LINE
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Express app and Google AI
const app = express();
const port = 3000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- ADD THIS SECTION FOR CORS ---
// Define the allowed origin for CORS
const corsOptions = {
  origin: 'https://kristina-hanxhara9.github.io'
};
// Use the cors middleware with your options
app.use(cors(corsOptions));
// ---------------------------------

// Middleware to parse JSON bodies
app.use(express.json());

// NOTE: I have removed `app.use(express.static(__dirname));` and the app.get('/') route
// because Vercel will handle serving the API, and GitHub Pages will serve your HTML.
// This keeps the server's job focused on just the API.

// Define the API endpoint that the front-end will call
app.post('/api/generate', async (req, res) => {
  try {
    // Get the prompt and user message from the request body sent by the front-end
    const { prompt, userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'userMessage is required' });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Construct the full prompt for the model
    const fullPrompt = `${prompt}\n\nUser Question: "${userMessage}"\n\nAI Assistant Response:`;

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Send the AI's reply back to the front-end
    res.json({ reply: text });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to generate response from AI' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});