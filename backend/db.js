import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config()

// Crear conexión a Turso
const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

// Función para inicializar las tablas
const initializeDatabase = async () => {
    try {
        // Crear tabla de usuarios
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                first_name TEXT,
                last_name TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Crear tabla de listas de tareas
        await db.execute(`
            CREATE TABLE IF NOT EXISTS task_lists (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                user_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        `);

        // Crear tabla de tareas
        await db.execute(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                due_date DATE,
                priority TEXT CHECK(priority IN ('baja', 'media', 'alta')) DEFAULT 'media',
                completed BOOLEAN DEFAULT 0,
                list_id INTEGER,
                user_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (list_id) REFERENCES task_lists (id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        `);

        console.log('Tablas creadas exitosamente');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        throw error;
    }
};

export { db, initializeDatabase };