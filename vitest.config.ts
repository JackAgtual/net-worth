import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "jsdom",
          environment: "jsdom",
          include: ["**/*.test.tsx"],
        },
      },
    ],
  },
});
