
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const pool = require("../database");
const { msg } = require("../i18n/messages");

router.post("/", async (req, res) => {
  const { title } = req.body;
  const userId = req.headers["x-user-id"];

  if (!title)
    return res.status(400).json(msg(req, "deckTitleRequired"));

  if (!userId)
    return res.status(401).json(msg(req, "unauthorized"));

  const client = await pool.connect();

  try {
    const id = crypto.randomUUID();

    await client.query(
      `INSERT INTO decks (id, title, user_id)
       VALUES ($1, $2, $3)`,
      [id, title, userId]
    );

    res.status(201).json({ id });

  } finally {
    client.release();
  }
});

router.get("/", async (req, res) => {
  const userId = req.headers["x-user-id"];

  if (!userId)
    return res.status(401).json(msg(req, "unauthorized"));

  const result = await pool.query(
    "SELECT * FROM decks WHERE user_id = $1",
    [userId]
  );

  res.json(result.rows);
});

module.exports = router;