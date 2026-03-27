import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import deckRoutes from "./routes/decks.js";
import flashcardRoutes from "./routes/flashcards.js";
import { initDB } from "./storage/initDB.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/decks", deckRoutes);
app.use("/decks/:deckId/flashcards", flashcardRoutes);

initDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});