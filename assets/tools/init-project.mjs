// Scaffold-time mirror script: materializes the starter tree and the selected module pieces into a
// game directory, so step 6a never hand-copies files (references/structure/base.md §1 owns the WHY,
// assets/templates/README.md owns the flag table, workflow/06-scaffold.md owns the invocation).
//
// Run it from anywhere, once, before 6a starts authoring pages:
//   node <skill-repo>/assets/tools/init-project.mjs <game-dir> [--m1] [--m2] [--m3] [--m5] [--m6]
//       [--m7] [--m12] [--m14] [--device phone|desktop|browser-chrome|pure-web]
//
// Flags mirror docs/system-profile.md: one per selected module with a scaffold artifact, plus the
// device class. It copies ONLY what the flags select — shipping an unselected module is module
// drift (references/common-mistakes.md §6, guardrails R13).
//
// Contract:
//   - NEVER overwrites an existing file (docs/ may be filling up while steps 3-5 run); existing
//     files are skipped and reported.
//   - This script stays in the skill repo; it is NOT part of the project's tools/ copy.
//   - Network is not required. After it finishes, run `node tools/vendor-alpine.mjs` inside the
//     project to vendor the pinned Alpine runtime (checksum-verified; base.md §1).
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const STARTER = join(SKILL_ROOT, 'assets', 'starter');
const TEMPLATES = join(SKILL_ROOT, 'assets', 'templates');

// tools/ inventory (explicit list on purpose: globbing would sweep in scaffold-only scripts).
const PROJECT_TOOLS = [
  'config.mjs', 'hash.mjs', 'build-keywords.mjs', 'check-links.mjs', 'check-solvable.mjs',
  'check-credentials.mjs', 'check-reachability.mjs', 'vendor-alpine.mjs', 'site-model.mjs',
  'site-graph.mjs',
];

// flag -> component template under assets/templates/js/modules/ (order = concatenation order)
const COMPONENT_FLAGS = {
  '--m1': 'search.js', '--m2': 'gate.js', '--m3': 'access.js', '--m12': 'staging.js',
  '--m7': 'progress.js', '--m14': 'read-state.js',
};
const DEVICE_SKINS = { phone: 'phone.css', 'browser-chrome': 'chrome.css' };
const DEVICE_COMPONENT = { phone: 'phone.js' };

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('--'));
if (!target) {
  console.error('usage: node init-project.mjs <game-dir> [--m1] [--m2] [--m3] [--m5] [--m6] [--m7] [--m12] [--m14] [--device phone|desktop|browser-chrome|pure-web]');
  process.exit(1);
}
let device = null;
const flags = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--device') { device = args[++i]; if (!device) { console.error('ERROR  --device needs a value'); process.exit(1); } }
  else if (a.startsWith('--')) flags.push(a);
}
const known = [...Object.keys(COMPONENT_FLAGS), '--m5', '--m6', '--device'];
const unknown = flags.filter((f) => !known.includes(f));
if (unknown.length || (device && ![...Object.keys(DEVICE_SKINS), 'desktop', 'pure-web'].includes(device))) {
  console.error(`ERROR  unknown flag(s): ${[...unknown, ...(device && !DEVICE_SKINS[device] && device !== 'desktop' && device !== 'pure-web' ? [`--device ${device}`] : [])].join(' ')}`);
  process.exit(1);
}
if (!existsSync(STARTER)) { console.error(`ERROR  starter not found: ${STARTER} (run from the skill repo)`); process.exit(1); }

const gameDir = resolve(target);
mkdirSync(gameDir, { recursive: true });
const copied = [], skipped = [];

function mirror(src, dest) {
  if (existsSync(dest)) { skipped.push(dest.slice(gameDir.length + 1)); return false; }
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
  copied.push(dest.slice(gameDir.length + 1));
  return true;
}

function mirrorTree(srcDir, destDir) {
  for (const e of readdirSync(srcDir, { withFileTypes: true })) {
    const s = join(srcDir, e.name), d = join(destDir, e.name);
    if (e.isDirectory()) mirrorTree(s, d); else mirror(s, d);
  }
}

// 1. Starter tree (entry shell, base.css + surface.css, components.js kernel, both ignore files, README)
mirrorTree(STARTER, gameDir);

// 2. Project tools/ + viewer/ + docs/
for (const f of PROJECT_TOOLS) mirror(join(SKILL_ROOT, 'assets', 'tools', f), join(gameDir, 'tools', f));
mirrorTree(join(SKILL_ROOT, 'assets', 'viewer'), join(gameDir, 'viewer'));
mkdirSync(join(gameDir, 'docs'), { recursive: true });

// 3. Conditional skins (css) — only what the flags select
if (flags.includes('--m5')) mirror(join(TEMPLATES, 'css', 'secret.css'), join(gameDir, 'assets', 'css', 'secret.css'));
if (flags.includes('--m6')) mirror(join(TEMPLATES, 'css', 'forbidden.css'), join(gameDir, 'assets', 'css', 'forbidden.css'));
if (device && DEVICE_SKINS[device]) mirror(join(TEMPLATES, 'css', DEVICE_SKINS[device]), join(gameDir, 'assets', 'css', DEVICE_SKINS[device]));

// 4. Component bodies: splice the selected Alpine.data(...) registrations into the kernel's
//    alpine:init listener. Skipped with a warning if the kernel was already edited by hand.
const componentFiles = [
  ...Object.entries(COMPONENT_FLAGS).filter(([f]) => flags.includes(f)).map(([, file]) => file),
  ...(device && DEVICE_COMPONENT[device] ? [DEVICE_COMPONENT[device]] : []),
];
if (componentFiles.length) {
  const kernelPath = join(gameDir, 'assets', 'js', 'components.js');
  const kernel = readFileSync(kernelPath, 'utf8');
  const m = kernel.match(/document\.addEventListener\('alpine:init', \(\) => \{\n([\s\S]*?)\n\}\);\s*$/);
  const isPlaceholder = m && m[1].split('\n').every((l) => l.trim() === '' || l.trim().startsWith('//'));
  if (!isPlaceholder) {
    const bodyOf = (f) => readFileSync(join(TEMPLATES, 'js', 'modules', f), 'utf8');
    const missing = componentFiles.filter((f) => !kernel.includes(`Alpine.data('${bodyOf(f).match(/Alpine\.data\('([^']+)'/)[1]}'`));
    if (missing.length) {
      console.warn('WARN   components.js alpine:init listener is not the starter placeholder; splice these bodies manually:');
      for (const f of missing) console.warn(`         assets/templates/js/modules/${f}`);
    } else {
      console.log('components.js already carries every selected body — left untouched');
    }
  } else {
    const bodies = componentFiles
      .map((f) => readFileSync(join(TEMPLATES, 'js', 'modules', f), 'utf8').trimEnd())
      .join('\n\n');
    writeFileSync(kernelPath, kernel.replace(/document\.addEventListener\('alpine:init', \(\) => \{\n[\s\S]*?\n\}\);\s*$/, `document.addEventListener('alpine:init', () => {\n${bodies}\n});\n`));
    copied.push(`assets/js/components.js (alpine:init += ${componentFiles.join(', ')})`);
  }
}

// 5. M1: empty-but-legal plaintext keyword sources, then the hashed tables they generate
if (flags.includes('--m1')) {
  for (const name of ['keywords.surface.src.json', 'keywords.secret.src.json']) {
    const p = join(gameDir, 'data', name);
    if (!existsSync(p)) { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, '{}\n'); copied.push(`data/${name} (empty)`);
    } else skipped.push(`data/${name}`);
  }
  const r = spawnSync(process.execPath, ['tools/build-keywords.mjs'], { cwd: gameDir, stdio: 'inherit' });
  if (r.status !== 0) { console.error('ERROR  build-keywords.mjs failed on the empty tables'); process.exit(1); }
}

console.log(`copied (${copied.length}):`);
for (const c of copied) console.log(`  + ${c}`);
if (skipped.length) { console.log(`skipped, already present (${skipped.length}):`); for (const s of skipped) console.log(`  = ${s}`); }
console.log('next: node tools/vendor-alpine.mjs   (vendors the pinned Alpine runtime; needs network)');
