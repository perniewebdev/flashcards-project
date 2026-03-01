
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://flashcards_project_user:urgpK6hAIbEsOYS98D8kdyyvNC8QUNKJ@dpg-d6fl0gtdi7vc739totkg-a.frankfurt-postgres.render.com/flashcards_project",
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;