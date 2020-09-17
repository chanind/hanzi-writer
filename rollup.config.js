import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import pkg from "./package.json";
import license from "rollup-plugin-license";

const extensions = [".js", ".ts"];

export default [
  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: "src/HanziWriter.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
        exports: "default",
      },
      {
        file: "dist/hanzi-writer.min.js",
        format: "iife",
        name: "HanziWriter",
        sourcemap: true,
        plugins: [terser()],
        exports: "default",
      },
      {
        file: pkg.module,
        format: "es",
        sourcemap: true,
        exports: "default",
      },
    ],
    plugins: [
      resolve({ extensions }),
      babel({
        exclude: "node_modules/**",
        extensions,
        babelHelpers: "bundled",
      }),
      license({
        banner: `Hanzi Writer v<%= pkg.version %> | https://chanind.github.io/hanzi-writer`,
      }),
    ],
  },
];
