import { db } from '../db.js';

export class TaskService {
    // Validar que una tarea pertenece a un usuario
    static async validateTaskOwnership(taskId, userId) {
        const result = await db.execute({
            sql: 'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
            args: [taskId, userId]
        });
        return result.rows.length > 0;
    }

    // Validar que una lista de tareas pertenece a un usuario
    static async validateListOwnership(listId, userId) {
        if (!listId) return true; // Si no hay list_id, es válido
        
        const result = await db.execute({
            sql: 'SELECT id FROM task_lists WHERE id = ? AND user_id = ?',
            args: [listId, userId]
        });
        return result.rows.length > 0;
    }

    // Obtener estadísticas de tareas del usuario
    static async getTaskStats(userId) {
        const result = await db.execute({
            sql: `SELECT 
                    COUNT(*) as total_tasks,
                    SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_tasks,
                    SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as pending_tasks,
                    SUM(CASE WHEN priority = 'alta' AND completed = 0 THEN 1 ELSE 0 END) as high_priority_pending
                  FROM tasks 
                  WHERE user_id = ?`,
            args: [userId]
        });
        return result.rows[0];
    }

    // Obtener tareas por prioridad
    static async getTasksByPriority(userId, priority) {
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
                  WHERE t.user_id = ? AND t.priority = ?
                  ORDER BY t.created_at DESC`,
            args: [userId, priority]
        });
        return result.rows;
    }

    // Obtener tareas vencidas
    static async getOverdueTasks(userId) {
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
                    AND t.due_date < date('now') 
                    AND t.completed = 0
                  ORDER BY t.due_date ASC`,
            args: [userId]
        });
        return result.rows;
    }
}
