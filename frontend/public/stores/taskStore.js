// taskStore.js - Manejo de estado simplificado
console.log("[taskStore.js] Script cargado en:", window.location.href);

// Estados principales (versión simplificada sin nanostores)
let state = {
    allTasks: [],
    currentFilter: "inbox",
    searchTerm: "",
    priorityFilter: "",
    currentTaskListId: null,
    isLoading: false,
    subscribers: {
        allTasks: [],
        filteredTasks: [],
        taskCounts: [],
        isLoading: [],
    },
};

// Sistema de suscripción simple
function createAtom(initialValue, name) {
    let value = initialValue;
    let subscribers = [];

    return {
        get: () => value,
        set: (newValue) => {
            console.log(`[taskStore] ${name} updated:`, newValue);
            value = newValue;
            subscribers.forEach((callback) => callback(value));
        },
        subscribe: (callback) => {
            subscribers.push(callback);
            return () => {
                const index = subscribers.indexOf(callback);
                if (index > -1) subscribers.splice(index, 1);
            };
        },
    };
}

// Crear atoms
export const allTasks = createAtom([], "allTasks");
export const currentFilter = createAtom("inbox", "currentFilter");
export const searchTerm = createAtom("", "searchTerm");
export const priorityFilter = createAtom("", "priorityFilter");
export const currentTaskListId = createAtom(null, "currentTaskListId");
export const isLoading = createAtom(false, "isLoading");

// Computed stores simulados
export const filteredTasks = {
    get: () => {
        const tasks = allTasks.get();
        const filter = currentFilter.get();
        const search = searchTerm.get();
        const priority = priorityFilter.get();

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
    },
    subscribe: (callback) => {
        // Suscribirse a cambios en las dependencias
        const unsubscribers = [
            allTasks.subscribe(() => callback(filteredTasks.get())),
            currentFilter.subscribe(() => callback(filteredTasks.get())),
            searchTerm.subscribe(() => callback(filteredTasks.get())),
            priorityFilter.subscribe(() => callback(filteredTasks.get())),
        ];
        return () => unsubscribers.forEach((unsub) => unsub());
    },
};

export const taskCounts = {
    get: () => {
        const tasks = allTasks.get();
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
    },
    subscribe: (callback) => {
        return allTasks.subscribe(() => callback(taskCounts.get()));
    },
};

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
