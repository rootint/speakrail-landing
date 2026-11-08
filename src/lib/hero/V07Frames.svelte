<!-- 7 · Every 80 ms: a spectrogram filling in frame by frame, and under it one cell per 80 ms frame
     tinted by the turn head's P(complete) for that frame. The first frame past 0.5 gets a ring. -->
<script>
	import { loop } from './clock.svelte.js';
	import * as S from './scenario.js';

	const W = 960;
	const H = 300;
	const FRAME = 0.08;
	const T_MAX = 4.4;
	const N = Math.round(T_MAX / FRAME); // 55 frames
	const X0 = 110;
	const CW = (W - X0) / N; // a frame's width
	const BINS = 16;
	const SPEC = { y: 40, h: 150 };
	const STRIP = { y: 220, h: 34 };

	const clock = loop(S.LOOP - 2.2, T_MAX);
	const now = $derived(Math.min(clock.t, T_MAX));
	const shown = $derived(Math.floor(now / FRAME));

	// a fake but speech-like spectrogram: two formant bands that drift, scaled by loudness
	const cells = Array.from({ length: N }, (_, f) => {
		const t = f * FRAME + FRAME / 2;
		const a = S.userLoud(t);
		const f1 = 3 + 2 * Math.sin(t * 2.1);
		const f2 = 9 + 2.5 * Math.sin(t * 1.3 + 1);
		return Array.from({ length: BINS }, (_, b) => {
			const e =
				a * (Math.exp(-((b - f1) ** 2) / 3) + 0.7 * Math.exp(-((b - f2) ** 2) / 5)) +
				0.04 * Math.abs(Math.sin(f * 7.1 + b * 3.3));
			return Math.min(1, e);
		});
	});
	const p = Array.from({ length: N }, (_, f) => S.pComplete(f * FRAME + FRAME));
	const fire = p.findIndex((v) => v >= 0.5);
</script>

<figure class="v">
	<svg
		viewBox="0 0 {W} {H}"
		role="img"
		aria-label="A spectrogram of the user's speech fills in frame by frame. Under it, one cell per 80 millisecond frame shows the turn head's confidence that the turn is over; it stays grey through a thinking pause and turns pink right after the last word."
	>
		<text class="lane" x="0" y={SPEC.y + 12}>audio</text>
		<text class="lane" x="0" y={STRIP.y + 22}>turn head</text>
		<text class="lane small" x="0" y={STRIP.y + 40}>every 80 ms</text>

		{#each cells as col, f (f)}
			{#if f <= shown}
				{#each col as e, b (b)}
					{#if e > 0.06}<rect
							class="px"
							x={X0 + f * CW}
							y={SPEC.y + SPEC.h - (b + 1) * (SPEC.h / BINS)}
							width={CW - 1}
							height={SPEC.h / BINS - 1}
							style:opacity={e}
						/>{/if}
				{/each}
				<rect
					class="cell"
					x={X0 + f * CW}
					y={STRIP.y}
					width={CW - 2}
					height={STRIP.h}
					rx="3"
					style:--p={p[f]}
				/>
			{:else}
				<rect
					class="cell empty"
					x={X0 + f * CW}
					y={STRIP.y}
					width={CW - 2}
					height={STRIP.h}
					rx="3"
				/>
			{/if}
		{/each}

		<!-- words, under the spectrogram -->
		{#each S.WORDS as w (w.a)}
			{#if now >= w.a}<text class="word" x={X0 + (w.a / FRAME) * CW} y={SPEC.y + SPEC.h + 18}
					>{w.w}</text
				>{/if}
		{/each}

		{#if shown >= fire}
			<rect
				class="ring"
				x={X0 + fire * CW - 3}
				y={STRIP.y - 3}
				width={CW + 4}
				height={STRIP.h + 6}
				rx="5"
			/>
			<text class="fire" x={X0 + fire * CW + CW} y={STRIP.y + STRIP.h + 24} text-anchor="end"
				>end of turn, {S.HEAD_MS} ms after the last word</text
			>
		{/if}
	</svg>
</figure>

<style>
	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.lane {
		font: 400 12px var(--font-mono);
		fill: var(--dim);
	}
	.lane.small {
		font-size: 11px;
	}
	.word {
		font: 400 13px var(--font-ui);
		fill: var(--body);
	}
	.px {
		fill: var(--muted);
	}
	.cell {
		fill: color-mix(in srgb, var(--accent) calc(var(--p) * 100%), var(--surface-2));
	}
	.cell.empty {
		fill: var(--surface-1);
	}
	.ring {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2;
	}
	.fire {
		font: 600 13px var(--font-mono);
		fill: var(--accent);
	}
</style>
