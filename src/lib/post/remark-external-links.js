// remark plugin for mdsvex: links out of the site open in a new tab and don't send a referrer
// (noreferrer also implies noopener), like the links in the components.

/** @typedef {{ type: string, url?: string, data?: Record<string, any>, children?: MdNode[] }} MdNode */

export function remarkExternalLinks() {
	return (/** @type {MdNode} */ tree) => walk(tree);
}

/** @param {MdNode} node */
function walk(node) {
	if (node.type === 'link' && /^https?:\/\//i.test(node.url ?? '')) {
		node.data = {
			...node.data,
			hProperties: { ...node.data?.hProperties, target: '_blank', rel: 'noreferrer' }
		};
	}
	node.children?.forEach(walk);
}
