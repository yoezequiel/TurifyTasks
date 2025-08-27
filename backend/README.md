# Backend API

API backend construida con Express.js y Turso (SQLite).

## Instalación

```bash
npm install
```

## Configuración

1. Copia el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

2. Configura las variables de entorno en el archivo `.env`:
- `PORT`: Puerto del servidor (por defecto 3000)
- `NODE_ENV`: Entorno de ejecución (development/production)
- `TURSO_DATABASE_URL`: URL de tu base de datos Turso
- `TURSO_AUTH_TOKEN`: Token de autenticación de Turso

## Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## Endpoints de Health Check

### GET /api/health
Endpoint principal de verificación de salud que incluye:
- Estado general del servicio
- Información del sistema (memoria, CPU, uptime)
- Estado de la base de datos
- Tiempo de respuesta

**Respuesta exitosa (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "responseTime": "15ms",
  "service": {
    "name": "Backend API",
    "version": "1.0.0",
    "uptime": 3600,
    "memory": {
      "used": 45.2,
      "total": 128.5,
      "external": 2.1
    },
    "environment": "development",
    "nodeVersion": "v18.17.0",
    "platform": "linux"
  },
  "database": {
    "status": "connected",
    "responseTime": "8ms",
    "type": "Turso SQLite",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
```

### GET /api/health/ready
Endpoint de readiness para contenedores (Kubernetes/Docker).

**Respuesta exitosa (200):**
```json
{
  "status": "ready",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "checks": {
    "database": "connected"
  }
}
```

### GET /api/health/live
Endpoint de liveness para contenedores.

**Respuesta exitosa (200):**
```json
{
  "status": "alive",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600
}
```

## Estructura del proyecto

```
backend/
├── routes/
│   └── health.js          # Rutas de health check
├── services/
│   └── healthService.js   # Lógica de verificación de salud
├── db.js                  # Configuración de base de datos
├── server.js              # Servidor principal
├── package.json
├── .env.example
└── README.md
```

## Buenas prácticas implementadas

- ✅ Separación de responsabilidades (rutas, servicios, configuración)
- ✅ Manejo de errores centralizado
- ✅ Variables de entorno para configuración
- ✅ Health checks completos (health, readiness, liveness)
- ✅ Logging de errores
- ✅ Respuestas JSON consistentes
- ✅ Códigos de estado HTTP apropiados
- ✅ Documentación de API