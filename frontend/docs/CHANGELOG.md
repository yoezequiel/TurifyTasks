# Changelog - TurifyTasks Frontend

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-08-30

### ✨ Added - Nuevas Funcionalidades
- **Toggle de Contraseña (Show/Hide Password)**
  - Botón de "ojito" en campos de contraseña
  - Iconos SVG de eye/eye-off con transiciones suaves
  - Funcionalidad en páginas de login y registro
  - Posicionamiento absoluto dentro del input

- **Validación en Tiempo Real**
  - Validación automática al salir de cada campo (blur event)
  - Mensajes de error específicos debajo de cada input
  - Validación completa antes del envío del formulario
  - Prevención de envíos con datos inválidos

- **Mejores Mensajes de Error**
  - Mensajes contextuales por cada campo
  - Retroalimentación visual con bordes rojos
  - Texto de error específico y claro
  - Estados de error persistentes hasta corrección

### 🎨 Styling - Mejoras de Diseño
- **Estados de Error Visual**
  - Bordes rojos en campos inválidos (`border-color: #dc2626`)
  - Fondo rosa claro en inputs con error (`background: #fef2f2`)
  - Texto de error en rojo con tamaño pequeño (12px)
  - Transiciones suaves entre estados

- **Toggle de Contraseña**
  - Contenedor relativo para posicionamiento
  - Padding derecho ajustado en inputs (50px)
  - Botón hover con color de marca (`#0c5a34`)
  - Iconos SVG con stroke consistente

- **Loading States Mejorados**
  - Spinner único sin texto para carga más limpia
  - Centrado perfecto con flexbox
  - Animación de rotación suave
  - Estados disabled apropiados

### 🔧 Technical - Mejoras Técnicas
- **Validación JavaScript**
  - Función `validateUsername()`: mínimo 3 caracteres, solo alfanuméricos y guiones bajos
  - Función `validateEmail()`: regex completo para formato de email
  - Función `validatePassword()`: mínimo 6 caracteres en login y registro
  - Sistema modular de mostrar/ocultar errores

- **Event Listeners**
  - Validación en evento `blur` para cada campo
  - Toggle de contraseña en evento `click`
  - Prevención de envío con validación fallida
  - Gestión de estados de formulario

- **Mensajes de Backend Actualizados**
  - Cambio de "Credenciales inválidas" a "Correo o contraseña incorrectos"
  - Mensajes más user-friendly y comprensibles
  - Consistencia entre frontend y backend

### 📱 UX/UI Improvements - Mejoras de Experiencia
- **Retroalimentación Inmediata**
  - Validación instantánea al cambiar de campo
  - Mensajes de error claros y específicos
  - Estados visuales de éxito y error

- **Accesibilidad**
  - Mensajes de error asociados a sus campos
  - Contraste apropiado en estados de error
  - Botones con áreas de toque adecuadas

- **Flujo de Usuario Optimizado**
  - Redirección más rápida tras registro/login (1-1.5s)
  - Mensajes de éxito sin "Redirigiendo..."
  - Loading states más profesionales

### 🛠️ Code Quality - Calidad de Código
- **Funciones Modulares**
  - Separación de lógica de validación
  - Funciones reutilizables para manejo de errores
  - Código más mantenible y testeable

- **CSS Organizado**
  - Nuevas clases para estados de error
  - Posicionamiento consistente
  - Variables implícitas para colores de error

### 📋 Validation Rules - Reglas de Validación

#### Registro (`/register`)
- **Username**: 
  - Mínimo 3 caracteres
  - Solo letras, números y guiones bajos
  - Mensaje: "El nombre de usuario debe tener al menos 3 caracteres"
- **Email**:
  - Formato válido (usuario@dominio.com)
  - Mensaje: "Por favor ingresa un correo electrónico válido"
- **Password**:
  - Mínimo 6 caracteres
  - Mensaje: "La contraseña debe tener al menos 6 caracteres"

#### Login (`/login`)
- **Email**:
  - Formato válido
  - Mensaje: "Por favor ingresa un correo electrónico válido"
- **Password**:
  - Obligatorio
  - Mínimo 6 caracteres
  - Mensaje: "La contraseña debe tener al menos 6 caracteres"

## [1.0.0] - 2025-08-30

### ✨ Added - Nuevas Funcionalidades
- **Sistema de Autenticación Completo**
  - Página de registro de usuarios (`/register`)
  - Página de inicio de sesión (`/login`)
  - Dashboard protegido (`/dashboard`)
  - Redirección automática desde página principal (`/`)

- **Gestión de Sesiones**
  - Integración con cookies de sesión HTTP-only
  - Verificación automática de autenticación en dashboard
  - Funcionalidad de logout con limpieza de sesión

- **Interfaz de Usuario**
  - Diseño moderno y responsivo
  - Estados de carga (loading states) en formularios
  - Mensajes de error y éxito contextuales
  - Efectos hover y transiciones suaves

- **Validación de Formularios**
  - Validación HTML5 nativa
  - Campos requeridos y longitud mínima
  - Feedback visual en tiempo real

### 🎨 Styling - Diseño
- **Sistema de Colores**
  - Color principal: `#0c5a34` (verde oscuro TurifyTasks)
  - Color secundario: `#16a085` (verde medio)
  - Paleta completa de estados (éxito, error, neutro)

- **Tipografía**
  - Font stack: Apple System fonts para consistencia multiplataforma
  - Jerarquía tipográfica clara (títulos, subtítulos, texto)
  - Pesos tipográficos apropiados (400, 500, 600)

- **Layout Responsivo**
  - Mobile-first approach
  - Contenedores con ancho máximo 400px
  - Espaciado consistente basado en sistema de 8px

- **Componentes UI**
  - Botones con estados hover, active y disabled
  - Inputs con focus states y transiciones
  - Cards con sombras y bordes redondeados
  - Spinners de carga animados

### 📁 Architecture - Arquitectura
- **Separación de Concerns**
  - CSS extraído a archivos independientes (`/src/styles/`)
  - Archivos JavaScript modulares preparados (`/src/scripts/`)
  - Estructura de directorios escalable

- **Archivos CSS Modulares**
  - `src/styles/login.css` - Estilos específicos para login
  - `src/styles/register.css` - Estilos específicos para registro
  - CSS reutilizable y mantenible

- **Documentación Completa**
  - `/docs/README.md` - Documentación principal
  - `/docs/STYLES.md` - Guía de estilos y diseño
  - `/docs/API.md` - Documentación de integración API
  - `/docs/CHANGELOG.md` - Este archivo de cambios

### 🔌 Integration - Integración
- **API Backend**
  - Conexión con backend Express.js en puerto 3000
  - Endpoints implementados: `/register`, `/login`, `/profile`, `/logout`
  - Manejo de errores HTTP y de red

- **CORS Configuration**
  - Configuración específica para desarrollo local
  - Soporte para cookies de sesión (`credentials: include`)
  - Headers permitidos para API calls

- **Error Handling**
  - Try-catch blocks en todas las peticiones
  - Mensajes de error específicos y amigables
  - Fallbacks para errores de conexión

### 🔧 Technical - Aspectos Técnicos
- **Astro Framework**
  - Configuración base de Astro 5.13.4
  - Estructura de páginas estática
  - Hot reload para desarrollo

- **JavaScript Features**
  - ES6+ syntax (async/await, destructuring)
  - DOM manipulation moderna
  - Fetch API para HTTP requests
  - LocalStorage para almacenamiento opcional

- **CSS Features**
  - CSS Grid y Flexbox para layouts
  - Custom properties (variables CSS) preparadas
  - Animaciones CSS con keyframes
  - Transiciones suaves para microinteracciones

### 🛠️ Development Setup
- **Configuración de Desarrollo**
  - Scripts npm configurados (`dev`, `build`, `preview`)
  - Estructura de directorios organizada
  - Archivos de configuración (tsconfig.json, astro.config.mjs)

- **Compatibilidad Cross-browser**
  - Prefijos de vendor cuando necesarios
  - Font stack compatible
  - CSS reset básico implementado

### 🔒 Security - Seguridad
- **Autenticación Segura**
  - Passwords hasheadas con bcrypt (backend)
  - Cookies HTTP-only para sesiones
  - No exposición de información sensible en frontend

- **Input Validation**
  - Validación de email format
  - Longitud mínima de contraseñas
  - Sanitización básica de inputs

- **CORS Policy**
  - Origen específico (no wildcard) con credentials
  - Headers permitidos definidos explícitamente
  - Métodos HTTP específicos

## [0.0.1] - 2025-08-30 (Initial Setup)

### Added
- Configuración inicial del proyecto Astro
- Estructura básica de directorios
- Archivo package.json con dependencias
- Configuración TypeScript básica

---

## 🔮 Próximas Versiones Planificadas

### [1.1.0] - Próxima iteración
- [ ] Implementación de archivos JavaScript externos
- [ ] Mejoras en validación de formularios
- [ ] Configuración de variables de entorno
- [ ] Optimizaciones de rendimiento

### [1.2.0] - Funcionalidades avanzadas
- [ ] "Recordar sesión" checkbox
- [ ] Recuperación de contraseña
- [ ] Perfil de usuario editable
- [ ] Configuraciones de cuenta

### [2.0.0] - Expansión mayor
- [ ] Dashboard funcional completo
- [ ] Gestión de tareas integrada
- [ ] Notificaciones en tiempo real
- [ ] Tema oscuro/claro

---

## 📋 Notas de Versión

### Compatibilidad
- **Node.js**: 18.0.0+
- **Navegadores**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Backend**: TurifyTasks Backend v1.0.0+

### Breaking Changes
- Ninguno en esta versión inicial

### Deprecations
- Ninguna en esta versión

### Known Issues
- TypeScript errors en archivos .astro (normales en desarrollo)
- CSS podría beneficiarse de custom properties para mejor mantenibilidad

### Performance Notes
- Tiempo de carga inicial: <2s en conexión rápida
- Tamaño de bundle CSS: ~8KB sin comprimir
- JavaScript inline: ~3KB por página

---

**Mantenido por**: Equipo TurifyTasks  
**Última actualización**: Agosto 30, 2025  
**Siguiente revisión**: Primera semana de Septiembre 2025
