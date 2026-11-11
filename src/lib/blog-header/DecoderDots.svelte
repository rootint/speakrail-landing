<!-- The graphic under the title: Voxtral Realtime's decoder as a field of dots, one column per layer
     (26) and ten rows, each dot's size and strength a stand-in for activity. Layer 11, where the turn
     head reads, is pink, with a drop to the head below it. The field runs edge to edge across the
     text column. Deterministic, so the server and the browser draw the same dots. -->
<script>
	const W = 696; // the text column; the SVG scales with it
	const COLS = 26;
	const ROWS = 10;
	const TAP = 11;
	const R_MAX = 4.5; // the largest dot (1.5 + 3): the outer columns' centres sit this far in
	const PITCH = (W - 2 * R_MAX) / (COLS - 1);
	const ROW_H = 18;
	const TOP = R_MAX;
	const FIELD_BOTTOM = TOP + (ROWS - 1) * ROW_H;
	const tapX = R_MAX + TAP * PITCH;
	const H = FIELD_BOTTOM + 52; // room for the drop and the ring

	let seed = 5;
	const noise = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
	const dots = Array.from({ length: COLS * ROWS }, (_, k) => {
		const c = k % COLS;
		const row = Math.floor(k / COLS);
		const v = 0.15 + 0.85 * noise() * (0.5 + 0.5 * Math.sin(c * 0.4 + row));
		return { k, c, x: R_MAX + c * PITCH, y: TOP + row * ROW_H, v };
	});
</script>

<figure class="dots">
	<svg
		viewBox="0 0 {W} {H}"
		role="img"
		aria-label="Voxtral Realtime's decoder as a grid of dots, one column per layer; layer 11, where the turn head reads, is pink."
	>
		{#each dots as d (d.k)}
			<circle
				class="dot"
				class:tap={d.c === TAP}
				cx={d.x}
				cy={d.y}
				r={1.5 + d.v * 3}
				style:opacity={d.c === TAP ? 0.4 + d.v * 0.6 : d.v}
			/>
		{/each}
		<line class="drop" x1={tapX} y1={FIELD_BOTTOM + 14} x2={tapX} y2={FIELD_BOTTOM + 34} />
		<circle class="head" cx={tapX} cy={FIELD_BOTTOM + 44} r="7" />
	</svg>
</figure>

<style>
	.dots {
		margin: 0;
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.dot {
		fill: var(--muted);
	}
	.dot.tap {
		fill: var(--accent);
	}
	.drop {
		stroke: var(--accent);
		stroke-width: 2;
	}
	.head {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2;
	}
</style>
