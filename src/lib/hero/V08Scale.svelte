<!-- 8 · Scale: Voxtral Realtime (970M encoder + 3.4B decoder, frozen) as squares the size of the
     turn head (2.4M parameters each), about 1,800 of them, and the turn head as the one pink square.
     The grid fills in once, then the head pulses. -->
<script>
	import { onMount } from 'svelte';

	const MODEL = 970e6 + 3.4e9;
	const HEAD = 2.4e6;
	const N = Math.round(MODEL / HEAD); // ≈ 1,821
	const COLS = 55; // leaves room for the key on the right
	const CELL = 9;
	const GAP = 3;
	const PITCH = CELL + GAP;
	const ROWS = Math.ceil(N / COLS);
	const GW = COLS * PITCH - GAP;
	const GH = ROWS * PITCH - GAP;
	const W = 960;
	const H = GH + 20;
	const ENC = Math.round(970e6 / HEAD); // the first squares are the encoder

	// one cell per square; the pink one is the last
	const cells = Array.from({ length: N + 1 }, (_, i) => ({
		i,
		x: (i % COLS) * PITCH,
		y: Math.floor(i / COLS) * PITCH,
		head: i === N
	}));

	// fill in once, on load (instantly for reduced motion)
	let shown = $state(N + 1);
	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		shown = 0;
		let raf = 0;
		let t0 = 0;
		const tick = (/** @type {number} */ ms) => {
			t0 ||= ms;
			shown = Math.min(N + 1, Math.floor(((ms - t0) / 1600) * (N + 1)));
			if (shown <= N) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});
</script>

<figure class="v">
	<svg
		viewBox="0 0 {W} {H}"
		role="img"
		aria-label="Voxtral Realtime's 4.4 billion frozen parameters drawn as about 1,800 squares, each the size of the 2.4 million parameter turn head; the turn head is the one pink square."
	>
		<g transform="translate(0 10)">
			{#each cells as c (c.i)}
				<rect
					class="cell"
					class:enc={c.i < ENC}
					class:head={c.head}
					class:on={c.i < shown}
					x={c.x}
					y={c.y}
					width={CELL}
					height={CELL}
					rx="2"
				/>
			{/each}
		</g>

		<!-- the key, right of the grid -->
		<g transform="translate({GW + 40} 24)">
			<text class="big" y="18">{N.toLocaleString('en-US')} squares</text>
			<text class="t" y="44">each one = 2.4M parameters,</text>
			<text class="t" y="64">the size of the turn head</text>

			<rect class="cell enc on" y="98" width={CELL + 3} height={CELL + 3} rx="2" />
			<text class="t" x="24" y="109">encoder · 970M · frozen</text>
			<rect class="cell on" y="126" width={CELL + 3} height={CELL + 3} rx="2" />
			<text class="t" x="24" y="137">decoder · 3.4B · frozen</text>
			<rect class="cell head on" y="154" width={CELL + 3} height={CELL + 3} rx="2" />
			<text class="t hot" x="24" y="165">turn head · 2.4M · trained</text>

			<text class="stat" y="220">+0.1 ms</text>
			<text class="t" y="242">per forward pass</text>
			<text class="stat" y="290">WER ±0</text>
			<text class="t" y="312">the weights never change</text>
		</g>
	</svg>
</figure>

<style>
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.cell {
		fill: color-mix(in srgb, var(--text) 9%, var(--surface-1));
		opacity: 0;
		transition: opacity 300ms;
	}
	.cell.on {
		opacity: 1;
	}
	.cell.enc {
		fill: color-mix(in srgb, var(--text) 24%, var(--surface-1));
	}
	.cell.head {
		fill: var(--accent);
		animation: beat 1.4s ease-in-out infinite;
		transform-box: fill-box;
		transform-origin: center;
	}
	@keyframes beat {
		50% {
			scale: 1.6;
		}
	}
	.big {
		font: 600 22px var(--font-ui);
		fill: var(--text);
	}
	.stat {
		font: 600 26px var(--font-mono);
		fill: var(--accent);
	}
	.t {
		font: 400 13px var(--font-mono);
		fill: var(--muted);
	}
	.t.hot {
		fill: var(--accent);
	}
	@media (prefers-reduced-motion: reduce) {
		.cell {
			transition: none;
		}
		.cell.head {
			animation: none;
		}
	}
</style>
