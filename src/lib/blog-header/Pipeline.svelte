<!-- 14 · audio → encoder (narrowing) → live spectrogram → decoder → "Hello, world!", with the turn head
     reading a middle decoder layer. Encoder, decoder and head are drawn as small firing networks.
     Plays once, then offers a replay. Audio, activity and probabilities are simulated -->
<script>
	import { onMount } from 'svelte';
	import Refresh from '~icons/iconoir/refresh';

	const W = 1240;
	const H = 372;
	const Y = 150; // centre line

	// geometry, in px of the drawing
	// the model (encoder → spectrogram → decoder) is centred on the page; PAD separates the pieces
	const PAD = 16;
	const GAP = { x: W / 2 - 120, y: Y - 45, w: 240, h: 90 };
	const ENC = { x0: GAP.x - PAD - 220, x1: GAP.x - PAD, big: 100, small: 45 }; // half-heights at each end
	const DEC = { x0: GAP.x + GAP.w + PAD, x1: GAP.x + GAP.w + PAD + 220, half: 100 };
	const WAVE = { x: 12, y: 50, w: ENC.x0 - PAD - 12, h: 200 };
	const RADIUS = 20;

	// time runs in ticks; the waveform and spectrogram move 3px per tick
	const PX = 3;
	const TICKS_PER_SECOND = 30; // clock-based, so 120 Hz screens don't play it twice as fast
	const BINS = 24;
	const TO_ENCODER = WAVE.w / PX;
	const ENC_OUT = TO_ENCODER + 10; // ticks from entering the waveform to leaving the encoder
	const LAG = Math.round(ENC_OUT + GAP.w / PX); // ticks from entering to reaching the decoder
	const START = 30; // the first words are already on their way in
	// the text runs behind the audio the head sees, so the last word lands after the head has fired
	const TEXT_DELAY = 50;
	const END = LAG + TEXT_DELAY + 180; // a second after the last word

	// one utterance: speech, a short pause, speech, then silence
	const speaking = (/** @type {number} */ t) => (t >= 0 && t < 70) || (t >= 90 && t < 160);
	const loudness = (/** @type {number} */ t) =>
		speaking(t)
			? Math.abs(Math.sin(t * 0.21)) * (0.6 + 0.4 * Math.sin(t * 0.05)) * 0.9 + 0.08
			: 0.03;

	// a schematic network: columns of nodes, each wired to a few nodes in the next column.
	// Deterministic, so server and client render the same picture.
	let netSeed = 11;
	const nrand = () => (netSeed = (netSeed * 16807) % 2147483647) / 2147483647;
	/**
	 * @param {number[]} xs column x positions
	 * @param {(x: number) => number} halfAt usable half-height at x
	 * @param {number} spacing vertical gap between nodes
	 * @param {(x: number, y: number) => boolean} [skip] keep nodes out of a label
	 */
	const network = (xs, halfAt, spacing, skip = () => false) => {
		const cols = xs.map((x, c) => {
			const half = halfAt(x);
			const n = Math.max(2, Math.floor((2 * half) / spacing) + 1);
			return Array.from({ length: n }, (_, k) => ({
				x,
				y: Y - half + (k * 2 * half) / (n - 1),
				col: c,
				delay: c * 0.16 + nrand() * 0.9
			})).filter((node) => !skip(node.x, node.y));
		});
		const edges = [];
		for (let c = 0; c < cols.length - 1; c++) {
			for (const [k, a] of cols[c].entries()) {
				const next = cols[c + 1];
				const near = Math.round((k / Math.max(1, cols[c].length - 1)) * (next.length - 1));
				// the straight-across node plus two neighbours within two rows, so wiring stays local
				const nearby = () => near + Math.round((nrand() - 0.5) * 4);
				const picks = new Set([near, nearby(), nearby()]);
				for (const j of picks) {
					const b = next[j];
					if (b) edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, delay: a.delay + 0.08 });
				}
			}
		}
		return { nodes: cols.flat(), edges };
	};
	const spread = (/** @type {number} */ x0, /** @type {number} */ x1, /** @type {number} */ n) =>
		Array.from({ length: n }, (_, i) => x0 + (i * (x1 - x0)) / (n - 1));

	// labels sit in the bottom corners; nodes stay out of them
	const ENC_LABEL = { x: ENC.x0 + 20, y: Y + 48 };
	const DEC_LABEL = { x: DEC.x1 - 20, y: Y + 48 };
	const encNet = network(
		spread(ENC.x0 + 22, ENC.x1 - 18, 7),
		(x) => ENC.big - ((ENC.big - ENC.small) * (x - ENC.x0)) / (ENC.x1 - ENC.x0) - 16,
		24,
		(x, y) => x < ENC_LABEL.x + 70 && y > ENC_LABEL.y - 22
	);
	const DEC_COLS = spread(DEC.x0 + 22, DEC.x1 - 22, 8);
	const TAP_COL = 3; // ≈ layer 11 of 26
	const decNet = network(
		DEC_COLS,
		() => DEC.half - 16,
		26,
		(x, y) => x > DEC_LABEL.x - 70 && y > DEC_LABEL.y - 22
	);
	const tapX = DEC_COLS[TAP_COL];

	// the turn head: a tiny network in its own box, under the tapped column
	const HEAD = { x: tapX - 40, y: 276, w: 250, h: 84 };
	const headNet = (() => {
		const xs = [HEAD.x + 24, HEAD.x + 52, HEAD.x + 80];
		const sizes = [4, 3, 1];
		const nodes = xs.flatMap((x, c) =>
			Array.from({ length: sizes[c] }, (_, k) => ({
				x,
				y:
					sizes[c] === 1 ? HEAD.y + HEAD.h / 2 : HEAD.y + 18 + (k * (HEAD.h - 36)) / (sizes[c] - 1),
				col: c,
				delay: c * 0.16 + nrand() * 0.5
			}))
		);
		const edges = nodes.flatMap((a) =>
			nodes
				.filter((b) => b.col === a.col + 1)
				.map((b) => ({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, delay: a.delay + 0.08 }))
		);
		return { nodes, edges, out: nodes[nodes.length - 1] };
	})();

	// polygon path with each corner cut by a quadratic curve of radius r
	const rounded = (/** @type {[number, number][]} */ pts, /** @type {number} */ r) =>
		pts
			.map((v, i) => {
				const toward = (/** @type {[number, number]} */ o) => {
					const len = Math.hypot(o[0] - v[0], o[1] - v[1]);
					const k = Math.min(r, len / 2) / len;
					return `${v[0] + (o[0] - v[0]) * k},${v[1] + (o[1] - v[1]) * k}`;
				};
				const prev = pts[(i - 1 + pts.length) % pts.length];
				const next = pts[(i + 1) % pts.length];
				return `${i ? 'L' : 'M'}${toward(prev)} Q${v[0]},${v[1]} ${toward(next)}`;
			})
			.join(' ') + ' Z';
	const encPath = rounded(
		[
			[ENC.x0, Y - ENC.big],
			[ENC.x1, Y - ENC.small],
			[ENC.x1, Y + ENC.small],
			[ENC.x0, Y + ENC.big]
		],
		RADIUS
	);

	/** @type {HTMLCanvasElement} */
	let wave;
	/** @type {HTMLCanvasElement} */
	let spec;
	let text = $state('Hello, world!');
	let p = $state(0.96); // smooth probability the head is tending towards
	let shown = $state(0.96); // what the readout shows: p plus per-step jitter
	let fired = $state(true); // latches on the first step at or over 0.9
	let done = $state(false);
	let still = $state(false);
	// which networks are busy, for the firing animation
	let encOn = $state(true);
	let decOn = $state(true);
	let headOn = $state(true);
	/** @type {() => void} */
	let replay = () => {};

	onMount(() => {
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		const setup = (
			/** @type {HTMLCanvasElement} */ c,
			/** @type {number} */ w,
			/** @type {number} */ h
		) => {
			c.width = w * dpr;
			c.height = h * dpr;
			const ctx = /** @type {CanvasRenderingContext2D} */ (c.getContext('2d'));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			return ctx;
		};
		const wctx = setup(wave, WAVE.w, WAVE.h);
		const sctx = setup(spec, GAP.w, GAP.h);

		let seed = 7;
		const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

		// one spectrogram column per tick, kept until the next tick so 1px scroll steps reuse it
		/** @type {(string | null)[]} */
		let column = [];
		let columnTick = NaN;
		const columnAt = (/** @type {number} */ t) => {
			if (t === columnTick) return column;
			columnTick = t;
			const syll = Math.abs(Math.sin(t * 0.21)) * (0.6 + 0.4 * Math.sin(t * 0.05));
			const f1 = 6 + 3 * Math.sin(t * 0.07);
			const f2 = 15 + 4 * Math.sin(t * 0.045 + 1);
			column = Array.from({ length: BINS }, (_, b) => {
				let e = rand() * 0.08;
				if (speaking(t)) {
					e +=
						syll *
						(Math.exp(-((b - f1) ** 2) / 6) +
							0.7 * Math.exp(-((b - f2) ** 2) / 10) +
							0.25 * rand());
				}
				e = Math.min(1, e);
				if (e < 0.04) return null;
				return e > 0.75 ? `rgb(252 245 247 / ${e})` : `rgb(245 158 185 / ${e})`;
			});
			return column;
		};

		// shift right by 1px and paint the newest strip on the left (the encoder side)
		const shiftSpec = (/** @type {number} */ now) => {
			sctx.drawImage(spec, 0, 0, (GAP.w - 1) * dpr, GAP.h * dpr, 1, 0, GAP.w - 1, GAP.h);
			sctx.fillStyle = '#1f1c1d';
			sctx.fillRect(0, 0, 1, GAP.h);
			const bh = GAP.h / BINS;
			columnAt(Math.floor(now - ENC_OUT)).forEach((fill, b) => {
				if (!fill) return;
				sctx.fillStyle = fill;
				sctx.fillRect(0, GAP.h - (b + 1) * bh, 1, bh - 1);
			});
		};

		// each bar is one sample time, so bars glide right instead of re-sampling in place
		const drawWave = (/** @type {number} */ now) => {
			wctx.clearRect(0, 0, WAVE.w, WAVE.h);
			wctx.fillStyle = '#736c6e';
			for (let t = Math.ceil(now - TO_ENCODER); t <= now; t++) {
				if (t % 2) continue;
				const x = (now - t) * PX;
				const a = loudness(t) * (0.75 + 0.25 * Math.sin(t * 1.7));
				const half = Math.max(1, a * (WAVE.h / 2 - 6));
				wctx.fillRect(x, WAVE.h / 2 - half, 2, half * 2);
			}
		};

		// what the decoder and the head see, LAG ticks after the audio came in
		let lastStep = 0;
		const decode = (
			/** @type {number} */ now,
			/** @type {number} */ dt,
			/** @type {number} */ ms
		) => {
			const u = now - LAG;
			const v = u - TEXT_DELAY;
			text = v < 60 ? '' : v < 150 ? 'Hello,' : 'Hello, world!';
			const target = u >= 162 ? 0.96 : u >= 70 && u < 90 ? 0.12 : 0.02;
			p += (target - p) * (1 - Math.exp(-dt / 0.2)); // eases with a ~0.2 s time constant
			// one jittery reading per 80 ms step, like the real head
			if (ms - lastStep >= 80) {
				lastStep = ms;
				const amp = 0.03 + 0.2 * p * (1 - p) + (Math.random() < 0.05 ? 0.08 : 0);
				shown = Math.min(1, Math.max(0, p + (Math.random() * 2 - 1) * amp));
				if (shown >= 0.9) fired = true;
			}
			encOn = speaking(now - TO_ENCODER) || speaking(now - TO_ENCODER - 8);
			decOn = speaking(u) || (v >= 0 && v < 160);
			headOn = u >= 0 && u < 200;
		};

		const reset = () => {
			sctx.fillStyle = '#1f1c1d';
			sctx.fillRect(0, 0, GAP.w, GAP.h);
			columnTick = NaN;
			seed = 7;
		};

		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			// static frame: speech in the spectrogram, the full sentence out, the head fired
			still = true;
			reset();
			const now = 200;
			for (let x = 0; x < GAP.w; x++) shiftSpec(now - (GAP.w - x) / PX);
			drawWave(now);
			return;
		}

		let raf = 0;
		let now = START;
		let shifted = 0; // whole px the spectrogram has scrolled
		let t0 = 0;
		let last = 0;
		const tick = (/** @type {number} */ ms) => {
			t0 ||= ms;
			const dt = last ? (ms - last) / 1000 : 0;
			last = ms;
			now = Math.min(END, START + ((ms - t0) / 1000) * TICKS_PER_SECOND);
			const target = Math.floor((now - START) * PX);
			// after a long stall (background tab) skip ahead instead of replaying every pixel
			if (target - shifted > GAP.w) shifted = target - GAP.w;
			for (; shifted < target; shifted++) shiftSpec(START + (shifted + 1) / PX);
			drawWave(now);
			decode(now, dt, ms);
			if (now >= END) {
				done = true;
				return;
			}
			raf = requestAnimationFrame(tick);
		};
		replay = () => {
			cancelAnimationFrame(raf);
			reset();
			now = START;
			shifted = 0;
			t0 = 0;
			last = 0;
			text = '';
			p = 0.02;
			shown = 0.02;
			fired = false;
			lastStep = 0;
			done = false;
			raf = requestAnimationFrame(tick);
		};
		replay();
		return () => cancelAnimationFrame(raf);
	});
</script>

<figure class="pipe">
	<div class="band">
		<div class="stage" style:width="{W}px" style:height="{H}px">
			<svg
				viewBox="0 0 {W} {H}"
				width={W}
				height={H}
				role="img"
				aria-label="Audio flows into a narrowing encoder, through a spectrogram, into a decoder that writes Hello, world! A turn head reads a middle decoder layer and says the phrase is over."
			>
				<defs>
					<marker
						id="pipe-arrow"
						viewBox="0 0 8 8"
						refX="7"
						refY="4"
						markerWidth="8"
						markerHeight="8"
						orient="auto"
					>
						<path class="tip" d="M0 0 L8 4 L0 8 z" />
					</marker>
					<marker
						id="pipe-arrow-hot"
						viewBox="0 0 8 8"
						refX="7"
						refY="4"
						markerWidth="8"
						markerHeight="8"
						orient="auto"
					>
						<path class="tip hot" d="M0 0 L8 4 L0 8 z" />
					</marker>
				</defs>

				<!-- encoder: wide where the audio comes in, narrow where it leaves -->
				<path class="enc" d={encPath} />
				<g class="net enc-net" class:on={encOn}>
					{#each encNet.edges as e, i (i)}
						<line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} style:animation-delay="{e.delay}s" />
					{/each}
					{#each encNet.nodes as n, i (i)}
						<circle cx={n.x} cy={n.y} r="3" style:animation-delay="{n.delay}s" />
					{/each}
				</g>
				<text class="name" x={ENC_LABEL.x} y={ENC_LABEL.y}>Encoder</text>
				<text class="size" x={ENC_LABEL.x} y={ENC_LABEL.y + 16}>970M</text>

				<!-- decoder -->
				<rect
					class="dec"
					x={DEC.x0}
					y={Y - DEC.half}
					width={DEC.x1 - DEC.x0}
					height={DEC.half * 2}
					rx={RADIUS}
				/>
				<g class="net dec-net" class:on={decOn}>
					{#each decNet.edges as e, i (i)}
						<line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} style:animation-delay="{e.delay}s" />
					{/each}
					{#each decNet.nodes as n, i (i)}
						<circle
							class:tap={n.col === TAP_COL}
							cx={n.x}
							cy={n.y}
							r="3"
							style:animation-delay="{n.delay}s"
						/>
					{/each}
				</g>
				<text class="name" x={DEC_LABEL.x} y={DEC_LABEL.y} text-anchor="end">Decoder</text>
				<text class="size" x={DEC_LABEL.x} y={DEC_LABEL.y + 16} text-anchor="end">3.4B</text>

				<line
					class="flow"
					x1={DEC.x1 + PAD}
					y1={Y}
					x2={DEC.x1 + PAD + 24}
					y2={Y}
					marker-end="url(#pipe-arrow)"
				/>

				<!-- turn head off a middle decoder layer -->
				<line
					class="tapline"
					x1={tapX}
					y1={Y + DEC.half}
					x2={tapX}
					y2={HEAD.y - 2}
					marker-end="url(#pipe-arrow-hot)"
				/>
				<rect class="head" x={HEAD.x} y={HEAD.y} width={HEAD.w} height={HEAD.h} rx={RADIUS} />
				<g class="net head-net" class:on={headOn}>
					{#each headNet.edges as e, i (i)}
						<line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} style:animation-delay="{e.delay}s" />
					{/each}
					{#each headNet.nodes as n, i (i)}
						<circle cx={n.x} cy={n.y} r="3" style:animation-delay="{n.delay}s" />
					{/each}
				</g>
				<circle class="out-node" class:hot={fired} cx={headNet.out.x} cy={headNet.out.y} r="5" />
				<text class="name" x={HEAD.x + 104} y={HEAD.y + 32}>Turn head</text>
				<text class="spec" class:hot={fired} x={HEAD.x + 104} y={HEAD.y + 54}
					>P(complete) {shown.toFixed(2)}</text
				>
				<rect class="track" x={HEAD.x + 104} y={HEAD.y + 64} width="130" height="4" rx="2" />
				<rect
					class="fill"
					class:hot={fired}
					x={HEAD.x + 104}
					y={HEAD.y + 64}
					width={130 * shown}
					height="4"
					rx="2"
				/>
				<g class="cue" class:on={fired}>
					<rect
						class="pill"
						x={HEAD.x + HEAD.w + 12}
						y={HEAD.y + HEAD.h / 2 - 12}
						width="104"
						height="24"
						rx="12"
					/>
					<text
						class="pill-t"
						x={HEAD.x + HEAD.w + 64}
						y={HEAD.y + HEAD.h / 2 + 4}
						text-anchor="middle">Phrase over!</text
					>
				</g>
			</svg>

			<canvas
				class="wave"
				bind:this={wave}
				style:left="{WAVE.x}px"
				style:top="{WAVE.y}px"
				style:width="{WAVE.w}px"
				style:height="{WAVE.h}px"
				aria-hidden="true"
			></canvas>
			<canvas
				class="spectro"
				bind:this={spec}
				style:left="{GAP.x}px"
				style:top="{GAP.y}px"
				style:width="{GAP.w}px"
				style:height="{GAP.h}px"
				aria-hidden="true"
			></canvas>

			<p class="out" style:left="{DEC.x1 + PAD + 32}px" style:top="{Y - 16}px">
				{text}<i class="caret" class:done></i>
			</p>

			{#if done && !still}
				<button
					class="replay"
					style:left="{DEC.x1 + PAD + 32}px"
					style:top="{Y + 30}px"
					onclick={() => replay()}
				>
					<Refresh /> Replay
				</button>
			{/if}
		</div>
	</div>
	<figcaption>
		Voxtral Mini 4B Realtime with the turn head on decoder layer 11. The audio is simulated.
	</figcaption>
</figure>

<style>
	.pipe {
		margin: 0;
	}
	/* full-bleed like 11 and 12; scrolls sideways on screens narrower than the drawing */
	.band {
		width: 100vw;
		margin-inline: calc(50% - 50vw);
		/* the post column slides left on tablets (--shift in Post.svelte); slide back so this still
		   spans the window */
		translate: calc(-1 * var(--shift, 0px)) 0;
		overflow-x: auto;
		scrollbar-width: none;
		mask-image: linear-gradient(90deg, transparent, #000 48px, #000 calc(100% - 48px), transparent);
	}
	.stage {
		position: relative;
		margin-inline: auto;
	}
	svg,
	canvas {
		position: absolute;
		display: block;
	}
	svg {
		inset: 0;
		max-width: none;
	}
	.spectro {
		border-radius: var(--radius);
	}
	/* the waveform fades in from nowhere on the left */
	.wave {
		mask-image: linear-gradient(90deg, transparent, #000 30%);
	}
	figcaption {
		margin-top: var(--s3);
		font: 400 var(--fs-caption) / 1.5 var(--font-mono);
		color: var(--muted);
	}

	.out {
		position: absolute;
		display: flex;
		align-items: center;
		height: 32px;
		margin: 0;
		font: 500 22px / 1 var(--font-mono);
		white-space: pre;
		color: var(--text);
	}
	/* blinks while the decoder is writing, holds still once it's finished */
	.caret.done {
		animation: none;
	}
	.caret {
		width: 2px;
		height: 24px;
		margin-left: 3px;
		background: var(--accent);
		animation: blink 1s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
	.replay {
		position: absolute;
		display: inline-flex;
		align-items: center;
		gap: var(--s2);
		height: 32px;
		padding-inline: 12px 14px;
		border: 0;
		border-radius: 999px;
		background: none;
		box-shadow: inset 0 0 0 1px rgb(252 245 247 / 0.16);
		font: var(--w-ui-strong) var(--fs-small) / 1 var(--font-ui);
		color: var(--body);
		cursor: pointer;
		animation: appear 300ms ease-out;
		transition:
			background var(--dur),
			color var(--dur);
	}
	.replay:hover {
		background: var(--surface-2);
		color: var(--text);
	}
	@keyframes appear {
		from {
			opacity: 0;
		}
	}

	text {
		font-family: var(--font-mono);
	}
	.name {
		font: 500 15px var(--font-ui);
		fill: var(--text);
	}
	.size {
		font-size: 12px;
		fill: var(--body);
	}
	.spec {
		font-size: 11px;
		fill: var(--muted);
	}
	.hot {
		fill: var(--accent);
	}

	.enc {
		fill: var(--accent-wash);
	}
	.dec {
		fill: var(--surface-2);
	}

	/* firing networks: nodes swell and edges brighten in waves; idle networks dim and hold still */
	.net {
		opacity: 0.4;
		transition: opacity 500ms;
	}
	.net.on {
		opacity: 1;
	}
	.net line {
		stroke-width: 1;
		animation: edge 1.4s ease-in-out infinite paused;
	}
	.net circle {
		transform-box: fill-box;
		transform-origin: center;
		animation: node 1.4s ease-in-out infinite paused;
	}
	.net.on line,
	.net.on circle {
		animation-play-state: running;
	}
	@keyframes edge {
		0%,
		100% {
			stroke-opacity: 0.12;
		}
		45% {
			stroke-opacity: 0.75;
		}
	}
	@keyframes node {
		0%,
		100% {
			opacity: 0.45;
			scale: 0.8;
		}
		45% {
			opacity: 1;
			scale: 1.3;
		}
	}
	.enc-net line {
		stroke: rgb(245 158 185);
	}
	.enc-net circle {
		fill: rgb(245 158 185);
	}
	.dec-net line,
	.head-net line {
		stroke: rgb(252 245 247);
	}
	.dec-net circle,
	.head-net circle {
		fill: var(--body);
	}
	.dec-net circle.tap {
		fill: var(--accent);
		filter: drop-shadow(0 0 4px rgb(245 158 185 / 0.9));
	}
	.out-node {
		fill: var(--surface-4);
		stroke: var(--chart-grey);
		transition: fill 200ms;
	}
	.out-node.hot {
		fill: var(--accent);
		stroke: var(--accent);
		filter: drop-shadow(0 0 6px rgb(245 158 185 / 0.9));
	}

	.flow {
		stroke: var(--chart-grey);
		stroke-width: 1.5;
	}
	.tapline {
		stroke: var(--accent);
		stroke-width: 2;
	}
	.tip {
		fill: var(--chart-grey);
	}
	.tip.hot {
		fill: var(--accent);
	}

	.head {
		fill: var(--surface-1);
		stroke: rgb(245 158 185 / 0.45);
	}
	.track {
		fill: var(--surface-4);
	}
	.fill {
		fill: var(--chart-grey);
	}
	.fill.hot {
		fill: var(--accent);
	}
	.cue {
		opacity: 0;
		transition: opacity 200ms;
	}
	.cue.on {
		opacity: 1;
	}
	.pill {
		fill: var(--accent);
	}
	.pill-t {
		font-size: 11px;
		font-weight: 500;
		fill: var(--on-accent);
	}

	@media (prefers-reduced-motion: reduce) {
		.caret,
		.net line,
		.net circle {
			animation: none;
		}
	}
</style>
