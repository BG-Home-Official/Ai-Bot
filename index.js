import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 5000;

const ApiKey = [
	process.env.GEMINI_API_KEY0,
	process.env.GEMINI_API_KEY1,
	process.env.GEMINI_API_KEY2,
	process.env.GEMINI_API_KEY3,
	process.env.GEMINI_API_KEY4,
	process.env.GEMINI_API_KEY5,
	process.env.GEMINI_API_KEY6,
	process.env.GEMINI_API_KEY7,
	process.env.GEMINI_API_KEY8,
	process.env.GEMINI_API_KEY9,
].filter(Boolean);

app.use(express.json());

app.post("/chat", async (req, res) => {
	const { history, message, system} = req.body;
	
	if (!message) {
		return res.status(400).json({ error: "No message provided" });
	}
	
	const chatHistory = history || [];
	chatHistory.push({ role: "user", parts: [{ text: message }] });
	
	let reply = null;
	let errorMessage = null;
	
	for (let i = 0; i < ApiKey.length; i++) {
		try {
			const ai = new GoogleGenAI({ apiKey: ApiKey[i] });
			
			const response = await ai.models.generateContent({
				model: "gemini-2.5-flash",
				contents: chatHistory,
				config: {
					systemInstruction: system || "",
				},
			});
			
			reply = response.text;
			break;
		} catch (err) {
			console.error(`API key ${i} failed:`, err.message || err);
			errorMessage = err.message || "Unknown error";
			continue;
		}
	}
	
	if (!reply) {
		return res.status(500).json({ error: "All API keys failed", details: errorMessage });
	}
	
	chatHistory.push({ role: "model", parts: [{ text: reply }] });
	res.json({ reply, history: chatHistory });
});

app.get("/", (req, res) => {
	res.json({ message: "Google GenAI API running 🚀" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
