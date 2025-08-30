# API Integration Guide - TurifyTasks Frontend

## 🔌 Configuración de Conexión

### URLs Base
```javascript
// Desarrollo
const API_BASE_URL = 'http://localhost:3000';
const FRONTEND_URL = 'http://localhost:4321';

// Producción (por configurar)
// const API_BASE_URL = 'https://api.turifytasks.com';
// const FRONTEND_URL = 'https://turifytasks.com';
```

### Configuración CORS
El backend debe estar configurado con los siguientes headers:
```javascript
// Backend: server.js
app.use(cors({
    origin: 'http://localhost:4321', // URL específica del frontend
    credentials: true,               // Permitir cookies de sesión
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 📡 Endpoints Implementados

### 1. 📝 Registro de Usuario

#### Request
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",     // string, requerido, mín 3 caracteres
  "email": "john@email.com", // string, requerido, formato email válido
  "password": "123456"       // string, requerido, mín 6 caracteres
}
```

#### Response - Éxito (201)
```javascript
{
  "message": "Usuario registrado exitosamente"
}
```

#### Response - Error (400)
```javascript
{
  "error": "Faltan campos obligatorios"
}
```

#### Response - Error (409)
```javascript
{
  "error": "El email o usuario ya está registrado"
}
```

#### Implementación Frontend
```javascript
// Ubicación: src/pages/register.astro
const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password })
});
```

### 2. 🔐 Inicio de Sesión

#### Request
```javascript
POST /api/auth/login
Content-Type: application/json
credentials: include  // IMPORTANTE: Para cookies de sesión

{
  "email": "john@email.com",    // string, requerido
  "password": "123456"          // string, requerido
}
```

#### Response - Éxito (200)
```javascript
{
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@email.com"
  }
}
```

#### Response - Error (400)
```javascript
{
  "error": "Faltan campos obligatorios"
}
```

#### Response - Error (401)
```javascript
{
  "error": "Credenciales inválidas"
}
```

#### Implementación Frontend
```javascript
// Ubicación: src/pages/login.astro
const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include', // CRÍTICO para sessions
    body: JSON.stringify({ email, password })
});
```

### 3. 👤 Verificación de Perfil

#### Request
```javascript
GET /api/auth/profile
credentials: include  // Para enviar cookies de sesión
```

#### Response - Éxito (200)
```javascript
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@email.com"
  }
}
```

#### Response - No Autenticado (401)
```javascript
{
  "error": "No autenticado"
}
```

#### Implementación Frontend
```javascript
// Ubicación: src/pages/dashboard.astro
const response = await fetch('http://localhost:3000/api/auth/profile', {
    method: 'GET',
    credentials: 'include',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        'Content-Type': 'application/json'
    }
});
```

### 4. 🚪 Cerrar Sesión

#### Request
```javascript
POST /api/auth/logout
credentials: include
```

#### Response - Éxito (200)
```javascript
{
  "message": "Sesión cerrada correctamente"
}
```

#### Implementación Frontend
```javascript
// Ubicación: src/pages/dashboard.astro
async function logout() {
    try {
        await fetch('http://localhost:3000/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    } finally {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    }
}
```

## 🍪 Manejo de Sesiones

### Configuración Backend
```javascript
// Backend: server.js
app.use(session({
    secret: process.env.SESSION_SECRET || 'turifytasks_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,      // true en producción con HTTPS
        httpOnly: true,     // Previene acceso desde JavaScript
        maxAge: 24 * 60 * 60 * 1000  // 24 horas
    }
}));
```

### Middleware de Autenticación
```javascript
// Backend: middleware/authMiddleware.js
export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ error: 'No autenticado' });
};
```

### Ventajas del Sistema Actual
- **Seguridad**: Cookies HTTP-only no son accesibles desde JavaScript
- **Automático**: Se envían automáticamente en cada petición
- **Server-side**: Sesión gestionada completamente en el servidor

## ⚠️ Manejo de Errores

### Estrategia de Error Handling

#### 1. Errores de Red
```javascript
try {
    const response = await fetch(url, options);
    // ... proceso normal
} catch (error) {
    console.error('Error de conexión:', error);
    showError('Error de conexión. Verifica que el servidor esté funcionando.');
}
```

#### 2. Errores HTTP
```javascript
const response = await fetch(url, options);
const data = await response.json();

if (response.ok) {
    // Éxito
    handleSuccess(data);
} else {
    // Error HTTP (4xx, 5xx)
    showError(data.error || 'Error desconocido');
}
```

#### 3. Validation Errors
```javascript
// Frontend - Validación antes de envío
if (!email || !password) {
    showError('Todos los campos son obligatorios');
    return;
}

if (password.length < 6) {
    showError('La contraseña debe tener al menos 6 caracteres');
    return;
}
```

### Códigos de Estado HTTP Utilizados

| Código | Significado | Uso en TurifyTasks |
|--------|-------------|-------------------|
| 200 | OK | Login exitoso, perfil obtenido |
| 201 | Created | Usuario registrado exitosamente |
| 400 | Bad Request | Campos faltantes o inválidos |
| 401 | Unauthorized | Credenciales incorrectas, no autenticado |
| 409 | Conflict | Email/username ya existe |
| 500 | Internal Server Error | Error del servidor |

## 🔄 Estados de Loading

### Implementación
```javascript
// Estado inicial
submitBtn.disabled = true;
buttonText.style.display = 'none';
loadingSpinner.style.display = 'flex';

try {
    // Petición API
    const response = await fetch(url, options);
    // Procesar respuesta
} finally {
    // Restaurar estado
    submitBtn.disabled = false;
    buttonText.style.display = 'inline';
    loadingSpinner.style.display = 'none';
}
```

### CSS para Loading States
```css
.loading {
    display: none;
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
```

## 🔒 Seguridad

### Medidas Implementadas

#### 1. CORS Específico
```javascript
// No usar wildcard (*) con credentials
origin: 'http://localhost:4321'  // ✅ Específico
// origin: '*'                   // ❌ Inseguro con credentials
```

#### 2. Cookies HTTP-Only
```javascript
cookie: { 
    httpOnly: true,  // ✅ No accesible desde JavaScript
    secure: false,   // ✅ true en producción con HTTPS
    sameSite: 'strict' // ✅ Protección CSRF (agregar en futuro)
}
```

#### 3. Validación Dual
- **Frontend**: Validación inmediata para UX
- **Backend**: Validación definitiva para seguridad

#### 4. Manejo Seguro de Contraseñas
```javascript
// Backend: bcrypt para hashing
const password_hash = await bcrypt.hash(password, 10);
const match = await bcrypt.compare(password, user.password_hash);
```

### Próximas Mejoras de Seguridad
- [ ] Rate limiting en endpoints de auth
- [ ] CSRF tokens
- [ ] Content Security Policy headers
- [ ] Input sanitization más robusta
- [ ] Password strength meter en frontend

## 🧪 Testing de API

### Pruebas Manuales con cURL

#### Registro
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"123456"}'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}' \
  -c cookies.txt
```

#### Perfil (requiere cookies de sesión)
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -b cookies.txt
```

### Pruebas con Postman
1. **Configurar Environment**:
   - `base_url`: `http://localhost:3000`
   
2. **Test de Registro**:
   - POST `{{base_url}}/api/auth/register`
   - Body: raw JSON con username, email, password

3. **Test de Login**:
   - POST `{{base_url}}/api/auth/login`  
   - Body: raw JSON con email, password
   - ✅ Enable "Send cookies"

4. **Test de Perfil**:
   - GET `{{base_url}}/api/auth/profile`
   - ✅ Usar cookies de login previo

## 📈 Monitoreo y Logs

### Frontend Logging
```javascript
// Logs estructurados para debugging
console.log('API Request:', {
    url: endpoint,
    method: 'POST',
    data: { email, username }, // NO loggear password
    timestamp: new Date().toISOString()
});

console.log('API Response:', {
    status: response.status,
    success: response.ok,
    timestamp: new Date().toISOString()
});
```

### Error Tracking (Futuro)
- Integrar con Sentry o similar
- Tracking de errores 4xx/5xx
- Métricas de tiempo de respuesta
- Alertas para fallos críticos

---

## 🚀 Deployment Considerations

### Variables de Entorno
```javascript
// Futuro: archivo .env
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000';
const ENVIRONMENT = process.env.NODE_ENV || 'development';
```

### CORS en Producción
```javascript
// Backend production config
const allowedOrigins = [
    'https://turifytasks.com',
    'https://www.turifytasks.com'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
```

---

**Fecha de última actualización**: Agosto 2025  
**Versión API**: 1.0.0  
**Compatibilidad**: Backend TurifyTasks v1.0.0
