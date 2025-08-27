import { db } from '../db.js';
import os from 'os';

/**
 * Servicio para verificar el estado de salud de la aplicación
 */

/**
 * Verifica la conexión a la base de datos Turso
 * @returns {Promise<Object>} Estado de la conexión
 */
export const checkDatabaseConnection = async () => {
    try {
        const startTime = Date.now();

        // Realizar una consulta simple para verificar la conexión
        await db.execute('SELECT 1 as test');

        const responseTime = Date.now() - startTime;

        return {
            status: 'connected',
            responseTime: `${responseTime}ms`,
            type: 'Turso SQLite',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error verificando conexión a la base de datos:', error);
        return {
            status: 'error',
            error: error.message,
            type: 'Turso SQLite',
            timestamp: new Date().toISOString()
        };
    }
};

/**
 * Verifica el estado general del sistema
 * @returns {Promise<Object>} Estado del sistema
 */
export const getSystemHealth = async () => {
    const memoryUsage = process.memoryUsage();

    return {
        uptime: process.uptime(),
        memory: {
            used: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100, // MB
            total: Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100, // MB
            external: Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100 // MB
        },
        cpu: {
            loadAverage: process.platform !== 'win32' ? os.loadavg() : [0, 0, 0]
        },
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        platform: process.platform
    };
};