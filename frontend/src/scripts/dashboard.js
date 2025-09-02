// dashboard.js - Inicialización y orquestación de dashboard
console.log('[dashboard.js] cargado');
import { checkAuthentication, updateUserUI, logout } from './auth.js';
import { loadTasks, updateTaskCounts, filterTasks, renderTasks, handleSearch, handlePriorityFilter, refreshTasks, toggleTask, deleteTask, submitTask } from './tasks.js';
import { showToast } from './ui.js';


window.filterTasks = filterTasks;
window.toggleTask = toggleTask;
window.logout = logout;
window.showToast = showToast;
window.submitTask = submitTask;
window.handleDelete = deleteTask;
window.handleSearch = handleSearch;
window.handlePriorityFilter = handlePriorityFilter;
window.refreshTasks = refreshTasks;

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
  loadTasks();

  // Delegación para botones de eliminar tarea
  document.body.addEventListener('click', function(e) {
    const btn = e.target.closest('.js-delete-task');
    if (btn) {
      const taskId = btn.getAttribute('data-task-id');
      console.log('[dashboard.js] Click en botón eliminar:', btn, 'taskId:', taskId);
      console.log('[dashboard.js] window.deleteTask:', window.deleteTask);
      if (taskId && window.deleteTask) {
        window.deleteTask(Number(taskId));
      }
    }
  });
});
