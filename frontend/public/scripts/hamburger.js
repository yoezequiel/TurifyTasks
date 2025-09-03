// hamburger.js - Funcionalidad del menú hamburguesa
console.log("[hamburger.js] Script cargado en:", window.location.href);

export function initHamburgerMenu() {
    console.log("[hamburger.js] Inicializando menú hamburguesa");

    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    // Verificar que los elementos existen
    if (!hamburgerBtn || !sidebar || !overlay) {
        console.warn("Elementos del menú hamburguesa no encontrados");
        return;
    }

    function toggleSidebar() {
        const isOpen = sidebar.classList.contains("sidebar-open");

        if (isOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    function openSidebar() {
        sidebar.classList.add("sidebar-open");
        overlay.classList.add("overlay-active");
        hamburgerBtn.classList.add("hamburger-active");
        document.body.style.overflow = "hidden";
        console.log("[hamburger.js] Sidebar abierto");
    }

    function closeSidebar() {
        sidebar.classList.remove("sidebar-open");
        overlay.classList.remove("overlay-active");
        hamburgerBtn.classList.remove("hamburger-active");
        document.body.style.overflow = "";
        console.log("[hamburger.js] Sidebar cerrado");
    }

    // Event listeners
    hamburgerBtn.addEventListener("click", toggleSidebar);
    overlay.addEventListener("click", closeSidebar);

    // Cerrar con tecla Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && sidebar.classList.contains("sidebar-open")) {
            closeSidebar();
        }
    });

    // Cerrar sidebar al cambiar a desktop
    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", initHamburgerMenu);
