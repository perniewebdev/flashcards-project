import pool from "../database.js";

export async function initDB() {
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
    CREATE TABLE IF NOT EXISTS decks (
      id UUID PRIMARY KEY,
      title TEXT NOT NULL,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      visibility TEXT DEFAULT 'private',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS flashcards (
      id UUID PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("Database ready");
}