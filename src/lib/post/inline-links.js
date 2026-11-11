// Markdown-style links, [label](https://…), inside a plain string from the frontmatter or a
// component prop (where markdown isn't run): the TL;DR, the demo cards' titles and descriptions.

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/;

/**
 * The text as runs of plain text and links, in order.
 * @param {string} text
 * @returns {({ text: string } | { label: string, href: string })[]}
 */
export function splitLinks(text) {
	return text
		.split(new RegExp(`(${LINK.source})`))
		.filter((part, i) => part && i % 4 < 2) // split keeps each match's two groups too: drop them
		.map((part) => {
			const m = part.match(new RegExp(`^${LINK.source}$`));
			return m ? { label: m[1], href: m[2] } : { text: part };
		});
}

/**
 * The text with each link reduced to its label: for aria-labels and the like.
 * @param {string} text
 */
export const stripLinks = (text) => text.replace(new RegExp(LINK.source, 'g'), '$1');
