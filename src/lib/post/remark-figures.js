// remark plugin for mdsvex: an image on a line of its own is a figure, so lift it out of the
// paragraph markdown wraps it in (a <figure> can't sit inside a <p>). Images inside running text
// are left alone.

/** @typedef {{ type: string, children?: MdNode[] }} MdNode */

export function remarkFigures() {
	return (/** @type {MdNode} */ tree) => lift(tree);
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
