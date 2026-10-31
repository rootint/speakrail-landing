<!-- A markdown image as a figure: ![alt](file.png "Caption"). A bare file name is looked up next to
     the post (src/posts/<slug>/), so it gets bundled; absolute paths and URLs are used as they are. -->
<script>
	import { getContext } from 'svelte';

	/** @type {{ src: string, alt?: string, title?: string }} */
	let { src, alt = '', title = '' } = $props();

	const files = /** @type {Record<string, string>} */ (
		import.meta.glob('/src/posts/*/*.{png,jpg,jpeg,webp,avif,gif,svg}', {
			eager: true,
			import: 'default'
		})
	);
	const post = /** @type {{ slug: string } | undefined} */ (getContext('post'));

	const url = $derived(
		/^(\/|[a-z]+:)/i.test(src)
			? src
			: (files[`/src/posts/${post?.slug}/${src.replace(/^\.\//, '')}`] ?? src)
	);
</script>

<figure>
	<img src={url} {alt} loading="lazy" decoding="async" />
	{#if title}<figcaption>{title}</figcaption>{/if}
</figure>
