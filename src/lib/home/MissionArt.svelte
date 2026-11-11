<!-- The drawing over the mission statement on the home page: short strokes carried by a current, each
     following the flow from where it starts, so together they show its bends. A few are pink.
     It runs the full width of the window and starts at the very top of the page, behind the nav
     (which is see-through there: <SiteNav clear />), fading in from nothing so the nav stays readable.
     Deterministic, so the prerendered HTML and the browser draw the same strokes. -->
<script>
	// The canvas is far wider than most screens: the window shows the middle of it at natural size,
	// as much as it has room for (preserveAspectRatio "slice"). Nothing depends on where it ends.
	const W = 2560;
	const H = 400;

	let seed = 211;
	const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
	/** 1 decimal keeps the markup short. @param {number} v */
	const r1 = (v) => Math.round(v * 10) / 10;

	/** Which way the current runs at a point, in radians. */
	const angle = (/** @type {number} */ x, /** @type {number} */ y) =>
		0.75 * Math.sin(x / 120 + 0.8 * Math.sin(y / 52)) + 0.55 * Math.sin(y / 44 - x / 190 + 1);

	const CELL = 23; // one stroke starts somewhere in each cell this wide...
	const ROW = 20; // ...and this tall
	const STEP = 4;
	const COLS = Math.round(W / CELL);
	const ROWS = Math.round(H / ROW);
	const strokes = Array.from({ length: COLS * ROWS }, (_, k) => {
		let x = ((k % COLS) + rand()) * (W / COLS);
		let y = (Math.floor(k / COLS) + rand()) * (H / ROWS);
		const steps = 8 + Math.floor(rand() * 16);
		let d = `M${r1(x)} ${r1(y)}`;
		for (let s = 0; s < steps; s++) {
			const a = angle(x, y);
			const dx = Math.cos(a) * STEP;
			const dy = Math.sin(a) * STEP;
			x += dx;
			y += dy;
			d += `l${r1(dx)} ${r1(dy)}`;
		}
		const hot = rand() < 0.08;
		return { k, d, o: hot ? 1 : r1(0.3 + 0.7 * rand()), hot };
	});
</script>

<div class="art" aria-hidden="true">
	<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice">
		{#each strokes as s (s.k)}
			<path class:hot={s.hot} d={s.d} opacity={s.o} />
		{/each}
	</svg>
</div>

<style>
	.art {
		--nav-h: 64px;
		/* shorter on a phone, where less of the drawing fits across */
		height: clamp(220px, 34vw, 400px);
		/* up behind the nav, to the top of the page */
		margin-top: calc(var(--nav-h) * -1);
		margin-bottom: var(--s6);
		pointer-events: none;
		/* in from nothing at the top, still faint behind the nav, full by the middle; a short fade out
		   at the bottom so the strokes don't end on a hard line */
		mask-image: linear-gradient(
			to bottom,
			transparent,
			rgb(0 0 0 / 0.1) 12%,
			rgb(0 0 0 / 0.3) var(--nav-h),
			#000 62%,
			#000 82%,
			transparent
		);
	}
	svg {
		display: block;
		width: 100%;
		height: 100%;
	}
	path {
		fill: none;
		stroke: var(--chart-grey);
		stroke-width: 1.25;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.hot {
		stroke: var(--accent);
		stroke-width: 1.75;
	}
</style>
