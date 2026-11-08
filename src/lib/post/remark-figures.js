// remark plugin for mdsvex: an image on a line of its own is a figure, so lift it out of the
// paragraph markdown wraps it in (a <figure> can't sit inside a <p>). Images inside running text
// are left alone.
// It also gives images next to the post their pixel size as width and height, so the page keeps
// their space before they load instead of growing as they come in (and jumping a reload's scroll).

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

/** @typedef {{ type: string, url?: string, data?: Record<string, any>, children?: MdNode[] }} MdNode */

export function remarkFigures() {
	return (/** @type {MdNode} */ tree, /** @type {{ filename?: string, path?: string }} */ file) => {
		lift(tree);
		const at = file.filename ?? file.path;
		if (at) size(tree, dirname(at));
	};
}

/** @param {MdNode} node */
function lift(node) {
	if (!node.children) return;
	node.children = node.children.map((child) => {
		const only = child.type === 'paragraph' && child.children?.length === 1 && child.children[0];
		if (only && only.type === 'image') return only;
		lift(child);
		return child;
	});
}

/** @param {MdNode} node @param {string} dir */
function size(node, dir) {
	// bare file names only, like Figure.svelte: absolute paths and URLs aren't next to the post
	if (node.type === 'image' && node.url && !/^(\/|[a-z]+:)/i.test(node.url)) {
		let wh;
		try {
			wh = measure(readFileSync(join(dir, node.url)));
		} catch {
			// missing file: leave it to the build to complain about
		}
		if (wh) node.data = { ...node.data, hProperties: { width: wh[0], height: wh[1] } };
	}
	node.children?.forEach((child) => size(child, dir));
}

/**
 * Width and height from a PNG, JPEG or GIF header; undefined for anything else (SVG, WebP, AVIF)
 * @param {Buffer} b
 * @returns {[number, number] | undefined}
 */
function measure(b) {
	if (b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
	if (b.toString('ascii', 0, 3) === 'GIF') return [b.readUInt16LE(6), b.readUInt16LE(8)];
	if (b[0] === 0xff && b[1] === 0xd8) {
		// walk the segments to the frame header (SOF0–15, minus the DHT/JPG/DAC markers in that range)
		for (let i = 2; i + 9 < b.length; i += 2 + b.readUInt16BE(i + 2)) {
			const m = b[i + 1];
			if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
				return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
		}
	}
}
