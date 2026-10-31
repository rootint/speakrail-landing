<!-- A pink citation number in the text, with an optional `note`: a sentence on what the source
     says, shown beside the sentence in the right margin. In a post, `id` names one of the sources in
     its frontmatter; a page can pass the `source` itself instead. Clicking the number flashes that note; when
     the margin is hidden (narrow screens) the number is a ringed circle that opens the source in a bottom
     sheet, or, outside a post, goes to the full entry at the end. -->
<script>
	import { getContext } from 'svelte';

	/** @type {{ id?: string, source?: import('./sources.js').Source, note?: string }} */
	let { id, source: given, note = '' } = $props();

	/** @typedef {import('./sources.js').Source} Source */
	const post =
		/** @type {{ sources: Record<string, Source>, showSource?: (s: Source, note?: string) => void } | undefined} */ (
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
		if (!side?.offsetParent) {
			// margin hidden: the post's bottom sheet, or failing that, follow the link
			if (source && post?.showSource) {
				e.preventDefault();
				post.showSource(source, note);
			}
			return;
		}
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
	/* phones (no margin notes, the same 48rem as the notes rail in Post.svelte): the number sits in a
	   16px pink ring centred on the capitals beside it, with an invisible 44px hit area around it for
	   a thumb */
	@media (max-width: 48rem) {
		.cite {
			position: relative;
			margin: 0 2px 0 4px;
			font-size: 1em; /* the paragraph's own size, so the ring can match its capitals */
		}
		.cite::after {
			content: '';
			position: absolute;
			inset: calc(50% - 22px);
		}
		sup {
			/* 0.66em digits; the ring is 1.347em of that = 16px on the 18px paragraph, a little taller
			   than Kripa's 13px capitals, and dropped half the difference so the two share a centre.
			   A single digit sits centred; two digits stretch it into a pill. */
			display: inline-block;
			box-sizing: border-box;
			min-width: 1.347em;
			height: 1.347em;
			padding-inline: 0.15em;
			border: 1px solid currentColor;
			border-radius: 999px;
			overflow: hidden; /* puts its baseline at the bottom edge, so vertical-align moves the ring */
			font-size: 0.66em;
			line-height: calc(1.347em - 2px);
			text-align: center;
			vertical-align: -0.124em;
		}
	}
	/* zero-size marker on the line's baseline; the margin note lines its first line up with it */
	.baseline {
		display: inline-block;
		width: 0;
		height: 0;
	}
</style>
