// dashboard.js - Inicialización y orquestación de dashboard
console.log('[dashboard.js] cargado');
import { checkAuthentication, updateUserUI, logout } from './auth.js';
import { loadTasks, updateTaskCounts, filterTasks, renderTasks, handleSearch, handlePriorityFilter, refreshTasks, toggleTask, deleteTask, submitTask, populateTaskFormListSelector } from './tasks.js';
import { showToast } from './ui.js';

// Solo necesario para el modal de tareas (mantenemos solo lo esencial)
window.showToast = showToast;
window.submitTask = submitTask;

// Función para mostrar el formulario de tareas
window.showTaskForm = async function(mode = 'create', task = null) {
  const modal = document.getElementById('taskForm');
  if (!modal) return;
  
  const form = document.getElementById('taskFormElement');
  const title = modal.querySelector('.task-form-title');
  
  if (mode === 'create') {
    if (title) title.textContent = 'Nueva Tarea';
    if (form) form.reset();
    document.getElementById('taskId').value = '';
  } else if (mode === 'edit' && task) {
    if (title) title.textContent = 'Editar Tarea';
    // Llenar formulario con datos de la tarea
    document.getElementById('taskTitle').value = task.title || '';
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskPriority').value = task.priority || 'medium';
    document.getElementById('taskDueDate').value = task.due_date ? task.due_date.split('T')[0] : '';
    document.getElementById('taskId').value = task.id || '';
  }
  
  // Poblar selector de listas de tareas
  await populateTaskFormListSelector();
  
  // Mostrar modal
  modal.style.display = 'flex';
};

// Función para cerrar el formulario de tareas
window.closeTaskForm = function() {
  const modal = document.getElementById('taskForm');
  if (modal) {
    modal.style.display = 'none';
  }
};

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
  console.log('[dashboard.js] DOM cargado, iniciando...');
  console.log('[dashboard.js] Llamando a checkAuthentication...');
  checkAuthentication();
  console.log('[dashboard.js] Llamando a loadTasks...');
  loadTasks();

  // Event Listeners para filtros de sidebar
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const filterType = button.getAttribute('data-filter');
      filterTasks(filterType);
    });
  });

  // Event Listeners para búsqueda y filtros
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      handleSearch(e.target.value);
    });
  }

  const priorityFilter = document.getElementById('priorityFilter');
  if (priorityFilter) {
    priorityFilter.addEventListener('change', handlePriorityFilter);
  }

  // Event Listeners para botones de acción
  const newTaskBtn = document.getElementById('newTaskBtn');
  if (newTaskBtn) {
    newTaskBtn.addEventListener('click', () => {
      if (window.showTaskForm) {
        window.showTaskForm('create');
      }
    });
  }

  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', refreshTasks);
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // Delegación para botones de eliminar tarea
  document.body.addEventListener('click', function(e) {
    const btn = e.target.closest('.js-delete-task');
    if (btn) {
      const taskId = btn.getAttribute('data-task-id');
      console.log('[dashboard.js] Click en botón eliminar:', btn, 'taskId:', taskId);
      if (taskId) {
        deleteTask(Number(taskId));
      }
    }
  });

  // Delegación para botones de toggle tarea
  document.body.addEventListener('click', function(e) {
    const checkbox = e.target.closest('.js-toggle-task');
    if (checkbox) {
      const taskId = checkbox.getAttribute('data-task-id');
      if (taskId) {
        toggleTask(taskId);
      }
    }
  });

  // Delegación para botones de editar tarea
  document.body.addEventListener('click', function(e) {
    const editBtn = e.target.closest('.js-edit-task');
    if (editBtn && window.showTaskForm) {
      try {
        const taskData = editBtn.getAttribute('data-task');
        const task = JSON.parse(taskData.replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
        window.showTaskForm('edit', task);
      } catch (error) {
        console.error('Error parsing task data:', error);
      }
    }
  });
});

// Exponer funciones necesarias globalmente
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
