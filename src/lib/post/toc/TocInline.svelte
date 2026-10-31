<!-- Option 5: the contents as a plain list in the page, between the top section and the text, the
     way long articles have always done it. The back-to-top button brings the reader back here. -->
<script>
	/** @type {{ reading: import('../reading.svelte.js').Reading }} */
	let { reading } = $props();
</script>

<nav class="toc-inline" id="contents" aria-label="Contents">
	<h2 class="toc-title">Contents</h2>
	<ol>
		{#each reading.sections as s, i (s.id)}
			<li><a href="#{s.id}"><span class="n">{i + 1}</span><span>{s.text}</span></a></li>
		{/each}
	</ol>
</nav>

<style>
	.toc-inline {
		margin-bottom: var(--s8);
		padding-block: var(--s4);
		box-shadow:
			inset 0 1px 0 var(--grid),
			inset 0 -1px 0 var(--grid);
		scroll-margin-top: calc(64px + var(--s5));
	}
	@media (min-width: 76.0625rem) {
		.toc-inline {
			display: none;
		}
	}
	.toc-title {
		margin: 0 0 var(--s2);
		font: 500 1.125rem / 1.4 var(--font-ui);
		color: var(--text);
	}
	ol {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	a {
		display: flex;
		align-items: baseline;
		gap: var(--s3);
		padding-block: 11px;
		font: var(--w-ui) 1rem / 22px var(--font-ui);
		color: var(--body);
		text-decoration: none;
	}
	.n {
		flex: none;
		width: 1.5ch;
		font: var(--fs-small) var(--font-mono);
		color: var(--accent);
	}
</style>
