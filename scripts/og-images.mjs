// Renders each published post's social preview card (/og/<slug>) into src/posts/<slug>/og.png.
// Run after a build, while `npm run preview` serves it:  npm run build && npm run preview, then
// npm run og  (another terminal). Uses a local Chrome; set CHROME to its path if it isn't the macOS one.
import { spawn } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = process.env.BASE ?? 'http://localhost:4173';
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9399;

// published posts: a folder in src/posts with an index.svx that isn't `draft: true`
const slugs = readdirSync('src/posts', { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => d.name)
	.filter((slug) => {
		try {
			const fm = readFileSync(join('src/posts', slug, 'index.svx'), 'utf8').split('\n---')[0];
			return !/^draft:\s*true/m.test(fm);
		} catch {
			return false;
		}
	});

const chrome = spawn(
	CHROME,
	[
		'--headless=new',
		`--remote-debugging-port=${PORT}`,
		`--user-data-dir=${mkdtempSync(join(tmpdir(), 'og-'))}`,
		'about:blank'
	],
	{ stdio: 'ignore' }
);
const sleep = (/** @type {number} */ ms) => new Promise((r) => setTimeout(r, ms));
/** @type {WebSocket | undefined} */
let ws;
for (let i = 0; i < 40 && !ws; i++) {
	try {
		const targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
		const page = targets.find((/** @type {{ type: string }} */ t) => t.type === 'page');
		if (page) ws = new WebSocket(page.webSocketDebuggerUrl);
	} catch {
		await sleep(250);
	}
}
if (!ws) throw new Error('Chrome did not start');
const socket = ws;
await new Promise((r) => socket.addEventListener('open', r));
let id = 0;
const pending = new Map();
socket.addEventListener('message', (e) => {
	const m = JSON.parse(String(e.data));
	if (m.id && pending.has(m.id)) (pending.get(m.id)(m), pending.delete(m.id));
});
const send = (/** @type {string} */ method, params = {}) =>
	new Promise((resolve) => {
		const i = ++id;
		pending.set(i, resolve);
		socket.send(JSON.stringify({ id: i, method, params }));
	});

await send('Emulation.setDeviceMetricsOverride', {
	width: 1200,
	height: 630,
	deviceScaleFactor: 1,
	mobile: false
});
for (const slug of slugs) {
	await send('Page.navigate', { url: `${BASE}/og/${slug}` });
	await sleep(2000); // fonts
	/** @type {any} */
	const shot = await send('Page.captureScreenshot', {
		format: 'png',
		clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 }
	});
	writeFileSync(join('src/posts', slug, 'og.png'), Buffer.from(shot.result.data, 'base64'));
	console.log(`src/posts/${slug}/og.png`);
}
socket.close();
chrome.kill();
