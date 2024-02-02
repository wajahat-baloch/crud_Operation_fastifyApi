const fastify = require("fastify")({ logger: true });
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "crud",
  password: "123456789",
  port: 5432,
});

// Create
fastify.post("/api/users", async (request, reply) => {
  const { name, email } = request.body;
  const result = await pool.query(
    "INSERT INTO users_data (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  return result.rows[0];
});

// Read
fastify.get("/api/users", async (request, reply) => {
  const result = await pool.query("SELECT * FROM users_data");
  return result.rows;
});

// Update
fastify.put("/api/users/:Id", async (request, reply) => {
  const { Id } = request.params;
  const { name, email } = request.body;
  const result = await pool.query(
    "UPDATE users_data SET name = $1, email = $2 WHERE Id = $3 RETURNING *",
    [name, email, Id]
  );
  return result.rows[0];
});

// Delete
fastify.delete("/api/users/:Id", async (request, reply) => {
  const { Id } = request.params;
  const result = await pool.query(
    "DELETE FROM users_data WHERE Id = $1 RETURNING Id, name, email",
    [Id]
  );

  return result.rows[0];
});

const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`Server is running on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
