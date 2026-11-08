// Every folder in src/posts is a post at /<folder name>: its index.svx is the text, an optional
// Top.svelte is the custom section under the title. See src/posts/README.md.
// Lazy imports, so a page downloads only its own post; the previous/next links come from
// +page.server.js as `data`, which also lists the pages to build and turns drafts away.
import { error } from '@sveltejs/kit';

const posts = import.meta.glob('/src/posts/*/index.svx');
const tops = import.meta.glob('/src/posts/*/Top.svelte');

/** @param {{ params: { slug: string }, data: import('./$types').PageServerData }} event */
export async function load({ params, data }) {
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
		...data
	};
}
