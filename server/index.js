
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/decks", (req, res) => {
  res.json([{ id: 1, name: "Sample Deck", visibility: "public" }]);
});

app.post("/decks", (req, res) => {
  res.status(201).json({ id: 2, ...req.body });
});

app.get("/decks/:deckId", (req, res) => {
  res.json({ id: req.params.deckId, name: "Sample Deck", visibility: "private" });
});

app.put("/decks/:deckId", (req, res) => {
  res.json({ id: req.params.deckId, ...req.body });
});

app.delete("/decks/:deckId", (req, res) => {
  res.json({ message: `Deck ${req.params.deckId} deleted` });
});

app.get("/decks/:deckId/flashcards", (req, res) => {
  res.json([{ id: 1, question: "Q?", answer: "A" }]);
});

app.post("/decks/:deckId/flashcards", (req, res) => {
  res.status(201).json({ id: 2, ...req.body });
});

app.get("/decks/:deckId/flashcards/:id", (req, res) => {
  res.json({ id: req.params.id, question: "Q?", answer: "A" });
});

app.put("/decks/:deckId/flashcards/:id", (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

app.delete("/decks/:deckId/flashcards/:id", (req, res) => {
  res.json({ message: `Flashcard ${req.params.id} deleted` });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
