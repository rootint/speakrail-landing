<!-- 11 · full-bleed scrolling spectrogram with a live p(done) readout (simulated audio) -->
<script>
	import { onMount } from 'svelte';

	const BINS = 40;
	const STEP = 3; // px per frame
	// speech / pause schedule in frames; the long pause after the second phrase is the end of turn
	/** @type {['speech' | 'pause' | 'end', number][]} */
	const schedule = [
		['speech', 80],
		['pause', 22],
		['speech', 64],
		['end', 90]
	];

	/** @type {HTMLCanvasElement} */
	let canvas;
	let p = $state(0.03);
	let seconds = $state(0);
	const hot = $derived(p >= 0.5);

	onMount(() => {
		const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		let w = 0;
		let h = 0;
		let frame = 0;
		let seg = 0;
		let segFrame = 0;
		let seed = 7;
		const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

		const column = () => {
			const [kind, len] = schedule[seg];
			const speaking = kind === 'speech';
			const syllable = Math.abs(Math.sin(frame * 0.21)) * (0.6 + 0.4 * Math.sin(frame * 0.05));
			const f1 = 9 + 4 * Math.sin(frame * 0.07);
			const f2 = 22 + 6 * Math.sin(frame * 0.045 + 1);
			const bh = h / BINS;
			ctx.fillStyle = '#161414';
			ctx.fillRect(w - STEP, 0, STEP, h);
			for (let b = 0; b < BINS; b++) {
				let e = rand() * 0.08;
				if (speaking) {
					e +=
						syllable *
						(Math.exp(-((b - f1) ** 2) / 14) +
							0.7 * Math.exp(-((b - f2) ** 2) / 24) +
							0.25 * rand());
				}
				e = Math.min(1, e);
				if (e < 0.04) continue;
				ctx.fillStyle = e > 0.75 ? `rgba(252,245,247,${e})` : `rgba(245,158,185,${e})`;
				ctx.fillRect(w - STEP, h - (b + 1) * bh, STEP, bh - 1);
			}
			// p(done): low while speaking, creeps up in a short pause, climbs past 0.5 in the end-of-turn pause
			const target = kind === 'speech' ? 0.04 : kind === 'pause' ? 0.28 : 0.95;
			p += (target - p) * (kind === 'end' ? 0.06 : 0.04);
			if (++segFrame >= len) {
				segFrame = 0;
				seg = (seg + 1) % schedule.length;
			}
		};

		// scroll left by one step and paint a new column on the right
		const step = () => {
			ctx.drawImage(canvas, STEP * dpr, 0, (w - STEP) * dpr, h * dpr, 0, 0, w - STEP, h);
			column();
			frame++;
		};

		// resizing clears the canvas, so refill it; ResizeObserver also fires once on observe
		const resize = () => {
			if (canvas.clientWidth === w && canvas.clientHeight === h) return;
			w = canvas.clientWidth;
			h = canvas.clientHeight;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.fillStyle = '#161414';
			ctx.fillRect(0, 0, w, h);
			for (let i = 0; i < Math.ceil(w / STEP); i++) step();
		};
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(canvas);

		let raf = 0;
		const tick = () => {
			step();
			if (frame % 6 === 0) seconds = frame / 60;
			raf = requestAnimationFrame(tick);
		};
		if (!matchMedia('(prefers-reduced-motion: reduce)').matches) raf = requestAnimationFrame(tick);
		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
		};
	});
</script>

<div class="band">
	<canvas bind:this={canvas} aria-hidden="true"></canvas>
	<div class="hud">
		<span>t = {seconds.toFixed(1)} s</span>
		<span class="p" class:hot>p(done) {p.toFixed(2)}{hot ? ' · end of turn → reply' : ''}</span>
	</div>
	<span class="foot">simulated audio</span>
</div>

<style>
	.band {
		position: relative;
		width: 100vw;
		height: 220px;
		margin-inline: calc(50% - 50vw);
		border-block: 1px solid var(--grid);
		mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
	}
	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
	.hud {
		position: absolute;
		top: var(--s3);
		left: 50%;
		display: flex;
		justify-content: space-between;
		width: min(100% - 2 * var(--gutter), 43.5rem);
		translate: -50% 0;
		font: 400 var(--fs-small) / 1.4 var(--font-mono);
		font-variant-numeric: tabular-nums;
		color: var(--muted);
	}
	.p {
		transition: color var(--dur);
	}
	.p.hot {
		color: var(--accent);
	}
	.foot {
		position: absolute;
		bottom: var(--s2);
		left: 50%;
		translate: -50% 0;
		font: 400 var(--fs-caption) / 1.4 var(--font-mono);
		color: var(--chart-grey);
	}
</style>
