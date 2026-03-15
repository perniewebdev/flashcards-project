
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const pool = require("../database");
const { msg } = require("../i18n/messages");
const { authMiddleware } = require("../middleware/auth");
const { deckAccessMiddleware } = require("../middleware/deckAccess");

router.post("/", authMiddleware, async (req, res) => {
  const { title, visibility = "private" } = req.body;
  if (!title)
    return res.status(400).json(msg(req, "deckTitleRequired"));

  const client = await pool.connect();
  try {
    const id = crypto.randomUUID();
    await client.query(
      `INSERT INTO decks (id, title, user_id, visibility)
       VALUES ($1, $2, $3, $4)`,
      [id, title, req.user.id, visibility]
    );
    res.status(201).json({ id });
  } finally {
    client.release();
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM decks WHERE user_id = $1",
    [req.user.id]
  );
  res.json(result.rows);
});

router.get("/:deckId/flashcards", authMiddleware, deckAccessMiddleware, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM flashcards WHERE deck_id = $1",
    [req.deck.id]
  );
  res.json(result.rows);
});

router.post("/:deckId/flashcards", authMiddleware, deckAccessMiddleware, async (req, res) => {
  const { question, answer } = req.body;
  if (!question)
    return res.status(400).json(msg(req, "questionRequired"));
  if (!answer)
    return res.status(400).json(msg(req, "answerRequired"));

  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO flashcards (id, question, answer, deck_id)
     VALUES ($1, $2, $3, $4)`,
    [id, question, answer, req.deck.id]
  );
  res.status(201).json({ id });
});

module.exports = router;