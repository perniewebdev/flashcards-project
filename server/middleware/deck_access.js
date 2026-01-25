
function deckAccessMiddleware(getDeckById) {
  return async function (req, res, next) {

    if (!getDeckById) return next();

    const { deckId } = req.params;
    const userId = req.user?.id;

    const deck = await getDeckById(deckId);

    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }

    if (deck.visibility === "public") {
      return next();
    }

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (deck.ownerId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  };
}

module.exports = { deckAccessMiddleware };