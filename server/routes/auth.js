import { Router } from "express";
import crypto from "crypto";
import pool from "../database.js";
import { msg } from "../i18n/messages.js";

const router = Router();

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, hash) => {
      if (err) reject(err);
      else resolve(salt + ":" + hash.toString("hex"));
    });
  });
}

export async function verifyPassword(password, stored) {
  if (stored.startsWith("$2b$") || stored.startsWith("$2a$")) {
    throw new Error("bcrypt_legacy");
  }
  if (!stored.includes(":")) {
    const sha256 = crypto.createHash("sha256").update(password).digest("hex");
    return sha256 === stored;
  }
  const [salt, hash] = stored.split(":");
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derived) => {
      if (err) reject(err);
      else {
        try {
          resolve(crypto.timingSafeEqual(Buffer.from(hash, "hex"), derived));
        } catch {
          resolve(false);
        }
      }
    });
  });
}

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json(msg(req, "emailRequired"));

  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email = $1 LIMIT 1",
    [email.trim().toLowerCase()]
  );
  const user = rows[0];
  if (!user) return res.status(401).json(msg(req, "invalidCredentials"));

  let valid = false;
  let needsUpgrade = false;

  try {
    valid = await verifyPassword(password, user.password_hash);
    needsUpgrade = !user.password_hash.includes(":");
  } catch (err) {
    if (err.message === "bcrypt_legacy") {
      return res.status(401).json({ error: "Password reset required. Please create a new account." });
    }
    throw err;
  }

  if (!valid) return res.status(401).json(msg(req, "invalidCredentials"));

  if (needsUpgrade) {
    const newHash = await hashPassword(password);
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [newHash, user.id]);
  }

  const token = crypto.randomUUID();
  await pool.query(
    "INSERT INTO sessions (token, user_id, created_at) VALUES ($1, $2, $3)",
    [token, user.id, new Date()]
  );

  return res.json({ token, userId: user.id });
});

export default router;