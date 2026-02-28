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
      password TEXT NOT NULL,
      accept_tos BOOLEAN NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("Database ready");
}

initDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});