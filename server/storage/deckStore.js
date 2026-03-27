import pool from "../database.js";
import { randomUUID } from "crypto";

function toDeck(row) {
  return {
    id: row.id,
    title: row.title,
    userId: row.user_id,
    visibility: row.visibility,
    createdAt: row.created_at
  };
}

async function findById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM decks WHERE id = $1 LIMIT 1",
    [id]
  );
  return rows.length ? toDeck(rows[0]) : null;
}

async function findByUserId(userId) {
  const { rows } = await pool.query(
    "SELECT * FROM decks WHERE user_id = $1",
    [userId]
  );
  return rows.map(toDeck);
}

async function createDeck(title, userId, visibility = "private") {
  const { rows } = await pool.query(
    `INSERT INTO decks (id, title, user_id, visibility) VALUES ($1, $2, $3, $4) RETURNING *`,
    [randomUUID(), title, userId, visibility]
  );
  return toDeck(rows[0]);
}

async function deleteDeck(id) {
  const { rowCount } = await pool.query(
    "DELETE FROM decks WHERE id = $1",
    [id]
  );
  return rowCount > 0;
}

export default { findById, findByUserId, createDeck, deleteDeck };