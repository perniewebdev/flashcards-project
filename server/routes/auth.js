
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const pool = require("../database");

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = result.rows[0];
    if (!user || user.password_hash !== hashPassword(password))
      return res.status(401).json({ error: "Invalid credentials" });

    const token = crypto.randomUUID();
    res.json({ token, userId: user.id });
  } finally {
    client.release();
  }
});

module.exports = router;