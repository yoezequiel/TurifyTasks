import express from 'express';
import { 
    getTasks, 
    createTask, 
    updateTask, 
    deleteTask,
    getTaskStats,
    getTasksByPriority,
    getOverdueTasks
} from '../controllers/taskController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas de tareas
router.use(isAuthenticated);

// Rutas CRUD para tareas
router.get('/', getTasks);                      // GET /api/tasks
router.post('/', createTask);                   // POST /api/tasks
router.put('/:id', updateTask);                 // PUT /api/tasks/:id
router.delete('/:id', deleteTask);              // DELETE /api/tasks/:id

// Rutas adicionales
router.get('/stats', getTaskStats);             // GET /api/tasks/stats
router.get('/priority/:priority', getTasksByPriority); // GET /api/tasks/priority/:priority
router.get('/overdue', getOverdueTasks);        // GET /api/tasks/overdue

export default router;
