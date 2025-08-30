# TurifyTasks Frontend - Documentación de Autenticación

## 📋 Tabla de Contenidos
- [Resumen del Proyecto](#resumen-del-proyecto)
- [Estructura de Archivos](#estructura-de-archivos)
- [Páginas Implementadas](#páginas-implementadas)
- [Configuración y Setup](#configuración-y-setup)
- [Guía de Uso](#guía-de-uso)
- [Estilos y Diseño](#estilos-y-diseño)
- [API Integration](#api-integration)
- [Solución de Problemas](#solución-de-problemas)

## 🎯 Resumen del Proyecto

Este proyecto implementa el sistema de autenticación frontend para TurifyTasks, una aplicación de gestión de tareas. Incluye páginas de registro, login y dashboard con un diseño moderno y responsivo.

### ✨ Características Principales
- ✅ Sistema de registro de usuarios
- ✅ Sistema de inicio de sesión
- ✅ Dashboard básico con autenticación
- ✅ Diseño responsivo y moderno
- ✅ Manejo de errores y estados de carga
- ✅ Integración con backend (Express.js)
- ✅ CSS modular separado
- ✅ Configuración CORS adecuada

### 🛠️ Tecnologías Utilizadas
- **Framework**: Astro 5.13.4
- **Lenguaje**: JavaScript/HTML/CSS
- **Backend**: Node.js + Express.js
- **Base de Datos**: SQLite
- **Autenticación**: Sessions + bcrypt

## 📁 Estructura de Archivos

```
frontend/
├── src/
│   ├── pages/
│   │   ├── index.astro          # Página principal (redirige a login)
│   │   ├── login.astro          # Página de inicio de sesión
│   │   ├── register.astro       # Página de registro
│   │   └── dashboard.astro      # Dashboard principal
│   ├── styles/
│   │   ├── login.css           # Estilos para login
│   │   └── register.css        # Estilos para registro
│   └── scripts/
│       ├── login.js            # Lógica de login (no implementado)
│       └── register.js         # Lógica de registro (no implementado)
├── docs/
│   └── README.md              # Esta documentación
├── public/
│   └── favicon.svg            # Icono del sitio
├── package.json
├── astro.config.mjs
└── tsconfig.json
```

## 📄 Páginas Implementadas

### 1. 🏠 Página Principal (`/`)
- **Archivo**: `src/pages/index.astro`
- **Función**: Redirige automáticamente a `/login`
- **Acceso**: Público

### 2. 🔐 Página de Login (`/login`)
- **Archivo**: `src/pages/login.astro`
- **CSS**: `src/styles/login.css`
- **Función**: Autenticación de usuarios existentes
- **Campos**: Email, Contraseña
- **Redirección**: `/dashboard` (exitoso) o muestra error
- **Acceso**: Público

### 3. 📝 Página de Registro (`/register`)
- **Archivo**: `src/pages/register.astro`
- **CSS**: `src/styles/register.css`
- **Función**: Registro de nuevos usuarios
- **Campos**: Nombre de usuario, Email, Contraseña
- **Redirección**: `/login` (exitoso) o muestra error
- **Acceso**: Público

### 4. 📊 Dashboard (`/dashboard`)
- **Archivo**: `src/pages/dashboard.astro`
- **Función**: Página principal de la aplicación
- **Características**: 
  - Verificación de autenticación
  - Mostrar información del usuario
  - Cards para diferentes secciones de tareas
  - Botón de logout
- **Acceso**: Requiere autenticación

## ⚙️ Configuración y Setup

### Requisitos Previos
- Node.js 18+ instalado
- Backend de TurifyTasks ejecutándose en puerto 3000

### Instalación
```bash
# Navegar al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### Variables de Entorno
El frontend está configurado para conectarse a:
- **Backend URL**: `http://localhost:3000`
- **Frontend URL**: `http://localhost:4321`

### Configuración CORS
El backend debe estar configurado con:
```javascript
app.use(cors({
    origin: 'http://localhost:4321',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 🎨 Estilos y Diseño

### Paleta de Colores
- **Color Principal**: `#0c5a34` (Verde oscuro)
- **Color Secundario**: `#16a085` (Verde medio)
- **Fondo**: Gradiente `#f5f7fa` a `#c3cfe2`
- **Texto Primario**: `#374151`
- **Texto Secundario**: `#6b7280`

### Componentes de UI
- **Botones**: Bordes redondeados, efectos hover, estados de carga
- **Inputs**: Focus states, validación visual
- **Cards**: Sombras suaves, bordes redondeados
- **Mensajes**: Error (rojo), Éxito (verde), Info (azul)

### Responsive Design
- **Mobile First**: Diseño adaptable desde 320px
- **Breakpoints**: Automático con CSS Grid y Flexbox
- **Máximo ancho**: 400px para formularios

## 🔌 API Integration

### Endpoints Utilizados

#### 1. Registro de Usuario
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string", 
  "password": "string"
}

// Respuesta exitosa (201)
{
  "message": "Usuario registrado exitosamente"
}

// Respuesta de error (400/409)
{
  "error": "Mensaje de error"
}
```

#### 2. Inicio de Sesión
```javascript
POST /api/auth/login
Content-Type: application/json
credentials: include

{
  "email": "string",
  "password": "string"
}

// Respuesta exitosa (200)
{
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": number,
    "username": "string",
    "email": "string"
  }
}
```

#### 3. Verificación de Perfil
```javascript
GET /api/auth/profile
credentials: include

// Respuesta exitosa (200)
{
  "user": {
    "id": number,
    "username": "string", 
    "email": "string"
  }
}

// No autenticado (401)
{
  "error": "No autenticado"
}
```

#### 4. Logout
```javascript
POST /api/auth/logout
credentials: include

// Respuesta exitosa (200)
{
  "message": "Sesión cerrada correctamente"
}
```

### Manejo de Sesiones
- **Método**: Cookies de sesión HTTP-only
- **Duración**: 24 horas
- **Seguridad**: `httpOnly: true`, `secure: false` (desarrollo)

## 📱 Guía de Uso

### Flujo de Usuario Nuevo
1. Usuario visita la aplicación (`/`)
2. Es redirigido automáticamente a `/login`
3. Hace clic en "Regístrate aquí"
4. Completa el formulario de registro
5. Es redirigido a `/login` con mensaje de éxito
6. Inicia sesión con sus credenciales
7. Es redirigido a `/dashboard`

### Flujo de Usuario Existente
1. Usuario visita `/login`
2. Ingresa email y contraseña
3. Sistema valida credenciales
4. Usuario es redirigido a `/dashboard`
5. Puede cerrar sesión desde el dashboard

### Características de UX
- **Loading States**: Indicadores visuales durante peticiones
- **Mensajes de Error**: Feedback claro y específico
- **Validación**: Campos requeridos y formatos
- **Redirecciones**: Flujo lógico entre páginas
- **Persistencia**: Sesión mantenida en cookies

## 🔧 Solución de Problemas

### Errores Comunes

#### 1. Error CORS
```
Access to fetch has been blocked by CORS policy
```
**Solución**: Verificar configuración CORS en backend con `origin` específico y `credentials: true`

#### 2. Error de Conexión
```
Failed to fetch / Error de conexión
```
**Solución**: 
- Verificar que el backend esté ejecutándose en puerto 3000
- Confirmar que no hay conflictos de puertos

#### 3. Campos Obligatorios Faltantes
```
Faltan campos obligatorios
```
**Solución**: 
- Verificar que todos los campos requeridos estén siendo enviados
- Para registro: username, email, password son obligatorios

#### 4. Usuario ya Existe
```
El email o usuario ya está registrado
```
**Solución**: Usar credenciales diferentes o iniciar sesión con cuenta existente

### Debug y Desarrollo
- **Consola del navegador**: Revisar logs de red y errores JavaScript
- **Network tab**: Verificar peticiones HTTP y respuestas
- **Backend logs**: Revisar logs del servidor para errores de servidor
- **Base de datos**: Verificar registros en SQLite si es necesario

### Performance Tips
- **Carga de CSS**: Archivos CSS externos se cachean mejor
- **Validación**: Validación del lado cliente mejora UX
- **Estados de carga**: Previenen múltiples submits accidentales

## 📝 Notas de Desarrollo

### Próximas Mejoras
- [ ] Implementar archivos JavaScript externos
- [ ] Agregar validación avanzada de formularios
- [ ] Implementar "Recordar sesión"
- [ ] Agregar recuperación de contraseña
- [ ] Mejorar accesibilidad (ARIA labels)
- [ ] Agregar tests unitarios

### Estructura Modular
El proyecto está diseñado para ser escalable:
- **CSS separado**: Fácil mantenimiento y reutilización
- **JavaScript modular**: Preparado para componentización
- **API centralizada**: Fácil cambio de endpoints

---

## 👥 Contribuciones

**Desarrollado por**: Equipo TurifyTasks  
**Fecha**: Agosto 2025  
**Versión**: 1.0.0  
**Framework**: Astro 5.13.4  

Para contribuir a este proyecto, seguir las mejores prácticas de código y mantener la documentación actualizada.
