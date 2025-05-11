import { execSync } from "child_process";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "fs";
import { join, resolve } from "path";
import { cp } from "fs/promises";

// 根目录路径
const ROOT_PATH = resolve(process.cwd());
const PUBLISH_PATH = join(ROOT_PATH, "publish");

// 需要过滤的配置项
const FILTERED_CONFIG = {
  scripts: ["publish", "test", "test:watch", "test:coverage"],
  devDependencies: ["@types/jest", "jest", "ts-jest", "tslib"],
};

// 复制配置
const COPY_CONFIG = [
  {
    type: "file",
    source: "docs/LICENSE",
    target: "LICENSE",
    description: "LICENSE",
  },
  {
    type: "file",
    source: "docs/README.md",
    target: "README.md",
    description: "README.md",
  },
  {
    type: "dir",
    source: "docs",
    target: "docs",
    description: "docs directory",
  },
];

(async function main() {
  try {
    // 清理并创建 publish 目录
    console.log("Cleaning publish directory...");
    try {
      rmSync(PUBLISH_PATH, { recursive: true, force: true });
    } catch (error) {
      // 忽略目录不存在的错误
    }
    mkdirSync(PUBLISH_PATH, { recursive: true });

    console.log("Building project...");
    execSync("npm run build", { stdio: "inherit" });

    console.log("Reading package.json...");
    const packageJson = JSON.parse(readFileSync(join(ROOT_PATH, "package.json"), "utf-8"));

    // 创建发布用的 package.json
    const { ...restPackageJson } = packageJson;
    const publishPackageJson = {
      ...restPackageJson,
      ...Object.fromEntries(
        Object.entries(restPackageJson).map(([key, value]) => {
          if (FILTERED_CONFIG[key]) {
            return [key, Object.fromEntries(Object.entries(value).filter(([k]) => !FILTERED_CONFIG[key].includes(k)))];
          }
          return [key, value];
        })
      ),
      files: ["dist", "src", "docs", "LICENSE", "README.md"],
    };

    // 写入发布用的 package.json
    console.log("Writing package.json for publish...");
    writeFileSync(join(PUBLISH_PATH, "package.json"), JSON.stringify(publishPackageJson, null, 2));

    // 执行复制操作
    for (const config of COPY_CONFIG) {
      console.log(`Copying ${config.description}...`);
      try {
        const source = join(ROOT_PATH, config.source);
        const target = join(PUBLISH_PATH, config.target);

        if (config.type === "file") {
          copyFileSync(source, target);
        } else if (config.type === "dir") {
          await cp(source, target, { recursive: true, force: true });
        }
      } catch (error) {
        console.error(`Error copying ${config.description}:`, error);
        throw error;
      }
    }

    console.log("Publish preparation completed successfully!");
  } catch (error) {
    console.error("Error during publish preparation:", error);
    process.exit(1);
  }
})();
