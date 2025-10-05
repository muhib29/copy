// vite.config.ts
import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

export default defineConfig(({ mode }) => ({
  // 👇 tell Vite where index.html is
  root: path.resolve(__dirname, "client"),

  server: {
    host: "::",
    port: 8080,
    fs: {
      // 👇 fix the paths (use absolute paths)
      allow: [
        path.resolve(__dirname, "client"),
        path.resolve(__dirname, "shared"),
      ],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist/spa"),
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(server) {
      const app = createServer();
      server.middlewares.use(app);
    },
  };
}
