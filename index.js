import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 5000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

app.use(express.json());

// memory for all conversations (resets if server restarts)
let chatHistory = [];

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No message provided" });

    // Add user message to history
    chatHistory.push({ role: "user", parts: [{ text: message }] });

    // Generate response with memory
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: chatHistory,
    });

    const reply = response.text;

    // Add AI response to history
    chatHistory.push({ role: "model", parts: [{ text: reply }] });

    res.json({ reply, history: chatHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Chat API running on port ${PORT}`));
