
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const deckRoutes = require("./routes/decks");
const pool = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/decks", deckRoutes);

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      consent_accepted_at TIMESTAMP,
      privacy_accepted_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    DROP TABLE IF EXISTS flashcards;
    DROP TABLE IF EXISTS decks;
    CREATE TABLE decks (
      id UUID PRIMARY KEY,
      title TEXT NOT NULL,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      visibility TEXT DEFAULT 'private',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE flashcards (
      id UUID PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("Database ready");
}

initDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});