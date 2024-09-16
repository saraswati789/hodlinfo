const express = require("express");
const axios = require("axios");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// Set up PostgreSQL connection
const pool = new Pool({
  user: "saraswati",
  host: "localhost",
  database: "db",
  password: "saraswati",
  port: 5432,
});

// Fetch API data and insert into database
async function fetchAndStoreData() {
  try {
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
    const tickers = Object.values(response.data).slice(0, 10); // Top 10 results

    // Insert into the database
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      for (const ticker of tickers) {
        const { name, last, buy, sell, volume, base_unit } = ticker;
        await client.query(
          "INSERT INTO crypto_data (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)",
          [name, last, buy, sell, volume, base_unit]
        );
      }

      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchAndStoreData();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Route to get data from the database
app.get("/crypto-data", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM crypto_data");
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.use(express.static("public"));
