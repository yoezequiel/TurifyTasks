// Variable para guardar el total de tareas pendientes iniciales por filtro
let initialPendingCount = {};
// Crear o editar tarea
export async function submitTask(taskData) {
  if (!taskData.title || !taskData.title.trim()) throw new Error('El título es obligatorio');
  const isEdit = !!taskData.id;
  console.log('[submitTask] isEdit:', isEdit, 'taskData:', taskData);
  const url = isEdit
    ? `http://localhost:3000/api/tasks/${taskData.id}`
    : 'http://localhost:3000/api/tasks';
  const method = isEdit ? 'PUT' : 'POST';
  console.log('[submitTask] URL:', url, 'Method:', method);
  try {
    const response = await fetch(url, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    console.log('[submitTask] Response status:', response.status);
    if (response.ok) {
      const responseData = await response.json();
      console.log('[submitTask] Response data:', responseData);
      await loadTasks();
      showToast(isEdit ? 'Tarea actualizada' : 'Tarea creada', 'success');
    } else {
      const errorData = await response.json();
      console.error('[submitTask] Error response:', errorData);
      throw new Error(errorData.message || 'Error al guardar tarea');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
// tasks.js - Lógica de tareas y helpers
import { showToast, escapeHtml } from './ui.js';

export let allTasks = [];
export let currentFilter = 'inbox';

export function getTaskDate(task) {
  let dateStr = task.dueDate || task.due_date || task.createdAt || task.created_at;
  console.log('[getTaskDate] Tarea:', task.title, 'Campos de fecha:', {
    dueDate: task.dueDate,
    due_date: task.due_date,
    createdAt: task.createdAt,
    created_at: task.created_at,
    selectedDate: dateStr
  });
  
  if (!dateStr) {
    return new Date();
  }
  
  // Si es una fecha YYYY-MM-DD (sin hora), agregar T00:00:00 para evitar problemas de zona horaria
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    dateStr += 'T00:00:00';
  }
  
  const date = new Date(dateStr);
  console.log(`[getTaskDate] Fecha procesada: ${dateStr} -> ${date}`);
  return date;
}

export async function loadTasks() {
  const loadingState = document.getElementById('loadingState');
  if (loadingState) loadingState.style.display = 'block';
  try {
    const response = await fetch('http://localhost:3000/api/tasks', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      const data = await response.json();
      allTasks = data.data || [];
      
      // Establecer filtro inicial si no está establecido
      if (!currentFilter) {
        currentFilter = 'inbox';
      }
      
      updateTaskCounts();
      renderTasks();
    } else {
      showToast('Error al cargar tareas', 'error');
    }
  } catch (error) {
    console.error('Error cargando tareas:', error);
    showToast('Error de conexión', 'error');
  } finally {
    if (loadingState) loadingState.style.display = 'none';
  }
}

export function updateTaskCounts() {
  const today = new Date().toDateString();
  const counts = {
    inbox: allTasks.filter(task => !task.completed).length,
    today: allTasks.filter(task => {
      const taskDate = getTaskDate(task).toDateString();
      return taskDate === today && !task.completed;
    }).length,
    upcoming: allTasks.filter(task => {
      const taskDate = getTaskDate(task);
      return taskDate > new Date() && !task.completed;
    }).length,
    important: allTasks.filter(task => (task.priority === 'high' || task.priority === 'alta') && !task.completed).length,
    completed: allTasks.filter(task => task.completed).length
  };
  document.getElementById('inboxCount').textContent = counts.inbox;
  document.getElementById('todayCount').textContent = counts.today;
  document.getElementById('upcomingCount').textContent = counts.upcoming;
  document.getElementById('importantCount').textContent = counts.important;
  document.getElementById('completedCount').textContent = counts.completed;
}

export function filterTasks(filterType) {
  currentFilter = filterType;
  
  // Remover clase activa de todos los items del sidebar
  document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
  
  // Añadir clase activa al item seleccionado usando data-filter
  const activeItem = document.querySelector(`[data-filter="${filterType}"]`);
  if (activeItem) {
    activeItem.classList.add('active');
  }
  
  const titles = {
    inbox: 'Bandeja de entrada',
    today: 'Tareas de hoy',
    upcoming: 'Próximas tareas',
    important: 'Tareas importantes',
    completed: 'Tareas completadas'
  };
  document.getElementById('pageTitle').textContent = titles[filterType];
  document.getElementById('sectionTitle').textContent = titles[filterType];
  renderTasks();
}

export function renderTasks() {

  const container = document.getElementById('tasksContainer');
  if (!container) return;
  const today = new Date().toDateString();
  let filteredTasks = [];
  console.log('[renderTasks] currentFilter:', currentFilter);
  // 1. Filtrar por tipo principal
  switch (currentFilter) {
    case 'inbox':
      filteredTasks = allTasks.filter(task => !task.completed);
      break;
    case 'today':
      const todayDate = new Date();
      const todayStr = todayDate.toDateString();
      console.log('[renderTasks] Filtro today - fecha de hoy:', todayStr);
      filteredTasks = allTasks.filter(task => {
        const taskDate = getTaskDate(task);
        const taskDateStr = taskDate.toDateString();
        const matches = taskDateStr === todayStr && !task.completed;
        console.log('[renderTasks] Tarea:', task.title, 'Fecha tarea:', taskDateStr, 'Coincide:', matches, 'Completada:', task.completed);
        return matches;
      });
      break;
    case 'upcoming':
      filteredTasks = allTasks.filter(task => {
        const taskDate = getTaskDate(task);
        return taskDate > new Date() && !task.completed;
      });
      break;
    case 'important':
      filteredTasks = allTasks.filter(task => (task.priority === 'high' || task.priority === 'alta') && !task.completed);
      break;
    case 'completed':
      filteredTasks = allTasks.filter(task => task.completed);
      break;
    default:
      filteredTasks = allTasks;
  }
  console.log('[renderTasks] after filter main:', filteredTasks.length);
  
  // Guardar cantidad base antes de filtros adicionales
  const baseFilteredTasks = [...filteredTasks];
  
  // 2. Filtrar por prioridad si está seleccionada
  if (priorityFilter) {
    filteredTasks = filteredTasks.filter(task => {
      if (priorityFilter === 'high') return task.priority === 'high' || task.priority === 'alta';
      if (priorityFilter === 'medium') return task.priority === 'medium' || task.priority === 'media';
      if (priorityFilter === 'low') return task.priority === 'low' || task.priority === 'baja';
      return true;
    });
    console.log('[renderTasks] after priorityFilter:', filteredTasks.length);
  }
  // 3. Filtrar por término de búsqueda si hay texto
  if (searchTerm) {
    filteredTasks = filteredTasks.filter(task => {
      const title = (task.title || '').toLowerCase();
      const desc = (task.description || '').toLowerCase();
      return title.includes(searchTerm) || desc.includes(searchTerm);
    });
    console.log('[renderTasks] after searchTerm:', filteredTasks.length);
  }
  
  // Contador contextual inteligente
  const taskCounter = document.getElementById('taskCounter');
  const progressFilters = ['inbox', 'today', 'upcoming'];
  const hasAdditionalFilters = priorityFilter || searchTerm;
  
  if (taskCounter) {
    if (hasAdditionalFilters) {
      // Con filtros adicionales: mostrar "X resultados de Y"
      taskCounter.textContent = `${filteredTasks.length} de ${baseFilteredTasks.length}`;
    } else {
      // Sin filtros adicionales: mostrar contador normal
      if (progressFilters.includes(currentFilter)) {
        if (initialPendingCount[currentFilter] === undefined || initialPendingCount[currentFilter] === null) {
          initialPendingCount[currentFilter] = filteredTasks.length;
        }
        if (filteredTasks.length > initialPendingCount[currentFilter]) {
          initialPendingCount[currentFilter] = filteredTasks.length;
        }
        if (filteredTasks.length === 0) {
          initialPendingCount[currentFilter] = 0;
        }
        const completed = initialPendingCount[currentFilter] - filteredTasks.length;
        const total = initialPendingCount[currentFilter];
        taskCounter.textContent = `${completed}/${total}`;
      } else {
        const total = filteredTasks.length;
        const completed = filteredTasks.filter(task => task.completed).length;
        taskCounter.textContent = `${completed}/${total}`;
      }
    }
  }
  if (filteredTasks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <p>No hay tareas en esta lista</p>
      </div>
    `;
    return;
  }
  container.innerHTML = filteredTasks.map(task => {
    const taskId = task._id || task.id;
    const isCompleted = task.completed ? 'completed' : '';
    const checkIcon = task.completed ? '✓' : '';
    const priorityText = getPriorityText(task.priority);
    const priorityClass = getPriorityClass(task.priority);
    
    // Generar información de fecha límite
    const dueDateHtml = getDueDateHtml(task.due_date || task.dueDate);
    
    return `
      <div class="task-card ${isCompleted}">
        <button class="task-checkbox js-toggle-task" data-task-id="${taskId}">
          ${checkIcon}
        </button>
        <div class="task-content">
          <h3 class="task-title${task.completed ? ' completed' : ''}">${escapeHtml(task.title)}</h3>
          ${task.description ? `<p class="task-desc${task.completed ? ' completed' : ''}">${escapeHtml(task.description)}</p>` : ''}
          <div class="task-meta">
            <span class="priority-badge ${priorityClass}">${priorityText}</span>
          </div>
          ${dueDateHtml}
        </div>
        <div class="task-actions">
          <button class="edit-btn js-edit-task" data-task='${JSON.stringify(task).replace(/\"/g, '&quot;').replace(/'/g, '&#39;')}'>✏️</button>
          <button class="delete-btn js-delete-task" data-task-id="${taskId}">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

export function getPriorityText(priority) {
  switch (priority) {
    case 'high':
    case 'alta': return '🔴 Alta';
    case 'medium':
    case 'media': return '🟡 Media';
    default: return '🟢 Baja';
  }
}

export function getPriorityClass(priority) {
  switch (priority) {
    case 'high':
    case 'alta': return 'priority-high';
    case 'medium':
    case 'media': return 'priority-medium';
    default: return 'priority-low';
  }
}

export async function toggleTask(taskId) {
  const task = allTasks.find(t => String(t._id || t.id) === String(taskId));
  if (!task) return;
  const newState = !task.completed;
  task.completed = newState;
  updateTaskCounts();
  renderTasks();
  try {
    const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: newState })
    });
    if (response.ok) {
      showToast(newState ? 'Tarea completada' : 'Tarea pendiente', 'success');
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Backend error:', error);
    task.completed = !newState;
    updateTaskCounts();
    renderTasks();
    showToast('Error al actualizar', 'error');
  }
}

export async function deleteTask(taskId) {
  console.log('[deleteTask] llamado con taskId:', taskId, typeof taskId);
  if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;
  try {
    const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('[deleteTask] response status:', response.status);
    let result;
    try {
      result = await response.json();
      console.log('[deleteTask] response json:', result);
    } catch (e) {
      console.log('[deleteTask] no se pudo parsear JSON:', e);
    }
    if (response.ok) {
      // Forzar recarga desde backend para evitar inconsistencias
      await loadTasks();
      showToast('Tarea eliminada', 'success');
    } else {
      showToast(result?.error || 'Error al eliminar tarea', 'error');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    showToast('Error de conexión', 'error');
  }
}


export let searchTerm = '';
export let priorityFilter = '';

export function handleSearch(term) {
  searchTerm = term.trim().toLowerCase();
  console.log('[handleSearch] searchTerm:', searchTerm);
  renderTasks();
}

export function handlePriorityFilter() {
  const select = document.getElementById('priorityFilter');
  priorityFilter = select ? select.value : '';
  console.log('[handlePriorityFilter] priorityFilter:', priorityFilter);
  renderTasks();
}

export function refreshTasks() {
  loadTasks();
  showToast('Tareas actualizadas', 'success');
}

// Funciones utilitarias para fechas límite
function getDueDateInfo(dueDateStr) {
  if (!dueDateStr) return null;
  
  const now = new Date();
  const dueDate = new Date(dueDateStr);
  
  // Verificar si es una fecha válida
  if (isNaN(dueDate.getTime())) {
    return null;
  }
  
  const diffInMs = dueDate.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.ceil(diffInMs / (1000 * 60));
  
  let status = '';
  let timeText = '';
  let icon = '📅';
  let urgencyClass = '';
  
  if (diffInMs < 0 && Math.abs(diffInDays) > 0) {
    // Vencida (solo si ha pasado al menos un día completo)
    const overdueDays = Math.abs(diffInDays);
    status = 'overdue';
    icon = '⚠️';
    urgencyClass = 'overdue';
    timeText = `Vencida hace ${overdueDays} ${overdueDays === 1 ? 'día' : 'días'}`;
  } else if (diffInDays === 0 || (diffInMs < 0 && Math.abs(diffInDays) === 0)) {
    // Hoy (incluye casos donde es el mismo día aunque haya pasado la hora)
    status = 'today';
    icon = '🔥';
    urgencyClass = 'today';
    timeText = 'Vence hoy';
  } else if (diffInDays === 1) {
    // Mañana
    status = 'tomorrow';
    icon = '⏰';
    urgencyClass = 'tomorrow';
    timeText = 'Vence mañana';
  } else if (diffInDays <= 7) {
    // Esta semana
    status = 'this-week';
    icon = '📅';
    urgencyClass = 'this-week';
    timeText = `Vence en ${diffInDays} días`;
  } else {
    // Futuro lejano
    status = 'future';
    icon = '🗓️';
    urgencyClass = 'future';
    timeText = `Vence en ${diffInDays} días`;
  }
  
  return {
    status,
    icon,
    timeText,
    urgencyClass,
    formattedDate: dueDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  };
}

function getDueDateHtml(dueDateStr) {
  const dueDateInfo = getDueDateInfo(dueDateStr);
  
  if (!dueDateInfo) {
    return '';
  }
  
  return `
    <div class="due-date-container ${dueDateInfo.urgencyClass}">
      <div class="due-date-main">
        <span class="due-date-icon" title="Estado: ${dueDateInfo.status}">
          ${dueDateInfo.icon}
        </span>
        <div class="due-date-text">
          <span class="due-date-label">Fecha límite:</span>
          <span class="due-date-value" title="${dueDateInfo.formattedDate}">
            ${dueDateInfo.formattedDate}
          </span>
        </div>
      </div>
      <div class="time-remaining ${dueDateInfo.urgencyClass}">
        <span class="time-remaining-text">
          ${dueDateInfo.timeText}
        </span>
      </div>
    </div>
  `;
}
