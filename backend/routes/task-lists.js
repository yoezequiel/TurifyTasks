import express from 'express';
import { 
    getTaskLists,
    getTaskListById,
    createTaskList,
    updateTaskList,
    deleteTaskList,
    getTaskListTasks
} from '../controllers/taskListController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas de listas de tareas
router.use(isAuthenticated);

// Rutas CRUD para listas de tareas
router.get('/', getTaskLists);                          // GET /api/task-lists
router.get('/:id', getTaskListById);                    // GET /api/task-lists/:id
router.post('/', createTaskList);                       // POST /api/task-lists
router.put('/:id', updateTaskList);                     // PUT /api/task-lists/:id
router.delete('/:id', deleteTaskList);                  // DELETE /api/task-lists/:id

// Rutas adicionales
router.get('/:id/tasks', getTaskListTasks);             // GET /api/task-lists/:id/tasks

export default router;
