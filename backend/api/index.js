import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "../routes/health.js";
import { initializeDatabase } from "../db.js";

import session from "express-session";
import authRoutes from "../routes/auth.js";
import taskRoutes from "../routes/tasks.js";
import taskListRoutes from "../routes/task-lists.js";

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(
    cors({
        origin: [
            "http://localhost:4321",
            "https://turify-tasks.vercel.app",
            /^https:\/\/.*\.vercel\.app$/,
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());

// Configuración de sesión para producción
app.use(
    session({
        secret: process.env.SESSION_SECRET || "turifytasks_secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production", // true en producción con HTTPS
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días de persistencia
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 'none' para CORS en producción
        },
    })
);

// Rutas
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/task-lists", taskListRoutes);

// Middleware de manejo de errores
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Algo salió mal!",
        message:
            process.env.NODE_ENV === "development"
                ? err.message
                : "Error interno del servidor",
    });
});

// Middleware para rutas no encontradas
app.use("*", (_req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// Inicializar base de datos al cargar el módulo
let dbInitialized = false;
const initDB = async () => {
    if (!dbInitialized) {
        try {
            await initializeDatabase();
            dbInitialized = true;
            console.log("Base de datos inicializada");
        } catch (error) {
            console.error("Error al inicializar la base de datos:", error);
        }
    }
};

// Handler principal para Vercel
const handler = async (req, res) => {
    await initDB();
    return app(req, res);
};

export default handler;
