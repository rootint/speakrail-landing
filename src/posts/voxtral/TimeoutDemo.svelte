<!-- Sample interactive demo for the post: a phrase with a breath in the middle, and where a silence
     timer replies for the chosen timeout versus the turn head. Illustrative timings. -->
<script>
	const SPEECH = [
		[0, 1400],
		[2000, 3200]
	]; // ms: two stretches of speech with a 600 ms pause between
	const END = SPEECH[1][1];
	const HEAD = END + 230; // the turn head replies shortly after the real end
	const SPAN = 5000;

	let timeout = $state(700);
	// the timer fires on the first silence longer than its timeout
	const pause = SPEECH[1][0] - SPEECH[0][1];
	const cutsIn = $derived(timeout < pause);
	const timer = $derived(cutsIn ? SPEECH[0][1] + timeout : END + timeout);
	const x = (/** @type {number} */ ms) => `${(ms / SPAN) * 100}%`;
</script>

<div class="demo">
	<div class="track">
		{#each SPEECH as [a, b] (a)}
			<span class="speech" style:left={x(a)} style:width={x(b - a)}></span>
		{/each}
		<span class="mark timer" class:bad={cutsIn} style:left={x(timer)}>
			<span class="tag">{cutsIn ? 'timer cuts in' : 'timer replies'}</span>
		</span>
		<span class="mark head" style:left={x(HEAD)}><span class="tag">turn head</span></span>
	</div>
	<label>
		<span>Silence timeout <output>{timeout} ms</output></span>
		<input type="range" min="200" max="1500" step="50" bind:value={timeout} />
	</label>
	<p class="note">
		{#if cutsIn}
			Shorter than the {pause} ms breath: the timer answers mid-sentence.
		{:else}
			Waits out the breath, but replies {timer - HEAD} ms after the turn head.
		{/if}
	</p>
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		gap: var(--s4);
		margin-block: var(--s6);
		padding: var(--s5);
		border-radius: var(--radius-lg);
		background: var(--surface-1);
		box-shadow: var(--ring-1);
	}
	.track {
		position: relative;
		height: 64px;
		margin-top: var(--s5);
		border-radius: var(--radius-sm);
		background: var(--surface-sunk);
	}
	.speech {
		position: absolute;
		top: 24px;
		height: 16px;
		border-radius: 8px;
		background: var(--chart-grey);
	}
	.mark {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		translate: -1px 0;
		transition: left 120ms ease-out;
	}
	.mark.head {
		background: var(--accent);
	}
	.mark.timer {
		background: var(--muted);
	}
	.mark.timer.bad {
		background: var(--error);
	}
	.tag {
		position: absolute;
		bottom: calc(100% + 4px);
		left: 50%;
		translate: -50% 0;
		font: 400 var(--fs-caption) / 1 var(--font-mono);
		white-space: nowrap;
		color: var(--muted);
	}
	.head .tag {
		top: calc(100% + 4px);
		bottom: auto;
		color: var(--accent);
	}
	label {
		display: flex;
		flex-direction: column;
		gap: var(--s2);
		margin-top: var(--s4);
		font-size: var(--fs-small);
		color: var(--muted);
	}
	output {
		margin-left: var(--s2);
		font-family: var(--font-mono);
		color: var(--text);
	}
	input {
		accent-color: var(--accent);
	}
	.note {
		margin: 0;
		font-size: var(--fs-small);
		color: var(--body);
	}
</style>
