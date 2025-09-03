// auth.js - Funciones de autenticación y usuario
import { logout as authUtilsLogout, checkAuthStatus } from "./authUtils.js";

export async function checkAuthentication() {
    try {
        const authStatus = await checkAuthStatus();
        if (authStatus.authenticated) {
            updateUserUI(authStatus.user);
            return true;
        } else {
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
    const userEmail = document.getElementById("userEmail");
    const userAvatar = document.getElementById("userAvatar");
    if (userEmail) userEmail.textContent = user.username;
    if (userAvatar)
        userAvatar.textContent = user.username.charAt(0).toUpperCase();
}

// Usar la función de logout de authUtils que ya tiene mejor manejo
export const logout = authUtilsLogout;
