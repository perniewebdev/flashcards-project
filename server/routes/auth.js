
const express = require("express");
const router = express.Router();
const { users, sessions, hashPassword, generateId } = require("../store");

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = [...users.values()].find(u => u.email === email);
  if (!user)
    return res.status(401).json({ error: "Invalid login" });

  if (user.passwordHash !== hashPassword(password))
    return res.status(401).json({ error: "Invalid credentials" });

  const token = generateId();
  sessions.set(token, user.id);

  res.json({ token });
});

module.exports = router;