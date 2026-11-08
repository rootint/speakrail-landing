<!-- The contents below 76rem, where the contents rail is gone: a round button bottom-right,
     mirroring back-to-top on the left. It shows the section number, ringed by how far through that
     section the reader is (the bar at the very top already shows the whole post); tapping it opens
     the contents in a sheet. There from the first heading on, whichever way the page scrolls. -->
<script>
	import TocSheet from './TocSheet.svelte';

	/** @type {{ reading: import('../reading.svelte.js').Reading, lift?: number }} */
	let { reading, lift = 0 } = $props();

	/** @type {TocSheet | undefined} */
	let sheet = $state();
	const n = $derived(reading.active + 1);
	const R = 20;
	const C = 2 * Math.PI * R;
</script>

<button
	type="button"
	class="toc-fab"
	class:visible={reading.started}
	style:--lift="{lift}px"
	tabindex={reading.started ? 0 : -1}
	aria-label="Contents, section {n} of {reading.sections.length}"
	onclick={() => sheet?.show()}
>
	<svg viewBox="0 0 48 48" aria-hidden="true">
		<circle class="track" cx="24" cy="24" r={R} />
		<!-- a fresh arc per section, so moving on starts it empty instead of unwinding the full one -->
		{#key reading.active}
			<circle
				class="arc"
				class:empty={reading.progress < 0.01}
				cx="24"
				cy="24"
				r={R}
				stroke-dasharray="{reading.progress * C} {C}"
			/>
		{/key}
	</svg>
	<span class="n">{n}</span>
</button>

<TocSheet bind:this={sheet} {reading} />

<style>
	.toc-fab {
		position: fixed;
		right: var(--s5);
		bottom: calc(var(--s5) + var(--lift));
		z-index: 9;
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: var(--surface-2);
		box-shadow: var(--ring-2), var(--shadow-2);
		cursor: pointer;
		opacity: 0;
		pointer-events: none;
		translate: 0 8px;
		transition:
			opacity 200ms,
			translate 200ms ease-out;
	}
	.toc-fab.visible {
		opacity: 1;
		pointer-events: auto;
		translate: 0 0;
	}
	@media (min-width: 76.0625rem) {
		.toc-fab {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.toc-fab {
			translate: 0 0;
		}
	}
	svg {
		position: absolute;
		inset: 0;
		rotate: -90deg; /* the arc starts at twelve o'clock */
	}
	circle {
		fill: none;
		stroke-width: 2;
	}
	.track {
		stroke: var(--grid);
	}
	.arc {
		stroke: var(--accent);
		stroke-linecap: round;
		transition: stroke-dasharray 160ms linear;
	}
	/* a zero-length dash with a round cap would still draw a dot at twelve o'clock */
	.arc.empty {
		visibility: hidden;
	}
	.n {
		font: 500 var(--fs-ui) / 1 var(--font-mono);
		color: var(--text);
	}
</style>
