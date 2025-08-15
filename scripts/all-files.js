import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SCRIPT_DIR = path.join(ROOT, "scripts");
const SCRIPT_OUTPUT = path.join(SCRIPT_DIR, "output.txt");

// Ensure scripts folder exists
fs.mkdirSync(SCRIPT_DIR, { recursive: true });

// Priority order for src folders
const PRIORITY_FOLDERS = ["src/components", "src/stores", "src/views"];

// Ignore these dirs completely
const EXCLUDE_DIRS = new Set([
  "node_modules",
  "dist",
  ".git",
  ".vscode",
  "public",
]);

// Files to exclude completely (boilerplate/noise or self-output)
const EXCLUDE_FILES = [
  /^src\/styles\/tailwind\.css$/,
  /^src\/styles\/positions\.css$/,
  /^src\/main\.(js|ts)$/,
  /^src\/App\.vue$/,
  /^src\/assets\/vue\.svg$/,
  /^index\.html$/,
  /^pnpm-lock\.yaml$/,
  /^\.DS_Store$/,
  /^scripts\/all-files\.js$/,
  /^scripts\/.*\.txt$/,
];

const STRIP_LINES = [
  /^\s*<\/?template>/,
  /^\s*<\/?script.*>/,
  /^\s*<\/?style.*>/,
];

// Config files printed last (kept for debugging)
const CONFIG_FILES = [
  "vite.config.js",
  "tailwind.config.cjs",
  "postcss.config.cjs",
  "tsconfig.json",
  "package.json",
  ".gitignore",
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function renderFile(filePath) {
  const rel = path.relative(ROOT, filePath).replaceAll("\\", "/");

  // Skip excluded files
  if (EXCLUDE_FILES.some((re) => re.test(rel))) return "";

  let content = fs.readFileSync(filePath, "utf8");

  // For .vue, drop the boilerplate wrapper tags
  if (rel.endsWith(".vue")) {
    content = content
      .split("\n")
      .filter((line) => !STRIP_LINES.some((re) => re.test(line)))
      .join("\n")
      .trim();
    if (!content) return "";
  }

  // For src/data, include FULL raw contents (json/csv/txt/etc.)
  // Just fall through and print like any other file, but keep it raw.
  return `\n=== ${rel} ===\n${content}\n`;
}

// Collect files
const allFiles = walk(ROOT);

// Sort: priority src folders first, config files last, then alpha
const sortedFiles = allFiles.sort((a, b) => {
  const relA = path.relative(ROOT, a).replaceAll("\\", "/");
  const relB = path.relative(ROOT, b).replaceAll("\\", "/");

  const pA = PRIORITY_FOLDERS.findIndex((p) => relA.startsWith(p));
  const pB = PRIORITY_FOLDERS.findIndex((p) => relB.startsWith(p));

  const cfgA = CONFIG_FILES.some((cfg) => relA.endsWith(cfg));
  const cfgB = CONFIG_FILES.some((cfg) => relB.endsWith(cfg));
  if (cfgA && !cfgB) return 1;
  if (!cfgA && cfgB) return -1;

  if (pA !== -1 && pB === -1) return -1;
  if (pA === -1 && pB !== -1) return 1;
  if (pA !== -1 && pB !== -1) return pA - pB;

  return relA.localeCompare(relB);
});

// Write output
let out = "";
for (const f of sortedFiles) out += renderFile(f);
fs.writeFileSync(SCRIPT_OUTPUT, out, "utf8");
console.log(`Output written to ${SCRIPT_OUTPUT}`);
