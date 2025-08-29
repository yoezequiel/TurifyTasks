# API de Tareas - TurifyTasks

## Descripción
Esta API proporciona endpoints CRUD para la gestión de tareas de usuarios autenticados, siguiendo las mejores prácticas de arquitectura REST y seguridad.

## Autenticación
Todos los endpoints requieren autenticación mediante sesión. El usuario debe estar logueado.

## Endpoints Principales

### 1. Obtener todas las tareas del usuario
```
GET /api/tasks
```
**Descripción:** Retorna todas las tareas del usuario autenticado ordenadas por fecha de creación (más recientes primero).

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Completar proyecto",
      "description": "Finalizar el desarrollo del backend",
      "due_date": "2025-08-30",
      "priority": "alta",
      "completed": false,
      "list_id": 1,
      "created_at": "2025-08-29T10:00:00Z",
      "updated_at": "2025-08-29T10:00:00Z",
      "list_name": "Trabajo"
    }
  ]
}
```

### 2. Crear nueva tarea
```
POST /api/tasks
```
**Cuerpo de la petición:**
```json
{
  "title": "Nueva tarea",
  "description": "Descripción opcional",
  "due_date": "2025-08-30",
  "priority": "media",
  "list_id": 1
}
```

**Campos obligatorios:**
- `title`: Título de la tarea (string, no vacío)

**Campos opcionales:**
- `description`: Descripción de la tarea (string)
- `due_date`: Fecha límite (formato YYYY-MM-DD)
- `priority`: Prioridad (baja, media, alta) - por defecto: media
- `list_id`: ID de la lista de tareas (debe pertenecer al usuario)

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Tarea creada exitosamente",
  "data": { /* objeto de la tarea creada */ }
}
```

### 3. Actualizar tarea existente
```
PUT /api/tasks/:id
```
**Cuerpo de la petición (todos los campos son opcionales):**
```json
{
  "title": "Título actualizado",
  "description": "Nueva descripción",
  "due_date": "2025-08-31",
  "priority": "alta",
  "completed": true,
  "list_id": 2
}
```

**Validaciones:**
- Solo el propietario de la tarea puede actualizarla
- Si se proporciona `list_id`, debe pertenecer al usuario
- Si se proporciona `priority`, debe ser válida (baja, media, alta)
- Si se proporciona `title`, no puede estar vacío

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Tarea actualizada exitosamente",
  "data": { /* objeto de la tarea actualizada */ }
}
```

### 4. Eliminar tarea
```
DELETE /api/tasks/:id
```
**Validaciones:**
- Solo el propietario de la tarea puede eliminarla

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Tarea eliminada exitosamente"
}
```

## Endpoints Adicionales

### 5. Obtener estadísticas de tareas
```
GET /api/tasks/stats
```
**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "total_tasks": 10,
    "completed_tasks": 3,
    "pending_tasks": 7,
    "high_priority_pending": 2
  }
}
```

### 6. Obtener tareas por prioridad
```
GET /api/tasks/priority/:priority
```
**Parámetros:**
- `priority`: baja, media, alta

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [ /* array de tareas con la prioridad especificada */ ]
}
```

### 7. Obtener tareas vencidas
```
GET /api/tasks/overdue
```
**Descripción:** Retorna todas las tareas no completadas cuya fecha límite ya pasó.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [ /* array de tareas vencidas */ ]
}
```

## Códigos de Error

- **400 Bad Request:** Datos inválidos en la petición
- **401 Unauthorized:** Usuario no autenticado
- **403 Forbidden:** Usuario no tiene permisos para realizar la acción
- **404 Not Found:** Tarea no encontrada
- **500 Internal Server Error:** Error interno del servidor

## Estructura de Error
```json
{
  "success": false,
  "error": "Mensaje descriptivo del error"
}
```

## Notas de Seguridad
- Todas las operaciones verifican que el usuario sea propietario del recurso
- Las consultas a la base de datos usan parámetros preparados para prevenir SQL injection
- Los datos de entrada son validados antes de procesarse
- Solo se devuelven datos que pertenecen al usuario autenticado
