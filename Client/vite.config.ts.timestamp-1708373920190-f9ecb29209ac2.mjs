// vite.config.ts
import { defineConfig } from "file:///C:/Users/Diego/Documents/projects/VaraEnergy/Client/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Diego/Documents/projects/VaraEnergy/Client/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import nodePolyfills from "file:///C:/Users/Diego/Documents/projects/VaraEnergy/Client/node_modules/vite-plugin-node-stdlib-browser/index.cjs";
import eslint from "file:///C:/Users/Diego/Documents/projects/VaraEnergy/Client/node_modules/vite-plugin-eslint/dist/index.mjs";
import svgr from "file:///C:/Users/Diego/Documents/projects/VaraEnergy/Client/node_modules/vite-plugin-svgr/dist/index.js";
import dotenv from "file:///C:/Users/Diego/Documents/projects/VaraEnergy/Client/node_modules/dotenv/lib/main.js";
import EnvironmentPlugin from "file:///C:/Users/Diego/Documents/projects/VaraEnergy/Client/node_modules/vite-plugin-environment/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Diego\\Documents\\projects\\VaraEnergy\\Client";
dotenv.config();
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  server: {
    host: "0.0.0.0",
    port: 3e3
  },
  preview: {
    port: 3e3,
    host: true
  },
  plugins: [svgr(), react(), nodePolyfills(), eslint(), EnvironmentPlugin("all")],
  assetsInclude: ["**/*.wasm?inline", "**/*.txt?inline"],
  build: { outDir: "build" }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxEaWVnb1xcXFxEb2N1bWVudHNcXFxccHJvamVjdHNcXFxcVmFyYUVuZXJneVxcXFxDbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXERpZWdvXFxcXERvY3VtZW50c1xcXFxwcm9qZWN0c1xcXFxWYXJhRW5lcmd5XFxcXENsaWVudFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvRGllZ28vRG9jdW1lbnRzL3Byb2plY3RzL1ZhcmFFbmVyZ3kvQ2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IG5vZGVQb2x5ZmlsbHMgZnJvbSAndml0ZS1wbHVnaW4tbm9kZS1zdGRsaWItYnJvd3Nlcic7XHJcbmltcG9ydCBlc2xpbnQgZnJvbSAndml0ZS1wbHVnaW4tZXNsaW50JztcclxuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3Zncic7XHJcbmltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52JztcclxuaW1wb3J0IEVudmlyb25tZW50UGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLWVudmlyb25tZW50JztcclxuXHJcbi8vIENhcmdhIGxhcyB2YXJpYWJsZXMgZGUgZW50b3JubyBkZXNkZSBlbCBhcmNoaXZvIC5lbnZcclxuZG90ZW52LmNvbmZpZygpO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhvc3Q6ICcwLjAuMC4wJyxcclxuICAgIHBvcnQ6IDMwMDAsXHJcbiAgfSxcclxuICBwcmV2aWV3OiB7XHJcbiAgICBwb3J0OiAzMDAwLFxyXG4gICAgaG9zdDogdHJ1ZSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtzdmdyKCksIHJlYWN0KCksIG5vZGVQb2x5ZmlsbHMoKSwgZXNsaW50KCksIEVudmlyb25tZW50UGx1Z2luKCdhbGwnKV0sXHJcbiAgYXNzZXRzSW5jbHVkZTogWycqKi8qLndhc20/aW5saW5lJywgJyoqLyoudHh0P2lubGluZSddLFxyXG4gIGJ1aWxkOiB7IG91dERpcjogJ2J1aWxkJyB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5VixTQUFTLG9CQUFvQjtBQUN0WCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sWUFBWTtBQUNuQixPQUFPLFVBQVU7QUFDakIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sdUJBQXVCO0FBUDlCLElBQU0sbUNBQW1DO0FBVXpDLE9BQU8sT0FBTztBQUdkLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUNwQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUyxDQUFDLEtBQUssR0FBRyxNQUFNLEdBQUcsY0FBYyxHQUFHLE9BQU8sR0FBRyxrQkFBa0IsS0FBSyxDQUFDO0FBQUEsRUFDOUUsZUFBZSxDQUFDLG9CQUFvQixpQkFBaUI7QUFBQSxFQUNyRCxPQUFPLEVBQUUsUUFBUSxRQUFRO0FBQzNCLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
