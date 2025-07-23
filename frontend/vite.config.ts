import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";


export default defineConfig(async ({ mode }) => {

  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }

  return {
    server: {
      port: 3000,
    },
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tanstackStart({ customViteReactPlugin: true }),
      viteReact(),
    ],

  }
});
