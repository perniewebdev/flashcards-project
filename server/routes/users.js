
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const pool = require("../database");
const { msg } = require("../i18n/messages");

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

router.post("/", async (req, res) => {
  const { email, password, acceptToS } = req.body;

  if (!email || !password || acceptToS !== true)
    return res.status(400).json(msg(req, "consentRequired"));

  const client = await pool.connect();

  try {
    const existing = await client.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length > 0)
      return res.status(409).json(msg(req, "usernameTaken"));

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

router.delete("/me", async (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) return res.status(401).json(msg(req, "unauthorized"));

  const client = await pool.connect();

  try {
    await client.query("DELETE FROM users WHERE id=$1", [userId]);
    res.json({ message: msg(req, "accountDeleted").error });
  } finally {
    client.release();
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json(msg(req, "usernameRequired"));

  const client = await pool.connect();

  try {
    const result = await client.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    const user = result.rows[0];
    if (!user || user.password_hash !== hashPassword(password))
      return res.status(401).json(msg(req, "wrongCredentials"));

    const token = crypto.randomUUID();
    res.json({ token, userId: user.id });
  } finally {
    client.release();
  }
});

module.exports = router;