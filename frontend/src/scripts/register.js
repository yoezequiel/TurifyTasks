import { initializeAuth } from "./authUtils.js";

// Inicializar verificación de autenticación
initializeAuth();

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const usernameInput = document.getElementById("username");
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const submitBtn = document.getElementById("submitBtn");
        const buttonText = document.getElementById("buttonText");
        const loadingSpinner = document.getElementById("loadingSpinner");
        const errorMessage = document.getElementById("errorMessage");
        const successMessage = document.getElementById("successMessage");

        if (!usernameInput || !emailInput || !passwordInput) return;

        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;

        // Limpiar mensajes previos
        if (errorMessage) errorMessage.style.display = "none";
        if (successMessage) successMessage.style.display = "none";

        // Mostrar loading
        if (submitBtn) submitBtn.disabled = true;
        if (buttonText) buttonText.style.display = "none";
        if (loadingSpinner) loadingSpinner.style.display = "flex";

        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, email, password }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                // Registro exitoso
                if (successMessage) {
                    successMessage.textContent =
                        "¡Cuenta creada exitosamente! Redirigiendo al login...";
                    successMessage.style.display = "block";
                }

                // Redirigir después de 2 segundos
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } else {
                // Error en el registro
                if (errorMessage) {
                    errorMessage.textContent =
                        data.error ||
                        "Error al crear la cuenta. Por favor, inténtalo de nuevo.";
                    errorMessage.style.display = "block";
                }
            }
        } catch (error) {
            console.error("Error:", error);
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
