// remark plugin for mdsvex: gives every ## heading its id in the built page, so a #link to a section
// works before (and without) JavaScript, and reader modes keep the heading as a link to itself.

import { slug } from './slug.js';

/** @typedef {{ type: string, depth?: number, value?: string, data?: Record<string, any>, children?: MdNode[] }} MdNode */

export function remarkHeadings() {
	return (/** @type {MdNode} */ tree) => walk(tree);
}

/** @param {MdNode} node */
function walk(node) {
	if (node.type === 'heading' && node.depth === 2) {
		node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id: slug(text(node)) } };
	}
	node.children?.forEach(walk);
}

/** @param {MdNode} node @returns {string} */
const text = (node) => node.value ?? node.children?.map(text).join('') ?? '';
