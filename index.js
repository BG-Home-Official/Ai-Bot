import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ message: "API running forever on Render 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
