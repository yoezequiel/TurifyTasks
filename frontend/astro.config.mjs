// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
    server: {
        host: true, // permite conexiones externas
        port: 4321, // tu puerto local
        allowedHosts: true, // permite cualquier host (LocalTunnel incluido)
    },
});
