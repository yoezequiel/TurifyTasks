// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
    output: "static",
    build: {
        assets: "assets",
        inlineStylesheets: "auto",
    },
    vite: {
        build: {
            rollupOptions: {
                output: {
                    assetFileNames: "assets/[name].[hash][extname]",
                },
            },
        },
    },
    server: {
        host: true, // permite conexiones externas
        port: 4321, // tu puerto local
        allowedHosts: true, // permite cualquier host (LocalTunnel incluido)
    },
});
