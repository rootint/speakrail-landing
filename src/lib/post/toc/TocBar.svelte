<!-- Option 1: a pill at the bottom naming the section being read. It comes up with the nav on a
     scroll up and goes with it on a scroll down; tapping it opens the contents in a sheet. It starts
     right of the back-to-top button so the two never overlap. -->
<script>
	import NavArrowUp from '~icons/iconoir/nav-arrow-up';
	import TocSheet from './TocSheet.svelte';

	/** @type {{ reading: import('../reading.svelte.js').Reading, shown: boolean, lift?: number }} */
	let { reading, shown, lift = 0 } = $props();

	/** @type {TocSheet | undefined} */
	let sheet = $state();
	const visible = $derived(shown && reading.started);
	const n = $derived(reading.active + 1);
</script>

<button
	type="button"
	class="toc-bar"
	class:visible
	style:--lift="{lift}px"
	tabindex={visible ? 0 : -1}
	aria-label="Contents, section {n} of {reading.sections.length}: {reading.sections[reading.active]
		?.text}"
	onclick={() => sheet?.show()}
>
	<span class="n">{n}</span>
	<span class="t">{reading.sections[reading.active]?.text}</span>
	<span class="of">{n}/{reading.sections.length}</span>
	<span class="chev"><NavArrowUp /></span>
	<!-- how far through this section -->
	<span class="fill" style:scale="{reading.progress} 1"></span>
</button>

<TocSheet bind:this={sheet} {reading} />

<style>
	.toc-bar {
		position: fixed;
		left: calc(var(--s5) + 48px + var(--s3));
		right: var(--s5);
		bottom: calc(var(--s5) + var(--lift));
		z-index: 9;
		display: flex;
		align-items: center;
		gap: var(--s3);
		height: 44px;
		padding: 0 var(--s3) 0 var(--s5);
		overflow: hidden;
		border: 0;
		border-radius: 999px;
		background: var(--surface-3);
		box-shadow: var(--ring-3), var(--shadow-3);
		font: var(--w-ui) var(--fs-ui) / 1 var(--font-ui);
		color: var(--text);
		text-align: left;
		cursor: pointer;
		translate: 0 calc(100% + var(--s5) + var(--lift) + env(safe-area-inset-bottom));
		transition: translate 240ms cubic-bezier(0.2, 0, 0, 1);
	}
	.toc-bar.visible {
		translate: 0 0;
	}
	@media (min-width: 76.0625rem) {
		.toc-bar {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.toc-bar {
			transition: none;
		}
	}
	.n {
		font: var(--fs-small) var(--font-mono);
		color: var(--accent);
	}
	.t {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		line-height: 1.4;
	}
	.of {
		font: var(--fs-caption) var(--font-mono);
		color: var(--muted);
	}
	.chev {
		display: flex;
		color: var(--muted);
	}
	.fill {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 2px;
		background: var(--accent);
		transform-origin: left;
		transition: scale 160ms linear;
	}
</style>
