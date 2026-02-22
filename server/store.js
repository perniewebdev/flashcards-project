
const crypto = require("crypto")

const users = new Map()
const sessions = new Map()

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex")
}

function generateId() {
  return crypto.randomUUID()
}

module.exports = { users, sessions, hashPassword, generateId }