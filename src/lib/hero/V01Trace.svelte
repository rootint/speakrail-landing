<!-- 1 · Probability trace: the user's waveform as it's spoken, and under it the turn head's
     P(complete) drawn live. The silence timer would fire in the thinking pause; the head stays low
     there and crosses 0.5 only 176 ms after the last word. -->
<script>
	import { loop } from './clock.svelte.js';
	import * as S from './scenario.js';

	const W = 960;
	const H = 340;
	const T_MAX = 4.6; // seconds shown
	const X0 = 84;
	const X1 = W - 24;
	const x = (/** @type {number} */ t) => X0 + (t / T_MAX) * (X1 - X0);
	const WAVE = { y: 54, h: 34 };
	const PLOT = { top: 150, bottom: 292 };
	const y = (/** @type {number} */ p) => PLOT.bottom - p * (PLOT.bottom - PLOT.top);

	const clock = loop(S.LOOP - 2.4, T_MAX);
	const now = $derived(Math.min(clock.t, T_MAX));

	const bars = Array.from({ length: Math.floor(T_MAX / 0.04) }, (_, i) => {
		const t = i * 0.04;
		return { t, a: S.userLoud(t) };
	});
	const trace = $derived.by(() => {
		let d = '';
		for (let t = 0; t <= now; t += 0.015)
			d += `${d ? 'L' : 'M'}${x(t).toFixed(1)} ${y(S.pComplete(t)).toFixed(1)}`;
		return d;
	});
	const p = $derived(S.pComplete(now));
</script>

<figure class="v">
	<svg
		viewBox="0 0 {W} {H}"
		role="img"
		aria-label="The user's speech and the turn head's probability that the turn is complete. It stays low through a thinking pause where a silence timer would cut in, and rises past 0.5 176 ms after the last word."
	>
		<text class="lane" x="0" y={WAVE.y + 4}>you</text>
		{#each bars as b (b.t)}
			<rect
				class="bar"
				class:on={b.t <= now}
				x={x(b.t)}
				y={WAVE.y - b.a * WAVE.h}
				width="2.4"
				height={Math.max(1, b.a * WAVE.h * 2)}
				rx="1"
			/>
		{/each}
		{#each S.WORDS as w (w.a)}
			{#if now >= w.a}<text class="word" x={x(w.a)} y={WAVE.y + WAVE.h + 26}>{w.w}</text>{/if}
		{/each}

		<!-- the plot -->
		<text class="lane" x="0" y={PLOT.top + 4}>P(done)</text>
		<line class="grid" x1={X0} x2={X1} y1={PLOT.bottom} y2={PLOT.bottom} />
		<line class="thresh" x1={X0} x2={X1} y1={y(0.5)} y2={y(0.5)} />
		<text class="tick" x={X0 - 8} y={y(0.5) + 4}>0.5</text>
		<text class="tick" x={X0 - 8} y={y(1) + 4}>1</text>
		<text class="tick" x={X0 - 8} y={y(0) + 4}>0</text>
		<rect
			class="pause"
			x={x(S.PAUSE[0])}
			y={PLOT.top - 6}
			width={x(S.PAUSE[1]) - x(S.PAUSE[0])}
			height={PLOT.bottom - PLOT.top + 6}
		/>
		<text class="note" x={x(S.PAUSE[0]) + 8} y={PLOT.top + 12}>thinking pause</text>
		<path class="trace" d={trace} />
		<circle class="dot" cx={x(now)} cy={y(p)} r="4.5" />

		{#if now >= S.TIMER_FIRES}
			<line
				class="timer"
				x1={x(S.TIMER_FIRES)}
				x2={x(S.TIMER_FIRES)}
				y1={WAVE.y - 30}
				y2={PLOT.bottom + 8}
			/>
			<text class="mark bad" x={x(S.TIMER_FIRES) + 8} y={PLOT.bottom + 26}
				>silence timer: cuts in mid-thought</text
			>
		{/if}
		{#if now >= S.HEAD_FIRES}
			<line
				class="fire"
				x1={x(S.HEAD_FIRES)}
				x2={x(S.HEAD_FIRES)}
				y1={WAVE.y - 30}
				y2={PLOT.bottom}
			/>
			<text class="mark hot end" x={x(S.HEAD_FIRES) - 8} y={PLOT.top - 14}
				>turn head: +{S.HEAD_MS} ms</text
			>
		{/if}
		<line class="head" x1={x(now)} x2={x(now)} y1={WAVE.y - 30} y2={PLOT.bottom} />
	</svg>
</figure>

<style>
	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	text {
		font-family: var(--font-mono);
	}
	.lane {
		font-size: 12px;
		fill: var(--dim);
	}
	.word {
		font-size: 15px;
		fill: var(--text);
	}
	.tick {
		font-size: 11px;
		fill: var(--dim);
		text-anchor: end;
	}
	.note {
		font-size: 12px;
		fill: var(--muted);
	}
	.mark {
		font-size: 13px;
	}
	.mark.end {
		text-anchor: end;
	}
	.bad {
		fill: var(--error);
	}
	.hot {
		fill: var(--accent);
	}
	.bar {
		fill: var(--chart-grey);
		opacity: 0.35;
	}
	.bar.on {
		fill: var(--muted);
		opacity: 1;
	}
	.grid {
		stroke: var(--grid);
	}
	.thresh {
		stroke: var(--chart-grey);
		stroke-dasharray: 4 4;
	}
	.pause {
		fill: color-mix(in srgb, var(--text) 5%, transparent);
	}
	.trace {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2.5;
		stroke-linejoin: round;
	}
	.dot {
		fill: var(--accent);
	}
	.timer {
		stroke: var(--error);
		stroke-width: 1.5;
		stroke-dasharray: 3 3;
	}
	.fire {
		stroke: var(--accent);
		stroke-width: 2;
	}
	.head {
		stroke: var(--text);
		stroke-opacity: 0.25;
	}
</style>
