import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(helmet());
app.use(cors({ origin: [FRONTEND_ORIGIN], allowedHeaders: ["Content-Type", "X-API-Key"] }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// (Routes will be added in Step 2+)

app.use((req, res) => res.status(404).json({ error: "Not Found" }));

export default app;
