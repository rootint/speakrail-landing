<!-- The source behind a citation, in a bottom sheet: how narrow screens see what the margin notes
     show on wide ones. Opened with `show(source, note)`. -->
<script>
	import Sheet from './Sheet.svelte';
	import { sourceMeta } from './sources.js';

	/** @type {Sheet | undefined} */
	let sheet = $state();
	/** @type {import('./sources.js').Source | null} */
	let source = $state(null);
	let note = $state('');

	/**
	 * @param {import('./sources.js').Source} s
	 * @param {string} [n]
	 */
	export function show(s, n = '') {
		source = s;
		note = n;
		sheet?.show();
	}
</script>

<Sheet bind:this={sheet} label="Source {source?.n ?? ''}">
	{#if source}
		<div class="entry">
			<span class="sheet-n">{source.n}</span>
			<div>
				{#if note}<p class="sheet-note">{note}</p>{/if}
				<p class="sheet-ref">
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external source URL -->
					<a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
					<span class="sheet-meta">{sourceMeta(source)}</span>
				</p>
			</div>
		</div>
	{/if}
</Sheet>

<style>
	/* the same layout as a margin note, a size up */
	.entry {
		display: flex;
		gap: var(--s3);
	}
	.sheet-n {
		display: grid;
		flex: none;
		place-items: center;
		width: 24px;
		height: 24px;
		border: 1px solid var(--accent);
		border-radius: 50%;
		font: 500 var(--fs-caption) / 1 var(--font-mono);
		color: var(--accent);
	}
	p {
		margin: 0;
	}
	.sheet-note {
		margin-bottom: var(--s3);
		font: var(--w-body) 1rem / 1.6 var(--font-read);
		color: var(--body);
	}
	/* the title is a plain pink underlined link (the global link style) */
	.sheet-ref {
		font-size: 1rem;
		line-height: 1.5;
	}
	.sheet-meta {
		display: block;
		margin-top: var(--s1);
		font-size: var(--fs-small);
		color: var(--muted);
	}
</style>
