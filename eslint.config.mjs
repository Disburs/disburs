import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// eslint-config-next v16 ships native flat configs, so we spread them directly
// (no @eslint/eslintrc FlatCompat).
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "lib/api-types.ts", // generated from the backend OpenAPI spec
    ],
  },
  ...coreWebVitals,
  ...typescript,
  {
    // eslint-plugin-react-hooks v7 (pulled in by eslint-config-next v16) ships
    // the new React Compiler ruleset. Those rules are advisory on a
    // pre-compiler codebase and flag intentional patterns (SSR-safe mount
    // detection in DemoGate, setState-on-open in the modal, the demo/mock
    // pages), so keep them as warnings rather than failing CI. Everything else
    // — rules-of-hooks, exhaustive-deps, the TypeScript and Next rules — stays
    // an error. Revisit if/when we adopt the React Compiler.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/globals": "warn",
      "react-hooks/static-components": "warn",
    },
  },
];

export default eslintConfig;
