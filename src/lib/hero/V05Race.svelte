<!-- 5 · The race: the article's two pipelines run side by side from the end of the user's last word,
     at half speed with a stopwatch, until each reply is heard: ≈1.2 s against 678 ms. -->
<script>
	import { loop } from './clock.svelte.js';

	const W = 960;
	const H = 270;
	const MAX = 1.3; // seconds of race shown
	const SLOW = 2; // played at half speed
	const X0 = 190;
	const X1 = W - 20;
	const x = (/** @type {number} */ s) => X0 + (s / MAX) * (X1 - X0);

	const lanes = [
		{
			name: 'Plain streaming',
			sub: 'silence timer',
			y: 70,
			heard: 1.2,
			label: '≈1.2 s',
			segs: [
				{ a: 0, b: 0.48, k: 'ears', t: 'words 480 ms late' },
				{ a: 0.48, b: 0.97, k: 'wait', t: 'wait for silence' },
				{ a: 0.97, b: 1.09, k: 'brain', t: 'LLM' },
				{ a: 1.09, b: 1.2, k: 'voice', t: 'TTS' }
			]
		},
		{
			name: 'Turn head',
			sub: '+ peek + speculation',
			y: 170,
			heard: 0.678,
			label: '678 ms',
			segs: [
				{ a: 0, b: 0.176, k: 'wait', t: 'head' },
				{ a: 0.176, b: 0.252, k: 'ears', t: 'peek' },
				{ a: 0.254, b: 0.52, k: 'brain', t: 'LLM drafts' },
				{ a: 0.52, b: 0.678, k: 'voice', t: 'TTS' }
			]
		}
	];

	const clock = loop(MAX * SLOW + 1.6, MAX * SLOW); // still frame: the finished race
	const now = $derived(Math.min(clock.t / SLOW, MAX));
</script>

<figure class="v">
	<svg
		viewBox="0 0 {W} {H}"
		role="img"
		aria-label="Two pipelines race from the end of the user's last word. Plain streaming is heard after about 1.2 seconds; the turn head with peek and speculation is heard after 678 milliseconds."
	>
		<text class="watch" x={W - 20} y="30">{(now * 1000).toFixed(0).padStart(4, ' ')} ms</text>
		<text class="hint" x={X0} y="30">from your last word</text>

		{#each lanes as l (l.name)}
			<text class="name" x="0" y={l.y + 20}>{l.name}</text>
			<text class="sub" x="0" y={l.y + 40}>{l.sub}</text>
			<rect class="lane" x={X0} y={l.y} width={X1 - X0} height="44" rx="10" />
			{#each l.segs as s (s.a)}
				{#if now > s.a}
					{@const end = Math.min(now, s.b)}
					<rect
						class="seg {s.k}"
						x={x(s.a) + 1}
						y={l.y + 4}
						width={Math.max(0, x(end) - x(s.a) - 2)}
						height="36"
						rx="7"
					/>
					{#if now >= s.b && x(s.b) - x(s.a) > 44}
						<text class="segt {s.k}" x={x(s.a) + 10} y={l.y + 27}>{s.t}</text>
					{/if}
				{/if}
			{/each}
			{#if now >= l.heard}
				<line class="flag" x1={x(l.heard)} x2={x(l.heard)} y1={l.y - 10} y2={l.y + 54} />
				<text
					class="won"
					x={x(l.heard) + (l.heard > 1 ? -10 : 10)}
					y={l.y + 72}
					text-anchor={l.heard > 1 ? 'end' : 'start'}>heard {l.label}</text
				>
			{/if}
		{/each}
		<line class="now" x1={x(now)} x2={x(now)} y1="50" y2={H - 10} />
	</svg>
</figure>

<style>
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.watch {
		font: 600 26px var(--font-mono);
		fill: var(--text);
		text-anchor: end;
		font-variant-numeric: tabular-nums;
		white-space: pre;
	}
	.hint,
	.sub {
		font: 400 12px var(--font-mono);
		fill: var(--dim);
	}
	.name {
		font: 500 17px var(--font-ui);
		fill: var(--text);
	}
	.lane {
		fill: var(--surface-sunk);
	}
	.seg.ears {
		fill: color-mix(in srgb, var(--accent) 38%, var(--surface-1));
	}
	.seg.wait {
		fill: var(--surface-2);
	}
	.seg.brain {
		fill: color-mix(in srgb, var(--accent) 70%, var(--surface-0));
	}
	.seg.voice {
		fill: var(--accent);
	}
	.segt {
		font: 400 13px var(--font-ui);
		fill: var(--text);
	}
	.segt.brain,
	.segt.voice {
		fill: var(--on-accent);
	}
	.segt.wait {
		fill: var(--muted);
	}
	.flag {
		stroke: var(--accent);
		stroke-width: 2.5;
	}
	.won {
		font: 600 14px var(--font-mono);
		fill: var(--accent);
	}
	.now {
		stroke: var(--text);
		stroke-opacity: 0.2;
	}
</style>
