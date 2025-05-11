import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";

// 基础配置
const baseConfig = {
  input: "src/index.ts",
  plugins: [nodeResolve(), commonjs(), json()],
};

// 浏览器使用的配置（打包依赖）
const browserConfig = {
  ...baseConfig,
  output: [
    {
      // UMD 格式（未压缩版）
      file: "publish/dist/wemt.js",
      format: "umd",
      name: "wemt",
      sourcemap: true,
    },
    {
      // UMD 格式（压缩版）
      file: "publish/dist/wemt.min.js",
      format: "umd",
      name: "wemt",
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    ...baseConfig.plugins,
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: false,
      rootDir: "./src",
    }),
  ],
};

// Node.js 使用的配置（不打包依赖）
const nodeConfig = {
  ...baseConfig,
  external: ["axios", "crypto-js"],
  output: [
    {
      // CommonJS 格式
      file: "publish/index.js",
      format: "cjs",
      sourcemap: false,
    },
  ],
  plugins: [
    ...baseConfig.plugins,
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "./publish",
      rootDir: "./src",
    }),
  ],
};

// 导出配置数组
export default [browserConfig, nodeConfig];
