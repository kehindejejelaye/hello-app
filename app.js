const http = require('http');
const { Client } = require('pg');

const PORT = process.env.PORT || 8080;

const getDbClient = () => {
  return new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });
};

const server = http.createServer(async (req, res) => {
  const client = getDbClient();
  try {
    await client.connect();
    // Insert a new record
    await client.query('INSERT INTO visits DEFAULT VALUES');
    // Count total visits
    const result = await client.query('SELECT COUNT(*) FROM visits');
    const visitCount = result.rows[0].count;

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Hello from GitOps Phase 2! Total Database Visits: ${visitCount}\n`);
  } catch (err) {
    console.error('Database query error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Database Connection Error\n');
  } finally {
    await client.end().catch(() => {});
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});