import { db } from "../db.js";
import { TaskService } from "../services/taskService.js";

// Obtener todas las tareas del usuario
export async function getTasks(req, res) {
    try {
        const userId = req.user.id;
        console.log("[getTasks] Usuario ID:", userId);

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
            args: [userId],
        });

        console.log("[getTasks] Tareas encontradas:", result.rows.length);
        res.json(result.rows);
    } catch (error) {
        console.error("[getTasks] Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// Crear una nueva tarea
export async function createTask(req, res) {
    try {
        const userId = req.user.id;
        const { title, description, due_date, priority, list_id } = req.body;

        console.log("[createTask] Usuario ID:", userId);
        console.log("[createTask] Datos recibidos:", {
            title,
            description,
            due_date,
            priority,
            list_id,
        });

        // Validar datos requeridos
        if (!title || title.trim() === "") {
            return res.status(400).json({ error: "El título es requerido" });
        }

        // Validar que la lista pertenece al usuario (si se especifica)
        if (list_id && list_id !== null) {
            const listOwnership = await TaskService.validateListOwnership(
                list_id,
                userId
            );
            if (!listOwnership) {
                return res
                    .status(403)
                    .json({
                        error: "No tienes permisos para acceder a esta lista",
                    });
            }
        }

        // Limpiar datos - convertir valores vacíos a null
        const cleanedData = {
            title: title.trim(),
            description:
                description && description.trim() !== ""
                    ? description.trim()
                    : null,
            due_date:
                due_date && due_date.trim() !== "" ? due_date.trim() : null,
            priority: priority || "media",
            list_id:
                list_id && list_id !== "" && list_id !== "0"
                    ? parseInt(list_id)
                    : null,
            user_id: userId,
            completed: 0,
        };

        console.log("[createTask] Datos limpiados:", cleanedData);

        const result = await db.execute({
            sql: `INSERT INTO tasks (title, description, due_date, priority, list_id, user_id, completed) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            args: [
                cleanedData.title,
                cleanedData.description,
                cleanedData.due_date,
                cleanedData.priority,
                cleanedData.list_id,
                cleanedData.user_id,
                cleanedData.completed,
            ],
        });

        // Obtener la tarea creada con información de la lista
        const taskResult = await db.execute({
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
            args: [result.lastInsertRowid],
        });

        console.log(
            "[createTask] Tarea creada exitosamente:",
            taskResult.rows[0]
        );
        res.status(201).json({ success: true, data: taskResult.rows[0] });
    } catch (error) {
        console.error("[createTask] Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// Actualizar una tarea existente
export async function updateTask(req, res) {
    try {
        const userId = req.user.id;
        const taskId = parseInt(req.params.id);
        const { title, description, due_date, priority, list_id, completed } =
            req.body;

        console.log("[updateTask] Usuario ID:", userId);
        console.log("[updateTask] Task ID:", taskId);
        console.log("[updateTask] Datos recibidos:", {
            title,
            description,
            due_date,
            priority,
            list_id,
            completed,
        });

        // Validar que la tarea existe y pertenece al usuario
        const taskOwnership = await TaskService.validateTaskOwnership(
            taskId,
            userId
        );
        if (!taskOwnership) {
            return res.status(404).json({ error: "Tarea no encontrada" });
        }

        // Validar datos requeridos
        if (!title || title.trim() === "") {
            return res.status(400).json({ error: "El título es requerido" });
        }

        // Validar que la lista pertenece al usuario (si se especifica)
        if (list_id && list_id !== null && list_id !== "" && list_id !== "0") {
            const listOwnership = await TaskService.validateListOwnership(
                list_id,
                userId
            );
            if (!listOwnership) {
                console.log(
                    "[updateTask] Lista no válida:",
                    list_id,
                    "para usuario:",
                    userId
                );
                return res
                    .status(403)
                    .json({
                        error: "No tienes permisos para acceder a esta lista",
                    });
            }
        }

        // Limpiar datos - convertir valores vacíos a null
        const cleanedData = {
            title: title.trim(),
            description:
                description && description.trim() !== ""
                    ? description.trim()
                    : null,
            due_date:
                due_date && due_date.trim() !== "" ? due_date.trim() : null,
            priority: priority || "media",
            list_id:
                list_id && list_id !== "" && list_id !== "0"
                    ? parseInt(list_id)
                    : null,
            completed: completed !== undefined ? (completed ? 1 : 0) : 0,
        };

        console.log("[updateTask] Datos limpiados:", cleanedData);

        await db.execute({
            sql: `UPDATE tasks 
                  SET title = ?, description = ?, due_date = ?, priority = ?, list_id = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
                  WHERE id = ? AND user_id = ?`,
            args: [
                cleanedData.title,
                cleanedData.description,
                cleanedData.due_date,
                cleanedData.priority,
                cleanedData.list_id,
                cleanedData.completed,
                taskId,
                userId,
            ],
        });

        // Obtener la tarea actualizada con información de la lista
        const taskResult = await db.execute({
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
                  WHERE t.id = ? AND t.user_id = ?`,
            args: [taskId, userId],
        });

        console.log(
            "[updateTask] Tarea actualizada exitosamente:",
            taskResult.rows[0]
        );
        res.json({ success: true, data: taskResult.rows[0] });
    } catch (error) {
        console.error("[updateTask] Error:", error);
        if (error.message && error.message.includes("FOREIGN KEY constraint")) {
            res.status(400).json({
                error: "Error de referencia: la lista especificada no existe o no tienes permisos para acceder a ella",
            });
        } else {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

// Eliminar una tarea
export async function deleteTask(req, res) {
    try {
        const userId = req.user.id;
        const taskId = parseInt(req.params.id);

        console.log("[deleteTask] Usuario ID:", userId);
        console.log("[deleteTask] Task ID:", taskId);

        // Validar que la tarea existe y pertenece al usuario
        const taskOwnership = await TaskService.validateTaskOwnership(
            taskId,
            userId
        );
        if (!taskOwnership) {
            return res.status(404).json({ error: "Tarea no encontrada" });
        }

        await db.execute({
            sql: "DELETE FROM tasks WHERE id = ? AND user_id = ?",
            args: [taskId, userId],
        });

        console.log("[deleteTask] Tarea eliminada exitosamente");
        res.json({ success: true, message: "Tarea eliminada exitosamente" });
    } catch (error) {
        console.error("[deleteTask] Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// Obtener estadísticas de tareas
export async function getTaskStats(req, res) {
    try {
        const userId = req.user.id;
        const stats = await TaskService.getTaskStats(userId);
        res.json(stats);
    } catch (error) {
        console.error("[getTaskStats] Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// Obtener tareas por prioridad
export async function getTasksByPriority(req, res) {
    try {
        const userId = req.user.id;
        const { priority } = req.params;

        const validPriorities = ["baja", "media", "alta"];
        if (!validPriorities.includes(priority)) {
            return res.status(400).json({ error: "Prioridad no válida" });
        }

        const tasks = await TaskService.getTasksByPriority(userId, priority);
        res.json(tasks);
    } catch (error) {
        console.error("[getTasksByPriority] Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// Obtener tareas vencidas
export async function getOverdueTasks(req, res) {
    try {
        const userId = req.user.id;
        const tasks = await TaskService.getOverdueTasks(userId);
        res.json(tasks);
    } catch (error) {
        console.error("[getOverdueTasks] Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// Obtener tareas huérfanas (sin lista asignada)
export async function getOrphanedTasks(req, res) {
    try {
        const userId = req.user.id;

        const result = await db.execute({
            sql: `SELECT 
                    id, 
                    title, 
                    description, 
                    due_date, 
                    priority, 
                    completed, 
                    list_id,
                    created_at, 
                    updated_at
                  FROM tasks 
                  WHERE user_id = ? AND list_id IS NULL
                  ORDER BY created_at DESC`,
            args: [userId],
        });

        res.json(result.rows);
    } catch (error) {
        console.error("[getOrphanedTasks] Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
