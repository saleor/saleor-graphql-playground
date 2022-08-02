// @ts-check
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";
import external from "rollup-plugin-peer-deps-external";
import dts from "rollup-plugin-dts";
import replace from "@rollup/plugin-replace";
import serve from "rollup-plugin-serve";
import postcss from "rollup-plugin-postcss";

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
      {
        file: packageJson.browser,
        format: "umd",
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
      process.env.NODE_ENV === "production" && terser(),
      json(),
      postcss({
        extract: true,
        plugins: [require("tailwindcss")(), require("autoprefixer")()],
      }),
      process.env.ROLLUP_WATCH &&
        serve({ contentBase: "", verbose: true, open: false }),
    ].filter((x) => x),
    inlineDynamicImports: true,
  },
  {
    input: "./dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
  },
];
