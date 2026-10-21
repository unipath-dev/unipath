
const pool = require("./db");

async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS universities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL DEFAULT 'United States',
        program VARCHAR(150) NOT NULL,
        annual_tuition NUMERIC(10, 2),
        scholarship_amount NUMERIC(10, 2),
        official_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    console.log("Universities table created successfully!");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

initDatabase();
