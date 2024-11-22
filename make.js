import { basename, resolve } from 'node:path';
import fs from 'node:fs';

const cwd = process.cwd();
const dest = resolve(cwd, '..', '..', '..');
const distPath = resolve(cwd, 'src');

fs.readdirSync(distPath).map(x => resolve(distPath, x)).forEach(x => {
  fs.renameSync(x, resolve(dest, basename(x)));
});

fs.rmSync(resolve(dest, "node_modules"), { recursive: true, force: true });
