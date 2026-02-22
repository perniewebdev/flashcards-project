
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const deckRoutes = require("./routes/decks");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/decks", deckRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});