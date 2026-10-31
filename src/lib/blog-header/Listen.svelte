<!-- 8 · "Hear the difference" — two sample rows, simulated playback until real clips exist -->
<script>
	import Pause from '~icons/iconoir/pause-solid';
	import Play from '~icons/iconoir/play-solid';

	// TODO: real clips + measured latencies; bars are a fixed pseudo-random waveform
	const DURATION = 4200;
	const SPEECH_END = 0.62; // where the speaker stops, as a fraction of the clip
	const samples = [
		{
			id: 'timeout',
			name: 'Silence timeout',
			note: 'waits a fixed 1 s after you stop',
			reply: SPEECH_END + 1000 / DURATION
		},
		{ id: 'head', name: 'Turn head', note: 'replies as soon as you are done', reply: 0.67 }
	];
	const bars = Array.from({ length: 72 }, (_, i) => {
		const t = i / 72;
		if (t > SPEECH_END) return 0.06;
		return 0.2 + 0.8 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.43));
	});

	let playing = $state(/** @type {string | null} */ (null));
	let progress = $state(0);
	let raf = 0;

	/** @param {string} id */
	function toggle(id) {
		cancelAnimationFrame(raf);
		if (playing === id) {
			playing = null;
			return;
		}
		playing = id;
		const start = performance.now();
		const tick = (/** @type {number} */ now) => {
			progress = Math.min(1, (now - start) / DURATION);
			if (progress < 1) raf = requestAnimationFrame(tick);
			else playing = null;
		};
		raf = requestAnimationFrame(tick);
	}
</script>

<section class="listen">
	<p class="k">Hear the difference</p>
	{#each samples as s (s.id)}
		{@const active = playing === s.id}
		<div class="sample" class:active>
			<button
				aria-label={active ? `Pause ${s.name}` : `Play ${s.name}`}
				onclick={() => toggle(s.id)}
			>
				{#if active}<Pause />{:else}<Play />{/if}
			</button>
			<div class="info">
				<span class="name">{s.name}</span>
				<span class="note">{s.note}</span>
			</div>
			<div class="wave" aria-hidden="true">
				{#each bars as h, i (i)}
					<span
						class:lit={active && i / bars.length <= progress}
						style:height="{Math.round(h * 100)}%"
					></span>
				{/each}
				<i class="mark end" style:left="{SPEECH_END * 100}%"></i>
				<i class="mark reply" style:left="{s.reply * 100}%"></i>
				{#if active}<i class="head" style:left="{progress * 100}%"></i>{/if}
			</div>
			<span class="gap">+{Math.round((s.reply - SPEECH_END) * DURATION)} ms</span>
		</div>
	{/each}
	<p class="legend">
		<i class="end"></i> you stop talking <i class="reply"></i> reply starts · simulated, real clips TBD
	</p>
</section>

<style>
	.listen {
		display: flex;
		flex-direction: column;
		gap: var(--s3);
	}
	p {
		margin: 0;
	}
	.k {
		font: 400 var(--fs-caption) / 1.4 var(--font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.sample {
		display: grid;
		grid-template-columns: 44px 10rem 1fr 4.5rem;
		align-items: center;
		gap: var(--s4);
		padding: var(--s3) var(--s4) var(--s3) var(--s3);
		border-radius: var(--radius-lg);
		background: var(--surface-1);
		box-shadow: inset 0 0 0 1px rgb(252 245 247 / 0.1);
		transition: background var(--dur);
	}
	.sample.active {
		background: var(--surface-2);
	}
	button {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: 50%;
		background: var(--accent);
		color: var(--on-accent);
		font-size: 18px;
		cursor: pointer;
	}
	button:hover {
		background: var(--accent-hover);
	}
	.info {
		display: flex;
		flex-direction: column;
	}
	.name {
		font-size: var(--fs-ui);
		font-weight: 500;
		line-height: 1.3;
		color: var(--text);
	}
	.note {
		font-size: var(--fs-caption);
		line-height: 1.4;
		color: var(--muted);
	}
	.wave {
		position: relative;
		display: flex;
		align-items: center;
		gap: 2px;
		height: 40px;
	}
	.wave span {
		flex: 1;
		min-height: 2px;
		border-radius: 1px;
		background: var(--chart-grey);
	}
	.wave span.lit {
		background: var(--accent);
	}
	.mark,
	.head {
		position: absolute;
		top: -4px;
		bottom: -4px;
		width: 0;
	}
	.mark.end {
		border-left: 1px dashed var(--muted);
	}
	.mark.reply {
		border-left: 2px solid var(--accent);
	}
	.head {
		border-left: 1px solid var(--text);
	}
	.gap {
		white-space: nowrap;
		font: 400 var(--fs-small) / 1 var(--font-mono);
		text-align: right;
		color: var(--body);
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--s2);
		font: 400 var(--fs-caption) / 1.4 var(--font-mono);
		color: var(--muted);
	}
	.legend i {
		display: inline-block;
		width: 14px;
		height: 0;
	}
	.legend i.end {
		border-top: 1px dashed var(--muted);
	}
	.legend i.reply {
		margin-left: var(--s3);
		border-top: 2px solid var(--accent);
	}
	@media (max-width: 40rem) {
		.sample {
			grid-template-columns: 44px 1fr 4rem;
		}
		.wave {
			grid-column: 1 / -1;
			grid-row: 2;
		}
	}
</style>
