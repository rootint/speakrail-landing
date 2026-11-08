<!-- A markdown image as a figure: ![alt](file.png "Caption"). A bare file name is looked up next to
     the post (src/posts/<slug>/), so it gets bundled; absolute paths and URLs are used as they are. -->
<script>
	import { getContext } from 'svelte';

	// width and height are the file's pixel size, from remark-figures.js: they keep the image's space
	// before it loads (CSS still sizes it to the column)
	/** @type {{ src: string, alt?: string, title?: string, width?: number, height?: number }} */
	let { src, alt = '', title = '', width, height } = $props();

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
	<img src={url} {alt} {width} {height} loading="lazy" decoding="async" />
	{#if title}<figcaption>{title}</figcaption>{/if}
</figure>
