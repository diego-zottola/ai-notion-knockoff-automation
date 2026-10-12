// Loaders for the synthetic clipboard fixtures in data/clipboard (regenerate with build-fixtures.mjs).
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'clipboard');

export const MOD = process.platform === 'darwin' ? 'Meta' : 'Control';
export const FIVE_MB = 5 * 1024 * 1024;

export const fixtureText = (name) => readFileSync(join(root, name), 'utf8');
export const fixtureBytes = (name) => readFileSync(join(root, name));
/** file:// URL of a fixture, for opening the manual-copy reference page in a browser. */
export const fixtureUrl = (name) => pathToFileURL(join(root, name)).href;

/** The two flavours a real copy puts on the clipboard for a fixture: HTML plus its plain-text rendering. */
export const clipboardOf = (base) => ({ html: fixtureText(`${base}.html`), text: fixtureText(`${base}.txt`) });

/** Expected visible text of each block of the large page, in order (see large-page.expected.json). */
export const largeExpected = () => JSON.parse(fixtureText('large-page.expected.json'));

/** A file payload that can cross the Playwright boundary (clipboard files and uploads). */
export const pngPayload = (color, name = `${color}.png`) => ({ name, mimeType: 'image/png', buffer: fixtureBytes(`images-${color}.png`) });
