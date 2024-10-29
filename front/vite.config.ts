import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        viteTsconfigPaths(),
    ],
    server: {
        port: 4200,
    },
    build: {
        outDir: 'dist',
    },
});