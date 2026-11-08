<!-- 2 · Two lanes, two endings: the same user turn twice. With a silence timer the system talks into
     the thinking pause; with the turn head it waits, then answers 678 ms after the last word. -->
<script>
	import { loop } from './clock.svelte.js';
	import * as S from './scenario.js';

	const W = 960;
	const H = 300;
	const T_MAX = 5.6;
	const X0 = 150;
	const X1 = W - 16;
	const x = (/** @type {number} */ t) => X0 + (t / T_MAX) * (X1 - X0);

	const clock = loop(S.LOOP - 1.2, T_MAX);
	const now = $derived(Math.min(clock.t, T_MAX));

	// what the system says in each version
	const CUT = { a: S.TIMER_FIRES, b: S.TIMER_FIRES + 0.9 }; // "Sorry, could we what?"
	const rows = [
		{ name: 'Silence timer', sub: `${S.TIMER_MS} ms`, y: 40, sys: [CUT], bad: true },
		{
			name: 'Turn head',
			sub: 'layer 11',
			y: 168,
			sys: [{ a: S.HEARD, b: S.HEARD + 1.2 }],
			bad: false
		}
	];
	const LANE = 30; // half-height of a lane
	const steps = Array.from({ length: Math.floor(T_MAX / 0.035) }, (_, i) => i * 0.035);
	const sysLoud = (/** @type {number} */ t, /** @type {{ a: number, b: number }[]} */ segs) => {
		const s = segs.find((g) => t >= g.a && t < g.b);
		return s
			? 0.2 +
					0.8 *
						Math.abs(Math.sin((t - s.a) * 17 + 2)) *
						Math.min(1, (t - s.a) / 0.05, (s.b - t) / 0.05)
			: 0;
	};
</script>

<figure class="v">
	<svg
		viewBox="0 0 {W} {H}"
		role="img"
		aria-label="Two versions of one conversation. With a silence timer the system starts talking during the user's thinking pause. With the turn head it waits and answers 678 ms after the user's last word."
	>
		{#each rows as r (r.name)}
			<text class="name" x="0" y={r.y + 14}>{r.name}</text>
			<text class="sub" x="0" y={r.y + 34}>{r.sub}</text>
			<line class="axis" x1={X0} x2={X1} y1={r.y + LANE} y2={r.y + LANE} />
			<text class="who" x={X0 - 12} y={r.y + 12}>you</text>
			<text class="who" x={X0 - 12} y={r.y + LANE + 22}>reply</text>
			{#each steps as t (t)}
				{@const u = S.userLoud(t)}
				{@const s = sysLoud(t, r.sys)}
				{#if t <= now && u > 0.05}<rect
						class="u"
						x={x(t)}
						y={r.y + LANE - u * (LANE - 4)}
						width="3"
						height={u * (LANE - 4)}
					/>{/if}
				{#if t <= now && s > 0}<rect
						class="s"
						class:bad={r.bad}
						x={x(t)}
						y={r.y + LANE}
						width="3"
						height={s * (LANE - 4)}
					/>{/if}
			{/each}
			{#if r.bad && now >= CUT.a}
				<rect
					class="clash"
					x={x(CUT.a)}
					y={r.y - 6}
					width={x(Math.min(now, S.PAUSE[1] + 0.9)) - x(CUT.a)}
					height={LANE * 2 + 12}
					rx="6"
				/>
				<text class="tag bad" x={x(CUT.a)} y={r.y + LANE * 2 + 30}
					>talks over your thinking pause</text
				>
			{/if}
			{#if !r.bad && now >= S.END}
				<line
					class="gapline"
					x1={x(S.END)}
					x2={x(Math.min(now, S.HEARD))}
					y1={r.y + LANE}
					y2={r.y + LANE}
				/>
				{#if now >= S.HEARD}
					<text
						class="tag hot"
						x={(x(S.END) + x(S.HEARD)) / 2}
						y={r.y + LANE * 2 + 30}
						text-anchor="middle">{S.HEARD_MS} ms</text
					>
				{/if}
			{/if}
		{/each}
		<line class="now" x1={x(now)} x2={x(now)} y1="28" y2={H - 20} />
	</svg>
</figure>

<style>
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.name {
		font: 500 17px var(--font-ui);
		fill: var(--text);
	}
	.sub,
	.who {
		font: 400 12px var(--font-mono);
		fill: var(--dim);
	}
	.who {
		text-anchor: end;
	}
	.tag {
		font: 500 13px var(--font-mono);
	}
	.axis {
		stroke: var(--grid);
	}
	.u {
		fill: var(--muted);
	}
	.s {
		fill: var(--accent);
	}
	.s.bad {
		fill: var(--error);
	}
	.clash {
		fill: color-mix(in srgb, var(--error) 10%, transparent);
		stroke: color-mix(in srgb, var(--error) 45%, transparent);
	}
	.bad {
		fill: var(--error);
	}
	.hot {
		fill: var(--accent);
	}
	.gapline {
		stroke: var(--accent);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.now {
		stroke: var(--text);
		stroke-opacity: 0.2;
	}
</style>
