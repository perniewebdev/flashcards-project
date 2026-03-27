import { Router } from "express";
import decksStore from "../storage/deckStore.js";
import { authMiddleware } from "../middleware/auth.js";
import { deckAccessMiddleware } from "../middleware/deckAccess.js";
import { msg } from "../i18n/messages.js";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
  const { title, visibility = "private" } = req.body;
  if (!title) return res.status(400).json(msg(req, "deckTitleRequired"));

  const deck = await decksStore.createDeck(title, req.user.id, visibility);
  return res.status(201).json({ id: deck.id });
});

router.get("/", authMiddleware, async (req, res) => {
  const decks = await decksStore.findByUserId(req.user.id);
  return res.json(decks);
});

router.delete("/:deckId", authMiddleware, deckAccessMiddleware, async (req, res) => {
  const ok = await decksStore.deleteDeck(req.deck.id);
  if (!ok) return res.sendStatus(404);
  return res.sendStatus(204);
});

export default router;