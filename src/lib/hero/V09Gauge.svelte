<!-- 9 · The gauge: one needle for the turn head's P(complete), a mark where it fires (0.5), and a
     big status word under it: listening, thinking pause, your turn, backchannel. -->
<script>
	import { loop } from './clock.svelte.js';
	import * as S from './scenario.js';

	const W = 960;
	const H = 330;
	const CX = 300;
	const CY = 250;
	const R = 200;
	// 0 at the left end of the arc, 1 at the right
	const pt = (/** @type {number} */ v, r = R) => {
		const a = Math.PI * (1 - v);
		return { x: CX + r * Math.cos(a), y: CY - r * Math.sin(a) };
	};
	const arc = (/** @type {number} */ a, /** @type {number} */ b, r = R) => {
		const p = pt(a, r);
		const q = pt(b, r);
		return `M${p.x} ${p.y} A${r} ${r} 0 0 1 ${q.x} ${q.y}`;
	};

	const clock = loop(S.LOOP, S.HEAD_FIRES + 0.3);
	const now = $derived(clock.t);
	const pr = $derived(S.probs(now));
	const v = $derived(pr.complete);
	const tip = $derived(pt(v, R - 26));
	const state = $derived.by(() => {
		if (pr.backchannel > 0.5) return { word: 'backchannel', sub: '“mm-hmm”: keep talking' };
		if (now >= S.HEARD)
			return { word: 'replying', sub: `heard ${S.HEARD_MS} ms after you stopped` };
		if (now >= S.HEAD_FIRES)
			return { word: 'your turn', sub: `${S.HEAD_MS} ms after the last word` };
		if (now > S.PAUSE[0] && now < S.PAUSE[1])
			return { word: 'thinking pause', sub: 'silent, but not done: wait' };
		if (now >= S.END) return { word: 'deciding…', sub: 'silence after “tomorrow?”' };
		return {
			word: 'listening',
			sub: S.said(S.WORDS, now)
				.map((w) => w.w)
				.slice(-4)
				.join(' ')
		};
	});
	const ticks = Array.from({ length: 11 }, (_, i) => i / 10);
</script>

<figure class="v">
	<svg
		viewBox="0 0 {W} {H}"
		role="img"
		aria-label="A gauge of the turn head's confidence that the user has finished. It stays low while the user talks and through a thinking pause, and swings past the 0.5 mark 176 ms after the last word."
	>
		<path class="track" d={arc(0, 1)} />
		<path class="hotzone" d={arc(0.5, 1)} />
		<path class="value" d={arc(0, Math.max(0.001, v))} />
		{#each ticks as t (t)}
			{@const a = pt(t, R + 14)}
			{@const b = pt(t, R + (t === 0.5 ? 30 : 22))}
			<line class="tick" class:fire={t === 0.5} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
		{/each}
		<text class="lbl" x={pt(0, R + 30).x} y={CY + 24}>0</text>
		<text class="lbl" x={pt(1, R + 30).x} y={CY + 24}>1</text>
		<text class="lbl hot" x={pt(0.5, R + 44).x} y={pt(0.5, R + 44).y}>fire at 0.5</text>
		<line class="needle" x1={CX} y1={CY} x2={tip.x} y2={tip.y} />
		<circle class="hub" cx={CX} cy={CY} r="9" />
		<text class="read" x={CX} y={CY + 54}>P(done) {v.toFixed(2)}</text>

		<!-- the status, right of the gauge -->
		<text class="word" x="600" y="170">{state.word}</text>
		<text class="sub" x="600" y="206">{state.sub}</text>
	</svg>
</figure>

<style>
	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.track,
	.hotzone,
	.value {
		fill: none;
		stroke-width: 18;
		stroke-linecap: round;
	}
	.track {
		stroke: var(--surface-2);
	}
	.hotzone {
		stroke: color-mix(in srgb, var(--accent) 18%, var(--surface-2));
	}
	.value {
		stroke: var(--accent);
	}
	.tick {
		stroke: var(--chart-grey);
		stroke-width: 1.5;
	}
	.tick.fire {
		stroke: var(--accent);
		stroke-width: 2.5;
	}
	.lbl {
		font: 400 12px var(--font-mono);
		fill: var(--dim);
		text-anchor: middle;
	}
	.lbl.hot {
		fill: var(--accent);
	}
	.needle {
		stroke: var(--text);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.hub {
		fill: var(--text);
	}
	.read {
		font: 500 18px var(--font-mono);
		fill: var(--text);
		text-anchor: middle;
		font-variant-numeric: tabular-nums;
	}
	.word {
		font: 600 44px var(--font-ui);
		fill: var(--text);
	}
	.sub {
		font: 400 17px var(--font-ui);
		fill: var(--muted);
	}
</style>
