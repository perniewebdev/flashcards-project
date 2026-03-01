
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const pool = require("../database");

router.post("/:deckId/flashcards", async (req, res) => {
  const { question, answer } = req.body;
  const { deckId } = req.params;

  if (!question || !answer)
    return res.status(400).json({ error: "Missing fields" });

  const id = crypto.randomUUID();

  await pool.query(
    `INSERT INTO flashcards (id, question, answer, deck_id)
     VALUES ($1, $2, $3, $4)`,
    [id, question, answer, deckId]
  );

  res.status(201).json({ id });
});

router.get("/:deckId/flashcards", async (req, res) => {
  const { deckId } = req.params;

  const result = await pool.query(
    "SELECT * FROM flashcards WHERE deck_id = $1",
    [deckId]
  );

  res.json(result.rows);
});

module.exports = router;