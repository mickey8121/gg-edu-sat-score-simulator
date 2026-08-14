import { readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { compile } from "tailwindcss";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_DIRS = ["app", "components", "lib"];
const SCAN_EXT = new Set([".ts", ".tsx"]);

// globals.css clears --color-*, --radius-* and --shadow-*, so utilities like
// rounded-2xl or bg-blue-500 silently emit nothing. Compiling the same
// candidates against stock Tailwind tells a removed utility apart from a
// string that was never a utility (cva variant keys, prop values).
const loadStylesheet = async (id, base) => {
  if (id === "tailwindcss") {
    return {
      base: join(root, "node_modules/tailwindcss"),
      content: readFileSync(join(root, "node_modules/tailwindcss/index.css"), "utf8"),
    };
  }
  const path = id.startsWith(".") ? resolve(base, id) : resolve(root, id);
  return { base: dirname(path), content: readFileSync(path, "utf8") };
};

const notSupported = (what) => () => {
  throw new Error(`${what} is not supported in the utility check`);
};

const walk = (dir, out = []) => {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else if (SCAN_EXT.has(extname(entry.name))) out.push(path);
  }
  return out;
};

const STRING_LITERAL = /"([^"\n]*)"|'([^'\n]*)'|`([^`\n]*)`/g;
const CANDIDATE = /^[a-z0-9![][a-z0-9:/.[\]_!&>~*+-]*$/;
// Only class-carrying positions, so prose ("Radius & shadow") and string-union
// types ("radius" | "shadow") are never mistaken for utilities.
const CLASS_REGION = /class(?:Name)?\s*[=:]\s*|\b(?:cn|cva|[A-Za-z_$][\w$]*Variants)\s*\(/g;
const OPENERS = { "{": "}", "(": ")", "[": "]" };

const regionEnd = (source, start) => {
  let index = start;
  while (index < source.length && /\s/.test(source[index])) index += 1;
  const opener = source[index];
  if (opener === '"' || opener === "'" || opener === "`") {
    const end = source.indexOf(opener, index + 1);
    return end === -1 ? index + 1 : end + 1;
  }
  const closer = OPENERS[opener];
  if (!closer) return index;
  let depth = 0;
  for (let i = index; i < source.length; i += 1) {
    if (source[i] === opener) depth += 1;
    else if (source[i] === closer) {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
  }
  return source.length;
};

const candidatesOf = (source) => {
  const found = new Map();
  for (const match of source.matchAll(CLASS_REGION)) {
    const start = (match.index ?? 0) + match[0].length;
    const region = source.slice(start, regionEnd(source, start));
    for (const literal of region.matchAll(STRING_LITERAL)) {
      const value = literal[1] ?? literal[2] ?? literal[3] ?? "";
      for (const token of value.split(/\s+/)) {
        if (token.length > 0 && CANDIDATE.test(token) && !found.has(token)) {
          found.set(token, start);
        }
      }
    }
  }
  return found;
};

const files = SCAN_DIRS.flatMap((dir) => walk(join(root, dir)));
const byCandidate = new Map();
for (const file of files) {
  const source = readFileSync(file, "utf8");
  for (const [candidate, index] of candidatesOf(source)) {
    const line = source.slice(0, index).split("\n").length;
    if (!byCandidate.has(candidate)) byCandidate.set(candidate, []);
    byCandidate.get(candidate).push(`${relative(root, file)}:${line}`);
  }
}

const options = { base: root, loadStylesheet, loadModule: notSupported("@plugin"), onDependency: () => {} };
const ours = await compile(readFileSync(join(root, "app/globals.css"), "utf8"), options);
const stock = await compile('@import "tailwindcss";', options);

// build() returns the whole sheet and accumulates candidates across calls, so a
// candidate emitted a rule iff feeding it made the output longer.
const emits = (compiler, candidates) => {
  let previous = compiler.build([]).length;
  const result = new Map();
  for (const candidate of candidates) {
    const length = compiler.build([candidate]).length;
    result.set(candidate, length > previous);
    previous = length;
  }
  return result;
};

const candidates = [...byCandidate.keys()];
const emittedByOurs = emits(ours, candidates);
const emittedByStock = emits(stock, candidates);

const removed = [];
for (const [candidate, sites] of byCandidate) {
  if (emittedByOurs.get(candidate)) continue;
  if (!emittedByStock.get(candidate)) continue;
  removed.push({ candidate, sites });
}

if (removed.length === 0) {
  console.log(`check-utilities: ${byCandidate.size} candidates across ${files.length} files, all resolve`);
  process.exit(0);
}

console.error(
  `check-utilities: ${removed.length} utility/utilities compile to nothing here but exist in stock Tailwind.\n` +
    `This project clears --color-*, --radius-* and --shadow-*. Use a project token instead.\n`,
);
for (const { candidate, sites } of removed.sort((a, b) => a.candidate.localeCompare(b.candidate))) {
  console.error(`  ${candidate}\n      ${sites.join("\n      ")}`);
}
process.exit(1);
