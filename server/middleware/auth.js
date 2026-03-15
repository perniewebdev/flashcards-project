
const pool = require("../database");

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Missing auth header" });

  const token = header.replace("Bearer ", "");

  const result = await pool.query(
    "SELECT users.* FROM sessions JOIN users ON sessions.user_id = users.id WHERE sessions.token = $1",
    [token]
  );

  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: "Invalid or expired session" });

  req.user = user;
  req.token = token;
  next();
}

module.exports = { authMiddleware };