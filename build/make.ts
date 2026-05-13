import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

import decompress from 'decompress';

const { values: args } = parseArgs({
  options: {
    clean: { type: "boolean", default: false, short: "c" },
    build: { type: "boolean", default: false, short: "b" },
    watch: { type: "boolean", default: false, short: "w" },
    publish: { type: "boolean", default: false, short: "p" }
  }
});

const PROJECT_ROOT_PATH = resolve(import.meta.dirname, '..');
const PROJECT_SRC_PATH = resolve(import.meta.dirname, '..', 'src');
const DIST_PATH = resolve(PROJECT_ROOT_PATH, 'dist');
const CACHE_PATH = resolve(PROJECT_ROOT_PATH, '.cache');
const STATIC_FILES = [
    "LICENSE",
    "package.json",
    "package-lock.json",
];

function cleanDist() {
    rmSync(DIST_PATH, { recursive: true, force: true });
}

async function downloadLatestWshcmxVersion() {
    if (existsSync(resolve(DIST_PATH, 'net'))) {
        console.log("⏩ Latest wshcmx/net package already exists in dist. Skipping download.");
        return;
    }

    console.log("📦 Fetching the latest wshcmx/net package from GitHub...");
    const latestRelease = await (await fetch("https://api.github.com/repos/wshcmx/net/releases/latest")).json();

    if (!latestRelease) {
        throw new Error("❌ Could not fetch the latest release. Please ensure you have the latest version of wshcmx installed.");
    }

    const { assets } = latestRelease;
    const netPackage = await (await fetch(assets[0].browser_download_url)).arrayBuffer();

    if (!netPackage) {
        throw new Error("❌ Could not fetch the latest wshcmx/net package. Please ensure you have the latest version of wshcmx installed.");
    }

    const netPackagePath = resolve(CACHE_PATH, 'wshcmx-net-latest.tgz');
    mkdirSync(CACHE_PATH, { recursive: true });
    writeFileSync(netPackagePath, Buffer.from(netPackage));
    await decompress(netPackagePath, resolve(DIST_PATH, 'net'));
}

async function buildProject() {
    await downloadLatestWshcmxVersion();
    execSync(`wshcmx build --include-non-ts-files`, { stdio: "inherit", cwd: PROJECT_SRC_PATH });

    for (const file of STATIC_FILES) {
        cpSync(resolve(PROJECT_ROOT_PATH, file), resolve(DIST_PATH, file), { force: true });
    }

    renameSync(resolve(PROJECT_ROOT_PATH, 'node_modules'), resolve(DIST_PATH, 'node_modules'));
}

function watchProject() {
    execSync(`wshcmx watch --include-non-ts-files`, { stdio: "inherit", cwd: PROJECT_SRC_PATH });
}

function publishProject() {
    execSync(`npm publish`, { stdio: "inherit", cwd: PROJECT_SRC_PATH });
}

if (args.clean) {
    console.log("🧹 Cleaning dist directory...");
    cleanDist();
} else if (args.build) {
   console.log("🏗️ Building the project...");
   buildProject();
} else if (args.watch) {
    console.log("👀 Watching for changes...");
    watchProject()
} else if (args.publish) {
    console.log("🚀 Publishing the project...");
    publishProject();
} else {
    console.log("❌ No valid options provided. Use --build, --watch, or --publish.");
}