
const express = require("express");
const router = express.Router({ mergeParams: true });
const { flashcards, generateId } = require("../store");

router.get("/", (req, res) => {
  const deckCards = [...flashcards.values()]
    .filter(fc => fc.deckId === req.deck.id);
  res.json(deckCards);
});

router.post("/", (req, res) => {
  const id = generateId();

  const flashcard = {
    id,
    deckId: req.deck.id,
    question: req.body.question,
    answer: req.body.answer
  };

  flashcards.set(id, flashcard);
  res.status(201).json(flashcard);
});

router.get("/:id", (req, res) => {
  const flashcard = flashcards.get(req.params.id);
  if (!flashcard || flashcard.deckId !== req.deck.id)
    return res.status(404).json({ error: "Not found" });

  res.json(flashcard);
});

router.put("/:id", (req, res) => {
  const flashcard = flashcards.get(req.params.id);
  if (!flashcard || flashcard.deckId !== req.deck.id)
    return res.status(404).json({ error: "Not found" });

  flashcard.question = req.body.question ?? flashcard.question;
  flashcard.answer = req.body.answer ?? flashcard.answer;

  res.json(flashcard);
});

router.delete("/:id", (req, res) => {
  const flashcard = flashcards.get(req.params.id);
  if (!flashcard || flashcard.deckId !== req.deck.id)
    return res.status(404).json({ error: "Not found" });

  flashcards.delete(req.params.id);
  res.json({ message: "Flashcard deleted" });
});

module.exports = router;