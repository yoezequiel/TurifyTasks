import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.js';
import { initializeDatabase } from './db.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', healthRoutes);

// Middleware de manejo de errores
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Algo salió mal!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
    });
});

// Middleware para rutas no encontradas
app.use('*', (_req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Inicializar servidor
const startServer = async () => {
    try {
        // Inicializar base de datos
        await initializeDatabase();
        
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
            console.log(`Health check disponible en: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();