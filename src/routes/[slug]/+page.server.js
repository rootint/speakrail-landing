// Which posts get a page (drafts don't), and each one's previous and next posts, read at build
// time (see posts.server.js for why it stays on the server). +page.js adds the post itself.
import { error } from '@sveltejs/kit';
import { isPublished, neighbours, posts } from '#lib/post/posts.server.js';

/** @returns {{ slug: string }[]} */
export const entries = () => posts.map((p) => ({ slug: p.slug }));

/** @param {{ params: { slug: string } }} event */
export function load({ params }) {
	if (!isPublished(params.slug)) error(404, 'Not found');
	return neighbours(params.slug);
}
