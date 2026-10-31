<!-- 13 · abstract: a voice print as topographic contours — rings spreading from a pink source,
     warped more the further they travel, with fine ripples where the voice is loudest -->
<script>
	import { onMount } from 'svelte';

	const RINGS = 34;
	const POINTS = 360;

	/** @type {HTMLCanvasElement} */
	let canvas;

	onMount(() => {
		const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
		const dpr = Math.min(2, window.devicePixelRatio || 1);

		const draw = () => {
			const w = canvas.clientWidth;
			const h = canvas.clientHeight;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, w, h);

			const cx = w / 2;
			const cy = h / 2;
			const reach = Math.min(h / 2 - 8, w / 2 - 8) - 22;
			ctx.lineWidth = 1;

			for (let i = 0; i < RINGS; i++) {
				const t = i / (RINGS - 1);
				const c = t ** 1.6; // stay pink for longer before cooling
				// pink at the source, cooling to grey as the rings spread
				const R = Math.round(245 - 130 * c);
				const G = Math.round(158 - 50 * c);
				const B = Math.round(185 - 75 * c);
				ctx.strokeStyle = `rgb(${R} ${G} ${B} / ${1 - 0.6 * t})`;
				ctx.beginPath();
				for (let k = 0; k <= POINTS; k++) {
					const a = (k / POINTS) * Math.PI * 2;
					const warp =
						10 * Math.sin(3 * a + 1.3 + 2.1 * t) +
						6 * Math.sin(5 * a - 0.7 + 3.4 * t) +
						3.5 * Math.sin(8 * a + 4.2 * t);
					const loud = Math.max(0, Math.sin(2 * a + 0.5)) ** 2;
					const ripple = 3.2 * Math.sin(36 * a + 9 * t) * loud;
					const r = 16 + t * reach + t ** 1.3 * warp + t ** 2 * ripple;
					const x = cx + r * Math.cos(a);
					const y = cy + r * Math.sin(a);
					if (k === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				}
				ctx.stroke();
			}
			// the source
			ctx.fillStyle = 'rgb(245 158 185)';
			ctx.beginPath();
			ctx.arc(cx, cy, 4, 0, Math.PI * 2);
			ctx.fill();
		};

		// fires once on observe, then on every size change
		let last = '';
		const ro = new ResizeObserver(() => {
			const size = `${canvas.clientWidth}x${canvas.clientHeight}`;
			if (size === last) return;
			last = size;
			draw();
		});
		ro.observe(canvas);
		return () => ro.disconnect();
	});
</script>

<div class="contour">
	<canvas bind:this={canvas} aria-hidden="true"></canvas>
</div>

<style>
	.contour {
		position: relative;
		height: 380px;
	}
	/* pinned to the box: with a percentage height Chrome fell back to the canvas's 2:1 default */
	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
</style>
