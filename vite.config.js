import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { Proxy } from "@domoinc/ryuu-proxy";
import manifest from "./public/manifest.json";
import tailwindcss from "@tailwindcss/vite";

const config = { manifest };
const proxy = new Proxy(config);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "ryuu-proxy",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          res.status = function (code) {
            this.statusCode = code;
            return this;
          };

          res.send = function (body) {
            this.setHeader("Content-Type", "text/plain");
            this.end(body);
          };

          next();
        });

        server.middlewares.use(proxy.express());
      },
    },
  ],

  define: { "process.env": {} },

  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
});