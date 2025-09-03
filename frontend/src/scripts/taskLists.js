// taskLists.js - Lógica para gestionar listas de tareas
import { showToast, escapeHtml } from "./ui.js";
import { filterTasks, getCurrentFilter } from "./tasks.js";
import { apiRequest, API_CONFIG } from "../config/api.js";

export let allTaskLists = [];
export let currentTaskListId = null;

// Cargar todas las listas de tareas
export async function loadTaskLists() {
    try {
        const response = await apiRequest(API_CONFIG.ENDPOINTS.TASK_LISTS.BASE);

        if (!response.ok) {
            throw new Error("Error al cargar listas de tareas");
        }

        const data = await response.json();
        allTaskLists = data.data || [];

        console.log("Listas cargadas:", allTaskLists);
        renderTaskLists();
        updateSidebarLists();
        updateTaskFormSelector(); // Actualizar selector del formulario

        return allTaskLists;
    } catch (error) {
        console.error("Error al cargar listas:", error);
        showToast("Error al cargar las listas de tareas", "error");
        allTaskLists = [];
        renderTaskLists();
        return [];
    }
}

// Renderizar listas en el modal
export function renderTaskLists() {
    const listsGrid = document.getElementById("listsGrid");
    const listsLoading = document.getElementById("listsLoading");
    const listsEmpty = document.getElementById("listsEmpty");

    if (!listsGrid) return;

    // Ocultar estados
    if (listsLoading) listsLoading.style.display = "none";
    if (listsEmpty) listsEmpty.style.display = "none";

    // Mostrar empty state si no hay listas
    if (!allTaskLists || allTaskLists.length === 0) {
        if (listsEmpty) listsEmpty.style.display = "block";
        return;
    }

    // Limpiar grid
    listsGrid.innerHTML = "";

    // Renderizar cada lista
    allTaskLists.forEach((list) => {
        const listCard = createListCard(list);
        listsGrid.appendChild(listCard);
    });
}

// Crear una tarjeta de lista
function createListCard(list) {
    const card = document.createElement("div");
    card.className = "list-card";
    card.dataset.listId = list.id;

    const completedCount = 0; // TODO: Implementar cuando tengamos las tareas
    const totalCount = list.task_count || 0;
    const createdDate = new Date(list.created_at).toLocaleDateString("es-ES");

    card.innerHTML = `
        <div class="list-card-header">
            <h3 class="list-card-title">${escapeHtml(list.name)}</h3>
            <div class="list-card-actions">
                <button class="list-action-btn" onclick="window.editTaskList(${
                    list.id
                })" title="Editar">
                    ✏️
                </button>
                <button class="list-action-btn danger" onclick="window.deleteTaskList(${
                    list.id
                })" title="Eliminar">
                    🗑️
                </button>
            </div>
        </div>
        
        ${
            list.description
                ? `<p class="list-card-description">${escapeHtml(
                      list.description
                  )}</p>`
                : ""
        }
        
        <div class="list-card-stats">
            <div class="list-stats-left">
                <span class="list-stat list-stat-primary">
                    📋 ${totalCount} ${totalCount === 1 ? "tarea" : "tareas"}
                </span>
            </div>
            <div class="list-card-date">
                Creada el ${createdDate}
            </div>
        </div>
    `;

    // Agregar evento click para seleccionar la lista
    card.addEventListener("click", (e) => {
        // No activar si se hizo click en botones de acción
        if (e.target.classList.contains("list-action-btn")) return;

        selectTaskList(list.id, list.name);
        window.closeTaskListsManager();
    });

    return card;
}

// Seleccionar una lista de tareas
export function selectTaskList(listId, listName) {
    currentTaskListId = listId;

    // Usar el sistema de filtros de tasks.js
    const filterKey = `list-${listId}`;
    filterTasks(filterKey);

    // Actualizar título específico para listas (ya que filterTasks no lo maneja)
    const pageTitle = document.getElementById("pageTitle");
    if (pageTitle) {
        pageTitle.textContent = listName || "Lista de Tareas";
    }

    console.log("Lista seleccionada:", listId, listName, "Filter:", filterKey);
}

// Actualizar sidebar con listas
export function updateSidebarLists() {
    const sidebarNav = document.querySelector(".sidebar-nav");
    if (!sidebarNav) return;

    // Buscar si ya existe una sección de listas
    let listsSection = document.getElementById("listsSection");

    if (!listsSection && allTaskLists.length > 0) {
        // Crear sección de listas
        listsSection = document.createElement("div");
        listsSection.id = "listsSection";
        listsSection.innerHTML = `
            <div class="sidebar-section-header">
                <span class="sidebar-section-title">Mis Listas</span>
                <button class="sidebar-section-action" onclick="window.openTaskListsManager()" title="Gestionar listas">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </button>
            </div>
        `;

        // Insertar después de los filtros principales
        sidebarNav.appendChild(listsSection);
    }

    if (listsSection && allTaskLists.length === 0) {
        listsSection.remove();
        return;
    }

    if (!listsSection) return;

    // Limpiar listas anteriores
    const existingLists = listsSection.querySelectorAll(
        ".sidebar-item[data-list-id]"
    );
    existingLists.forEach((item) => item.remove());

    // Agregar cada lista al sidebar
    allTaskLists.forEach((list) => {
        const listItem = document.createElement("button");
        listItem.className = "sidebar-item";
        listItem.dataset.filter = `list-${list.id}`;
        listItem.dataset.listId = list.id;

        listItem.innerHTML = `
            <div class="sidebar-item-content">
                <span>📋 ${escapeHtml(list.name)}</span>
                <span class="sidebar-item-count">${list.task_count || 0}</span>
            </div>
        `;

        listItem.addEventListener("click", () => {
            selectTaskList(list.id, list.name);
        });

        listsSection.appendChild(listItem);
    });
}

// Crear o editar lista
export async function submitTaskList(listData) {
    if (!listData.name || !listData.name.trim()) {
        throw new Error("El nombre de la lista es obligatorio");
    }

    const isEdit = !!listData.id;
    const endpoint = isEdit
        ? `${API_CONFIG.ENDPOINTS.TASK_LISTS.BASE}/${listData.id}`
        : API_CONFIG.ENDPOINTS.TASK_LISTS.BASE;
    const method = isEdit ? "PUT" : "POST";

    try {
        const response = await apiRequest(endpoint, {
            method,
            body: JSON.stringify({
                name: listData.name.trim(),
                description: listData.description?.trim() || null,
            }),
        });

        if (response.ok) {
            const responseData = await response.json();
            await loadTaskLists(); // Recargar listas
            updateTaskFormSelector(); // Actualizar selector del formulario
            showToast(isEdit ? "Lista actualizada" : "Lista creada", "success");
            return responseData.data;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al guardar lista");
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Eliminar lista
export async function deleteTaskListById(listId) {
    if (
        !confirm(
            "¿Estás seguro de que quieres eliminar esta lista? Todas las tareas asociadas también se eliminarán."
        )
    ) {
        return;
    }

    try {
        const response = await apiRequest(
            `${API_CONFIG.ENDPOINTS.TASK_LISTS.BASE}/${listId}`,
            {
                method: "DELETE",
            }
        );

        if (response.ok) {
            const responseData = await response.json();
            await loadTaskLists(); // Recargar listas
            updateTaskFormSelector(); // Actualizar selector del formulario

            // Si se eliminó la lista actualmente seleccionada, volver a inbox
            if (currentTaskListId === listId) {
                currentTaskListId = null;
                filterTasks("inbox"); // Usar el sistema de filtros
            }

            showToast(responseData.message || "Lista eliminada", "success");
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al eliminar lista");
        }
    } catch (error) {
        console.error("Error:", error);
        showToast(error.message, "error");
    }
}

// Obtener lista por ID
export function getTaskListById(listId) {
    return allTaskLists.find((list) => list.id === parseInt(listId));
}

// Funciones globales para el HTML
window.openTaskListsManager = function () {
    const modal = document.getElementById("taskListsManager");
    if (modal) {
        modal.style.display = "flex";
        loadTaskLists(); // Recargar listas al abrir
    }
};

window.closeTaskListsManager = function () {
    const modal = document.getElementById("taskListsManager");
    if (modal) {
        modal.style.display = "none";
    }
};

window.openCreateListForm = function () {
    const modal = document.getElementById("listFormModal");
    const title = document.getElementById("listFormTitle");
    const submitText = document.getElementById("listSubmitText");

    if (modal && title && submitText) {
        // Limpiar formulario
        document.getElementById("listFormElement").reset();
        document.getElementById("listId").value = "";

        // Configurar para crear
        title.textContent = "Nueva Lista";
        submitText.textContent = "Crear Lista";

        modal.style.display = "flex";
        document.getElementById("listName").focus();
    }
};

window.editTaskList = function (listId) {
    const list = getTaskListById(listId);
    if (!list) return;

    const modal = document.getElementById("listFormModal");
    const title = document.getElementById("listFormTitle");
    const submitText = document.getElementById("listSubmitText");

    if (modal && title && submitText) {
        // Llenar formulario con datos
        document.getElementById("listId").value = list.id;
        document.getElementById("listName").value = list.name;
        document.getElementById("listDescription").value =
            list.description || "";

        // Configurar para editar
        title.textContent = "Editar Lista";
        submitText.textContent = "Actualizar Lista";

        modal.style.display = "flex";
        document.getElementById("listName").focus();
    }
};

window.deleteTaskList = function (listId) {
    deleteTaskListById(listId);
};

window.closeListForm = function () {
    const modal = document.getElementById("listFormModal");
    if (modal) {
        modal.style.display = "none";
    }
};

// Manejar envío del formulario de lista
document.addEventListener("DOMContentLoaded", function () {
    // Asegurar que los modales estén ocultos al cargar
    const taskListsModal = document.getElementById("taskListsManager");
    const listFormModal = document.getElementById("listFormModal");

    if (taskListsModal) {
        taskListsModal.style.display = "none";
    }

    if (listFormModal) {
        listFormModal.style.display = "none";
    }

    // Función de emergencia para cerrar todos los modales
    window.closeAllModals = function () {
        if (taskListsModal) taskListsModal.style.display = "none";
        if (listFormModal) listFormModal.style.display = "none";
    };

    // Cerrar modales con tecla ESC
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            window.closeAllModals();
        }
    });

    const listForm = document.getElementById("listFormElement");
    if (listForm) {
        listForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = new FormData(listForm);
            const listData = {
                id: formData.get("id") || null,
                name: formData.get("name"),
                description: formData.get("description"),
            };

            try {
                await submitTaskList(listData);
                window.closeListForm();
            } catch (error) {
                showToast(error.message, "error");
            }
        });
    }
});

// Poblar selector de listas en el formulario de tareas
export function populateTaskFormListSelector(preSelectListId = null) {
    const listSelector = document.getElementById("taskList");
    if (!listSelector) return;

    // Limpiar opciones existentes excepto la primera
    while (listSelector.children.length > 1) {
        listSelector.removeChild(listSelector.lastChild);
    }

    // Agregar cada lista como opción
    allTaskLists.forEach((list) => {
        const option = document.createElement("option");
        option.value = list.id;
        option.textContent = `📋 ${list.name}`;
        listSelector.appendChild(option);
    });

    // Pre-seleccionar lista si se especifica
    if (preSelectListId) {
        listSelector.value = preSelectListId;
    } else {
        // Si estamos filtrando por una lista específica, pre-seleccionarla
        const filter = getCurrentFilter();
        if (filter && filter.startsWith("list-")) {
            const listId = filter.replace("list-", "");
            listSelector.value = listId;
        }
    }
}

// Función para actualizar el selector cuando cambian las listas
function updateTaskFormSelector() {
    // Actualizar el selector si el formulario está abierto
    const taskForm = document.getElementById("taskForm");
    if (taskForm && taskForm.style.display !== "none") {
        populateTaskFormListSelector();
    }
}

// Exponer función globalmente para que pueda ser llamada desde otros scripts
window.populateTaskFormListSelector = populateTaskFormListSelector;

// Cargar listas al inicializar
document.addEventListener("DOMContentLoaded", loadTaskLists);
