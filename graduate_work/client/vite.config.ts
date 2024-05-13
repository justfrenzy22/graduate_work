import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    envDir: "./",
    server: {
      proxy: {
        '/api' : {
          target: 'https://192.168.0.101:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
          ws: true
        }
      }
    },
    define: {
      "import.meta.env.VITE_API_BASE_URL": '"https://192.168.0.101:3000/api"',
    }
    // server: {
    //     proxy: {
    //         "/api": {
    //             target: "http://192.168.0.101:8000",
    //             changeOrigin: true,
    //             rewrite: (path) => path.replace(/^\/api/, ""),
    //         },
    //     },
    // },
    // define: {
    //     "import.meta.env.VITE_API_BASE_URL": '"http://192.168.0.101:3000/api"',
    // },
});
