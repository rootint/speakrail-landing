<!-- A pink citation number in the text, with an optional `note`: a sentence on what the source
     says, shown beside the sentence in the right margin. In a post, `id` names one of the sources in
     its frontmatter; a page can pass the `source` itself instead. Clicking the number flashes that note; when
     the margin is hidden (narrow screens) it goes to the full entry at the end of the post. -->
<script>
	import { getContext } from 'svelte';

	/** @type {{ id?: string, source?: import('./sources.js').Source, note?: string }} */
	let { id, source: given, note = '' } = $props();

	const post =
		/** @type {{ sources: Record<string, import('./sources.js').Source> } | undefined} */ (
			getContext('post')
		);
	const source = $derived(given ?? post?.sources[id ?? '']);
	// a typo in the id renders nothing; say so in the console
	$effect(() => {
		if (!source) console.warn(`<Cite>: no source "${id}" in this post's frontmatter`);
	});

	/** @param {MouseEvent & { currentTarget: HTMLAnchorElement }} e */
	function onclick(e) {
		const i = [...document.querySelectorAll('[data-source]')].indexOf(e.currentTarget);
		const side = document.getElementById(`sidenote-${i}`);
		if (!side?.offsetParent) return; // margin hidden: follow the link
		e.preventDefault();
		const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
		side.scrollIntoView({ block: 'nearest', behavior: smooth ? 'smooth' : 'auto' });
		side.classList.remove('flash');
		void side.offsetWidth; // restart the animation on repeat clicks
		side.classList.add('flash');
	}
</script>

{#if source}<a
		class="cite"
		href="#source-{source.id}"
		data-source={source.id}
		data-note={note || undefined}
		aria-label="Source {source.n}: {source.title}"
		{onclick}><span class="baseline"></span><sup>{source.n}</sup></a
	>{/if}

<style>
	.cite {
		margin-left: 0.15em;
		font: 500 0.7em / 0 var(--font-mono); /* line-height 0 so the line it sits in doesn't grow */
		color: var(--accent);
		text-decoration: none;
	}
	.cite:hover {
		color: var(--accent-hover);
	}
	sup {
		vertical-align: 0.6em;
	}
	/* zero-size marker on the line's baseline; the margin note lines its first line up with it */
	.baseline {
		display: inline-block;
		width: 0;
		height: 0;
	}
</style>
