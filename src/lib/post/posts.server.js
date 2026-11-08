// Every published post's slug, title, date and description, newest first: read from the frontmatter
// of src/posts/*/index.svx. A post with `draft: true` in its frontmatter is left out everywhere:
// no page, not in the list, the previous/next links or llms.txt.
// Server-only (it runs at build time): reading the frontmatter means importing each post whole, so
// in the browser it would download every post's text on every page. Pages get the list through
// their +page.server.js instead.

/** @typedef {{ slug: string, title: string, date: string, description?: string }} PostSummary */

const metas =
	/** @type {Record<string, { title: string, date: string, description?: string, draft?: boolean }>} */ (
		import.meta.glob('/src/posts/*/index.svx', { eager: true, import: 'metadata' })
	);

/** @type {PostSummary[]} */
export const posts = Object.entries(metas)
	.filter(([, m]) => !m.draft)
	.map(([path, m]) => ({
		slug: path.split('/')[3],
		title: m.title,
		date: m.date,
		description: m.description
	}))
	.sort((a, b) => +new Date(b.date) - +new Date(a.date));

/** @param {string} slug */
export const isPublished = (slug) => posts.some((p) => p.slug === slug);

/**
 * The posts on either side of `slug` in time.
 * @param {string} slug
 */
export function neighbours(slug) {
	const i = posts.findIndex((p) => p.slug === slug);
	return { older: posts[i + 1] ?? null, newer: i > 0 ? posts[i - 1] : null };
}
