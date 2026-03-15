
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const pool = require("../database");
const { msg } = require("../i18n/messages");
const { authMiddleware } = require("../middleware/auth");

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

router.post("/", async (req, res) => {
  const { email, password, acceptToS } = req.body;
  if (!email || typeof email !== "string")
    return res.status(400).json(msg(req, "emailRequired"));
  if (!password || typeof password !== "string")
    return res.status(400).json(msg(req, "passwordRequired"));
  if (password.length < 8)
    return res.status(400).json(msg(req, "passwordTooShort"));
  if (acceptToS !== true)
    return res.status(400).json(msg(req, "tosRequired"));

  const client = await pool.connect();
  try {
    const existing = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existing.rows.length > 0)
      return res.status(409).json(msg(req, "emailTaken"));

    const id = crypto.randomUUID();
    await client.query(
      `INSERT INTO users (id, email, password_hash, consent_accepted_at, created_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, email, hashPassword(password), new Date(), new Date()]
    );
    res.status(201).json({ id });
  } finally {
    client.release();
  }
});

router.delete("/me", authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("DELETE FROM sessions WHERE user_id = $1", [req.user.id]);
    await client.query("DELETE FROM users WHERE id = $1", [req.user.id]);
    res.json({ message: "Account deleted" });
  } finally {
    client.release();
  }
});

module.exports = router;