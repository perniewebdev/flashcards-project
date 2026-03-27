import { Router } from "express";
import flashcardsStore from "../storage/flashcardStore.js";
import { authMiddleware } from "../middleware/auth.js";
import { deckAccessMiddleware } from "../middleware/deckAccess.js";
import { msg } from "../i18n/messages.js";

const router = Router({ mergeParams: true });

router.get("/", authMiddleware, deckAccessMiddleware, async (req, res) => {
  const flashcards = await flashcardsStore.findByDeckId(req.deck.id);
  return res.json(flashcards);
});

router.post("/", authMiddleware, deckAccessMiddleware, async (req, res) => {
  const { question, answer } = req.body;
  if (!question) return res.status(400).json(msg(req, "questionRequired"));
  if (!answer) return res.status(400).json(msg(req, "answerRequired"));

  const flashcard = await flashcardsStore.createFlashcard(question, answer, req.deck.id);
  return res.status(201).json({ id: flashcard.id });
});

router.delete("/:flashcardId", authMiddleware, deckAccessMiddleware, async (req, res) => {
  const ok = await flashcardsStore.deleteFlashcard(req.params.flashcardId);
  if (!ok) return res.sendStatus(404);
  return res.sendStatus(204);
});

export default router;