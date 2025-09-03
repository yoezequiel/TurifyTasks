// register.js - Lógica del formulario de registro
console.log("[register.js] Script cargado en:", window.location.href);

import { initializeAuth } from "./authUtils.js";

// Inicializar verificación de autenticación
initializeAuth();

document.addEventListener("DOMContentLoaded", function () {
    console.log("[register.js] DOM cargado, inicializando...");

    // Configurar toggle de contraseña
    const togglePassword = document.getElementById("togglePassword");
    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
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
        });
    }
});
