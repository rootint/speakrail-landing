<!-- Margin notes for the right-hand rail: one per <Cite> in the post, its first line on the same
     baseline as the sentence that cites it. A note that would run into the one above it is pushed
     down instead. Positions are measured after mount and again whenever the layout changes. -->
<script>
	import { onMount, tick } from 'svelte';

	/** @type {{ sources: Record<string, import('./sources.js').Source>, root?: string }} */
	let { sources, root = 'article' } = $props();

	const GAP = 24; // the least space between two notes

	/** @type {{ note: string, source: import('./sources.js').Source }[]} */
	let notes = $state([]);
	/** @type {number[]} */
	let tops = $state([]);
	/** @type {HTMLOListElement | undefined} */
	let list = $state();
	/** @type {Element[]} */
	let cites = [];

	function layout() {
		// hidden (narrow screen): nothing to place
		if (!list || !list.offsetParent) return;
		const origin = list.getBoundingClientRect().top;
		let floor = -Infinity;
		tops = [...list.children].map((li, i) => {
			const want = baseline(cites[i]) - origin;
			const own = baseline(li) - li.getBoundingClientRect().top; // note top to its first baseline
			const top = Math.max(want - own, floor);
			floor = top + li.getBoundingClientRect().height + GAP;
			return Math.round(top);
		});
	}

	/** y of the zero-size .baseline probe inside el (sits on its first line's baseline) */
	const baseline = (/** @type {Element} */ el) =>
		el.querySelector('.baseline')?.getBoundingClientRect().top ?? el.getBoundingClientRect().top;

	onMount(() => {
		cites = [...document.querySelectorAll(`${root} [data-source]`)];
		notes = cites
			.map((c) => ({
				note: c.getAttribute('data-note') ?? '',
				source: sources[c.getAttribute('data-source') ?? '']
			}))
			.filter((n) => n.source);
		tick().then(layout);
		document.fonts.ready.then(layout);
		// images loading, fonts swapping, the window resizing: anything that moves the text
		const ro = new ResizeObserver(layout);
		const article = document.querySelector(root);
		if (article) ro.observe(article);
		if (list) ro.observe(list);
		return () => ro.disconnect();
	});
</script>

<ol class="notes" class:placed={tops.length > 0} bind:this={list} aria-label="Sources">
	{#each notes as c, i (i)}
		<li id="sidenote-{i}" style:top="{tops[i] ?? 0}px">
			<span class="n">{c.source.n}</span>
			<div>
				{#if c.note}<p class="text"><span class="baseline"></span>{c.note}</p>{/if}
				<p class="ref">
					{#if !c.note}<span class="baseline"></span>{/if}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external source URL -->
					<a href={c.source.url}>{c.source.title}</a>
					<span class="src-meta">{c.source.authors}, {c.source.year} · {c.source.venue}</span>
				</p>
			</div>
		</li>
	{/each}
</ol>

<style>
	.notes {
		position: relative;
		height: 100%;
		margin: 0;
		padding: 0;
		list-style: none;
		visibility: hidden; /* until measured, so notes don't flash in a pile at the top */
	}
	.notes.placed {
		visibility: visible;
	}
	/* number in its own column; the note, then the source under it */
	li {
		position: absolute;
		left: 0;
		right: 0;
		display: flex;
		gap: var(--s3);
		font: var(--w-ui) var(--fs-small) / 1.6 var(--font-ui);
	}
	.n {
		flex: none;
		width: 1.5ch;
		font-family: var(--font-mono);
		color: var(--accent);
	}
	.text {
		margin: 0 0 var(--s2);
		font: var(--w-body) var(--fs-small) / 1.6 var(--font-read);
		color: var(--body);
	}
	/* the title is a plain pink underlined link (the global link style) */
	.ref {
		margin: 0;
		line-height: 1.4;
	}
	.src-meta {
		display: block;
		margin-top: 2px;
		font-size: var(--fs-caption);
		color: var(--muted);
	}
	.baseline {
		display: inline-block;
		width: 0;
		height: 0;
	}
	/* clicking the number in the text flashes its note */
	li:global(.flash) .text,
	li:global(.flash) .n {
		animation: flash 1.6s ease-out;
	}
	@keyframes flash {
		0%,
		35% {
			color: var(--accent-hover);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		li:global(.flash) .text,
		li:global(.flash) .n {
			animation-duration: 0.01s;
		}
	}
</style>
