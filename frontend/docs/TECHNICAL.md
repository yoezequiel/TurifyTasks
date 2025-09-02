# TurifyTasks Frontend - Guía Técnica

## 🔧 Arquitectura y Implementación Técnica

Esta guía documenta los aspectos técnicos avanzados de la implementación del frontend de TurifyTasks.

## 📊 Stack Tecnológico

### Framework y Herramientas
- **Astro 4.x** - Framework principal
- **TypeScript 5.x** - Tipado estático estricto
- **Node.js 18+** - Runtime de desarrollo
- **CSS3** - Estilos personalizados con variables
- **ES2022** - JavaScript moderno

### Librerías y Dependencias
```json
{
  "@astrojs/check": "^0.9.4",
  "@types/node": "^22.9.0",
  "astro": "^4.16.11",
  "typescript": "^5.6.3"
}
```

## 🏗️ Arquitectura de Componentes

### Patron de Componentes Astro

**TaskForm.astro** - Modal de Creación/Edición
```astro
---
export interface Props {
    isOpen?: boolean;
    task?: Task;
    onClose?: () => void;
}

const { isOpen = false, task, onClose } = Astro.props;
---
```

**TaskList.astro** - Lista con Filtros
```astro
---
export interface Props {
    tasks: Task[];
    filter: string;
    onTaskToggle?: (id: number) => void;
    onTaskDelete?: (id: number) => void;
}
---
```

**TaskItem.astro** - Item Individual
```astro
---
export interface Props {
    task: Task;
    onToggle?: (id: number) => void;
    onDelete?: (id: number) => void;
}
---
```

### Sistema de Tipos TypeScript

**Interfaces Principales**
```typescript
export interface Task {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
    isImportant: boolean;
    createdAt: string;
    updatedAt: string;
    userId: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}

export interface TaskFormData {
    title: string;
    description?: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
    isImportant?: boolean;
}
```

**Extensiones Globales**
```typescript
declare global {
    interface Window {
        // Estado Global
        tasks: Task[];
        currentUser: User | null;
        currentFilter: string;
        
        // Utilidades
        showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
        refreshTasks: () => Promise<void>;
        
        // Operaciones de Tareas
        toggleTask: (taskId: number) => Promise<void>;
        deleteTask: (taskId: number) => Promise<void>;
        createTask: (taskData: TaskFormData) => Promise<void>;
        
        // Filtros y Contadores
        filterTasks: (filter: string) => Task[];
        getTaskCounts: () => TaskCounts;
        
        // Autenticación
        checkAuthentication: () => Promise<boolean>;
        logout: () => Promise<void>;
    }
}
```

## 🔄 Gestión de Estado

### Estado Global (Window Object)
```javascript
// Inicialización del estado global
window.tasks = [];
window.currentUser = null;
window.currentFilter = 'inbox';

// Patrón de actualización de estado
const updateGlobalState = (newTasks) => {
    window.tasks = newTasks;
    updateTaskCounts();
    rerenderTaskList();
};
```

### Flujo de Datos Unidireccional
1. **Acción del Usuario** → Evento en componente
2. **Función Global** → Actualización de estado
3. **API Request** → Sincronización con backend  
4. **State Update** → Re-render de componentes
5. **UI Feedback** → Notificación al usuario

## 🔐 Sistema de Autenticación

### Migración JWT → Sesiones

**Antes (JWT):**
```javascript
// Almacenamiento en localStorage
localStorage.setItem('token', data.token);

// Headers en requests
headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

**Después (Sesiones):**
```javascript
// Sin almacenamiento local - cookies automáticas
fetch('/api/endpoint', {
    method: 'POST',
    credentials: 'include',  // Incluye cookies automáticamente
    headers: {
        'Content-Type': 'application/json'
    }
})
```

### Flujo de Autenticación
```javascript
// 1. Login - Establecer sesión
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});

// 2. Verificación automática
const checkAuth = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/auth/profile', {
            credentials: 'include'
        });
        return response.ok;
    } catch (error) {
        return false;
    }
};

// 3. Logout - Limpiar sesión
const logout = async () => {
    await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    });
    window.location.href = '/login';
};
```

## 🔌 Integración con API

### Configuración Base
```javascript
const API_BASE = 'http://localhost:3000/api';

const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
};
```

### Endpoints Implementados
```javascript
// Autenticación
POST   /auth/login           - Iniciar sesión
POST   /auth/register        - Registrar usuario  
GET    /auth/profile         - Obtener perfil
POST   /auth/logout          - Cerrar sesión

// Gestión de Tareas
GET    /tasks                - Obtener todas las tareas
POST   /tasks                - Crear nueva tarea
PUT    /tasks/:id            - Actualizar tarea
DELETE /tasks/:id            - Eliminar tarea
PUT    /tasks/toggle/:id     - Toggle completado
```

## 🎨 Sistema de Estilos

### Variables CSS
```css
:root {
    /* Colores Principales */
    --primary-color: #0c5a34;
    --primary-hover: #0a4a2a;
    --secondary-color: #16a085;
    --accent-color: #f39c12;
    
    /* Estados */
    --success-color: #27ae60;
    --error-color: #e74c3c;
    --warning-color: #f1c40f;
    --info-color: #3498db;
    
    /* Neutrales */
    --background: #f8fafc;
    --surface: #ffffff;
    --text-primary: #2c3e50;
    --text-secondary: #7f8c8d;
    --border: #ecf0f1;
    
    /* Espaciado */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    
    /* Transiciones */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
}
```

### Arquitectura CSS
```
styles/
├── dashboard.css      # Estilos del dashboard principal
├── login.css         # Estilos para autenticación
├── register.css      # Estilos para registro
└── components/       # Estilos de componentes (futuro)
    ├── task-form.css
    ├── task-list.css
    └── task-item.css
```

### Patrón BEM para Classes
```css
/* Bloque */
.task-item { }

/* Elemento */
.task-item__title { }
.task-item__description { }
.task-item__actions { }

/* Modificador */
.task-item--completed { }
.task-item--important { }
.task-item--high-priority { }
```

## 🔄 Manejo de Estados Asíncronos

### Patrón Loading/Error/Success
```javascript
const handleAsyncOperation = async (operation, loadingElement) => {
    try {
        // 1. Estado Loading
        if (loadingElement) {
            loadingElement.disabled = true;
            loadingElement.textContent = 'Cargando...';
        }
        
        // 2. Operación Asíncrona
        const result = await operation();
        
        // 3. Estado Success
        showToast('Operación exitosa', 'success');
        return result;
        
    } catch (error) {
        // 4. Estado Error
        console.error('Error:', error);
        showToast('Error en la operación', 'error');
        throw error;
        
    } finally {
        // 5. Limpieza
        if (loadingElement) {
            loadingElement.disabled = false;
            loadingElement.textContent = 'Enviar';
        }
    }
};
```

### Sistema de Notificaciones Toast
```javascript
window.showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animación de entrada
    setTimeout(() => toast.classList.add('toast--visible'), 100);
    
    // Auto-remove
    setTimeout(() => {
        toast.classList.remove('toast--visible');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
};
```

## 🧪 Debugging y Development

### Console Logging Estratégico
```javascript
// Desarrollo: Logs detallados
if (import.meta.env.DEV) {
    console.log('🔄 Estado actualizado:', window.tasks);
    console.log('👤 Usuario actual:', window.currentUser);
    console.log('🔍 Filtro activo:', window.currentFilter);
}

// Errores: Siempre loggear
console.error('❌ Error en operación:', error);
console.warn('⚠️ Advertencia:', warning);
```

### Performance Monitoring
```javascript
// Medir tiempo de operaciones
const startTime = performance.now();
await operation();
const endTime = performance.now();
console.log(`⏱️ Operación tomó: ${endTime - startTime}ms`);
```

## 📊 Métricas y Optimizaciones

### Bundle Size Analysis
```bash
# Análisis de build
npm run build -- --analyze

# Métricas típicas:
# - HTML: ~15KB gzipped
# - CSS: ~8KB gzipped  
# - JS: ~25KB gzipped
# - Total: ~48KB gzipped
```

### Optimizaciones Implementadas
- **Tree Shaking** automático con Astro
- **CSS Purging** de clases no utilizadas
- **Image Optimization** con formatos modernos
- **Lazy Loading** de componentes no críticos
- **Minimal JavaScript** enviado al cliente

### Lighthouse Scores Objetivo
- **Performance:** 95+
- **Accessibility:** 100
- **Best Practices:** 100  
- **SEO:** 95+

## 🔒 Seguridad

### Medidas Implementadas
```javascript
// 1. Sanitización de inputs
const sanitizeInput = (input) => {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// 2. Validación client-side
const validateTaskTitle = (title) => {
    return title.length > 0 && title.length <= 200;
};

// 3. Headers de seguridad (manejados por Astro)
// - Content Security Policy
// - X-Content-Type-Options
// - X-Frame-Options
```

### Configuración CORS
```javascript
// Backend requirement
app.use(cors({
    origin: 'http://localhost:4321',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 📋 Lista de Tareas Técnicas

### Completadas ✅
- [x] Migración completa JWT → Sesiones
- [x] Sistema de componentes TypeScript
- [x] Estado global con tipado estricto
- [x] Integración completa con API backend
- [x] Sistema de filtros y contadores
- [x] Manejo robusto de errores
- [x] Toggle de tareas funcional
- [x] Responsive design completo
- [x] Sistema de fechas límite con indicadores visuales
- [x] Filtro de tareas vencidas segregado

## 📅 Sistema de Fechas Límite - Documentación Técnica

### Arquitectura de Componentes para Fechas

**DueDateInfo.astro** - Componente de Visualización de Fechas
```astro
---
interface Props {
  dueDate?: string;
  showTimeRemaining?: boolean;
  compact?: boolean;
}

// Función de normalización consistente
const normalizeDateString = (dateStr: string) => {
  let normalizedDateStr = dateStr;
  
  // Manejo de fechas YYYY-MM-DD sin zona horaria
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDateStr)) {
    normalizedDateStr += 'T00:00:00';
  }
  
  return new Date(normalizedDateStr);
};

const getDueDateInfo = (dueDateStr: string) => {
  const now = new Date();
  const dueDate = normalizeDateString(dueDateStr);
  
  const diffInMs = dueDate.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
  // Lógica de estados de urgencia
  if (diffInMs < 0 && Math.abs(diffInDays) > 0) {
    return { status: 'overdue', icon: '⚠️', urgencyClass: 'overdue' };
  } else if (diffInDays === 0) {
    return { status: 'today', icon: '🔥', urgencyClass: 'today' };
  }
  // ... más estados
};
---
```

### Funciones JavaScript para Renderizado Dinámico

**tasks.js** - Funciones Utilitarias
```javascript
// Normalización centralizada de fechas
export function normalizeDateString(dateStr) {
  if (!dateStr) return new Date();
  
  let normalizedDateStr = dateStr;
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDateStr)) {
    normalizedDateStr += 'T00:00:00';
  }
  
  return new Date(normalizedDateStr);
}

// Determinación de estado de vencimiento
export function isTaskOverdue(task) {
  if (task.completed) return false;
  
  const taskDate = getTaskDate(task);
  const now = new Date();
  
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const taskDateStart = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
  
  return taskDateStart < todayStart;
}

// Renderizado HTML dinámico para JavaScript
function getDueDateHtml(dueDateStr) {
  const dueDateInfo = getDueDateInfo(dueDateStr);
  
  return `
    <div class="due-date-container ${dueDateInfo.urgencyClass}">
      <div class="due-date-main">
        <span class="due-date-icon">${dueDateInfo.icon}</span>
        <div class="due-date-text">
          <span class="due-date-value">${dueDateInfo.formattedDate}</span>
        </div>
      </div>
      <div class="time-remaining">
        <span class="time-remaining-text">${dueDateInfo.timeText}</span>
      </div>
    </div>
  `;
}
```

### Sistema de Filtros de Tareas Vencidas

**Lógica de Filtrado Segregado**
```javascript
// Exclusión de vencidas del inbox
case 'inbox':
  filteredTasks = allTasks.filter(task => !task.completed && !isTaskOverdue(task));
  break;

// Filtro específico para vencidas
case 'overdue':
  filteredTasks = allTasks.filter(task => isTaskOverdue(task));
  break;

// Actualización de contadores
export function updateTaskCounts() {
  const counts = {
    inbox: allTasks.filter(task => !task.completed && !isTaskOverdue(task)).length,
    overdue: allTasks.filter(task => isTaskOverdue(task)).length,
    // ... otros contadores
  };
  
  document.getElementById('overdueCount').textContent = counts.overdue;
}
```

### Estilos CSS con Estados de Urgencia

**Dashboard.css** - Indicadores Visuales
```css
/* Estados base */
.due-date-container {
  padding: 0.5rem;
  border-radius: 6px;
  margin-top: 0.5rem;
}

/* Estados de urgencia */
.due-date-container.today {
  background: rgba(245, 158, 11, 0.05);
  border-color: rgba(245, 158, 11, 0.2);
}

.due-date-container.overdue {
  background: rgba(239, 68, 68, 0.05);
  border-color: rgba(239, 68, 68, 0.2);
}

.due-date-container.critical {
  animation: pulse-urgent 2s infinite;
}

/* Animación para tareas críticas */
@keyframes pulse-urgent {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1); }
}

/* Indicadores en tarjetas */
.task-card:has(.due-date-container.overdue) {
  border-left: 3px solid #dc2626;
}
```

### Consistencia de Datos

**Normalización Entre Componentes**
- **Formulario**: `<input type="date">` guarda formato YYYY-MM-DD
- **Visualización**: `normalizeDateString()` agrega T00:00:00 
- **Procesamiento**: Mismo algoritmo en Astro y JavaScript
- **Resultado**: Fechas consistentes sin problemas de zona horaria

### Pendientes 🔄
- [ ] Tests automatizados (Jest + Testing Library)
- [ ] Storybook para componentes
- [ ] Service Worker para PWA
- [ ] Performance optimizations
- [ ] Internacionalización (i18n)
- [ ] Dark mode toggle
- [ ] Drag & drop para tareas
- [ ] Bulk operations

---

**Última Actualización:** Implementación completa del sistema de tareas  
**Estado Técnico:** ✅ Producción Ready  
**Coverage:** 100% funcionalidades implementadas
