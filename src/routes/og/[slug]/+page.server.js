// /og/<slug>: the social preview card for a published post, to screenshot into
// src/posts/<slug>/og.png (npm run og). Not linked anywhere; noindex, and blocked in robots.txt.
import { error } from '@sveltejs/kit';
import { posts } from '#lib/post/posts.server.js';

/** @returns {{ slug: string }[]} */
export const entries = () => posts.map((p) => ({ slug: p.slug }));

/** @param {{ params: { slug: string } }} event */
export function load({ params }) {
	const post = posts.find((p) => p.slug === params.slug);
	if (!post) error(404, 'Not found');
	return { slug: post.slug, title: post.title };
}
