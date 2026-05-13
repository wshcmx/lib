import { execSync } from "node:child_process";
import { cpSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

const { values: args } = parseArgs({
  options: {
    build: { type: "boolean", default: false },
    watch: { type: "boolean", default: false },
    publish: { type: "boolean", default: false }
  }
});

const PROJECT_ROOT_PATH = resolve(import.meta.dirname, '..', 'src');
const STATIC_FILES = [
    "LICENSE",
    "package.json",
    "package-lock.json",
]

function cleanDist() {
    rmSync(resolve(PROJECT_ROOT_PATH, '../dist'), { recursive: true, force: true });
}

function buildProject() {
    execSync(`wshcmx build --include-non-ts-files`, { stdio: "inherit", cwd: PROJECT_ROOT_PATH });

    for (const file of STATIC_FILES) {
        cpSync(resolve(PROJECT_ROOT_PATH, '..', file), resolve(PROJECT_ROOT_PATH, '../dist', file), { force: true });
    }
}

function watchProject() {
    execSync(`wshcmx watch --include-non-ts-files`, { stdio: "inherit", cwd: PROJECT_ROOT_PATH });
}

function publishProject() {
    execSync(`npm publish`, { stdio: "inherit", cwd: PROJECT_ROOT_PATH });
}

if (args.build) {
   console.log("Building the project...");
   cleanDist();
   buildProject();
} else if (args.watch) {
    console.log("Watching for changes...");
    watchProject()
} else if (args.publish) {
    console.log("Building the project...");
    cleanDist();
    buildProject();
    console.log("Publishing the project...");
    publishProject();
} else {
    console.log("No valid options provided. Use --build, --watch, or --publish.");
}