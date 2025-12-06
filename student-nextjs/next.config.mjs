// eslint.config.mjs
import { defineConfig } from "eslint";
import next from "eslint-config-next";

export default defineConfig({
  extends: [
    ...next(),
  ],
  ignorePatterns: [
    ".next/**",
    "node_modules/**",
    "build/**",
    "out/**",
  ],
});
