import pool from "../database.js";
import { randomUUID } from "crypto";

function toFlashcard(row) {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    deckId: row.deck_id,
    createdAt: row.created_at
  };
}

async function findByDeckId(deckId) {
  const { rows } = await pool.query(
    "SELECT * FROM flashcards WHERE deck_id = $1",
    [deckId]
  );
  return rows.map(toFlashcard);
}

async function createFlashcard(question, answer, deckId) {
  const { rows } = await pool.query(
    `INSERT INTO flashcards (id, question, answer, deck_id) VALUES ($1, $2, $3, $4) RETURNING *`,
    [randomUUID(), question, answer, deckId]
  );
  return toFlashcard(rows[0]);
}

async function deleteFlashcard(id) {
  const { rowCount } = await pool.query(
    "DELETE FROM flashcards WHERE id = $1",
    [id]
  );
  return rowCount > 0;
}

export default { findByDeckId, createFlashcard, deleteFlashcard };