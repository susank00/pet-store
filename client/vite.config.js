import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.SOME_KEY": JSON.stringify(env.SOME_KEY),
    },
    plugins: [react()],
    build: {
      outDir: "build", // Change output directory to 'build'
      rollupOptions: {
        external: ["@heroicons/react"], // Externalize Heroicons
      },
    },
  };
});
