// authUtils.js - Utilidades de autenticación persistente
import { showToast } from "./ui.js";

// Verificar si el usuario está autenticado
export async function checkAuthStatus() {
    try {
        const response = await fetch("http://localhost:3000/api/auth/check", {
            credentials: "include", // Incluir cookies de sesión
        });

        if (!response.ok) {
            throw new Error("Error al verificar autenticación");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al verificar autenticación:", error);
        return { authenticated: false };
    }
}

// Función para redirigir basado en el estado de autenticación
export async function handleAuthRedirect() {
    const authStatus = await checkAuthStatus();
    const currentPath = window.location.pathname;

    console.log("[Auth] Estado de autenticación:", authStatus);
    console.log("[Auth] Ruta actual:", currentPath);

    if (authStatus.authenticated) {
        // Usuario autenticado
        console.log("[Auth] Usuario autenticado:", authStatus.user);

        // Si está en login o register, redirigir al dashboard
        if (
            currentPath === "/login" ||
            currentPath === "/login/" ||
            currentPath === "/register" ||
            currentPath === "/register/" ||
            currentPath === "/" ||
            currentPath === "/index.html"
        ) {
            console.log("[Auth] Redirigiendo a dashboard...");
            window.location.href = "/dashboard";
            return false; // Indica que se va a redirigir
        }

        // Guardar datos del usuario para uso en la aplicación
        window.currentUser = authStatus.user;
        return true; // Usuario autenticado y en página correcta
    } else {
        // Usuario no autenticado
        console.log("[Auth] Usuario no autenticado");

        // Si está en una página protegida O en la página principal, redirigir al login
        if (
            currentPath !== "/login" &&
            currentPath !== "/login/" &&
            currentPath !== "/register" &&
            currentPath !== "/register/"
        ) {
            console.log("[Auth] Redirigiendo a login...");
            window.location.href = "/login";
            return false; // Indica que se va a redirigir
        }

        return false; // Usuario no autenticado
    }
}

// Función para logout
export async function logout() {
    try {
        const response = await fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        if (response.ok) {
            showToast("Sesión cerrada correctamente", "success");
            // Limpiar datos del usuario
            window.currentUser = null;
            // Redirigir al login
            window.location.href = "/login";
        } else {
            throw new Error("Error al cerrar sesión");
        }
    } catch (error) {
        console.error("Error en logout:", error);
        showToast("Error al cerrar sesión", "error");
    }
}

// Inicializar verificación de autenticación en cada página
export function initializeAuth() {
    // Verificar autenticación cuando se carga la página
    document.addEventListener("DOMContentLoaded", async () => {
        console.log("[Auth] Inicializando verificación de autenticación...");
        await handleAuthRedirect();
    });
}
