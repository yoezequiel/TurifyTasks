// tasks.js - Gestión de tareas simplificada
console.log("[tasks.js] Script cargado en:", window.location.href);

import { showToast } from "./ui.js";
import { apiRequest, API_CONFIG } from "../config/api.js";
import {
    allTasks,
    currentFilter,
    searchTerm,
    priorityFilter,
    filteredTasks,
    taskCounts,
    taskActions,
    isLoading,
} from "../stores/taskStore.js";

// Función para obtener el filtro actual
export function getCurrentFilter() {
    return currentFilter.get();
}

// Función para establecer el filtro actual
export function setCurrentFilter(filter) {
    taskActions.setFilter(filter);
}

// Cargar todas las tareas
export async function loadTasks() {
    console.log("[tasks.js] Cargando tareas...");
    taskActions.setLoading(true);

    try {
        const response = await apiRequest(API_CONFIG.ENDPOINTS.TASKS.BASE);
        console.log("[tasks.js] Respuesta de la API:", response.status);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("[tasks.js] Datos recibidos:", data);

        const tasks = data.data || data || [];
        console.log("[tasks.js] Tareas procesadas:", tasks.length);

        taskActions.setTasks(tasks);
        showToast(`${tasks.length} tareas cargadas`, "success");

        return tasks;
    } catch (error) {
        console.error("[tasks.js] Error al cargar tareas:", error);
        showToast("Error al cargar las tareas: " + error.message, "error");
        return [];
    } finally {
        taskActions.setLoading(false);
    }
}

// Renderizar tareas en el DOM
export function renderTasks() {
    console.log("[tasks.js] Renderizando tareas...");
    const tasksContainer = document.getElementById("tasksContainer");
    const loadingState = document.getElementById("loadingState");

    if (!tasksContainer) {
        console.warn("[tasks.js] Contenedor de tareas no encontrado");
        return;
    }

    // Ocultar loading
    if (loadingState) {
        loadingState.style.display = "none";
    }

    const tasks = filteredTasks.get();
    console.log("[tasks.js] Tareas filtradas a renderizar:", tasks.length);

    if (tasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <h3>No hay tareas</h3>
                <p>Crea tu primera tarea para comenzar</p>
            </div>
        `;
        return;
    }

    tasksContainer.innerHTML = tasks
        .map((task) => createTaskHTML(task))
        .join("");
}

// Crear HTML para una tarea
function createTaskHTML(task) {
    const isCompleted = task.completed ? "checked" : "";
    const completedClass = task.completed ? "task-completed" : "";
    const priorityClass = task.priority ? `priority-${task.priority}` : "";

    return `
        <div class="task-item ${completedClass} ${priorityClass}" data-task-id="${
        task.id
    }">
            <div class="task-content">
                <input 
                    type="checkbox" 
                    class="task-checkbox js-toggle-task" 
                    data-task-id="${task.id}" 
                    ${isCompleted}
                >
                <div class="task-details">
                    <h4 class="task-title">${escapeHtml(task.title)}</h4>
                    ${
                        task.description
                            ? `<p class="task-description">${escapeHtml(
                                  task.description
                              )}</p>`
                            : ""
                    }
                    ${
                        task.due_date
                            ? `<span class="task-due-date">📅 ${formatDate(
                                  task.due_date
                              )}</span>`
                            : ""
                    }
                </div>
            </div>
            <div class="task-actions">
                <button class="task-action-btn js-edit-task" data-task='${JSON.stringify(
                    task
                ).replace(/"/g, "&quot;")}' title="Editar">
                    ✏️
                </button>
                <button class="task-action-btn js-delete-task danger" data-task-id="${
                    task.id
                }" title="Eliminar">
                    🗑️
                </button>
            </div>
        </div>
    `;
}

// Función helper para escapar HTML
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Función helper para formatear fechas
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES");
    } catch (error) {
        return dateString;
    }
}

// Actualizar contadores de tareas
export function updateTaskCounts() {
    console.log("[tasks.js] Actualizando contadores...");
    const counts = taskCounts.get();
    console.log("[tasks.js] Contadores:", counts);

    // Actualizar contadores en el sidebar
    Object.keys(counts).forEach((key) => {
        const element = document.querySelector(
            `[data-filter="${key}"] .sidebar-item-count`
        );
        if (element) {
            element.textContent = counts[key];
        }
    });

    // Actualizar contador principal
    const taskCounter = document.getElementById("taskCounter");
    if (taskCounter) {
        const filteredCount = filteredTasks.get().length;
        const totalCount = allTasks.get().length;
        taskCounter.textContent = `${filteredCount}/${totalCount}`;
    }
}

// Función para filtrar tareas
export function filterTasks(filterType) {
    console.log("[tasks.js] Aplicando filtro:", filterType);
    taskActions.setFilter(filterType);

    // Actualizar UI del filtro activo
    document.querySelectorAll("[data-filter]").forEach((btn) => {
        btn.classList.remove("active");
    });

    const activeButton = document.querySelector(
        `[data-filter="${filterType}"]`
    );
    if (activeButton) {
        activeButton.classList.add("active");
    }

    // Actualizar título de la sección
    const sectionTitle = document.getElementById("sectionTitle");
    if (sectionTitle) {
        const filterNames = {
            inbox: "Bandeja de entrada",
            today: "Hoy",
            upcoming: "Próximas",
            important: "Importantes",
            overdue: "Vencidas",
            completed: "Completadas",
        };

        sectionTitle.textContent = filterNames[filterType] || "Tareas";
    }
}

// Función para manejar búsqueda
export function handleSearch(searchValue) {
    console.log("[tasks.js] Búsqueda:", searchValue);
    taskActions.setSearch(searchValue);
}

// Función para manejar filtro de prioridad
export function handlePriorityFilter(event) {
    const priority = event.target.value;
    console.log("[tasks.js] Filtro de prioridad:", priority);
    taskActions.setPriorityFilter(priority);
}

// Función para refrescar tareas
export function refreshTasks() {
    console.log("[tasks.js] Refrescando tareas...");
    loadTasks();
}

// Función para toggle de tarea
export function toggleTask(taskId) {
    console.log("[tasks.js] Toggle tarea:", taskId);
    const tasks = allTasks.get();
    const task = tasks.find((t) => t.id == taskId);

    if (!task) {
        console.error("[tasks.js] Tarea no encontrada:", taskId);
        return;
    }

    const newCompleted = !task.completed;
    console.log("[tasks.js] Cambiando estado completed a:", newCompleted);

    // Actualizar optimísticamente
    taskActions.updateTask(taskId, { completed: newCompleted });

    // Enviar al servidor
    updateTaskOnServer(taskId, { completed: newCompleted });
}

// Función para eliminar tarea
export function deleteTask(taskId) {
    console.log("[tasks.js] Eliminando tarea:", taskId);

    if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
        // Eliminar optimísticamente
        taskActions.removeTask(taskId);

        // Eliminar en el servidor
        deleteTaskOnServer(taskId);
    }
}

// Función para actualizar tarea en el servidor
async function updateTaskOnServer(taskId, updates) {
    try {
        const response = await apiRequest(
            `${API_CONFIG.ENDPOINTS.TASKS.BASE}/${taskId}`,
            {
                method: "PUT",
                body: JSON.stringify(updates),
            }
        );

        if (!response.ok) {
            throw new Error("Error al actualizar tarea");
        }

        console.log("[tasks.js] Tarea actualizada en el servidor");
        showToast("Tarea actualizada", "success");
    } catch (error) {
        console.error("[tasks.js] Error al actualizar tarea:", error);
        showToast("Error al actualizar tarea", "error");
        // Recargar tareas para sincronizar
        loadTasks();
    }
}

// Función para eliminar tarea en el servidor
async function deleteTaskOnServer(taskId) {
    try {
        const response = await apiRequest(
            `${API_CONFIG.ENDPOINTS.TASKS.BASE}/${taskId}`,
            {
                method: "DELETE",
            }
        );

        if (!response.ok) {
            throw new Error("Error al eliminar tarea");
        }

        console.log("[tasks.js] Tarea eliminada del servidor");
        showToast("Tarea eliminada", "success");
    } catch (error) {
        console.error("[tasks.js] Error al eliminar tarea:", error);
        showToast("Error al eliminar tarea", "error");
        // Recargar tareas para sincronizar
        loadTasks();
    }
}

// Función para enviar nueva tarea o actualizar existente
export async function submitTask(formData) {
    console.log("[tasks.js] Enviando tarea:", formData);

    try {
        const isEdit = formData.id && formData.id !== "";
        const url = isEdit
            ? `${API_CONFIG.ENDPOINTS.TASKS.BASE}/${formData.id}`
            : API_CONFIG.ENDPOINTS.TASKS.BASE;
        const method = isEdit ? "PUT" : "POST";

        const response = await apiRequest(url, {
            method,
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error("Error al guardar tarea");
        }

        const result = await response.json();
        console.log("[tasks.js] Tarea guardada:", result);

        showToast(isEdit ? "Tarea actualizada" : "Tarea creada", "success");

        // Recargar tareas
        await loadTasks();

        return result;
    } catch (error) {
        console.error("[tasks.js] Error al guardar tarea:", error);
        showToast("Error al guardar tarea: " + error.message, "error");
        throw error;
    }
}

// Función para poblar selector de listas en el formulario
export async function populateTaskFormListSelector(preselectedListId = null) {
    console.log("[tasks.js] Poblando selector de listas...");
    // Esta función se puede implementar cuando se copie taskLists.js
}
