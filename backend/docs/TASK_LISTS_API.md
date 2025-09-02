# Task Lists API Documentation

Esta documentación describe los endpoints disponibles para gestionar las listas de tareas en TurifyTasks.

## Base URL
```
http://localhost:3000/api/task-lists
```

## Autenticación
Todos los endpoints requieren autenticación. El usuario debe estar logueado y tener una sesión válida.

## Endpoints

### GET /api/task-lists
Obtiene todas las listas de tareas del usuario autenticado.

**Respuesta exitosa (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Trabajo",
            "description": "Tareas relacionadas con el trabajo",
            "created_at": "2024-01-15T10:30:00Z",
            "updated_at": "2024-01-15T10:30:00Z",
            "task_count": 5
        }
    ]
}
```

### GET /api/task-lists/:id
Obtiene una lista de tareas específica por su ID.

**Parámetros:**
- `id` (number): ID de la lista de tareas

**Respuesta exitosa (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Trabajo",
        "description": "Tareas relacionadas con el trabajo",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z",
        "task_count": 5
    }
}
```

**Errores:**
- `404`: Lista no encontrada o no pertenece al usuario

### POST /api/task-lists
Crea una nueva lista de tareas.

**Body:**
```json
{
    "name": "Mi nueva lista",
    "description": "Descripción opcional de la lista"
}
```

**Campos:**
- `name` (string, requerido): Nombre de la lista (no debe estar duplicado para el usuario)
- `description` (string, opcional): Descripción de la lista

**Respuesta exitosa (201):**
```json
{
    "success": true,
    "message": "Lista de tareas creada exitosamente",
    "data": {
        "id": 2,
        "name": "Mi nueva lista",
        "description": "Descripción opcional de la lista",
        "created_at": "2024-01-15T11:00:00Z",
        "updated_at": "2024-01-15T11:00:00Z",
        "task_count": 0
    }
}
```

**Errores:**
- `400`: Nombre requerido o vacío
- `409`: Ya existe una lista con ese nombre para el usuario

### PUT /api/task-lists/:id
Actualiza una lista de tareas existente.

**Parámetros:**
- `id` (number): ID de la lista de tareas a actualizar

**Body:**
```json
{
    "name": "Nombre actualizado",
    "description": "Nueva descripción"
}
```

**Campos:**
- `name` (string, opcional): Nuevo nombre de la lista
- `description` (string, opcional): Nueva descripción de la lista

**Respuesta exitosa (200):**
```json
{
    "success": true,
    "message": "Lista de tareas actualizada exitosamente",
    "data": {
        "id": 1,
        "name": "Nombre actualizado",
        "description": "Nueva descripción",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T11:30:00Z",
        "task_count": 5
    }
}
```

**Errores:**
- `400`: No se proporcionaron campos para actualizar
- `404`: Lista no encontrada o no pertenece al usuario
- `409`: Ya existe otra lista con ese nombre para el usuario

### DELETE /api/task-lists/:id
Elimina una lista de tareas y todas las tareas asociadas.

**Parámetros:**
- `id` (number): ID de la lista de tareas a eliminar

**Respuesta exitosa (200):**
```json
{
    "success": true,
    "message": "Lista de tareas eliminada exitosamente junto con 3 tarea(s) asociada(s)",
    "deleted_tasks": 3
}
```

**Errores:**
- `404`: Lista no encontrada o no pertenece al usuario

### GET /api/task-lists/:id/tasks
Obtiene todas las tareas de una lista específica.

**Parámetros:**
- `id` (number): ID de la lista de tareas

**Respuesta exitosa (200):**
```json
{
    "success": true,
    "data": {
        "list": {
            "id": 1,
            "name": "Trabajo"
        },
        "tasks": [
            {
                "id": 1,
                "title": "Completar proyecto",
                "description": "Finalizar el desarrollo del proyecto X",
                "due_date": "2024-01-20",
                "priority": "alta",
                "completed": false,
                "list_id": 1,
                "created_at": "2024-01-15T10:30:00Z",
                "updated_at": "2024-01-15T10:30:00Z"
            }
        ]
    }
}
```

**Errores:**
- `404`: Lista no encontrada o no pertenece al usuario

## Integración con Tasks API

Las listas de tareas se integran con la API de tareas existente:

### Al crear una tarea (POST /api/tasks)
Se puede incluir el campo `list_id` para asignar la tarea a una lista:

```json
{
    "title": "Nueva tarea",
    "description": "Descripción de la tarea",
    "priority": "media",
    "list_id": 1
}
```

### Al actualizar una tarea (PUT /api/tasks/:id)
Se puede cambiar la lista de una tarea incluyendo `list_id`:

```json
{
    "list_id": 2
}
```

### Al obtener tareas (GET /api/tasks)
Las tareas ahora incluyen información de la lista:

```json
{
    "id": 1,
    "title": "Mi tarea",
    "description": "Descripción",
    "due_date": "2024-01-20",
    "priority": "media",
    "completed": false,
    "list_id": 1,
    "list_name": "Trabajo",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
}
```

## Códigos de Estado HTTP

- `200`: Operación exitosa
- `201`: Recurso creado exitosamente
- `400`: Error en los datos enviados
- `401`: No autenticado
- `404`: Recurso no encontrado
- `409`: Conflicto (por ejemplo, nombre duplicado)
- `500`: Error interno del servidor

## Notas de Seguridad

- Todas las consultas SQL utilizan parámetros para prevenir inyección SQL
- Los usuarios solo pueden acceder a sus propias listas de tareas
- La validación de permisos se realiza en cada endpoint
- Las eliminaciones en cascada están configuradas en la base de datos
