import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    ignores: ["node_modules", "dist", "lib"],
  },
  // {
  //   files: ["**/*.{js,mjs,cjs,jsx}"],
  //   plugins: { js },
  //   extends: ["js/recommended"],
  // },
  // {
  //   files: ["**/*.{js,mjs,cjs,jsx}"],
  //   languageOptions: { globals: globals.browser },
  // },
  // pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js, react: pluginReact },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
      sourceType: "module",
    },
    settings: {
      react: { version: "detect" },
    },
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  pluginReact.configs.flat.recommended,
]);
