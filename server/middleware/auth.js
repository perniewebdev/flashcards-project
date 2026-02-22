
const { sessions, users } = require("../store")

function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: "Missing auth header" })

  const token = header.replace("Bearer ", "")
  const userId = sessions.get(token)

  if (!userId) return res.status(401).json({ error: "Invalid or expired session" })

  const user = users.get(userId)
  if (!user) return res.status(401).json({ error: "User no longer exists" })

  req.user = user
  req.token = token
  next()
}

module.exports = { authMiddleware }