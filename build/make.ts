import { execFileSync, execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { parse, resolve } from "node:path";
import { parseArgs } from "node:util";

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

function extractArchive(archivePath: string, destinationPath: string) {
    const normalizedArchivePath = archivePath.toLowerCase();

    if (normalizedArchivePath.endsWith(".tar.gz") || normalizedArchivePath.endsWith(".tgz")) {
        execFileSync("tar", ["-xzf", archivePath, "-C", destinationPath], { stdio: "inherit" });
        return;
    }

    if (normalizedArchivePath.endsWith(".tar")) {
        execFileSync("tar", ["-xf", archivePath, "-C", destinationPath], { stdio: "inherit" });
        return;
    }

    if (normalizedArchivePath.endsWith(".zip")) {
        if (process.platform === "win32") {
            execFileSync("powershell", ["-NoProfile", "-Command", `Expand-Archive -Path '${archivePath}' -DestinationPath '${destinationPath}' -Force`], { stdio: "inherit" });
        } else {
            execFileSync("unzip", ["-q", archivePath, "-d", destinationPath], { stdio: "inherit" });
        }
        return;
    }

    throw new Error(`❌ Unsupported archive format: ${archivePath}`);
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
    const releaseAsset = assets.find((asset: { name?: string }) => /\.(tar\.gz|tgz|tar|zip)$/i.test(asset.name ?? "")) ?? assets[0];

    if (!releaseAsset?.browser_download_url) {
        throw new Error("❌ Could not find a downloadable wshcmx/net package asset in the latest release.");
    }

    console.log(`📦 Fetching the ${latestRelease.tag_name} wshcmx/net package from GitHub...`);
    const netPackage = await (await fetch(releaseAsset.browser_download_url)).arrayBuffer();

    if (!netPackage) {
        throw new Error("❌ Could not fetch the latest wshcmx/net package. Please ensure you have the latest version of wshcmx installed.");
    }

    const assetName = releaseAsset.name ?? `wshcmx-net-${latestRelease.tag_name}.tgz`;
    const archiveExtension = assetName.match(/\.(tar\.gz|tgz|tar|zip)$/i)?.[0] ?? ".tgz";
    const netPackagePath = resolve(CACHE_PATH, `wshcmx-net-${latestRelease.tag_name}${archiveExtension}`);
    mkdirSync(CACHE_PATH, { recursive: true });
    writeFileSync(netPackagePath, Buffer.from(netPackage));
    mkdirSync(resolve(DIST_PATH, 'net'), { recursive: true });
    extractArchive(netPackagePath, resolve(DIST_PATH, 'net'));
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