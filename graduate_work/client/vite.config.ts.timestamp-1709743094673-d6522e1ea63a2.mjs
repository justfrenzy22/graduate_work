// vite.config.ts
import { defineConfig } from "file:///home/justfrenzy/share/graduate_work/client/node_modules/vite/dist/node/index.js";
import react from "file:///home/justfrenzy/share/graduate_work/client/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://192.168.0.101:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false,
        ws: true
      }
    }
  },
  define: {
    "import.meta.env.VITE_API_BASE_URL": '"https://192.168.0.101:3000/api"'
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
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9qdXN0ZnJlbnp5L3NoYXJlL2dyYWR1YXRlX3dvcmsvY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9qdXN0ZnJlbnp5L3NoYXJlL2dyYWR1YXRlX3dvcmsvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2p1c3RmcmVuenkvc2hhcmUvZ3JhZHVhdGVfd29yay9jbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBwbHVnaW5zOiBbcmVhY3QoKV0sXG5cbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHByb3h5OiB7XG4gICAgICAgICcvYXBpJyA6IHtcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwczovLzE5Mi4xNjguMC4xMDE6ODAwMCcsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXG4gICAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgICB3czogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIFwiaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBJX0JBU0VfVVJMXCI6ICdcImh0dHBzOi8vMTkyLjE2OC4wLjEwMTozMDAwL2FwaVwiJyxcbiAgICB9XG4gICAgLy8gc2VydmVyOiB7XG4gICAgLy8gICAgIHByb3h5OiB7XG4gICAgLy8gICAgICAgICBcIi9hcGlcIjoge1xuICAgIC8vICAgICAgICAgICAgIHRhcmdldDogXCJodHRwOi8vMTkyLjE2OC4wLjEwMTo4MDAwXCIsXG4gICAgLy8gICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgIC8vICAgICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCBcIlwiKSxcbiAgICAvLyAgICAgICAgIH0sXG4gICAgLy8gICAgIH0sXG4gICAgLy8gfSxcbiAgICAvLyBkZWZpbmU6IHtcbiAgICAvLyAgICAgXCJpbXBvcnQubWV0YS5lbnYuVklURV9BUElfQkFTRV9VUkxcIjogJ1wiaHR0cDovLzE5Mi4xNjguMC4xMDE6MzAwMC9hcGlcIicsXG4gICAgLy8gfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVCxTQUFTLG9CQUFvQjtBQUNoVixPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBRWpCLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVM7QUFBQSxRQUNQLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxRQUM1QyxRQUFRO0FBQUEsUUFDUixJQUFJO0FBQUEsTUFDTjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixxQ0FBcUM7QUFBQSxFQUN2QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWFKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
