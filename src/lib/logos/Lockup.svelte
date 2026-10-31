<!-- A symbol + "Speakrail" lockup, or one of the two typographic lockups (boxed badge, departure
     board). Scales with font-size; colours come from --fg / --acc / --bg like Mark. -->
<script>
	import Mark from './Mark.svelte';

	/** @type {{ mark: number, style?: 'title' | 'lower' | 'mono' | 'badge' | 'board', size?: number }} */
	let { mark, style = 'title', size = 40 } = $props();
</script>

<span class="lockup s-{style}" style:font-size="{size}px" role="img" aria-label="Speakrail">
	{#if style === 'badge'}
		<!-- boxed like a rating card: monogram | name over a tagline -->
		<span class="box">
			<span class="cell"><Mark id={mark} size="1.5em" /></span>
			<span class="stack">
				<span class="caps">SPEAKRAIL</span>
				<span class="tag">Voice AI on your own GPU</span>
			</span>
		</span>
	{:else if style === 'board'}
		<!-- split-flap departure board, the last tile flipped to pink -->
		<span class="board">
			<span class="row">
				{#each 'SPEAK'.split('') as ch, i (i)}<span class="flap">{ch}</span>{/each}
			</span>
			<span class="row">
				{#each 'RAIL'.split('') as ch, i (i)}<span class="flap">{ch}</span>{/each}<span
					class="flap hot">→</span
				>
			</span>
		</span>
	{:else}
		<Mark id={mark} size="1.3em" />
		<span class="word">{style === 'title' ? 'Speakrail' : 'speakrail'}</span>
	{/if}
</span>

<style>
	.lockup {
		display: inline-flex;
		align-items: center;
		gap: 0.32em;
		line-height: 1;
		white-space: nowrap;
		color: var(--fg);
	}
	.word {
		font: 480 1em / 1 var(--font-ui);
		letter-spacing: -0.025em;
	}
	.s-mono .word {
		font: 450 0.92em / 1 var(--font-mono);
		letter-spacing: -0.04em;
	}

	/* badge */
	.box {
		display: inline-flex;
		align-items: stretch;
		box-shadow: inset 0 0 0 0.045em var(--fg);
	}
	.cell {
		display: grid;
		place-items: center;
		padding: 0.1em 0.2em;
		border-right: 0.045em solid var(--fg);
	}
	.stack {
		display: flex;
		flex-direction: column;
	}
	.caps {
		padding: 0.2em 0.35em 0.16em;
		border-bottom: 0.045em solid var(--fg);
		font: 650 0.62em / 1 var(--font-ui);
		letter-spacing: 0.02em;
	}
	.tag {
		padding: 0.18em 0.35em 0.2em;
		font: 400 0.5em / 1 var(--font-ui);
	}

	/* departure board */
	.board {
		display: inline-flex;
		flex-direction: column;
		gap: 0.08em;
	}
	.row {
		display: flex;
		gap: 0.06em;
	}
	.flap {
		display: grid;
		place-items: center;
		width: 0.78em;
		height: 1em;
		border-radius: 0.1em;
		background:
			linear-gradient(
				transparent calc(50% - 0.025em),
				var(--bg) 0 calc(50% + 0.025em),
				transparent 0
			),
			var(--tile, color-mix(in srgb, var(--fg) 14%, var(--bg)));
		font: 500 0.66em / 1 var(--font-mono);
	}
	.flap.hot {
		background:
			linear-gradient(
				transparent calc(50% - 0.025em),
				var(--bg) 0 calc(50% + 0.025em),
				transparent 0
			),
			var(--acc);
		color: var(--bg);
	}
</style>
