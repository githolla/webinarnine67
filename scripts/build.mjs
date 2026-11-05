import { cpSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import './check.mjs';

const source = fileURLToPath(new URL('../dist/', import.meta.url));
const output = fileURLToPath(new URL('../build/', import.meta.url));
rmSync(output, { recursive: true, force: true });
cpSync(source, output, { recursive: true });
console.log('Build complete. Publish the build/ directory.');
