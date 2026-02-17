/**
 * ESLint config (Next.js).
 *
 * Note: `npm run lint:fix` only auto-fixes rules that have fixers. Many of our
 * reported issues (e.g. @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect,
 * react-hooks/refs) have no automatic fix and require manual code changes.
 */
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
