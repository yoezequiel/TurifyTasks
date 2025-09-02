import { db } from '../db.js';
import { TaskService } from '../services/taskService.js';

// GET /api/tasks - Obtener todas las tareas del usuario actual
export const getTasks = async (req, res) => {
    try {
        const userId = req.session.user.id;
        
        const result = await db.execute({
            sql: `SELECT 
                    t.id, 
                    t.title, 
                    t.description, 
                    t.due_date, 
                    t.priority, 
                    t.completed, 
                    t.list_id,
                    t.created_at, 
                    t.updated_at,
                    tl.name as list_name
                  FROM tasks t 
                  LEFT JOIN task_lists tl ON t.list_id = tl.id
                  WHERE t.user_id = ? 
                  ORDER BY t.created_at DESC`,
            args: [userId]
        });

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// POST /api/tasks - Crear una nueva tarea para el usuario actual
export const createTask = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { title, description, due_date, priority = 'media', list_id } = req.body;

        // Validaciones básicas
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'El título es obligatorio'
            });
        }

        // Validar que la prioridad sea válida
        const validPriorities = ['baja', 'media', 'alta'];
        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                success: false,
                error: 'La prioridad debe ser: baja, media o alta'
            });
        }

        // Si se proporciona list_id, verificar que pertenezca al usuario
        if (list_id) {
            const isValidList = await TaskService.validateListOwnership(list_id, userId);
            if (!isValidList) {
                return res.status(403).json({
                    success: false,
                    error: 'No tienes permisos para agregar tareas a esta lista'
                });
            }
        }

        const result = await db.execute({
            sql: `INSERT INTO tasks (title, description, due_date, priority, list_id, user_id) 
                  VALUES (?, ?, ?, ?, ?, ?)`,
            args: [title, description, due_date || null, priority, list_id || null, userId]
        });

        // Obtener la tarea creada
        const newTask = await db.execute({
            sql: `SELECT 
                    t.id, 
                    t.title, 
                    t.description, 
                    t.due_date, 
                    t.priority, 
                    t.completed, 
                    t.list_id,
                    t.created_at, 
                    t.updated_at,
                    tl.name as list_name
                  FROM tasks t 
                  LEFT JOIN task_lists tl ON t.list_id = tl.id
                  WHERE t.id = ?`,
            args: [result.lastInsertRowid]
        });

        res.status(201).json({
            success: true,
            message: 'Tarea creada exitosamente',
            data: newTask.rows[0]
        });
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// PUT /api/tasks/:id - Actualizar una tarea existente
export const updateTask = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const taskId = req.params.id;
        const { title, description, due_date, priority, completed, list_id } = req.body;

        // Verificar que la tarea existe y pertenece al usuario
        const isValidTask = await TaskService.validateTaskOwnership(taskId, userId);
        if (!isValidTask) {
            return res.status(404).json({
                success: false,
                error: 'Tarea no encontrada o no tienes permisos para modificarla'
            });
        }

        // Validar prioridad si se proporciona
        if (priority) {
            const validPriorities = ['baja', 'media', 'alta'];
            if (!validPriorities.includes(priority)) {
                return res.status(400).json({
                    success: false,
                    error: 'La prioridad debe ser: baja, media o alta'
                });
            }
        }

        // Si se proporciona list_id, verificar que pertenezca al usuario
        if (list_id) {
            const isValidList = await TaskService.validateListOwnership(list_id, userId);
            if (!isValidList) {
                return res.status(403).json({
                    success: false,
                    error: 'No tienes permisos para mover la tarea a esta lista'
                });
            }
        }

        // Construir la query de actualización dinámicamente
        const updates = [];
        const args = [];

        if (title !== undefined) {
            if (!title || title.trim() === '') {
                return res.status(400).json({
                    success: false,
                    error: 'El título no puede estar vacío'
                });
            }
            updates.push('title = ?');
            args.push(title);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            args.push(description);
        }
        if (due_date !== undefined) {
            updates.push('due_date = ?');
            args.push(due_date);
        }
        if (priority !== undefined) {
            updates.push('priority = ?');
            args.push(priority);
        }
        if (completed !== undefined) {
            updates.push('completed = ?');
            args.push(completed ? 1 : 0);
        }
        if (list_id !== undefined) {
            updates.push('list_id = ?');
            args.push(list_id);
        }

        // Agregar updated_at
        updates.push('updated_at = CURRENT_TIMESTAMP');
        args.push(taskId);

        if (updates.length === 1) { // Solo updated_at
            return res.status(400).json({
                success: false,
                error: 'No se proporcionaron campos para actualizar'
            });
        }

        await db.execute({
            sql: `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
            args: args
        });

        // Obtener la tarea actualizada
        const updatedTask = await db.execute({
            sql: `SELECT 
                    t.id, 
                    t.title, 
                    t.description, 
                    t.due_date, 
                    t.priority, 
                    t.completed, 
                    t.list_id,
                    t.created_at, 
                    t.updated_at,
                    tl.name as list_name
                  FROM tasks t 
                  LEFT JOIN task_lists tl ON t.list_id = tl.id
                  WHERE t.id = ?`,
            args: [taskId]
        });

        res.json({
            success: true,
            message: 'Tarea actualizada exitosamente',
            data: updatedTask.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// DELETE /api/tasks/:id - Eliminar una tarea
export const deleteTask = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const taskId = req.params.id;

        // Verificar que la tarea existe y pertenece al usuario
        const isValidTask = await TaskService.validateTaskOwnership(taskId, userId);
        if (!isValidTask) {
            return res.status(404).json({
                success: false,
                error: 'Tarea no encontrada o no tienes permisos para eliminarla'
            });
        }

        await db.execute({
            sql: 'DELETE FROM tasks WHERE id = ?',
            args: [taskId]
        });

        res.json({
            success: true,
            message: 'Tarea eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// GET /api/tasks/stats - Obtener estadísticas de tareas del usuario
export const getTaskStats = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const stats = await TaskService.getTaskStats(userId);
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// GET /api/tasks/priority/:priority - Obtener tareas por prioridad
export const getTasksByPriority = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { priority } = req.params;
        
        const validPriorities = ['baja', 'media', 'alta'];
        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                success: false,
                error: 'La prioridad debe ser: baja, media o alta'
            });
        }

        const tasks = await TaskService.getTasksByPriority(userId, priority);
        
        res.json({
            success: true,
            data: tasks
        });
    } catch (error) {
        console.error('Error al obtener tareas por prioridad:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// GET /api/tasks/orphaned - Obtener tareas sin lista asignada
export const getOrphanedTasks = async (req, res) => {
    try {
        const userId = req.session.user.id;
        
        const result = await db.execute({
            sql: `SELECT 
                    t.id, 
                    t.title, 
                    t.description, 
                    t.due_date, 
                    t.priority, 
                    t.completed, 
                    t.list_id,
                    t.created_at, 
                    t.updated_at
                  FROM tasks t 
                  WHERE t.user_id = ? AND t.list_id IS NULL
                  ORDER BY t.created_at DESC`,
            args: [userId]
        });

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error al obtener tareas sin lista:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};
export const getOverdueTasks = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const tasks = await TaskService.getOverdueTasks(userId);
        
        res.json({
            success: true,
            data: tasks
        });
    } catch (error) {
        console.error('Error al obtener tareas vencidas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};
