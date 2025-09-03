// login.js - Lógica del formulario de login
console.log("[login.js] Script cargado en:", window.location.href);

import { initializeAuth } from "./authUtils.js";
import { apiRequest, API_CONFIG } from "../config/api.js";

// Función para mostrar/ocultar error de campo
function showFieldError(fieldId, message) {
    const errorDiv = document.getElementById(fieldId + "Error");
    const inputField = document.getElementById(fieldId);
    if (errorDiv && inputField) {
        errorDiv.textContent = message;
        errorDiv.style.display = "block";
        inputField.classList.add("error");
    }
}

// Función para limpiar errores de campo
function clearFieldError(fieldId) {
    const errorDiv = document.getElementById(fieldId + "Error");
    const inputField = document.getElementById(fieldId);
    if (errorDiv && inputField) {
        errorDiv.style.display = "none";
        inputField.classList.remove("error");
    }
}

// Función para alternar visibilidad de contraseña
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");
    const eyeOffIcon = document.getElementById("eyeOffIcon");

    if (passwordInput && eyeIcon && eyeOffIcon) {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeIcon.style.display = "none";
            eyeOffIcon.style.display = "block";
        } else {
            passwordInput.type = "password";
            eyeIcon.style.display = "block";
            eyeOffIcon.style.display = "none";
        }
    }
}

// Inicializar verificación de autenticación
initializeAuth();

document.addEventListener("DOMContentLoaded", function () {
    console.log("[login.js] DOM cargado, inicializando...");

    // Configurar toggle de contraseña
    const togglePassword = document.getElementById("togglePassword");
    if (togglePassword) {
        togglePassword.addEventListener("click", togglePasswordVisibility);
    }

    // Limpiar errores cuando el usuario empieza a escribir
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (emailInput) {
        emailInput.addEventListener("input", () => clearFieldError("email"));
    }
    if (passwordInput) {
        passwordInput.addEventListener("input", () => clearFieldError("password"));
    }

    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        console.log("[Login] Formulario enviado");

        // Limpiar errores previos
        clearFieldError("email");
        clearFieldError("password");

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const submitBtn = document.getElementById("submitBtn");
        const buttonText = document.getElementById("buttonText");
        const loadingSpinner = document.getElementById("loadingSpinner");
        const errorMessage = document.getElementById("errorMessage");
        const successMessage = document.getElementById("successMessage");

        if (!emailInput || !passwordInput) return;

        const email = emailInput.value;
        const password = passwordInput.value;

        console.log("[Login] Datos del formulario:", {
            email: email,
            password: "***",
        });

        // Validaciones básicas
        let hasErrors = false;

        if (!email || !email.includes("@")) {
            showFieldError(
                "email",
                "Por favor, ingresa un correo electrónico válido"
            );
            hasErrors = true;
        }

        if (!password || password.length < 6) {
            showFieldError(
                "password",
                "La contraseña debe tener al menos 6 caracteres"
            );
            hasErrors = true;
        }

        if (hasErrors) {
            return;
        }

        // Limpiar mensajes previos
        if (errorMessage) errorMessage.style.display = "none";
        if (successMessage) successMessage.style.display = "none";

        // Mostrar loading
        if (submitBtn) submitBtn.disabled = true;
        if (buttonText) buttonText.style.display = "none";
        if (loadingSpinner) loadingSpinner.style.display = "flex";

        try {
            console.log("[Login] Enviando petición al servidor...");
            const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("[Login] Respuesta del servidor:", data);

            if (response.ok) {
                // Login exitoso
                if (successMessage) {
                    successMessage.textContent =
                        "¡Inicio de sesión exitoso! Redirigiendo...";
                    successMessage.style.display = "block";
                }

                // Limpiar cualquier token viejo que pueda existir
                localStorage.removeItem("authToken");

                // Redirigir después de 1 segundo
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1000);
            } else {
                // Error en el login
                if (errorMessage) {
                    errorMessage.textContent =
                        data.error ||
                        "Credenciales incorrectas. Por favor, verifica tu email y contraseña.";
                    errorMessage.style.display = "block";
                }
            }
        } catch (error) {
            console.error("[Login] Error:", error);
            if (errorMessage) {
                errorMessage.textContent =
                    "Error de conexión. Verifica que el servidor esté funcionando.";
                errorMessage.style.display = "block";
            }
        } finally {
            // Restaurar botón
            if (submitBtn) submitBtn.disabled = false;
            if (buttonText) buttonText.style.display = "inline";
            if (loadingSpinner) loadingSpinner.style.display = "none";
        }
    });
});
