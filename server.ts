import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory fallback if Neon database isn't connected
interface Consultation {
  id?: number;
  client_name: string;
  email: string;
  phone: string;
  service_type: string;
  message: string;
  status: string;
  created_at: string;
}

const inMemoryConsultations: Consultation[] = [];

// Lazy PG client helper
let pool: pg.Pool | null = null;
let lastUsedUrl: string | null = null;
let lastDbFailureTime = 0; // Cooldown tracker
const DB_FAILURE_COOLDOWN_MS = 45000; // 45s cooldown on error to avoid spamming connection/DNS timeouts

function getDatabaseUrl(): string | null {
  let dbUrl = process.env.DATABASE_URL;

  if (!dbUrl || dbUrl.trim() === "" || dbUrl.trim() === "base") {
    try {
      const dotenvPath = path.join(process.cwd(), ".env");
      if (fs.existsSync(dotenvPath)) {
        const envContent = fs.readFileSync(dotenvPath, "utf-8");
        const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
        if (match && match[1]) {
          dbUrl = match[1];
        }
      }
    } catch (e) {}

    if (!dbUrl || dbUrl.trim() === "" || dbUrl.trim() === "base") {
      try {
        const dotenvExamplePath = path.join(process.cwd(), ".env.example");
        if (fs.existsSync(dotenvExamplePath)) {
          const envContent = fs.readFileSync(dotenvExamplePath, "utf-8");
          const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
          if (match && match[1]) {
            dbUrl = match[1];
          }
        }
      } catch (e) {}
    }
  }
  return dbUrl ? dbUrl.trim() : null;
}

function getPool(): { pool: pg.Pool | null; error: string | null } {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) {
    return { pool: null, error: "DATABASE_URL environment variable is missing" };
  }

  const trimmed = dbUrl.trim();
  if (trimmed === "" || trimmed === "base") {
    return { pool: null, error: "DATABASE_URL is not set or has default placeholder value." };
  }

  if (!trimmed.startsWith("postgres://") && !trimmed.startsWith("postgresql://")) {
    return { pool: null, error: "DATABASE_URL must start with postgresql:// or postgres://" };
  }

  // Bracket detection or obvious invalid configurations
  if (trimmed.includes("[") || trimmed.includes("]") || trimmed.includes("<") || trimmed.includes(">") || trimmed.includes("your-")) {
    return { pool: null, error: "DATABASE_URL has invalid placeholder characters." };
  }

  if (pool && lastUsedUrl !== trimmed) {
    try {
      pool.end();
    } catch (e) {}
    pool = null;
  }

  if (!pool) {
    try {
      pool = new pg.Pool({
        connectionString: trimmed,
        connectionTimeoutMillis: 3500, // Reject connections faster if target is down or slow (3.5s max)
        ssl: {
          rejectUnauthorized: false // Neon requires SSL
        }
      });
      lastUsedUrl = trimmed;
    } catch (err: any) {
      return { pool: null, error: err.message || "Failed to initialize PG Pool" };
    }
  }
  return { pool, error: null };
}

// Helper to determine if we are in active database connection cooldown
function isDbInCooldown(): boolean {
  return Date.now() - lastDbFailureTime < DB_FAILURE_COOLDOWN_MS;
}

// 1. Get database status
app.get("/api/db-status", async (req, res) => {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) {
    return res.json({
      connected: false,
      message: "DATABASE_URL is not set in environment variables.",
      fallbackActive: true,
    });
  }

  const trimmed = dbUrl.trim();
  if (trimmed === "" || trimmed === "base" || (!trimmed.startsWith("postgres://") && !trimmed.startsWith("postgresql://")) || trimmed.includes("[")) {
    return res.json({
      connected: false,
      message: "DATABASE_URL is either a placeholder, default value, or has an invalid format.",
      fallbackActive: true,
    });
  }

  const { pool: activePool, error } = getPool();
  if (error || !activePool) {
    return res.json({
      connected: false,
      message: error || "Could not instantiate PostgreSQL pool.",
      fallbackActive: true,
    });
  }

  try {
    const client = await activePool.connect();
    const result = await client.query("SELECT NOW()");
    client.release();
    // Connection succeeded, reset any failure tracker
    lastDbFailureTime = 0;
    return res.json({
      connected: true,
      message: "Connected to Neon database successfully!",
      timestamp: result.rows[0].now,
      fallbackActive: false,
    });
  } catch (err: any) {
    // Record failure time to trigger connection bypass cooldown
    lastDbFailureTime = Date.now();
    return res.json({
      connected: false,
      message: `Failed to connect with Neon: ${err.message}`,
      fallbackActive: true,
    });
  }
});

// 2. Initialize database schema
app.post("/api/db-init", async (req, res) => {
  const { pool: activePool, error } = getPool();
  if (error || !activePool) {
    return res.status(400).json({
      success: false,
      message: error || "Database connection check failed. Set DATABASE_URL."
    });
  }

  try {
    const client = await activePool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS consultations (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        service_type VARCHAR(100) NOT NULL,
        message TEXT,
        status VARCHAR(20) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    client.release();
    lastDbFailureTime = 0; // successfully initialized, reset cooldown
    return res.json({
      success: true,
      message: "Table 'consultations' verified/created successfully in your Neon DB!"
    });
  } catch (err: any) {
    lastDbFailureTime = Date.now();
    return res.status(500).json({
      success: false,
      message: `Failed to initialize table: ${err.message}`
    });
  }
});

// 3. Create a consultation
app.post("/api/consultations", async (req, res) => {
  const { client_name, email, phone, service_type, message } = req.body;

  if (!client_name || !email || !phone || !service_type) {
    return res.status(400).json({
      success: false,
      message: "Nama, email, nomor HP, dan tipe layanan harus diisi."
    });
  }

  if (!isDbInCooldown()) {
    const { pool: activePool } = getPool();
    if (activePool) {
      try {
        const client = await activePool.connect();
        const query = `
          INSERT INTO consultations (client_name, email, phone, service_type, message, status, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW())
          RETURNING *
        `;
        const values = [client_name, email, phone, service_type, message || "", "Pending"];
        const result = await client.query(query, values);
        client.release();

        return res.json({
          success: true,
          message: "Permintaan konsultasi Anda berhasil dikirim ke server IT Support Hub.",
          data: result.rows[0]
        });
      } catch (err: any) {
        lastDbFailureTime = Date.now();
        console.warn("Neon DB Insert failed, falling back to in-memory store:", err.message);
      }
    }
  } else {
    console.info("Neon database is currently offline (cooldown active), falling back directly to memory store.");
  }

  // Fallback to memory
  const newConsultation: Consultation = {
    id: inMemoryConsultations.length + 1,
    client_name,
    email,
    phone,
    service_type,
    message: message || "",
    status: "Pending",
    created_at: new Date().toISOString()
  };
  inMemoryConsultations.unshift(newConsultation);

  return res.json({
    success: true,
    message: "Permintaan konsultasi Anda telah berhasil kami terima.",
    data: newConsultation,
    fallback: true
  });
});

// 4. Get all consultations
app.get("/api/consultations", async (req, res) => {
  if (!isDbInCooldown()) {
    const { pool: activePool } = getPool();
    if (activePool) {
      try {
        const client = await activePool.connect();
        const result = await client.query("SELECT * FROM consultations ORDER BY created_at DESC");
        client.release();
        return res.json({
          success: true,
          source: "neon-db",
          data: result.rows
        });
      } catch (err: any) {
        lastDbFailureTime = Date.now();
        console.warn("Failed to fetch from Neon, falling back to in-memory:", err.message);
      }
    }
  } else {
    console.info("Neon database is currently offline (cooldown active), serving from local memory.");
  }

  return res.json({
    success: true,
    source: "local-memory",
    data: inMemoryConsultations
  });
});

// 5. Update consultation status
app.patch("/api/consultations/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: "Status is required." });
  }

  if (!isDbInCooldown()) {
    const { pool: activePool } = getPool();
    if (activePool) {
      try {
        const client = await activePool.connect();
        const result = await client.query(
          "UPDATE consultations SET status = $1 WHERE id = $2 RETURNING *",
          [status, id]
        );
        client.release();

        if (result.rowCount > 0) {
          return res.json({
            success: true,
            message: "Status updated in Neon!",
            data: result.rows[0]
          });
        }
      } catch (err: any) {
        lastDbFailureTime = Date.now();
        console.warn("Failed to update in Neon, falling back:", err.message);
      }
    }
  }

  // Fallback in-memory
  const index = inMemoryConsultations.findIndex(c => c.id === parseInt(id));
  if (index !== -1) {
    inMemoryConsultations[index].status = status;
    return res.json({
      success: true,
      message: "Status updated in local memory!",
      data: inMemoryConsultations[index]
    });
  }

  return res.status(404).json({ success: false, message: "Consultation not found." });
});

// Setup Vite & static serving
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

bootstrap();
