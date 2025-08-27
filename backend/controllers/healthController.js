import { checkDatabaseConnection, getSystemHealth } from '../services/healthService.js';

/**
 * Controlador para endpoints de health check
 */

/**
 * Health check completo
 */
export const getHealth = async (_req, res) => {
    try {
        const startTime = Date.now();
        
        // Obtener información del sistema
        const systemHealth = await getSystemHealth();
        
        // Verificar conexión a la base de datos
        const dbStatus = await checkDatabaseConnection();
        
        const responseTime = Date.now() - startTime;
        
        const healthStatus = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            responseTime: `${responseTime}ms`,
            service: {
                name: 'Backend API',
                version: process.env.npm_package_version || '1.0.0',
                ...systemHealth
            },
            database: dbStatus
        };

        // Determinar el status general basado en los componentes
        const isHealthy = dbStatus.status === 'connected';
        healthStatus.status = isHealthy ? 'healthy' : 'unhealthy';
        
        const statusCode = isHealthy ? 200 : 503;
        res.status(statusCode).json(healthStatus);
        
    } catch (error) {
        console.error('Error en health check:', error);
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Error interno del servidor',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Readiness check para contenedores
 */
export const getReadiness = async (_req, res) => {
    try {
        const dbStatus = await checkDatabaseConnection();
        const isReady = dbStatus.status === 'connected';
        
        res.status(isReady ? 200 : 503).json({
            status: isReady ? 'ready' : 'not ready',
            timestamp: new Date().toISOString(),
            checks: {
                database: dbStatus.status
            }
        });
    } catch (error) {
        res.status(503).json({
            status: 'not ready',
            timestamp: new Date().toISOString(),
            error: 'Service not ready'
        });
    }
};

/**
 * Liveness check para contenedores
 */
export const getLiveness = (_req, res) => {
    res.status(200).json({
        status: 'alive',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
};