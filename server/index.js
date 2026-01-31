const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { deckAccessMiddleware } = require("./middleware/deck_access");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const users = new Map();
const sessions = new Map();

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function generateId() {
  return crypto.randomUUID();
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Missing auth header" });

  const token = header.replace("Bearer ", "");
  const userId = sessions.get(token);

  if (!userId) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  const user = users.get(userId);
  if (!user) {
    return res.status(401).json({ error: "User no longer exists" });
  }

  req.user = user;
  req.token = token;
  next();
}

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/users", (req, res) => {
  const { email, password, acceptToS } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  if (acceptToS !== true) {
    return res.status(400).json({ error: "Terms must be accepted" });
  }

  for (const user of users.values()) {
    if (user.email === email) {
      return res.status(409).json({ error: "Email already in use" });
    }
  }

  const userId = generateId();

  users.set(userId, {
    id: userId,
    email,
    passwordHash: hashPassword(password),
    consentAcceptedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({ message: "User created" });
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = [...users.values()].find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid login" });
  }

  if (user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateId();
  sessions.set(token, user.id);

  res.json({ token });
});

app.delete("/users/me", authMiddleware, (req, res) => {
  users.delete(req.user.id);
  sessions.delete(req.token);
  res.json({ message: "User deleted" });
});

app.get("/decks", (req, res) => {
  res.json([{ id: 1, name: "Sample Deck", visibility: "public" }]);
});

app.post("/decks", (req, res) => {
  res.status(201).json({ id: 2, ...req.body });
});

app.get("/decks/:deckId", deckAccessMiddleware(), (req, res) => {
  res.json({ id: req.params.deckId, name: "Sample Deck", visibility: "private" });
});

app.put("/decks/:deckId", deckAccessMiddleware(), (req, res) => {
  res.json({ id: req.params.deckId, ...req.body });
});

app.delete("/decks/:deckId", deckAccessMiddleware(), (req, res) => {
  res.json({ message: `Deck ${req.params.deckId} deleted` });
});

app.get("/decks/:deckId/flashcards", deckAccessMiddleware(), (req, res) => {
  res.json([{ id: 1, question: "Q?", answer: "A" }]);
});

app.post("/decks/:deckId/flashcards", deckAccessMiddleware(), (req, res) => {
  res.status(201).json({ id: 2, ...req.body });
});

app.get("/decks/:deckId/flashcards/:id", deckAccessMiddleware(), (req, res) => {
  res.json({ id: req.params.id, question: "Q?", answer: "A" });
});

app.put("/decks/:deckId/flashcards/:id", deckAccessMiddleware(), (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

app.delete("/decks/:deckId/flashcards/:id", deckAccessMiddleware(), (req, res) => {
  res.json({ message: `Flashcard ${req.params.id} deleted` });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});