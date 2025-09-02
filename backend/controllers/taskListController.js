import { db } from '../db.js';

// GET /api/task-lists - Obtener todas las listas de tareas del usuario actual
export const getTaskLists = async (req, res) => {
    try {
        const userId = req.session.user.id;
        
        const result = await db.execute({
            sql: `SELECT 
                    id, 
                    name, 
                    description, 
                    created_at, 
                    updated_at,
                    (SELECT COUNT(*) FROM tasks WHERE list_id = task_lists.id) as task_count
                  FROM task_lists 
                  WHERE user_id = ? 
                  ORDER BY created_at DESC`,
            args: [userId]
        });

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error al obtener listas de tareas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// GET /api/task-lists/:id - Obtener una lista de tareas específica
export const getTaskListById = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const listId = req.params.id;

        const result = await db.execute({
            sql: `SELECT 
                    id, 
                    name, 
                    description, 
                    created_at, 
                    updated_at,
                    (SELECT COUNT(*) FROM tasks WHERE list_id = task_lists.id) as task_count
                  FROM task_lists 
                  WHERE id = ? AND user_id = ?`,
            args: [listId, userId]
        });

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Lista de tareas no encontrada'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error al obtener lista de tareas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// POST /api/task-lists - Crear una nueva lista de tareas
export const createTaskList = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { name, description } = req.body;

        // Validaciones básicas
        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'El nombre de la lista es obligatorio'
            });
        }

        // Verificar que el usuario no tenga ya una lista con el mismo nombre
        const existingList = await db.execute({
            sql: 'SELECT id FROM task_lists WHERE name = ? AND user_id = ?',
            args: [name.trim(), userId]
        });

        if (existingList.rows.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'Ya tienes una lista con este nombre'
            });
        }

        const result = await db.execute({
            sql: `INSERT INTO task_lists (name, description, user_id) 
                  VALUES (?, ?, ?)`,
            args: [name.trim(), description?.trim() || null, userId]
        });

        // Obtener la lista creada
        const newTaskList = await db.execute({
            sql: `SELECT 
                    id, 
                    name, 
                    description, 
                    created_at, 
                    updated_at,
                    0 as task_count
                  FROM task_lists 
                  WHERE id = ?`,
            args: [result.lastInsertRowid]
        });

        res.status(201).json({
            success: true,
            message: 'Lista de tareas creada exitosamente',
            data: newTaskList.rows[0]
        });
    } catch (error) {
        console.error('Error al crear lista de tareas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// PUT /api/task-lists/:id - Actualizar una lista de tareas existente
export const updateTaskList = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const listId = req.params.id;
        const { name, description } = req.body;

        // Verificar que la lista existe y pertenece al usuario
        const existingList = await db.execute({
            sql: 'SELECT id, name FROM task_lists WHERE id = ? AND user_id = ?',
            args: [listId, userId]
        });

        if (existingList.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Lista de tareas no encontrada o no tienes permisos para modificarla'
            });
        }

        // Si se está cambiando el nombre, verificar que no exista otra lista con el mismo nombre
        if (name && name.trim() !== existingList.rows[0].name) {
            const duplicateList = await db.execute({
                sql: 'SELECT id FROM task_lists WHERE name = ? AND user_id = ? AND id != ?',
                args: [name.trim(), userId, listId]
            });

            if (duplicateList.rows.length > 0) {
                return res.status(409).json({
                    success: false,
                    error: 'Ya tienes una lista con este nombre'
                });
            }
        }

        // Construir la consulta de actualización dinámicamente
        const updates = [];
        const args = [];

        if (name && name.trim() !== '') {
            updates.push('name = ?');
            args.push(name.trim());
        }

        if (description !== undefined) {
            updates.push('description = ?');
            args.push(description?.trim() || null);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No se proporcionaron campos para actualizar'
            });
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        args.push(listId, userId);

        await db.execute({
            sql: `UPDATE task_lists SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
            args: args
        });

        // Obtener la lista actualizada
        const updatedTaskList = await db.execute({
            sql: `SELECT 
                    id, 
                    name, 
                    description, 
                    created_at, 
                    updated_at,
                    (SELECT COUNT(*) FROM tasks WHERE list_id = task_lists.id) as task_count
                  FROM task_lists 
                  WHERE id = ?`,
            args: [listId]
        });

        res.json({
            success: true,
            message: 'Lista de tareas actualizada exitosamente',
            data: updatedTaskList.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar lista de tareas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// DELETE /api/task-lists/:id - Eliminar una lista de tareas
export const deleteTaskList = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const listId = req.params.id;

        // Verificar que la lista existe y pertenece al usuario
        const existingList = await db.execute({
            sql: 'SELECT id FROM task_lists WHERE id = ? AND user_id = ?',
            args: [listId, userId]
        });

        if (existingList.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Lista de tareas no encontrada o no tienes permisos para eliminarla'
            });
        }

        // Verificar cuántas tareas están asociadas a esta lista
        const taskCount = await db.execute({
            sql: 'SELECT COUNT(*) as count FROM tasks WHERE list_id = ?',
            args: [listId]
        });

        // Eliminar la lista (las tareas asociadas se eliminarán automáticamente por CASCADE)
        await db.execute({
            sql: 'DELETE FROM task_lists WHERE id = ? AND user_id = ?',
            args: [listId, userId]
        });

        res.json({
            success: true,
            message: `Lista de tareas eliminada exitosamente${taskCount.rows[0].count > 0 ? ` junto con ${taskCount.rows[0].count} tarea(s) asociada(s)` : ''}`,
            deleted_tasks: taskCount.rows[0].count
        });
    } catch (error) {
        console.error('Error al eliminar lista de tareas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// GET /api/task-lists/:id/tasks - Obtener todas las tareas de una lista específica
export const getTaskListTasks = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const listId = req.params.id;

        // Verificar que la lista existe y pertenece al usuario
        const existingList = await db.execute({
            sql: 'SELECT id, name FROM task_lists WHERE id = ? AND user_id = ?',
            args: [listId, userId]
        });

        if (existingList.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Lista de tareas no encontrada'
            });
        }

        // Obtener las tareas de la lista
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
                  WHERE t.list_id = ? AND t.user_id = ?
                  ORDER BY t.created_at DESC`,
            args: [listId, userId]
        });

        res.json({
            success: true,
            data: {
                list: existingList.rows[0],
                tasks: result.rows
            }
        });
    } catch (error) {
        console.error('Error al obtener tareas de la lista:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};
