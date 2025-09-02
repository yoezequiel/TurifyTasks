# TurifyTasks Frontend - Documentación Completa

## 📋 Tabla de Contenidos
- [Resumen del Proyecto](#resumen-del-proyecto)
- [Estructura de Archivos](#estructura-de-archivos)
- [Páginas Implementadas](#páginas-implementadas)
- [Funcionalidades Responsive](#funcionalidades-responsive)
- [Configuración y Setup](#configuración-y-setup)
- [Guía de Uso](#guía-de-uso)
- [Estilos y Diseño](#estilos-y-diseño)
- [API Integration](#api-integration)
- [Solución de Problemas](#solución-de-problemas)

## 🎯 Resumen del Proyecto

Este proyecto implementa el sistema completo frontend para TurifyTasks, una aplicación de gestión de tareas con enfoque mobile-first. Incluye autenticación completa, dashboard funcional y navegación responsive.

### ✨ Características Principales
- ✅ Sistema de registro y autenticación completo
- ✅ Dashboard híbrido con gestión de tareas CRUD
- ✅ **Menú hamburguesa mobile-first con animaciones**
- ✅ **Sidebar responsive que se convierte en menú deslizable**
- ✅ **Navegación optimizada para móvil, tablet y desktop**
- ✅ **Header optimizado sin márgenes laterales**
- ✅ **Visualización de username en lugar de email**
- ✅ Toggle de contraseña y validación en tiempo real
- ✅ Diseño responsive y moderno
- ✅ Manejo de errores y estados de carga
- ✅ Integración completa con backend
- ✅ Arquitectura modular y escalable

### 🛠️ Tecnologías Utilizadas
- **Framework**: Astro 5.13.4
- **Lenguaje**: JavaScript/TypeScript/HTML/CSS
- **Backend**: Node.js + Express.js
- **Base de Datos**: SQLite
- **Autenticación**: Sessions + bcrypt
- **Responsive**: Mobile-first CSS + Media Queries

## 📁 Estructura de Archivos

```
frontend/
├── src/
│   ├── pages/
│   │   ├── index.astro          # Página principal (redirige a login)
│   │   ├── login.astro          # Página de inicio de sesión
│   │   ├── register.astro       # Página de registro
│   │   └── dashboard.astro      # Dashboard principal híbrido
│   ├── components/
│   │   ├── TaskForm.astro       # Formulario modal de tareas
│   │   ├── TaskList.astro       # Lista de tareas
│   │   └── TaskItem.astro       # Item individual de tarea
│   ├── styles/
│   │   ├── login.css           # Estilos para login
│   │   ├── register.css        # Estilos para registro
│   │   ├── dashboard.css       # Estilos del dashboard
│   │   └── components/
│   │       └── Dashboard.css   # Estilos principales del dashboard
│   ├── scripts/
│   │   ├── auth.js            # Funciones de autenticación
│   │   ├── tasks.js           # Gestión de tareas
│   │   ├── dashboard.js       # Orquestación del dashboard
│   │   ├── hamburger.js       # **NUEVO: Funcionalidad menú hamburguesa**
│   │   └── ui.js             # Componentes de interfaz
│   └── types/
│       └── window.d.ts        # Declaraciones TypeScript globales
├── docs/
│   ├── README.md              # Esta documentación
│   ├── CHANGELOG.md           # Historial de cambios detallado
│   ├── STYLES.md             # Guía de estilos
│   └── TECHNICAL.md          # Documentación técnica
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
- **Campos**: Email, Contraseña (con toggle show/hide)
- **Validación**: 
  - Email formato válido
  - Contraseña mínimo 6 caracteres
  - Mensajes de error específicos debajo de cada campo
- **Estados Visuales**: Campos con borde rojo cuando hay errores
- **Redirección**: `/dashboard` (exitoso) o muestra error
- **Acceso**: Público

### 3. 📝 Página de Registro (`/register`)
- **Archivo**: `src/pages/register.astro`
- **CSS**: `src/styles/register.css`
- **Función**: Registro de nuevos usuarios
- **Campos**: Nombre de usuario, Email, Contraseña (con toggle show/hide)
- **Validación**: 
  - Username: mínimo 3 caracteres, solo alfanuméricos y guiones bajos
  - Email: formato válido
  - Contraseña: mínimo 6 caracteres
  - Mensajes de error específicos debajo de cada campo
- **Estados Visuales**: Campos con borde rojo cuando hay errores
- **Redirección**: `/login` (exitoso) o muestra error
- **Acceso**: Público

### 4. 📊 Dashboard (`/dashboard`)
- **Archivo**: `src/pages/dashboard.astro`
- **CSS**: `src/styles/components/Dashboard.css`
- **Scripts**: `src/scripts/dashboard.js`, `src/scripts/hamburger.js`
- **Función**: Página principal con gestión completa de tareas
- **Características**: 
  - Sistema CRUD completo de tareas
  - Sidebar con filtros (Inbox, Hoy, Próximas, Importantes, Completadas)
  - **Menú hamburguesa responsive para móvil**
  - **Header optimizado sin márgenes laterales**
  - **Visualización de username en lugar de email**
  - Formulario modal para crear/editar tareas
  - Contadores dinámicos en tiempo real
  - Sistema de notificaciones toast
- **Acceso**: Requiere autenticación

## 📱 Funcionalidades Responsive

### 🎯 Menú Hamburguesa Mobile-First

#### Características del Menú Hamburguesa
- **Activación**: Visible solo en dispositivos ≤768px
- **Posición**: Esquina superior izquierda del header
- **Animación**: Transformación de hamburguesa (☰) a X al abrir
- **Función**: Abre/cierra el sidebar en dispositivos móviles

#### Estados del Botón
```css
/* Estado normal - 3 líneas horizontales */
.hamburger-line {
  width: 20px;
  height: 2px;
  background: var(--foreground);
  transition: all 0.3s ease;
}

/* Estado activo - forma de X */
.hamburger-active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(4px, 4px);
}
.hamburger-active .hamburger-line:nth-child(2) {
  opacity: 0;
}
.hamburger-active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(4px, -4px);
}
```

### 🗂️ Sidebar Responsive

#### Comportamiento por Dispositivo
- **Desktop (>768px)**: Sidebar siempre visible en layout de grid
- **Mobile/Tablet (≤768px)**: Sidebar oculto, accesible via hamburguesa

#### Estados del Sidebar Móvil
```css
/* Estado cerrado */
.sidebar {
  transform: translateX(-100%);
  position: fixed;
  z-index: 50;
}

/* Estado abierto */
.sidebar.sidebar-open {
  transform: translateX(0);
}
```

### 🌓 Overlay de Fondo
- **Función**: Oscurece el contenido principal cuando el sidebar está abierto
- **Interacción**: Click para cerrar el menú
- **Estilos**: `background: rgba(0, 0, 0, 0.5)`

### ⌨️ Funcionalidades de Teclado y UX
- **Tecla Escape**: Cierra el sidebar automáticamente
- **Resize Window**: Auto-cierre al cambiar a desktop (>768px)
- **Body Scroll**: Bloqueado cuando sidebar está abierto en móvil
- **Focus Management**: Manejo apropiado del foco para accesibilidad

### 📐 Responsive Breakpoints

#### Mobile (≤768px)
```css
@media (max-width: 768px) {
  .hamburger-btn { display: flex; }
  .sidebar { 
    position: fixed;
    transform: translateX(-100%);
  }
  .main-content { padding: 1rem; }
  .user-info span { display: none; } /* Oculta email */
}
```

#### Tablet (769px - 1024px)
```css
@media (min-width: 769px) and (max-width: 1024px) {
  .header-content { padding: 0.75rem 1.5rem; }
  .main-content { padding: 1.5rem; }
}
```

#### Desktop (≥1025px)
```css
@media (min-width: 1025px) {
  .dashboard-layout { 
    grid-template-columns: 280px 1fr; 
  }
  .sidebar { 
    position: static;
    transform: none;
  }
}
```

### 🎨 Optimizaciones de Header

#### Antes vs Después
```css
/* ANTES - Problemas */
.header-content {
  max-width: 20px;    /* ❌ Muy pequeño */
  padding: 5px;       /* ❌ Padding mínimo */
  margin: 0;
}

/* DESPUÉS - Optimizado */
.header-content {
  width: 100%;        /* ✅ Ancho completo */
  padding: 16px 20px; /* ✅ Padding apropiado */
  margin: 0;
}
```

#### Mejoras Implementadas
- ✅ **Eliminación de márgenes laterales excesivos**
- ✅ **Header ocupa 100% del ancho disponible**
- ✅ **Padding interno optimizado para mejor espaciado**
- ✅ **Responsive con diferentes paddings por dispositivo**

### 🧩 Arquitectura del Script Hamburguesa

#### Estructura Modular (`hamburger.js`)
```javascript
// Función principal exportable
export function initHamburgerMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  // Verificación de elementos DOM
  if (!hamburgerBtn || !sidebar || !overlay) {
    console.warn('Elementos del menú hamburguesa no encontrados');
    return;
  }
  
  // Event listeners y funcionalidades...
}

// Auto-inicialización
document.addEventListener('DOMContentLoaded', initHamburgerMenu);
```

#### Integración en Dashboard
```astro
<!-- En dashboard.astro -->
<script type="module" src="/src/scripts/hamburger.js"></script>
```

### 🔧 Funcionalidades JavaScript

#### Toggle del Sidebar
```javascript
function toggleSidebar() {
  const isOpen = sidebar.classList.contains('sidebar-open');
  
  if (isOpen) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

function openSidebar() {
  sidebar.classList.add('sidebar-open');
  overlay.classList.add('overlay-active');
  hamburgerBtn.classList.add('hamburger-active');
  document.body.style.overflow = 'hidden'; // Bloquea scroll
}

function closeSidebar() {
  sidebar.classList.remove('sidebar-open');
  overlay.classList.remove('overlay-active');
  hamburgerBtn.classList.remove('hamburger-active');
  document.body.style.overflow = ''; // Restaura scroll
}
```

#### Event Listeners
```javascript
// Click en hamburguesa
hamburgerBtn.addEventListener('click', toggleSidebar);

// Click en overlay para cerrar
overlay.addEventListener('click', closeSidebar);

// Tecla Escape para cerrar
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && sidebar.classList.contains('sidebar-open')) {
    closeSidebar();
  }
});

// Auto-cierre en resize a desktop
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    closeSidebar();
  }
});
```

### 📊 Métricas de Performance Responsive
- **Animaciones**: Utilizan `transform` y `opacity` para mejor performance
- **GPU Acceleration**: `translateX()` activa aceleración por hardware
- **Tiempo de animación**: 0.3s para balance entre fluidez y velocidad
- **Bundle size**: +2KB por funcionalidad hamburguesa (mínimo impacto)
- **JavaScript**: Event delegation para mejor performance

### 🎯 Mejoras de UX/UI

#### Visualización de Usuario Mejorada
- **Antes**: Mostraba email del usuario
- **Después**: Muestra username del usuario
- **Avatar**: Primera letra del username en lugar del email
- **Beneficio**: Más personal y user-friendly

#### Navegación Intuitiva
- **Indicadores visuales**: Estados claros de abierto/cerrado
- **Feedback táctil**: Animaciones que guían la interacción
- **Accesibilidad**: Aria-labels y navegación por teclado
- **Consistencia**: Mismo comportamiento en todos los dispositivos móviles

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

## ✅ Sistema de Validación

### Funcionalidades de Validación en Tiempo Real

#### 🔍 Toggle de Contraseña
- **Ubicación**: Campos de contraseña en login y registro
- **Funcionalidad**: Botón de "ojito" para mostrar/ocultar contraseña
- **Iconos**: SVG de eye/eye-off que cambian dinámicamente
- **Styling**: Posicionado absolutamente dentro del input
- **Interacción**: Hover effects con color de marca

#### ⚡ Validación Automática
- **Trigger**: Evento `blur` (al salir del campo)
- **Feedback**: Mensajes específicos aparecen debajo del campo
- **Visual**: Bordes rojos y fondo rosa claro en campos inválidos
- **Prevención**: No permite envío con datos inválidos

#### 📋 Reglas de Validación

**Login (`/login`)**:
- **Email**: 
  - Formato válido (usuario@dominio.com)
  - Mensaje: "Por favor ingresa un correo electrónico válido"
- **Contraseña**: 
  - Obligatoria y mínimo 6 caracteres
  - Mensaje: "La contraseña debe tener al menos 6 caracteres"

**Registro (`/register`)**:
- **Username**: 
  - Mínimo 3 caracteres
  - Solo letras, números y guiones bajos (regex: `/^[a-zA-Z0-9_]+$/`)
  - Mensaje: "El nombre de usuario debe tener al menos 3 caracteres"
- **Email**: 
  - Formato válido con regex completo
  - Mensaje: "Por favor ingresa un correo electrónico válido"
- **Contraseña**: 
  - Mínimo 6 caracteres
  - Mensaje: "La contraseña debe tener al menos 6 caracteres"

#### 🎨 Estados Visuales
```css
/* Campo con error */
.form-input.error {
    border-color: #dc2626;
    background: #fef2f2;
}

/* Mensaje de error */
.field-error {
    color: #dc2626;
    font-size: 12px;
    margin-top: 4px;
}

/* Toggle de contraseña */
.password-toggle:hover {
    color: #0c5a34;
}
```

#### 🔧 Funciones JavaScript
```javascript
// Validación de email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : 'Mensaje de error';
}

// Validación de username
function validateUsername(username) {
    if (username.length < 3) return 'Mínimo 3 caracteres';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Solo alfanuméricos';
    return null;
}

// Mostrar/ocultar errores
function showFieldError(fieldId, message) {
    const errorDiv = document.getElementById(fieldId + 'Error');
    const inputField = document.getElementById(fieldId);
    // Lógica de mostrar error
}
```

#### 📱 Experiencia de Usuario
1. **Usuario escribe en campo**
2. **Sale del campo (blur)** → Validación automática
3. **Error encontrado** → Mensaje específico aparece
4. **Campo se marca** → Borde rojo y fondo rosa
5. **Usuario corrige** → Error desaparece automáticamente
6. **Envío de formulario** → Validación final antes de submit
7. **Loading state** → Spinner limpio sin texto
8. **Éxito** → Mensaje breve y redirección rápida

### Mensajes de Backend Actualizados
- **Antes**: "Credenciales inválidas"
- **Ahora**: "Correo o contraseña incorrectos"
- **Beneficio**: Mensajes más user-friendly y comprensibles

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
