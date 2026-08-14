
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
    build: {
        rollupOptions: {
            output: {
                /**
                 * Split vendor code out of the entry chunk.
                 *
                 * Nearly all of the weight here is third-party, and it changes
                 * far less often than our own code — separate chunks mean a
                 * routine app deploy doesn't invalidate the browser's cached
                 * copy of React, and the browser fetches them in parallel.
                 */
                manualChunks(id) {
                    if (!id.includes('node_modules')) return;

                    if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) {
                        return 'vendor-react';
                    }
                    if (id.includes('react-router')) return 'vendor-router';
                    // Only the table pages need these
                    if (id.includes('@tanstack/table-core') || id.includes('react-table')) return 'vendor-table';
                    if (id.includes('lightweight-charts') || id.includes('fancy-canvas')) return 'vendor-charts';
                    if (id.includes('react-day-picker') || id.includes('date-fns')) return 'vendor-dates';
                    if (id.includes('@radix-ui') || id.includes('@floating-ui')) return 'vendor-radix';
                    if (id.includes('zod') || id.includes('react-hook-form') || id.includes('@hookform')) {
                        return 'vendor-forms';
                    }
                    if (id.includes('@tiptap') || id.includes('prosemirror')) return 'vendor-editor';

                    return 'vendor';
                },
            },
        },
    },
})
