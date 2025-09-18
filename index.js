import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 5000;

const GEMINI_API_KEY = "AIzaSyAJ1lowKyxaRDqLi5aa15KadVH095-mACw";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

app.use(express.json());

// Memory in server (resets when restarted)
let chatHistory = [];

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // Add user message
    chatHistory.push({ role: "user", parts: [{ text: message }] });

    // Call Gemini with full history
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: chatHistory,
    });

    // Extract reply safely
    const reply =
      response.text ||
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No reply from Gemini";

    // Save AI reply
    chatHistory.push({ role: "model", parts: [{ text: reply }] });

    // Send back
    res.json({ reply, history: chatHistory });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Chat API running 🚀" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
