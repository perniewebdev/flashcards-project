
const express = require("express");
const router = express.Router();
const { users, sessions, hashPassword, generateId } = require("../store");
const { authMiddleware } = require("../middleware/auth");

router.post("/", (req, res) => {
  const { email, password, acceptToS } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  if (acceptToS !== true)
    return res.status(400).json({ error: "Terms must be accepted" });

  for (const user of users.values()) {
    if (user.email === email)
      return res.status(409).json({ error: "Email already in use" });
  }

  const userId = generateId();

  users.set(userId, {
    id: userId,
    email,
    passwordHash: hashPassword(password),
    consentAcceptedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  });

  res.status(201).json({ id: userId });
});

router.delete("/me", authMiddleware, (req, res) => {
  users.delete(req.user.id);
  sessions.delete(req.token);
  res.json({ message: "User deleted" });
});

module.exports = router;