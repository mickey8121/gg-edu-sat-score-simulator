import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig, globalIgnores } from "eslint/config";

const collapse = (selector) => selector.replace(/\s+/g, "");

const VALUE_DECLARATION = collapse(`:matches(
  VariableDeclaration,
  FunctionDeclaration,
  ClassDeclaration,
  ExportDefaultDeclaration,
  ExportNamedDeclaration[declaration.type=/^(VariableDeclaration|FunctionDeclaration|ClassDeclaration)$/]
)`);

const TYPE_DECLARATION = collapse(`:matches(
  TSTypeAliasDeclaration,
  TSInterfaceDeclaration,
  ExportNamedDeclaration[declaration.type=/^(TSTypeAliasDeclaration|TSInterfaceDeclaration)$/]
)`);

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

  {
    plugins: { perfectionist },
    rules: {
      "perfectionist/sort-imports": [
        "error",
        {
          type: "alphabetical",
          order: "asc",
          ignoreCase: true,
          newlinesBetween: 1,
          internalPattern: ["^@/.*"],
          groups: [
            ["value-builtin", "type-builtin"],
            ["value-external", "type-external"],
            ["value-internal", "type-internal"],
            [
              "value-parent",
              "type-parent",
              "value-sibling",
              "type-sibling",
              "value-index",
              "type-index",
            ],
            "style",
            "side-effect",
            "side-effect-style",
            "unknown",
          ],
        },
      ],
      "import/first": "error",
      "func-style": ["error", "expression"],
      semi: ["error", "always"],
    },
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: `Program > ${VALUE_DECLARATION} ~ ${TYPE_DECLARATION}`,
          message:
            "Declare every type and interface above the first value. Module order is imports -> types -> values.",
        },
      ],
      "react/function-component-definition": [
        "error",
        { namedComponents: "arrow-function", unnamedComponents: "arrow-function" },
      ],
    },
  },
]);

export default eslintConfig;
