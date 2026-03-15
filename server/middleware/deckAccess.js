
const pool = require("../database");

async function deckAccessMiddleware(req, res, next) {
  const { deckId } = req.params;

  const result = await pool.query("SELECT * FROM decks WHERE id = $1", [deckId]);
  const deck = result.rows[0];

  if (!deck) return res.status(404).json({ error: "Deck not found" });

  if (deck.visibility === "public") {
    req.deck = deck;
    return next();
  }

  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (deck.user_id !== req.user.id) {
    return res.status(403).json({ error: "Access denied" });
  }

  req.deck = deck;
  next();
}

module.exports = { deckAccessMiddleware };