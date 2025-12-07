import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import reactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

export default [
  // Reglas base de JS
  js.configs.recommended,

  // Reglas base de TypeScript
  ...tseslint.configs.recommended,

  // Reglas base de React + JSX runtime
  reactRecommended,
  reactJsxRuntime,

  // React hooks + ajustes de reglas
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      // Reglas recomendadas de hooks
      ...reactHooks.configs.recommended.rules,

      // Por ahora desactivamos este para que no te rompa el flujo.
      // Más adelante lo podemos volver a activar.
      "react-hooks/exhaustive-deps": "off",

      // Vamos a ser flexibles con `any` al principio.
      "@typescript-eslint/no-explicit-any": "off",

      // Unused vars: que solo avise (warn) y deje usar `_var` para cosas que sabemos que no vamos a usar.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
         "no-case-declarations": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // Integración con Prettier (desactiva reglas de formato que chocan)
  prettier,

  // Ignorar cosas que no nos interesan lint-ear por ahora
  {
    ignores: ["dist", "node_modules", "public/sw.js"],
  },

  // Opciones generales de parser
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
];
