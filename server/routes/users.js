import { Router } from "express";
import usersStore from "../storage/userStore.js";
import { authMiddleware } from "../middleware/auth.js";
import { hashPassword, verifyPassword } from "./auth.js";
import { msg } from "../i18n/messages.js";

const router = Router();

router.post("/", async (req, res) => {
  const { email, password, acceptToS } = req.body;
  if (!email || typeof email !== "string")
    return res.status(400).json(msg(req, "emailRequired"));
  if (!password || typeof password !== "string")
    return res.status(400).json(msg(req, "passwordRequired"));
  if (password.length < 8)
    return res.status(400).json(msg(req, "passwordTooShort"));
  if (acceptToS !== true)
    return res.status(400).json(msg(req, "tosRequired"));

  const existing = await usersStore.findByEmail(email);
  if (existing) return res.status(409).json(msg(req, "emailTaken"));

  const hash = await hashPassword(password);
  const user = await usersStore.createUser(email, hash, new Date(), new Date());
  return res.status(201).json({ id: user.id });
});

router.delete("/me", authMiddleware, async (req, res) => {
  const ok = await usersStore.deleteUser(req.user.id);
  if (!ok) return res.sendStatus(404);
  return res.sendStatus(204);
});

router.patch("/me/email", authMiddleware, async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string")
    return res.status(400).json(msg(req, "emailRequired"));
  const existing = await usersStore.findByEmail(email);
  if (existing) return res.status(409).json(msg(req, "emailTaken"));
  const ok = await usersStore.updateEmail(req.user.id, email);
  if (!ok) return res.sendStatus(404);
  return res.sendStatus(200);
});

router.patch("/me/password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json(msg(req, "passwordRequired"));
  if (newPassword.length < 8)
    return res.status(400).json(msg(req, "passwordTooShort"));

  const user = await usersStore.findById(req.user.id);

  let valid = false;
  try {
    valid = await verifyPassword(currentPassword, user.passwordHash);
  } catch {
    return res.status(401).json(msg(req, "invalidCredentials"));
  }
  if (!valid) return res.status(401).json(msg(req, "invalidCredentials"));

  const hash = await hashPassword(newPassword);
  const ok = await usersStore.updatePassword(req.user.id, hash);
  if (!ok) return res.sendStatus(404);
  return res.sendStatus(200);
});

export default router;