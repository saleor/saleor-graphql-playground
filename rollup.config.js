// @ts-check
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";
import external from "rollup-plugin-peer-deps-external";
import dts from "rollup-plugin-dts";
import replace from "@rollup/plugin-replace";
import css from "rollup-plugin-import-css";
import serve from "rollup-plugin-serve";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.tsx",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    external: [],
    plugins: [
      replace({
        preventAssignment: true,
        values: { "process.env.NODE_ENV": JSON.stringify("production") },
      }),
      external(),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      // terser(),
      json(),
      css(),
      process.env.ROLLUP_WATCH &&
        serve({ contentBase: "", verbose: true, open: false }),
    ],
    inlineDynamicImports: true,
  },
  {
    input: "./dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
  },
];
