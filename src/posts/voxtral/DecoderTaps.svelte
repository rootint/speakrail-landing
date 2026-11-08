<!-- Voxtral Realtime's decoder as a row of its 26 layers, from the audio encoder's output on the left
     to the text it writes on the right, and the five places the layer experiment read hidden states
     from (layers 0, 4, 11, 17 and the output after the final norm), each into its own linear probe.
     Arrows underneath: the left end is closer to the sound, the right end to the meaning. Drawn at
     the column's width (696px); narrower screens scroll it sideways. Theme tokens throughout. -->
<script>
	const W = 696;
	const H = 288;

	const LAYERS = 26;
	const X0 = 88; // first layer's left edge
	const PITCH = 18; // layer to layer
	const BAR = 12; // a layer's width
	const TOP = 44;
	const BOTTOM = 154;
	const MID = (TOP + BOTTOM) / 2;
	const R = 4; // corner radius for the thin layer bars; 10 (--radius-sm) for the boxes

	const lx = (/** @type {number} */ i) => X0 + i * PITCH;
	const lc = (/** @type {number} */ i) => lx(i) + BAR / 2;
	const NORM = { x: lx(LAYERS) + 8, w: BAR }; // the final norm, after the last layer
	const LAST = lx(LAYERS - 1) + BAR; // right edge of layer 25

	// where we read from: layer index, or 'out' for after the final norm
	const TAPPED = [0, 4, 11, 17];
	const taps = [
		...TAPPED.map((i) => ({ x: lc(i), label: String(i) })),
		{ x: NORM.x + NORM.w / 2, label: 'output' }
	];
	const PROBE = { y: 194, h: 26, w: 56 };

	// numbers over the layers: the tapped ones and the two ends
	const numbered = [...new Set([0, ...TAPPED, LAYERS - 1])];

	const ARROWS = 256;
</script>

<figure class="taps">
	<div class="scroll">
		<svg
			viewBox="0 0 {W} {H}"
			role="img"
			aria-label="A schematic of the Voxtral's decoder – the audio encoder feeds 26 decoder layers with a final norm at the end. We picker layers 0, 4, 11, 17 and the final norm for probing. Layers on the left are more acoustic, while layers on the right are more semantic."
		>
			<defs>
				<marker
					id="taps-arrow"
					viewBox="0 0 8 8"
					refX="7"
					refY="4"
					markerWidth="7"
					markerHeight="7"
					orient="auto-start-reverse"
				>
					<path class="head" d="M0 0 L8 4 L0 8 z" />
				</marker>
				<marker
					id="taps-arrow-hot"
					viewBox="0 0 8 8"
					refX="7"
					refY="4"
					markerWidth="7"
					markerHeight="7"
					orient="auto"
				>
					<path class="head hot" d="M0 0 L8 4 L0 8 z" />
				</marker>
			</defs>

			<!-- what goes in: the audio encoder's output -->
			<rect class="box" x="0.5" y={MID - 34} width="64" height="68" rx="10" />
			<text class="small" x="32.5" y={MID - 3}>audio</text>
			<text class="small" x="32.5" y={MID + 12}>encoder</text>
			<line class="flow" x1="66" y1={MID} x2={X0 - 4} y2={MID} marker-end="url(#taps-arrow)" />

			<!-- the decoder: 26 layers, a bracket and a name over them -->
			<text class="name" x={(X0 + LAST) / 2} y="12">Voxtral Realtime decoder schematic</text>
			{#each numbered as i (i)}
				<text class="num" class:hot={TAPPED.includes(i)} x={lc(i)} y={TOP - 10}>{i}</text>
			{/each}
			{#each Array.from({ length: LAYERS }, (_, i) => i) as i (i)}
				<rect
					class="layer"
					class:hot={TAPPED.includes(i)}
					x={lx(i)}
					y={TOP}
					width={BAR}
					height={BOTTOM - TOP}
					rx={R}
				/>
			{/each}

			<!-- the final norm, then the text out -->
			<text class="num hot" x={NORM.x + NORM.w / 2} y={TOP - 10}>norm</text>
			<rect class="layer norm hot" x={NORM.x} y={TOP} width={NORM.w} height={BOTTOM - TOP} rx={R} />
			<line
				class="flow"
				x1={NORM.x + NORM.w + 2}
				y1={MID}
				x2={NORM.x + NORM.w + 26}
				y2={MID}
				marker-end="url(#taps-arrow)"
			/>
			<text class="small out" x={NORM.x + NORM.w + 32} y={MID - 3}>text</text>
			<text class="small out" x={NORM.x + NORM.w + 32} y={MID + 12}>tokens</text>

			<!-- each tap: hidden states down into a linear probe -->
			{#each taps as t (t.label)}
				<line
					class="tap"
					x1={t.x}
					y1={BOTTOM + 2}
					x2={t.x}
					y2={PROBE.y - 3}
					marker-end="url(#taps-arrow-hot)"
				/>
				<rect
					class="probe"
					x={t.x - PROBE.w / 2}
					y={PROBE.y}
					width={PROBE.w}
					height={PROBE.h}
					rx="10"
				/>
				<text class="small" x={t.x} y={PROBE.y + PROBE.h / 2 + 4}>probe</text>
			{/each}

			<!-- left is closer to the sound, right to the meaning -->
			<line
				class="axis"
				x1={(X0 + LAST) / 2 - 6}
				y1={ARROWS}
				x2={X0 + 2}
				y2={ARROWS}
				marker-end="url(#taps-arrow)"
			/>
			<line
				class="axis"
				x1={(X0 + LAST) / 2 + 6}
				y1={ARROWS}
				x2={LAST - 2}
				y2={ARROWS}
				marker-end="url(#taps-arrow)"
			/>
			<text class="side" x={X0} y={ARROWS + 22}>more acoustic</text>
			<text class="side end" x={LAST} y={ARROWS + 22}>more semantic</text>
		</svg>
	</div>
	<figcaption>
	A schematic of the Voxtral's decoder – the audio encoder feeds 26 decoder layers with a final norm at the end. We picked layers 0, 4, 11, 17 and the final norm for probing. Layers on the left are more acoustic, while layers on the right are more semantic.
	</figcaption>
</figure>

<style>
	/* phones: keep the text readable and scroll the drawing sideways instead */
	.scroll {
		overflow-x: auto;
		scrollbar-width: thin;
	}
	@media (max-width: 41rem) {
		.scroll {
			mask-image: linear-gradient(90deg, #000 calc(100% - 40px), transparent);
		}
	}
	svg {
		display: block;
		width: 100%;
		min-width: 600px;
		height: auto;
	}

	text {
		text-anchor: middle;
	}
	.name {
		font: 500 14px var(--font-ui);
		fill: var(--text);
	}
	.num,
	.small {
		font: 400 11px var(--font-mono);
		fill: var(--muted);
	}
	.num.hot {
		fill: var(--accent);
	}
	.small.out {
		text-anchor: start;
	}
	.side {
		font: 400 13px var(--font-ui);
		fill: var(--muted);
		text-anchor: start;
	}
	.side.end {
		text-anchor: end;
	}

	.box {
		fill: var(--surface-1);
		stroke: var(--grid);
	}
	.layer {
		fill: var(--surface-2);
		stroke: var(--grid);
	}
	.layer.hot {
		fill: var(--accent-wash);
		stroke: var(--accent);
	}
	.probe {
		fill: var(--surface-1);
		stroke: color-mix(in srgb, var(--accent) 45%, transparent);
	}

	.flow,
	.axis {
		stroke: var(--chart-grey);
		stroke-width: 1.25;
	}
	.tap {
		stroke: var(--accent);
		stroke-width: 1.25;
	}
	.head {
		fill: var(--chart-grey);
	}
	.head.hot {
		fill: var(--accent);
	}
</style>
