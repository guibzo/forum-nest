// vitest.config.e2e.mts
import swc from "file:///C:/dev/ignite/forum-nest/node_modules/.pnpm/unplugin-swc@1.5.1_@swc+core@1.7.36_rollup@4.24.0_webpack-sources@3.2.3/node_modules/unplugin-swc/dist/index.js";
import tsConfigPaths from "file:///C:/dev/ignite/forum-nest/node_modules/.pnpm/vite-tsconfig-paths@5.0.1_typescript@5.6.3_vite@5.4.9_@types+node@20.16.11_terser@5.34.1_/node_modules/vite-tsconfig-paths/dist/index.js";
import { defineConfig } from "file:///C:/dev/ignite/forum-nest/node_modules/.pnpm/vitest@1.6.0_@types+node@20.16.11_terser@5.34.1/node_modules/vitest/dist/config.js";
var vitest_config_e2e_default = defineConfig({
  test: {
    include: ["**/*.e2e-spec.ts"],
    globals: true,
    root: "./",
    setupFiles: ["./src/tests/setup-e2e.ts"]
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: "es6" }
    })
  ]
});
export {
  vitest_config_e2e_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy5lMmUubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcZGV2XFxcXGlnbml0ZVxcXFxmb3J1bS1uZXN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxkZXZcXFxcaWduaXRlXFxcXGZvcnVtLW5lc3RcXFxcdml0ZXN0LmNvbmZpZy5lMmUubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9kZXYvaWduaXRlL2ZvcnVtLW5lc3Qvdml0ZXN0LmNvbmZpZy5lMmUubXRzXCI7aW1wb3J0IHN3YyBmcm9tICd1bnBsdWdpbi1zd2MnXHJcbmltcG9ydCB0c0NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGVzdC9jb25maWcnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHRlc3Q6IHtcclxuICAgIGluY2x1ZGU6IFsnKiovKi5lMmUtc3BlYy50cyddLFxyXG4gICAgZ2xvYmFsczogdHJ1ZSxcclxuICAgIHJvb3Q6ICcuLycsXHJcbiAgICBzZXR1cEZpbGVzOiBbJy4vc3JjL3Rlc3RzL3NldHVwLWUyZS50cyddLFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgdHNDb25maWdQYXRocygpLFxyXG4gICAgc3djLnZpdGUoe1xyXG4gICAgICBtb2R1bGU6IHsgdHlwZTogJ2VzNicgfSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1IsT0FBTyxTQUFTO0FBQ2hTLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsb0JBQW9CO0FBRTdCLElBQU8sNEJBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxJQUNKLFNBQVMsQ0FBQyxrQkFBa0I7QUFBQSxJQUM1QixTQUFTO0FBQUEsSUFDVCxNQUFNO0FBQUEsSUFDTixZQUFZLENBQUMsMEJBQTBCO0FBQUEsRUFDekM7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLGNBQWM7QUFBQSxJQUNkLElBQUksS0FBSztBQUFBLE1BQ1AsUUFBUSxFQUFFLE1BQU0sTUFBTTtBQUFBLElBQ3hCLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
