import express from "express";
import helmet from "helmet";
import cors from "cors";
import employees from "./routes/employees.routes";
import roles from "./routes/roles.routes";
import { apiKey } from "./middleware/apiKey";

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const API_KEY = process.env.API_KEY || "dev-secret-key";

app.use(helmet());
app.use(cors({ origin: [FRONTEND_ORIGIN], allowedHeaders: ["Content-Type", "X-API-Key"] }));
app.use(express.json());

// Only allow authorized callers (front-end/Postman with X-API-Key)
app.use(apiKey(API_KEY));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/employees", employees);
app.use("/api/roles", roles);

app.use((req, res) => res.status(404).json({ error: "Not Found" }));

export default app;
