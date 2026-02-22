
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const { deckAccessMiddleware } = require("../middleware/deckAccess");
const flashcardRoutes = require("./flashcards");
const { decks, generateId } = require("../store");

router.get("/", (req, res) => {
  res.json([...decks.values()]);
});

router.post("/", authMiddleware, (req, res) => {
  const id = generateId();

  const deck = {
    id,
    name: req.body.name,
    visibility: req.body.visibility || "private",
    ownerId: req.user.id
  };

  decks.set(id, deck);
  res.status(201).json(deck);
});

router.get("/:deckId",
  authMiddleware,
  deckAccessMiddleware,
  (req, res) => {
    res.json(req.deck);
  }
);

router.put("/:deckId",
  authMiddleware,
  deckAccessMiddleware,
  (req, res) => {
    req.deck.name = req.body.name ?? req.deck.name;
    req.deck.visibility = req.body.visibility ?? req.deck.visibility;
    res.json(req.deck);
  }
);

router.delete("/:deckId",
  authMiddleware,
  deckAccessMiddleware,
  (req, res) => {
    decks.delete(req.deck.id);
    res.json({ message: "Deck deleted" });
  }
);

router.use("/:deckId/flashcards",
  authMiddleware,
  deckAccessMiddleware,
  flashcardRoutes
);

module.exports = router;