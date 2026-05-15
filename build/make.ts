import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { parse, resolve } from "node:path";
import { parseArgs } from "node:util";

import decompress from 'decompress';

const { values: args, positionals: commands } = parseArgs({
  options: {
    clean: { type: "boolean", default: false, short: "c" }
  },
  allowPositionals: true
});

const PROJECT_ROOT_PATH = resolve(import.meta.dirname, '..');
const PROJECT_SRC_PATH = resolve(import.meta.dirname, '..', 'src');
const DIST_PATH = resolve(PROJECT_ROOT_PATH, 'dist');
const CACHE_PATH = resolve(PROJECT_ROOT_PATH, '.cache');
const STATIC_FILES = [
    "LICENSE",
    "package.json",
    "package-lock.json",
    "src/index.xml"
];

function cleanDist() {
    console.log("🧹 Cleaning dist directory...");
    rmSync(DIST_PATH, { recursive: true, force: true });
}

async function downloadLatestWshcmxVersion() {
    if (existsSync(resolve(DIST_PATH, 'net'))) {
        console.log("⏩ Latest wshcmx/net package already exists in dist. Skipping download.");
        return;
    }

    if (process.env.WSHCMX_NET_PATH) {
        const localNetPath = resolve(process.env.WSHCMX_NET_PATH);
        if (!existsSync(localNetPath)) {
            throw new Error(`❌ The specified wshcmx/net package path does not exist: ${localNetPath}`);
        }
        cpSync(localNetPath, resolve(DIST_PATH, 'net'), { recursive: true });
        console.log("⏩ Using local wshcmx/net package from environment variable.");
        return;
    }

    console.log("📦 Finding the latest wshcmx/net package from GitHub...");
    const latestRelease = await (await fetch("https://api.github.com/repos/wshcmx/net/releases/latest")).json();

    if (!latestRelease) {
        throw new Error("❌ Could not fetch the latest release. Please ensure you have the latest version of wshcmx installed.");
    }

    const { assets } = latestRelease;
    console.log(`📦 Fetching the ${latestRelease.tag_name} wshcmx/net package from GitHub...`);
    const netPackage = await (await fetch(assets[0].browser_download_url)).arrayBuffer();

    if (!netPackage) {
        throw new Error("❌ Could not fetch the latest wshcmx/net package. Please ensure you have the latest version of wshcmx installed.");
    }

    const netPackagePath = resolve(CACHE_PATH, `wshcmx-net-${latestRelease.tag_name}.tgz`);
    mkdirSync(CACHE_PATH, { recursive: true });
    writeFileSync(netPackagePath, Buffer.from(netPackage));
    await decompress(netPackagePath, resolve(DIST_PATH, 'net'));
}

async function buildProject() {
    console.log("🏗️  Building the project...");
    await downloadLatestWshcmxVersion();
    execSync(`wshcmx build --include-non-ts-files`, { stdio: "inherit", cwd: PROJECT_SRC_PATH });

    for (const file of STATIC_FILES) {
        cpSync(resolve(PROJECT_ROOT_PATH, file), resolve(DIST_PATH, parse(file).base), { force: true });
    }
}

if (commands[0] == "clean" || args.clean) {
    cleanDist();
}

if (commands[0] == "build") {
    buildProject();
} else if (commands[0] == "watch") {
    console.log("👀 Watching for changes...");
    buildProject();
    execSync(`wshcmx watch --include-non-ts-files`, { stdio: "inherit", cwd: PROJECT_SRC_PATH });
} else {
    console.log("❌ No valid options provided. Use --build, --watch, or --publish.");
}