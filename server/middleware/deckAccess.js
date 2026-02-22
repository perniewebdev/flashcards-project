
const { decks } = require("../store");

function deckAccessMiddleware(req, res, next) {
  const { deckId } = req.params;
  const deck = decks.get(deckId);

  if (!deck) return res.status(404).json({ error: "Deck not found" });

  if (deck.visibility === "public") {
    req.deck = deck;
    return next();
  }

  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (deck.ownerId !== req.user.id) {
    return res.status(403).json({ error: "Access denied" });
  }

  req.deck = deck;
  next();
}

module.exports = { deckAccessMiddleware };