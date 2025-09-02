// dashboard.js - Inicialización y orquestación de dashboard
console.log('[dashboard.js] cargado');
import { checkAuthentication, updateUserUI, logout } from './auth.js';
import { loadTasks, updateTaskCounts, filterTasks, renderTasks, handleSearch, handlePriorityFilter, refreshTasks, toggleTask, deleteTask, submitTask } from './tasks.js';
import { showToast } from './ui.js';

// Solo necesario para el modal de tareas (mantenemos solo lo esencial)
window.showToast = showToast;
window.submitTask = submitTask;

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
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
