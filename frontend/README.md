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

- **Node.js** 18.0.0 o superior
- **Backend TurifyTasks** ejecutándose en puerto 3000
- **Navegador moderno** (Chrome 90+, Firefox 88+, Safari 14+)

## 🎯 Funcionalidades

- ✅ **Registro de usuarios** - Formulario completo con validación
- ✅ **Inicio de sesión** - Autenticación segura con sesiones
- ✅ **Dashboard protegido** - Acceso solo para usuarios autenticados  
- ✅ **Diseño responsivo** - Optimizado para móvil y desktop
- ✅ **Estados de carga** - Feedback visual durante operaciones
- ✅ **Manejo de errores** - Mensajes claros y específicos

## 🏗️ Estructura del Proyecto

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
│       ├── login.js            # Lógica de login (preparado)
│       └── register.js         # Lógica de registro (preparado)
├── docs/
│   ├── README.md              # Documentación completa
│   ├── STYLES.md              # Guía de estilos
│   ├── API.md                 # Integración con API
│   └── CHANGELOG.md           # Historial de cambios
├── public/
└── package.json
```

## 🧞 Comandos Disponibles

| Comando | Acción |
|:--------|:-------|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Construye el sitio para producción |
| `npm run preview` | Previsualiza la build localmente |

## 🎨 Diseño

### Colores
- **Principal**: `#0c5a34` (Verde TurifyTasks)
- **Secundario**: `#16a085` (Verde medio)
- **Fondo**: Gradiente suave gris-azul

### Características de UI
- **Mobile-first**: Diseño adaptable desde 320px
- **Tipografía**: System fonts para consistencia
- **Interacciones**: Hover effects y transiciones suaves
- **Estados**: Loading, error, éxito claramente diferenciados

## 🔌 Integración con Backend

### Endpoints Utilizados
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Verificación de usuario
- `POST /api/auth/logout` - Cerrar sesión

### Configuración CORS
El backend debe permitir:
```javascript
origin: 'http://localhost:4321'
credentials: true
```

## 📚 Documentación Completa

Para información detallada, consulta:

- **[📖 Documentación Principal](./docs/README.md)** - Guía completa del proyecto
- **[🎨 Guía de Estilos](./docs/STYLES.md)** - Sistema de diseño y componentes
- **[🔌 API Integration](./docs/API.md)** - Detalles de integración con backend
- **[📋 Changelog](./docs/CHANGELOG.md)** - Historial de cambios

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
- `src/styles/login.css` - Estilos específicos de login
- `src/styles/register.css` - Estilos específicos de registro

### JavaScript
Actualmente usa JavaScript inline en cada página. Los archivos en `src/scripts/` están preparados para migración futura.

### Hot Reload
Astro incluye hot reload automático. Los cambios se reflejan instantáneamente durante desarrollo.

## ⚠️ Solución de Problemas

### Error CORS
Si ves errores de CORS, verifica que el backend esté configurado correctamente:
```javascript
// En el backend
app.use(cors({
    origin: 'http://localhost:4321',
    credentials: true
}));
```

### Error de Conexión
- Verifica que el backend esté ejecutándose en puerto 3000
- Confirma que no hay conflictos de puertos

### Campos Obligatorios
Para registro, asegúrate de completar:
- Nombre de usuario (mínimo 3 caracteres)
- Email (formato válido)
- Contraseña (mínimo 6 caracteres)

## 🤝 Contribución

1. **Fork** el repositorio
2. **Crear** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abrir** un Pull Request

### Estándares de Código
- Usar nombres descriptivos para variables y funciones
- Comentar código complejo
- Mantener consistencia con el estilo existente
- Actualizar documentación cuando sea necesario

## 📝 Notas de Versión

**Versión Actual**: 1.0.0  
**Fecha**: Agosto 2025  
**Compatibilidad**: Backend TurifyTasks v1.0.0+

### Próximas Mejoras
- [ ] JavaScript externo
- [ ] Variables CSS custom properties
- [ ] Tests unitarios
- [ ] Optimizaciones de performance

## 📞 Soporte

Para preguntas o issues:
- **Repository Issues**: [GitHub Issues](https://github.com/Turify-Tech/TurifyTasks/issues)
- **Documentación**: Consulta archivos en `/docs/`
- **Backend**: Verifica documentación del backend en `/backend/docs/`

---

**Desarrollado con ❤️ por el equipo TurifyTasks**
