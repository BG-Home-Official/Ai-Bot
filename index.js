import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 5000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyAJ1lowKyxaRDqLi5aa15KadVH095-mACw";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: message,
    });
    
    console.log("Request:", message);
    console.log("Response:", response.text);
    
    res.json({ input: message, output: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Google GenAI API is running 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
