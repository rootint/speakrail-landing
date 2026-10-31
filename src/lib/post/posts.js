// Every post's slug, title and date, newest first: read from the frontmatter of src/posts/*/index.svx.

/** @typedef {{ slug: string, title: string, date: string }} PostSummary */

const metas = /** @type {Record<string, { title: string, date: string }>} */ (
	import.meta.glob('/src/posts/*/index.svx', { eager: true, import: 'metadata' })
);

/** @type {PostSummary[]} */
export const posts = Object.entries(metas)
	.map(([path, m]) => ({ slug: path.split('/')[3], title: m.title, date: m.date }))
	.sort((a, b) => +new Date(b.date) - +new Date(a.date));

/**
 * The posts on either side of `slug` in time.
 * @param {string} slug
 */
export function neighbours(slug) {
	const i = posts.findIndex((p) => p.slug === slug);
	return { older: posts[i + 1] ?? null, newer: i > 0 ? posts[i - 1] : null };
}
