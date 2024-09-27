import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.SOME_KEY": JSON.stringify(env.SOME_KEY),
    },
    server: {
      host: "0.0.0.0", // or your specific IP address
      port: 5173, // Ensure the port matches your setup
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
