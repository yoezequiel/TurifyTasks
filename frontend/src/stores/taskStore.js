// taskStore.js - Manejo de estado con nanostores
import { atom, computed } from "nanostores";

// Estados principales
export const allTasks = atom([]);
export const currentFilter = atom("inbox");
export const searchTerm = atom("");
export const priorityFilter = atom("");
export const currentTaskListId = atom(null);
export const isLoading = atom(false);

// Computed stores
export const filteredTasks = computed(
    [allTasks, currentFilter, searchTerm, priorityFilter],
    (tasks, filter, search, priority) => {
        let filtered = filterTasksByType(tasks, filter);

        // Aplicar filtro de búsqueda
        if (search.trim()) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(
                (task) =>
                    task.title.toLowerCase().includes(searchLower) ||
                    (task.description &&
                        task.description.toLowerCase().includes(searchLower))
            );
        }

        // Aplicar filtro de prioridad
        if (priority) {
            filtered = filtered.filter((task) => task.priority === priority);
        }

        return filtered;
    }
);

export const taskCounts = computed([allTasks], (tasks) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const counts = {
        inbox: 0,
        today: 0,
        upcoming: 0,
        important: 0,
        overdue: 0,
        completed: 0,
    };

    tasks.forEach((task) => {
        if (task.completed) {
            counts.completed++;
        } else {
            counts.inbox++;

            const taskDate = getTaskDate(task);
            if (taskDate) {
                const taskDateOnly = new Date(
                    taskDate.getFullYear(),
                    taskDate.getMonth(),
                    taskDate.getDate()
                );

                if (taskDateOnly.getTime() === today.getTime()) {
                    counts.today++;
                } else if (taskDateOnly < today) {
                    counts.overdue++;
                } else if (taskDateOnly > today) {
                    counts.upcoming++;
                }
            }

            // Contar importantes
            if (task.priority === "alta" || task.priority === "high") {
                counts.important++;
            }
        }
    });

    return counts;
});

// Funciones helper
function filterTasksByType(tasks, filterType) {
    if (!Array.isArray(tasks)) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filterType) {
        case "inbox":
            return tasks.filter((task) => !task.completed);

        case "today":
            return tasks.filter((task) => {
                if (task.completed) return false;
                const taskDate = getTaskDate(task);
                return (
                    taskDate && taskDate.toDateString() === today.toDateString()
                );
            });

        case "upcoming":
            return tasks.filter((task) => {
                if (task.completed) return false;
                const taskDate = getTaskDate(task);
                return taskDate && taskDate > today;
            });

        case "important":
            return tasks.filter(
                (task) =>
                    !task.completed &&
                    (task.priority === "alta" || task.priority === "high")
            );

        case "overdue":
            return tasks.filter((task) => {
                if (task.completed) return false;
                return isTaskOverdue(task);
            });

        case "completed":
            return tasks.filter((task) => task.completed);

        default:
            // Filtro por lista específica
            if (filterType.startsWith("list-")) {
                const listId = parseInt(filterType.replace("list-", ""));
                return tasks.filter(
                    (task) => !task.completed && task.list_id === listId
                );
            } else {
                return tasks.filter((task) => !task.completed);
            }
    }
}

function getTaskDate(task) {
    if (task.due_date) {
        try {
            const date = new Date(task.due_date);
            if (!isNaN(date.getTime())) {
                return date;
            }
        } catch (e) {
            console.warn("Invalid date format:", task.due_date);
        }
    }
    return null;
}

function isTaskOverdue(task) {
    const taskDate = getTaskDate(task);
    if (!taskDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return taskDate < today && !task.completed;
}

// Acciones para modificar el estado
export const taskActions = {
    setTasks: (tasks) => {
        allTasks.set(Array.isArray(tasks) ? tasks : []);
    },

    addTask: (task) => {
        const current = allTasks.get();
        allTasks.set([...current, task]);
    },

    updateTask: (taskId, updates) => {
        const current = allTasks.get();
        console.log("[taskStore] Actualizando tarea:", taskId, updates);
        console.log("[taskStore] Tareas actuales:", current.length);

        const updated = current.map((task) => {
            const match = task.id == taskId; // Usar == para comparar sin tipo estricto
            if (match) {
                console.log(
                    "[taskStore] Tarea encontrada y actualizada:",
                    task.id
                );
                return { ...task, ...updates };
            }
            return task;
        });

        console.log(
            "[taskStore] Tareas después de actualización:",
            updated.length
        );
        allTasks.set(updated);
    },

    removeTask: (taskId) => {
        const current = allTasks.get();
        allTasks.set(current.filter((task) => task.id !== taskId));
    },

    setFilter: (filter) => {
        currentFilter.set(filter);
    },

    setSearch: (search) => {
        searchTerm.set(search);
    },

    setPriorityFilter: (priority) => {
        priorityFilter.set(priority);
    },

    setCurrentTaskListId: (id) => {
        currentTaskListId.set(id);
    },

    setLoading: (loading) => {
        isLoading.set(loading);
    },
};
