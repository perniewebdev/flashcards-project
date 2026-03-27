import pool from "../database.js";

function toUser(row) {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    consentAcceptedAt: row.consent_accepted_at,
    privacyAcceptedAt: row.privacy_accepted_at,
    createdAt: row.created_at
  };
}

async function findByEmail(email) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email = $1 LIMIT 1",
    [email.trim().toLowerCase()]
  );
  return rows.length ? toUser(rows[0]) : null;
}

async function findById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE id = $1 LIMIT 1",
    [id]
  );
  return rows.length ? toUser(rows[0]) : null;
}

async function createUser(email, passwordHash, consentAcceptedAt, privacyAcceptedAt) {
  const { randomUUID } = await import("crypto");
  const { rows } = await pool.query(
    `INSERT INTO users (id, email, password_hash, consent_accepted_at, privacy_accepted_at, created_at)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [randomUUID(), email.trim().toLowerCase(), passwordHash, consentAcceptedAt, privacyAcceptedAt, new Date()]
  );
  return toUser(rows[0]);
}

async function deleteUser(id) {
  const { rowCount } = await pool.query(
    "DELETE FROM users WHERE id = $1",
    [id]
  );
  return rowCount > 0;
}

async function updatePassword(id, newPasswordHash) {
  const { rowCount } = await pool.query(
    "UPDATE users SET password_hash = $1 WHERE id = $2",
    [newPasswordHash, id]
  );
  return rowCount > 0;
}

async function updateEmail(id, newEmail) {
  const { rowCount } = await pool.query(
    "UPDATE users SET email = $1 WHERE id = $2",
    [newEmail.trim().toLowerCase(), id]
  );
  return rowCount > 0;
}

export default { findByEmail, findById, createUser, deleteUser, updatePassword, updateEmail };