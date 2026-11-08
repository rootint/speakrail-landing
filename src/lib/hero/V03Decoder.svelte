<!-- 3 · Inside the decoder: Voxtral's 26 frozen decoder layers, a pulse running through them every
     80 ms frame, layer 11 tapped into the turn head, and the head's three outputs live. -->
<script>
	import { loop } from './clock.svelte.js';
	import * as S from './scenario.js';

	const W = 960;
	const H = 366;
	const LAYERS = 26;
	const L0 = 250;
	const PITCH = 22;
	const BAR = 14;
	const TOP = 70;
	const BOT = 190;
	const TAP = 11;
	const lx = (/** @type {number} */ i) => L0 + i * PITCH;
	const HX = lx(TAP) + BAR / 2 - 210; // the head box, centred under the tapped layer
	const HY = BOT + 30;

	const clock = loop(S.LOOP, S.HEAD_FIRES + 0.4);
	const now = $derived(clock.t);
	// the frame's wave through the layers: 80 ms per frame, layer by layer
	const phase = $derived((now % 0.08) / 0.08);
	const pr = $derived(S.probs(now));
	const classes = $derived([
		{ k: 'complete', v: pr.complete, say: 'reply' },
		{ k: 'incomplete', v: pr.incomplete, say: 'wait' },
		{ k: 'backchannel', v: pr.backchannel, say: 'keep talking' }
	]);
	const top = $derived(classes.reduce((a, b) => (b.v > a.v ? b : a)));

	// the last 1.6 s of input, scrolling into the decoder from the left
	const SPAN = 1.6;
	const wave = $derived(
		Array.from({ length: 40 }, (_, i) => {
			const t = now - SPAN + (i * SPAN) / 40;
			const a = t < 0 ? 0 : S.userLoud(t); // the ASR hears the user
			return { i, a };
		})
	);
	const caption = $derived(
		now < S.HEARD
			? S.said(S.WORDS, now)
					.map((w) => w.w)
					.join(' ')
			: S.said([...S.REPLY], now)
					.map((w) => w.w)
					.join(' ')
	);
</script>

<figure class="v">
	<svg
		viewBox="0 0 {W} {H}"
		role="img"
		aria-label="Voxtral's 26 decoder layers process each 80 millisecond frame. A turn head reads layer 11 and outputs complete, incomplete or backchannel."
	>
		<!-- the audio coming in -->
		<text class="lane" x="0" y={TOP - 18}>audio in</text>
		{#each wave as b (b.i)}
			<rect
				class="in"
				x={b.i * 5}
				y={(TOP + BOT) / 2 - b.a * 46}
				width="3"
				height={Math.max(1, b.a * 92)}
				rx="1"
			/>
		{/each}
		<text class="cap" x="0" y={H - 6}>“{caption}”</text>

		<!-- the decoder -->
		<text class="name" x={lx(0)} y={TOP - 34}>Voxtral Realtime decoder</text>
		<text class="frozen" x={lx(LAYERS - 1) + BAR} y={TOP - 34}>frozen · 26 layers</text>
		{#each Array.from({ length: LAYERS }, (_, i) => i) as i (i)}
			{@const lit = Math.max(0, 1 - Math.abs(phase * LAYERS - i) / 3)}
			<rect
				class="layer"
				class:tap={i === TAP}
				x={lx(i)}
				y={TOP}
				width={BAR}
				height={BOT - TOP}
				rx="4"
				style:--lit={lit}
			/>
		{/each}
		<text class="num" x={lx(TAP) + BAR / 2} y={TOP - 10}>11</text>

		<!-- the tap and the head -->
		<line class="tapline" x1={lx(TAP) + BAR / 2} x2={lx(TAP) + BAR / 2} y1={BOT + 2} y2={HY} />
		<rect class="head" x={HX} y={HY} width="420" height="116" rx="14" />
		<text class="name sm" x={HX + 20} y={HY + 28}>Turn head · 2.4M</text>
		<text class="verdict" x={HX + 400} y={HY + 28}>→ {top.say}</text>
		{#each classes as c, i (c.k)}
			<text class="cls" class:win={c === top} x={HX + 20} y={HY + 56 + i * 22}>{c.k}</text>
			<rect class="track" x={HX + 130} y={HY + 47 + i * 22} width="230" height="8" rx="4" />
			<rect
				class="fill"
				class:win={c === top}
				x={HX + 130}
				y={HY + 47 + i * 22}
				width={Math.max(4, c.v * 230)}
				height="8"
				rx="4"
			/>
			<text class="val" x={HX + 400} y={HY + 56 + i * 22}>{c.v.toFixed(2)}</text>
		{/each}
	</svg>
</figure>

<style>
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.lane,
	.num,
	.val,
	.frozen {
		font: 400 12px var(--font-mono);
		fill: var(--dim);
	}
	.num {
		fill: var(--accent);
		text-anchor: middle;
	}
	.frozen {
		text-anchor: end;
	}
	.val {
		text-anchor: end;
		font-variant-numeric: tabular-nums;
	}
	.cap {
		font: 400 14px var(--font-ui);
		fill: var(--body);
	}
	.name {
		font: 500 16px var(--font-ui);
		fill: var(--text);
	}
	.name.sm {
		font-size: 15px;
	}
	.verdict {
		font: 600 14px var(--font-mono);
		fill: var(--accent);
		text-anchor: end;
	}
	.cls {
		font: 400 13px var(--font-mono);
		fill: var(--muted);
	}
	.cls.win {
		fill: var(--text);
	}
	.in {
		fill: var(--muted);
	}
	.layer {
		fill: color-mix(in srgb, var(--text) calc(6% + var(--lit) * 16%), var(--surface-1));
		stroke: var(--grid);
	}
	.layer.tap {
		fill: color-mix(in srgb, var(--accent) calc(25% + var(--lit) * 50%), var(--surface-1));
		stroke: var(--accent);
	}
	.tapline {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2;
	}
	.head {
		fill: var(--surface-1);
		stroke: color-mix(in srgb, var(--accent) 45%, transparent);
	}
	.track {
		fill: var(--surface-sunk);
	}
	.fill {
		fill: var(--chart-grey);
	}
	.fill.win {
		fill: var(--accent);
	}
</style>
