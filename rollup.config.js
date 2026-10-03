import { defineConfig } from "rollup";
import { string } from "rollup-plugin-string";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import css from "rollup-plugin-import-css";
import json from "@rollup/plugin-json";

export default defineConfig({
  input: "index.js",

  plugins: [
    string({
      include: ["template.handlebars"],
    }),
    nodeResolve(),
    commonjs(),
    css(),
    json(),
  ],

  output: {
    file: "dist/index.js",
    format: "es",
    sourcemap: true,
  },
});
