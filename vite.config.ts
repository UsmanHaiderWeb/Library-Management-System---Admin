
import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    // Pinned so the two portals can never swap ports. A browser tab holding a
    // cached index.html from the other app would request chunk hashes this
    // server does not have, giving a blank page with only 404s in the network
    // tab and nothing in the console.
    server: { port: 5173, strictPort: true },
    preview: { port: 4173, strictPort: true },
    build: {
        /**
         * The entry chunk is large because it is almost entirely third-party
         * (react-dom, react-router, zod, react-day-picker...). Our own source is
         * a small fraction of it and is already route-split via React.lazy.
         *
         * Do NOT hand-roll manualChunks here. Grouping packages by substring
         * previously put '@tiptap/react' in the React chunk (it matches
         * '/react/'), which created a circular import between chunks — the app
         * rendered a blank page with no console error. Rollup's default
         * chunking follows the real module graph and cannot cycle.
         *
         * lightweight-charts is the one safe exception: it is a leaf with no
         * imports of its own, so it can never take part in a cycle, and only
         * the dashboard needs it.
         */
        chunkSizeWarningLimit: 700,
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-charts': ['lightweight-charts'],
                },
            },
        },
    },
})
