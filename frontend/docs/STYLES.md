# Guía de Estilos - TurifyTasks Frontend

## 🎨 Sistema de Diseño

### Paleta de Colores

#### Colores Principales
```css
/* Color principal de la marca */
--primary-color: #0c5a34;

/* Color secundario */
--secondary-color: #16a085;

/* Colores de fondo */
--bg-gradient-start: #f5f7fa;
--bg-gradient-end: #c3cfe2;
--bg-white: #ffffff;
--bg-light: #f9fafb;
```

#### Colores de Texto
```css
/* Texto principal */
--text-primary: #374151;
--text-secondary: #6b7280;
--text-white: #ffffff;
--text-muted: rgba(255, 255, 255, 0.9);
```

#### Colores de Estado
```css
/* Estados de éxito */
--success-bg: #f0fdf4;
--success-border: #bbf7d0;
--success-text: #16a34a;

/* Estados de error */
--error-bg: #fef2f2;
--error-border: #fecaca;
--error-text: #dc2626;

/* Estados neutros */
--neutral-bg: #9ca3af;
--border-light: #e5e7eb;
```

### Tipografía

#### Familia de Fuentes
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

#### Escala Tipográfica
```css
/* Títulos principales */
.title {
    font-size: 24px;
    font-weight: 600;
    line-height: 1.2;
}

/* Subtítulos */
.subtitle {
    font-size: 14px;
    font-weight: 400;
    opacity: 0.9;
}

/* Texto de formularios */
.form-label {
    font-size: 14px;
    font-weight: 500;
}

.form-input {
    font-size: 16px;
    font-weight: 400;
}

/* Botones */
.btn-primary {
    font-size: 16px;
    font-weight: 600;
}

/* Texto pequeño */
.small-text {
    font-size: 14px;
    font-weight: 400;
}
```

### Espaciado

#### Sistema de Espaciado (8px base)
```css
/* Espacios internos */
--spacing-xs: 8px;
--spacing-sm: 12px;
--spacing-md: 16px;
--spacing-lg: 20px;
--spacing-xl: 30px;
--spacing-xxl: 40px;

/* Uso en componentes */
.form-group {
    margin-bottom: var(--spacing-lg); /* 20px */
}

.form-input {
    padding: var(--spacing-sm) var(--spacing-md); /* 12px 16px */
}

.container {
    padding: var(--spacing-xxl) var(--spacing-xl); /* 40px 30px */
}
```

### Bordes y Radios

#### Border Radius
```css
--radius-sm: 6px;   /* Elementos pequeños */
--radius-md: 8px;   /* Inputs, botones */
--radius-lg: 12px;  /* Cards pequeños */
--radius-xl: 16px;  /* Containers principales */
```

#### Bordes
```css
--border-width: 2px;
--border-style: solid;
--border-color: #e5e7eb;
--border-focus: #0c5a34;
```

### Sombras

#### Sistema de Elevación
```css
/* Sombra sutil para inputs */
--shadow-sm: 0 0 0 3px rgba(12, 90, 52, 0.1);

/* Sombra para cards */
--shadow-md: 0 4px 20px rgba(0, 0, 0, 0.05);

/* Sombra para containers principales */
--shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.1);

/* Sombra para hover de botones */
--shadow-hover: 0 4px 20px rgba(12, 90, 52, 0.3);

/* Sombra para header */
--shadow-header: 0 2px 10px rgba(0, 0, 0, 0.1);
```

## 🧩 Componentes

### Botones

#### Botón Primario
```css
.btn-primary {
    width: 100%;
    background: #0c5a34;
    color: white;
    border: none;
    padding: 14px 20px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(12, 90, 52, 0.3);
}

.btn-primary:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}
```

### Formularios

#### Input Fields
```css
.form-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.2s, box-shadow 0.2s;
    background: #f9fafb;
}

.form-input:focus {
    outline: none;
    border-color: #0c5a34;
    box-shadow: 0 0 0 3px rgba(12, 90, 52, 0.1);
    background: white;
}
```

#### Labels
```css
.form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
}
```

### Cards y Containers

#### Container Principal
```css
.container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    width: 100%;
    max-width: 400px;
}
```

#### Header
```css
.header {
    background: #0c5a34;
    padding: 40px 30px;
    text-align: center;
    color: white;
}
```

### Estados y Feedback

#### Mensajes de Error
```css
.error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
}
```

#### Mensajes de Éxito
```css
.success-message {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #16a34a;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
}
```

#### Loading States
```css
.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
/* Base: 320px+ (móviles pequeños) */

/* Tablet: 768px+ */
@media (min-width: 768px) {
    .container {
        max-width: 480px;
    }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
    .container {
        max-width: 500px;
    }
}
```

### Layout Patterns

#### Centrado Vertical y Horizontal
```css
body {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}
```

#### Flexbox para Layout Interno
```css
.logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
```

## ⚡ Transiciones y Animaciones

### Transiciones Estándar
```css
/* Transición suave para interacciones */
transition: all 0.2s;

/* Transiciones específicas para mejor rendimiento */
transition: border-color 0.2s, box-shadow 0.2s;
transition: transform 0.2s, box-shadow 0.2s;
```

### Micro-interacciones
```css
/* Hover effect para botones */
.btn-primary:hover {
    transform: translateY(-2px);
}

/* Efecto de presionado */
.btn-primary:active {
    transform: translateY(0);
}
```

## 🔧 Mejores Prácticas

### CSS Organization
1. **Reset/Normalize**: Usar reset básico con `* { margin: 0; padding: 0; box-sizing: border-box; }`
2. **Variables CSS**: Considerar migrar a custom properties para mejor mantenimiento
3. **BEM Methodology**: Para proyectos más grandes, considerar BEM para naming
4. **Mobile First**: Siempre diseñar desde móvil hacia desktop

### Performance
1. **Crítico Above-fold**: Inlinear CSS crítico si es necesario
2. **Lazy Loading**: Para imágenes y componentes no críticos
3. **Minificación**: En producción, minificar CSS
4. **Concatenación**: Combinar archivos CSS cuando sea posible

### Accesibilidad
1. **Contraste**: Verificar ratios de contraste WCAG AA (4.5:1 mínimo)
2. **Focus States**: Siempre mantener estados de focus visibles
3. **Color No Es Único Indicador**: No depender solo del color para comunicar información
4. **Tamaños Mínimos**: Targets touch de mínimo 44px x 44px

## 📋 Checklist de Implementación

### ✅ Para Nuevos Componentes
- [ ] Usar paleta de colores definida
- [ ] Implementar estados de hover/focus
- [ ] Agregar transiciones suaves
- [ ] Verificar responsive design
- [ ] Probar accesibilidad básica
- [ ] Optimizar para performance

### ✅ Para Modificaciones
- [ ] Mantener consistencia visual
- [ ] No hardcodear valores (usar variables)
- [ ] Probar en diferentes dispositivos
- [ ] Verificar que no rompe otros componentes
- [ ] Actualizar documentación si es necesario

---

**Nota**: Esta guía de estilos debe evolucionar con el proyecto. Mantener actualizada con cada cambio significativo en el diseño.
