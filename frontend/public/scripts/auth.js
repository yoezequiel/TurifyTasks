// auth.js - Funciones de autenticación y usuario
console.log("[auth.js] Script cargado en:", window.location.href);

import { logout as authUtilsLogout, checkAuthStatus } from "./authUtils.js";

export async function checkAuthentication() {
    console.log("[auth.js] Verificando autenticación...");
    try {
        const authStatus = await checkAuthStatus();
        console.log("[auth.js] Estado de autenticación:", authStatus);

        if (authStatus.authenticated) {
            updateUserUI(authStatus.user);
            return true;
        } else {
            console.log("[auth.js] Usuario no autenticado, redirigiendo...");
            window.location.href = "/login";
            return false;
        }
    } catch (error) {
        console.error("Error verificando autenticación:", error);
        window.location.href = "/login";
        return false;
    }
}

export function updateUserUI(user) {
    console.log("[auth.js] Actualizando UI del usuario:", user);
    const userEmail = document.getElementById("userEmail");
    const userAvatar = document.getElementById("userAvatar");
    if (userEmail) userEmail.textContent = user.username;
    if (userAvatar)
        userAvatar.textContent = user.username.charAt(0).toUpperCase();
}

// Usar la función de logout de authUtils que ya tiene mejor manejo
export const logout = authUtilsLogout;
