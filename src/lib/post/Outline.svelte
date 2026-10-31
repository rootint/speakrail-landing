<!-- Numbered table of contents built from the post's headings. The entry for the section being read
     fills with white from left to right as the reader gets through it; its number turns pink.
     Each entry has its own white copy laid over the grey one and clipped to how far it's filled, so
     when the section changes the old fill fades out while the new one fades in.
     Sticky: `top` is where it pins, so the page can push it below the nav while the nav is showing. -->
<script>
	/** @type {{ reading: import('./reading.svelte.js').Reading, top?: number }} */
	let { reading, top = 24 } = $props();

	/** @type {HTMLOListElement | undefined} */
	let list = $state();
	// per entry: where its text starts and how wide it is, relative to the entry; re-measured on rewrap
	/** @type {{ width: number, textLeft: number, textWidth: number }[]} */
	let boxes = $state([]);

	function measure() {
		if (!list) return;
		boxes = [...list.children].map((li) => {
			const own = li.getBoundingClientRect();
			const t = li.querySelector('.t')?.getBoundingClientRect(); // union of its lines when it wraps
			return {
				width: own.width,
				textLeft: t ? t.left - own.left : 0,
				textWidth: t?.width ?? 0
			};
		});
	}

	$effect(() => {
		void reading.sections.length;
		measure();
	});

	$effect(() => {
		if (!list) return;
		const ro = new ResizeObserver(measure); // entries rewrap when the rail narrows
		ro.observe(list);
		return () => ro.disconnect();
	});

	// sections already passed stay full while they fade out; later ones are empty
	const fill = (/** @type {number} */ i) =>
		i === reading.active ? reading.progress : i < reading.active ? 1 : 0;

	const clip = (/** @type {number} */ i) => {
		const b = boxes[i];
		if (!b) return 'inset(0 100% 0 0)';
		return `inset(0 ${Math.max(0, b.width - (b.textLeft + fill(i) * b.textWidth))}px 0 0)`;
	};
</script>

<nav class="outline" style:--top="{top}px" aria-label="Contents">
	<ol bind:this={list}>
		{#each reading.sections as item, i (item.id)}
			<li>
				<a href="#{item.id}" aria-current={i === reading.active ? 'location' : undefined}
					><span class="n">{i + 1}</span><span class="t">{item.text}</span></a
				>
				<span
					class="lit"
					class:on={i === reading.active && boxes.length > 0}
					style:clip-path={clip(i)}
					aria-hidden="true"><span class="n">{i + 1}</span><span class="t">{item.text}</span></span
				>
			</li>
		{/each}
	</ol>
</nav>

<style>
	.outline {
		position: sticky;
		top: var(--top);
		transition: top 240ms cubic-bezier(0.2, 0, 0, 1); /* moves with the nav sliding in and out */
	}
	ol {
		display: flex;
		flex-direction: column;
		gap: var(--s1);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		position: relative;
	}
	a,
	.lit {
		display: flex;
		gap: var(--s3);
		padding-block: 6px;
		font: var(--w-ui) var(--fs-small) / 1.4 var(--font-ui);
		text-decoration: none;
	}
	a {
		/* dimmer than --muted so the white fill reads against it */
		color: var(--chart-grey);
		transition: color var(--dur);
	}
	a:hover {
		color: var(--text);
	}
	.n {
		flex: none;
		width: 1.5ch;
		font-family: var(--font-mono);
	}
	a .n {
		color: var(--chart-grey);
	}

	/* the fill: a white copy with a pink number over each entry, clipped to how much is read.
	   The clip eases between scroll steps; switching sections cross-fades old and new. */
	.lit {
		position: absolute;
		inset: 0;
		color: var(--text);
		pointer-events: none;
		opacity: 0;
		transition:
			clip-path 160ms linear,
			opacity 360ms ease;
	}
	.lit.on {
		opacity: 1;
	}
	.lit .n {
		color: var(--accent);
	}
	@media (prefers-reduced-motion: reduce) {
		.outline,
		.lit {
			transition: none;
		}
	}
</style>
