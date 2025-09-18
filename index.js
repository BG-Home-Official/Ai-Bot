import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
