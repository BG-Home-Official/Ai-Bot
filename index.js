import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 5000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Set this in Render
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { history, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const chatHistory = history || [];

    chatHistory.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: chatHistory,
    });

    const reply = response.text;

    chatHistory.push({ role: "model", parts: [{ text: reply }] });

    res.json({ reply, history: chatHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Google GenAI API running 🚀" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
