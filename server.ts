import express from "express";
import path from "path";
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

function getPool(): { pool: pg.Pool | null; error: string | null } {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return { pool: null, error: "DATABASE_URL environment variable is missing" };
  }

  if (!pool) {
    try {
      pool = new pg.Pool({
        connectionString: dbUrl,
        ssl: {
          rejectUnauthorized: false // Neon requires SSL, usually with rejectUnauthorized: false
        }
      });
    } catch (err: any) {
      return { pool: null, error: err.message || "Failed to initialize PG Pool" };
    }
  }
  return { pool, error: null };
}

// 1. Get database status
app.get("/api/db-status", async (req, res) => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res.json({
      connected: false,
      message: "DATABASE_URL is not set in environment variables.",
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
    return res.json({
      connected: true,
      message: "Connected to Neon database successfully!",
      timestamp: result.rows[0].now,
      fallbackActive: false,
    });
  } catch (err: any) {
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
    return res.json({
      success: true,
      message: "Table 'consultations' verified/created successfully in your Neon DB!"
    });
  } catch (err: any) {
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
        message: "Yay! Konsultasi berhasil dibuat langsung di Neon Database.",
        data: result.rows[0]
      });
    } catch (err: any) {
      console.warn("Neon DB Insert failed, falling back to in-memory store:", err.message);
    }
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
    message: "Konsultasi disimpan di penyimpanan lokal (Database Neon belum tersambung).",
    data: newConsultation,
    fallback: true
  });
});

// 4. Get all consultations
app.get("/api/consultations", async (req, res) => {
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
      console.warn("Failed to fetch from Neon, falling back to in-memory:", err.message);
    }
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
      console.warn("Failed to update in Neon, falling back:", err.message);
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
