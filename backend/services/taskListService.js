import { db } from '../db.js';

export class TaskListService {
    // Validar que una lista de tareas pertenece a un usuario
    static async validateListOwnership(listId, userId) {
        if (!listId) return true; // Si no hay list_id, es válido
        
        const result = await db.execute({
            sql: 'SELECT id FROM task_lists WHERE id = ? AND user_id = ?',
            args: [listId, userId]
        });
        return result.rows.length > 0;
    }

    // Obtener estadísticas de una lista de tareas
    static async getListStats(listId, userId) {
        const result = await db.execute({
            sql: `SELECT 
                    COUNT(*) as total_tasks,
                    SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_tasks,
                    SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as pending_tasks,
                    SUM(CASE WHEN priority = 'alta' AND completed = 0 THEN 1 ELSE 0 END) as high_priority_pending
                  FROM tasks 
                  WHERE list_id = ? AND user_id = ?`,
            args: [listId, userId]
        });
        return result.rows[0];
    }

    // Verificar si una lista tiene tareas asociadas
    static async hasAssociatedTasks(listId) {
        const result = await db.execute({
            sql: 'SELECT COUNT(*) as count FROM tasks WHERE list_id = ?',
            args: [listId]
        });
        return result.rows[0].count > 0;
    }

    // Obtener todas las listas con conteo de tareas
    static async getListsWithTaskCount(userId) {
        const result = await db.execute({
            sql: `SELECT 
                    tl.id,
                    tl.name,
                    tl.description,
                    tl.created_at,
                    tl.updated_at,
                    COUNT(t.id) as task_count,
                    SUM(CASE WHEN t.completed = 1 THEN 1 ELSE 0 END) as completed_count
                  FROM task_lists tl
                  LEFT JOIN tasks t ON tl.id = t.list_id
                  WHERE tl.user_id = ?
                  GROUP BY tl.id, tl.name, tl.description, tl.created_at, tl.updated_at
                  ORDER BY tl.created_at DESC`,
            args: [userId]
        });
        return result.rows;
    }

    // Mover tareas de una lista a otra
    static async moveTasksToList(fromListId, toListId, userId) {
        // Verificar que ambas listas pertenecen al usuario
        const fromListValid = await this.validateListOwnership(fromListId, userId);
        const toListValid = await this.validateListOwnership(toListId, userId);

        if (!fromListValid || !toListValid) {
            throw new Error('Una o ambas listas no pertenecen al usuario');
        }

        const result = await db.execute({
            sql: 'UPDATE tasks SET list_id = ?, updated_at = CURRENT_TIMESTAMP WHERE list_id = ? AND user_id = ?',
            args: [toListId, fromListId, userId]
        });

        return result.changes;
    }

    // Obtener tareas sin lista asignada (orphaned tasks)
    static async getOrphanedTasks(userId) {
        const result = await db.execute({
            sql: `SELECT 
                    id, 
                    title, 
                    description, 
                    due_date, 
                    priority, 
                    completed, 
                    created_at, 
                    updated_at
                  FROM tasks 
                  WHERE list_id IS NULL AND user_id = ?
                  ORDER BY created_at DESC`,
            args: [userId]
        });
        return result.rows;
    }
}
