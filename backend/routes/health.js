import express from 'express';
import { getHealth, getReadiness, getLiveness } from '../controllers/healthController.js';

const router = express.Router();

/**
 * Rutas de Health Check
 */
router.get('/health', getHealth);
router.get('/health/ready', getReadiness);
router.get('/health/live', getLiveness);

export default router;