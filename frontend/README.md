# TurifyTasks Frontend

Sistema de autenticación frontend para TurifyTasks - Una aplicación moderna de gestión de tareas construida con Astro.

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# El frontend estará disponible en http://localhost:4321
```

## � Prerequisitos

-   **Node.js** 18.0.0 o superior
-   **Backend TurifyTasks** ejecutándose en puerto 3000
-   **Navegador moderno** (Chrome 90+, Firefox 88+, Safari 14+)

## 🎯 Funcionalidades

### 🔐 Autenticación y Seguridad

-   ✅ **Registro de usuarios** - Formulario completo con validación
-   ✅ **Inicio de sesión** - Autenticación segura con sesiones
-   ✅ **Dashboard protegido** - Acceso solo para usuarios autenticados

### 📋 Gestión de Tareas

-   ✅ **CRUD completo** - Crear, leer, actualizar y eliminar tareas
-   ✅ **Sistema de filtros** - Inbox, Hoy, Próximas, Importantes, Completadas
-   ✅ **Toggle de completado** - Marcar tareas como completadas/pendientes
-   ✅ **Prioridades** - Sistema de alta, media y baja prioridad

### 📅 Sistema de Fechas Límite

-   ✅ **Fechas límite visuales** - Indicadores de tiempo restante con colores
-   ✅ **Estados de urgencia** - Hoy, Mañana, Esta semana, Vencidas, Futuras
-   ✅ **Iconos contextuales** - 🔥 Hoy, ⏰ Mañana, ⚠️ Vencidas
-   ✅ **Animaciones** - Pulso para tareas críticas y vencidas
-   ✅ **Filtro de vencidas** - Apartado específico para tareas vencidas
-   ✅ **Exclusión automática** - Las vencidas no aparecen en Inbox
-   ✅ **Normalización de fechas** - Consistencia entre formulario y visualización

### 📝 Sistema de Validación de Texto (Nuevo)

-   ✅ **Límites de caracteres** - Título y descripción: 120 caracteres máximo
-   ✅ **Contadores dinámicos** - Visualización en tiempo real (ej: 45/120)
-   ✅ **Validación visual** - Colores progresivos: gris → amarillo → rojo
-   ✅ **Prevención de errores** - No permite envío si excede límites
-   ✅ **Mensajes específicos** - Errores claros y contextuales

### 📱 Truncado Responsive Inteligente (Nuevo)

-   ✅ **Adaptación automática** - Texto completo en pantallas >1500px
-   ✅ **Truncado optimizado** - 20 caracteres + "..." en pantallas ≤1500px
-   ✅ **Doble renderizado** - Versiones completa y truncada simultáneas
-   ✅ **Control CSS** - Media queries para rendimiento óptimo
-   ✅ **Experiencia consistente** - Mismo comportamiento en componentes Astro y JavaScript

### 🛠️ Arquitectura Modular (Nuevo)

-   ✅ **Utilidades centralizadas** - `src/utils/textUtils.ts` y `src/utils/themeUtils.ts`
-   ✅ **Eliminación de duplicación** - Funciones reutilizables entre componentes
-   ✅ **TypeScript estricto** - Tipado completo y validaciones
-   ✅ **Constantes configurables** - Límites y colores centralizados

### ⚙️ Configuración de API (Nuevo)

-   ✅ **Variables de entorno** - Configuración flexible para diferentes entornos
-   ✅ **Configuración centralizada** - `src/config/api.js` para endpoints
-   ✅ **Funciones helper** - `apiRequest()` y `buildApiUrl()` para requests
-   ✅ **Fallback automático** - Desarrollo con localhost:3000 por defecto

### 🎨 Diseño y UX

-   ✅ **Diseño responsivo** - Optimizado para móvil y desktop
-   ✅ **Menú hamburguesa** - Navegación móvil intuitiva
-   ✅ **Estados de carga** - Feedback visual durante operaciones
-   ✅ **Manejo de errores** - Mensajes claros y específicos
-   ✅ **Animaciones suaves** - Transiciones y microinteracciones

## 🏗️ Estructura del Proyecto

```
frontend/
├── src/
│   ├── pages/
│   │   ├── index.astro          # Página principal (redirige a login)
│   │   ├── login.astro          # Página de inicio de sesión
│   │   ├── register.astro       # Página de registro
│   │   └── dashboard.astro      # Dashboard principal
│   ├── components/
│   │   ├── TaskForm.astro       # Formulario de tareas con validación
│   │   ├── TaskItem.astro       # Item individual con truncado responsive
│   │   ├── TaskList.astro       # Lista de tareas
│   │   └── DueDateInfo.astro    # Componente de fechas límite
│   ├── utils/                   # Utilidades modulares (Nuevo)
│   │   ├── textUtils.ts         # Funciones de texto y validación
│   │   └── themeUtils.ts        # Constantes de tema y colores
│   ├── styles/
│   │   ├── dashboard.css        # Estilos del dashboard
│   │   ├── login.css           # Estilos para login
│   │   ├── register.css        # Estilos para registro
│   │   └── components/         # Estilos de componentes
│   │       ├── Dashboard.css    # Componentes del dashboard
│   │       ├── TaskForm.css     # Formulario de tareas
│   │       ├── TaskItem.css     # Items individuales
│   │       └── TaskList.css     # Lista de tareas
│   └── scripts/
│       ├── login.js            # Lógica de login
│       ├── register.js         # Lógica de registro
│       ├── dashboard.js        # Lógica del dashboard
│       ├── tasks.js            # Gestión de tareas con truncado
│       └── ui.js              # Utilidades de UI
├── docs/
│   ├── README.md              # Documentación completa
│   ├── STYLES.md              # Guía de estilos
│   ├── API.md                 # Integración con API
│   ├── TECHNICAL.md           # Documentación técnica detallada
│   ├── CHANGELOG.md           # Historial de cambios
│   └── IMPLEMENTATION.md      # Detalles de implementación
├── public/
│   └── favicon.svg            # Icono de la aplicación
└── package.json
```

## ⚙️ Configuración

### Variables de Entorno

El frontend utiliza variables de entorno para configurar la URL de la API del backend. Esto facilita el despliegue en diferentes entornos.

1. **Copia el archivo de ejemplo:**

    ```bash
    cp .env.example .env
    ```

2. **Configura la variable de entorno:**

    ```bash
    # .env
    VITE_API_URL=http://localhost:3000  # Para desarrollo
    # VITE_API_URL=https://api.tu-dominio.com  # Para producción
    ```

3. **Variables disponibles:**
    - `VITE_API_URL`: URL base de la API del backend
        - **Desarrollo**: `http://localhost:3000`
        - **Producción**: `https://api.tu-dominio.com`

### Configuración Centralizada

El archivo `src/config/api.js` contiene toda la configuración de la API:

```javascript
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    ENDPOINTS: {
        AUTH: { LOGIN: '/api/auth/login', ... },
        TASKS: { BASE: '/api/tasks' },
        TASK_LISTS: { BASE: '/api/task-lists' }
    }
};
```

### Funciones Helper

-   `buildApiUrl(endpoint)`: Construye URLs completas
-   `apiRequest(endpoint, options)`: Realiza requests con configuración predeterminada

## 🧞 Comandos Disponibles

| Comando           | Acción                                     |
| :---------------- | :----------------------------------------- |
| `npm install`     | Instala dependencias                       |
| `npm run dev`     | Servidor de desarrollo en `localhost:4321` |
| `npm run build`   | Construye el sitio para producción         |
| `npm run preview` | Previsualiza la build localmente           |

## 🎨 Diseño

### Colores

-   **Principal**: `#0c5a34` (Verde TurifyTasks)
-   **Secundario**: `#16a085` (Verde medio)
-   **Fondo**: Gradiente suave gris-azul

### Características de UI

-   **Mobile-first**: Diseño adaptable desde 320px
-   **Tipografía**: System fonts para consistencia
-   **Interacciones**: Hover effects y transiciones suaves
-   **Estados**: Loading, error, éxito claramente diferenciados

## 🔌 Integración con Backend

### Endpoints Utilizados

-   `POST /api/auth/register` - Registro de usuarios
-   `POST /api/auth/login` - Inicio de sesión
-   `GET /api/auth/profile` - Verificación de usuario
-   `POST /api/auth/logout` - Cerrar sesión

### Configuración CORS

El backend debe permitir:

```javascript
origin: "http://localhost:4321";
credentials: true;
```

## 📚 Documentación Completa

Para información detallada, consulta:

-   **[📖 Documentación Principal](./docs/README.md)** - Guía completa del proyecto
-   **[🎨 Guía de Estilos](./docs/STYLES.md)** - Sistema de diseño y componentes
-   **[🔌 API Integration](./docs/API.md)** - Detalles de integración con backend
-   **[📋 Changelog](./docs/CHANGELOG.md)** - Historial de cambios

## 🚀 Flujo de Usuario

1. **Nuevo Usuario**:

    - Visita `/` → Redirigido a `/login`
    - Clic en "Regístrate aquí" → `/register`
    - Completa formulario → Redirigido a `/login`
    - Inicia sesión → Accede a `/dashboard`

2. **Usuario Existente**:
    - Visita `/login` → Ingresa credenciales
    - Autenticación exitosa → Accede a `/dashboard`

## 🔧 Desarrollo

### Estructura CSS Modular

Los estilos están separados por página para mejor mantenibilidad:

-   `src/styles/login.css` - Estilos específicos de login
-   `src/styles/register.css` - Estilos específicos de registro

### JavaScript

Actualmente usa JavaScript inline en cada página. Los archivos en `src/scripts/` están preparados para migración futura.

### Hot Reload

Astro incluye hot reload automático. Los cambios se reflejan instantáneamente durante desarrollo.

## ⚠️ Solución de Problemas

### Error CORS

Si ves errores de CORS, verifica que el backend esté configurado correctamente:

```javascript
// En el backend
app.use(
    cors({
        origin: "http://localhost:4321",
        credentials: true,
    })
);
```

### Error de Conexión

-   Verifica que el backend esté ejecutándose en puerto 3000
-   Confirma que no hay conflictos de puertos

### Campos Obligatorios

Para registro, asegúrate de completar:

-   Nombre de usuario (mínimo 3 caracteres)
-   Email (formato válido)
-   Contraseña (mínimo 6 caracteres)

## 🤝 Contribución

1. **Fork** el repositorio
2. **Crear** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abrir** un Pull Request

### Estándares de Código

-   Usar nombres descriptivos para variables y funciones
-   Comentar código complejo
-   Mantener consistencia con el estilo existente
-   Actualizar documentación cuando sea necesario

## 📝 Notas de Versión

**Versión Actual**: 1.0.0  
**Fecha**: Agosto 2025  
**Compatibilidad**: Backend TurifyTasks v1.0.0+

### Próximas Mejoras

-   [ ] JavaScript externo
-   [ ] Variables CSS custom properties
-   [ ] Tests unitarios
-   [ ] Optimizaciones de performance

## 📞 Soporte

Para preguntas o issues:

-   **Repository Issues**: [GitHub Issues](https://github.com/Turify-Tech/TurifyTasks/issues)
-   **Documentación**: Consulta archivos en `/docs/`
-   **Backend**: Verifica documentación del backend en `/backend/docs/`

---

**Desarrollado con ❤️ por el equipo TurifyTasks**
