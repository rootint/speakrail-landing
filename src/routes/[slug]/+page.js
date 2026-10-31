// Every folder in src/posts is a post at /<folder name>: its index.svx is the text, an optional
// Top.svelte is the custom section under the title. See src/posts/README.md.
import { error } from '@sveltejs/kit';
import { neighbours } from '#lib/post/posts.js';

const posts = import.meta.glob('/src/posts/*/index.svx');
const tops = import.meta.glob('/src/posts/*/Top.svelte');

/** @returns {{ slug: string }[]} */
export const entries = () => Object.keys(posts).map((path) => ({ slug: path.split('/')[3] }));

/** @param {{ params: { slug: string } }} event */
export async function load({ params }) {
	const dir = `/src/posts/${params.slug}`;
	const post = posts[`${dir}/index.svx`];
	if (!post) error(404, 'Not found');
	const top = tops[`${dir}/Top.svelte`];
	const [mod, topMod] = await Promise.all([post(), top?.()]);
	return {
		slug: params.slug,
		metadata: /** @type {any} */ (mod).metadata,
		Content: /** @type {any} */ (mod).default,
		Top: /** @type {any} */ (topMod)?.default ?? null,
		...neighbours(params.slug)
	};
}
