<!-- TEMP: a skeuomorphic take on /voxtral — raised panels, glass, real keys, instruments, paper.
     All numbers on this page are illustrative. -->
<script>
	import '#lib/temp-kit.css';
	import { resolve } from '$app/paths';
	import ArrowUpRight from '~icons/iconoir/arrow-up-right';
	import Page from '~icons/iconoir/page';
	import HfLogo from '#lib/blog-header/HfLogo.svelte';
	import Pipeline from '#lib/blog-header/Pipeline.svelte';
	import Experiment from '#lib/logos/Experiment.svelte';

	// ---- trade-off scope: response latency (x) vs. false cut-ins (y) ----
	const PW = 600;
	const PH = 300;
	const box = { l: 52, r: 584, t: 20, b: 258 };
	const X_MAX = 1000; // ms
	const Y_MAX = 16; // %
	const sx = (/** @type {number} */ ms) => box.l + (ms / X_MAX) * (box.r - box.l);
	const sy = (/** @type {number} */ pct) => box.b - (pct / Y_MAX) * (box.b - box.t);

	// the turn head: a higher threshold waits longer but cuts in less
	const head = (/** @type {number} */ t) => {
		const u = (t - 0.5) / 0.45;
		return { ms: 90 + 520 * u * u, pct: 0.6 + 11 * (1 - u) ** 2 };
	};
	// a silence timer: the usual baseline
	const vad = (/** @type {number} */ s) => ({ ms: s + 40, pct: 22 * Math.exp(-s / 300) + 0.4 });

	/** @param {{ ms: number, pct: number }[]} pts */
	const path = (pts) =>
		pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p.ms).toFixed(1)} ${sy(p.pct).toFixed(1)}`).join('');
	const headPath = path(Array.from({ length: 46 }, (_, i) => head(0.5 + i * 0.01)));
	const vadPath = path(
		Array.from({ length: 50 }, (_, i) => vad(140 + i * 18)).filter((p) => p.pct <= Y_MAX)
	);
	const xTicks = [0, 200, 400, 600, 800, 1000];
	const yTicks = [0, 4, 8, 12, 16];

	let threshold = $state(0.72);
	let baseline = $state(true);
	const op = $derived(head(threshold));

	// ---- paper chart: WER with and without the head ----
	const wer = [
		{ set: 'LibriSpeech clean', base: 2.1, ours: 2.1 },
		{ set: 'LibriSpeech other', base: 4.9, ours: 4.9 },
		{ set: 'FLEURS en', base: 5.3, ours: 5.4 },
		{ set: 'Earnings-22', base: 11.2, ours: 11.2 }
	];
	const WER_MAX = 12;
</script>

<svelte:head>
	<title>Speakrail · Voxtral (tactile test)</title>
</svelte:head>

<div class="room">
	<nav class="glass" aria-label="Site">
		<a class="home" href={resolve('/')}><Experiment id={41} size={18} /></a>
		<span class="nav-keys">
			<a class="key sm" href="https://huggingface.co/speakrail" target="_blank" rel="noreferrer"
				><HfLogo size="1.35em" /> Hugging Face</a
			>
			<a
				class="key sm"
				href="https://github.com/speakrail/speakrail"
				target="_blank"
				rel="noreferrer"
			>
				<!-- GitHub's mark (Primer octicon mark-github) -->
				<svg class="gh" viewBox="0 0 16 16" aria-hidden="true"
					><path
						fill="currentColor"
						d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
					/></svg
				>
				GitHub</a
			>
		</span>
	</nav>

	<main>
		<header class="col">
			<p class="eyebrow">
				<time datetime="2026-11-01T08:37Z">Nov 1, 2026</time> by
				<a href="https://x.com/danil_rootint" target="_blank" rel="noreferrer">@danil_rootint</a>
			</p>
			<h1>Your ASR already knows when you're done talking</h1>
			<div class="keys">
				<a
					class="key pink"
					href="https://huggingface.co/speakrail/Voxtral-Mini-4B-Realtime-2602-TurnHead"
					target="_blank"
					rel="noreferrer"
					aria-label="Get it on Hugging Face">Get on <HfLogo size="1.5em" /> <ArrowUpRight /></a
				>
				<a class="key" href="https://arxiv.org/" target="_blank" rel="noreferrer"
					><Page /> Read on arXiv</a
				>
			</div>
		</header>

		<!-- the pipeline animation, mounted in a device with a glass screen -->
		<section class="device" aria-label="How it works">
			<span class="screw tl"></span><span class="screw tr"></span>
			<span class="screw bl"></span><span class="screw br"></span>
			<div class="plate">
				<span class="engraved">SPEAKRAIL · TURN HEAD · MODEL 11</span>
				<span class="status"><span class="led"></span>Live</span>
			</div>
			<div class="screen">
				<Pipeline />
			</div>
		</section>

		<aside class="col note" aria-label="TL;DR">
			<span class="tape"></span>
			<p class="note-label">TL;DR</p>
			<p>
				You can achieve great turn-taking without losing WER on Voxtral Realtime by just attaching a
				turn head to layer 11 of the model’s decoder. The weights are available on Hugging Face,
				benchmarks are there as well. To try the model in real life, try using Speakrail, it will
				most likely launch on your hardware.
			</p>
		</aside>

		<article class="col prose">
			<h2>Waiting is the whole problem</h2>
			<p>
				A voice agent has two ways to get turn-taking wrong. Answer too early and it talks over you
				mid-thought. Answer too late and every exchange carries a dead second of silence. A silence
				timer can only trade one for the other: the longer it waits, the fewer interruptions, the
				slower every reply.
			</p>
			<p>
				The turn head reads what the recogniser already understands about the sentence, so it can
				tell a pause for breath from a finished thought. Drag the fader to move its threshold.
			</p>
		</article>

		<!-- interactive scope: a fader, a toggle, three readouts -->
		<section class="instrument" aria-label="Latency against interruptions">
			<div class="screen scope">
				<svg viewBox="0 0 {PW} {PH}" role="img" aria-label="Response latency against false cut-ins">
					{#each xTicks as t (t)}
						<line class="grid" x1={sx(t)} x2={sx(t)} y1={box.t} y2={box.b} />
						<text class="tick" x={sx(t)} y={box.b + 20} text-anchor="middle">{t}</text>
					{/each}
					{#each yTicks as t (t)}
						<line class="grid" x1={box.l} x2={box.r} y1={sy(t)} y2={sy(t)} />
						<text class="tick" x={box.l - 10} y={sy(t) + 4} text-anchor="end">{t}%</text>
					{/each}
					<text class="axis" x={box.r} y={box.b - 8} text-anchor="end">latency, ms →</text>
					<text class="axis" x={box.l + 8} y={box.t + 14}>↑ false cut-ins</text>
					{#if baseline}
						<path class="trace vad" d={vadPath} />
						<text class="trace-label vad-label" x={sx(560)} y={sy(6.6)}>silence timer</text>
					{/if}
					<path class="trace glow" d={headPath} />
					<path class="trace head" d={headPath} />
					<text class="trace-label head-label" x={sx(626)} y={sy(0.6) + 4}>turn head</text>
					<line class="cross" x1={sx(op.ms)} x2={sx(op.ms)} y1={box.t} y2={box.b} />
					<line class="cross" x1={box.l} x2={box.r} y1={sy(op.pct)} y2={sy(op.pct)} />
					<circle class="op-halo" cx={sx(op.ms)} cy={sy(op.pct)} r="11" />
					<circle class="op" cx={sx(op.ms)} cy={sy(op.pct)} r="5" />
				</svg>
			</div>

			<div class="controls">
				<div class="readouts">
					<div class="readout">
						<span class="engraved">Latency</span>
						<output>{Math.round(op.ms)}<small>ms</small></output>
					</div>
					<div class="readout">
						<span class="engraved">Cut-ins</span>
						<output>{op.pct.toFixed(1)}<small>%</small></output>
					</div>
					<div class="readout">
						<span class="engraved">Threshold</span>
						<output>{threshold.toFixed(2)}</output>
					</div>
				</div>

				<label class="fader">
					<span class="engraved">Threshold</span>
					<input type="range" min="0.5" max="0.95" step="0.01" bind:value={threshold} />
					<span class="scale" aria-hidden="true"><span>eager</span><span>patient</span></span>
				</label>

				<label class="switch">
					<input type="checkbox" bind:checked={baseline} />
					<span class="engraved">Silence timer</span>
					<span class="led" class:off={!baseline}></span>
				</label>
			</div>
		</section>

		<article class="col prose">
			<h2>And it costs nothing in accuracy</h2>
			<p>
				The head only reads from the decoder; it never writes back. Transcripts come out exactly as
				they would without it, which is what the benchmarks show.
			</p>
		</article>

		<!-- a printed chart, taped down -->
		<figure class="col paper">
			<span class="tape"></span>
			<figcaption>
				<span class="paper-title">Word error rate, %</span>
				<span class="legend"
					><span class="sw base"></span>Voxtral Realtime <span class="sw ours"></span>+ turn head</span
				>
			</figcaption>
			<div class="rows">
				{#each wer as w (w.set)}
					<div class="row">
						<span class="set">{w.set}</span>
						<span class="pair">
							<span class="ink base" style:width="{(w.base / WER_MAX) * 100}%"
								><b>{w.base.toFixed(1)}</b></span
							>
							<span class="ink ours" style:width="{(w.ours / WER_MAX) * 100}%"
								><b>{w.ours.toFixed(1)}</b></span
							>
						</span>
					</div>
				{/each}
			</div>
			<p class="fine">Illustrative numbers for the design test.</p>
		</figure>
	</main>
</div>

<style>
	/* ---------- the room: warm dark, a lamp above, a little grain ---------- */
	.room {
		--paper: #f4ede4;
		--ink: #2a2426;
		--ink-pink: #c9416f;
		--metal-hi: #3a3436;
		--metal-lo: #1d1a1b;
		--screen: #0c0b0b;
		--glow: 245 158 185; /* accent as rgb */
		min-height: 100vh;
		background:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .045 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"),
			radial-gradient(70rem 36rem at 50% -8rem, rgb(var(--glow) / 0.1), transparent 70%),
			radial-gradient(50rem 30rem at 50% 30rem, rgb(255 236 220 / 0.035), transparent 70%),
			var(--surface-0);
	}
	main {
		display: flex;
		flex-direction: column;
		gap: var(--s8);
		padding-block: var(--s9);
	}
	.col {
		width: min(100% - 2 * var(--gutter), 43.5rem);
		margin-inline: auto;
	}
	p {
		margin: 0;
	}

	/* engraved labels: dark letters with a lit lower edge, like text cut into a panel */
	.engraved {
		font: 500 11px / 1 var(--font-mono);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #8f8789;
		text-shadow:
			0 -1px 0 rgb(0 0 0 / 0.7),
			0 1px 0 rgb(255 255 255 / 0.06);
	}

	/* ---------- glass nav ---------- */
	.glass {
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 64px;
		padding-inline: max(var(--gutter), (100% - 76rem) / 2);
		--fg: var(--text);
		--acc: var(--accent);
		--bg: #1d1a1b;
		background: linear-gradient(rgb(40 36 37 / 0.72), rgb(26 23 24 / 0.6));
		backdrop-filter: blur(18px) saturate(1.5);
		-webkit-backdrop-filter: blur(18px) saturate(1.5);
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.07),
			inset 0 -1px 0 rgb(255 255 255 / 0.05),
			0 10px 30px -12px rgb(0 0 0 / 0.6);
	}
	.home {
		display: flex;
	}
	.glass a,
	.eyebrow a {
		text-decoration: none;
	}
	.nav-keys {
		display: flex;
		gap: var(--s3);
	}
	/* small keys for the nav: same cap and lip, scaled down, labels in mono */
	.key.sm {
		gap: 8px;
		height: 36px;
		padding-inline: 12px 14px;
		border-radius: 10px;
		font: 500 13px / 1 var(--font-mono);
		letter-spacing: 0.01em;
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.14),
			inset 0 -2px 3px rgb(0 0 0 / 0.25),
			0 3px 0 var(--lip),
			0 4px 3px rgb(0 0 0 / 0.35),
			0 10px 16px -6px rgb(0 0 0 / 0.55);
	}
	.key.sm:active {
		transform: translateY(2px);
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.1),
			inset 0 -1px 2px rgb(0 0 0 / 0.25),
			0 1px 0 var(--lip),
			0 2px 2px rgb(0 0 0 / 0.35),
			0 4px 8px -4px rgb(0 0 0 / 0.5);
	}
	.gh {
		width: 16px;
		height: 16px;
	}

	/* ---------- header ---------- */
	.eyebrow {
		font: 400 var(--fs-small) / 1.4 var(--font-mono);
		color: var(--muted);
	}
	.eyebrow a {
		color: inherit;
	}
	h1 {
		margin: var(--s4) 0 calc(var(--s5) + var(--s4));
		font-size: clamp(2rem, 1.2rem + 3.5vw, 2.75rem);
		font-weight: 500;
		line-height: 1.3;
		color: var(--text);
		text-shadow: 0 2px 6px rgb(0 0 0 / 0.45);
	}

	/* ---------- real keys: a convex cap on a lip, pressing sinks it ---------- */
	.keys {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--s4);
	}
	.key {
		--cap-hi: #3b3537;
		--cap-lo: #272324;
		--lip: #141213;
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.45em;
		height: 52px;
		padding-inline: 22px;
		border-radius: 14px;
		font: 500 var(--fs-ui) var(--font-ui);
		color: var(--text);
		text-decoration: none;
		background: linear-gradient(var(--cap-hi), var(--cap-lo));
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.14),
			inset 0 -2px 3px rgb(0 0 0 / 0.25),
			0 4px 0 var(--lip),
			0 6px 4px rgb(0 0 0 / 0.35),
			0 14px 24px -6px rgb(0 0 0 / 0.55);
		transform: translateY(0);
		transition:
			transform 80ms,
			box-shadow 80ms,
			filter var(--dur);
	}
	.key:hover {
		color: var(--text); /* the global a:hover would turn it pink */
		filter: brightness(1.06);
	}
	.key:active {
		transform: translateY(3px);
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.1),
			inset 0 -1px 2px rgb(0 0 0 / 0.25),
			0 1px 0 var(--lip),
			0 2px 2px rgb(0 0 0 / 0.35),
			0 4px 10px -4px rgb(0 0 0 / 0.5);
	}
	.key.pink {
		--cap-hi: #ffbfd3;
		--cap-lo: #ef93b1;
		--lip: #b65a7a;
		height: 60px;
		padding-inline: 26px;
		font-size: 1.125rem;
		color: var(--on-accent);
		text-shadow: 0 1px 0 rgb(255 255 255 / 0.35);
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.7),
			inset 0 -3px 6px rgb(160 50 90 / 0.25),
			0 4px 0 var(--lip),
			0 6px 4px rgb(0 0 0 / 0.35),
			0 16px 32px -8px rgb(var(--glow) / 0.35);
	}
	.key.pink:active {
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.5),
			inset 0 -1px 4px rgb(160 50 90 / 0.25),
			0 1px 0 var(--lip),
			0 2px 2px rgb(0 0 0 / 0.35),
			0 6px 16px -6px rgb(var(--glow) / 0.3);
	}

	/* ---------- the device: a raised metal enclosure with a recessed glass screen ---------- */
	.device,
	.instrument {
		position: relative;
		margin-inline: auto;
		border-radius: 28px;
		background:
			linear-gradient(rgb(255 255 255 / 0.04), transparent 40%),
			linear-gradient(var(--metal-hi), var(--metal-lo));
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.12),
			inset 0 -1px 0 rgb(0 0 0 / 0.5),
			0 2px 3px rgb(0 0 0 / 0.4),
			0 24px 48px -12px rgb(0 0 0 / 0.7),
			0 60px 80px -40px rgb(0 0 0 / 0.6);
	}
	.device {
		width: min(100% - 2 * var(--gutter), 1320px);
		padding: 18px 24px 24px;
	}
	.plate {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 14px 14px;
	}
	.status {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font: 500 11px / 1 var(--font-mono);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
	}
	.led {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 30%, #fff 0 12%, #ffb6cc 30%, #e0608c 75%);
		box-shadow:
			0 0 6px rgb(var(--glow) / 0.9),
			0 0 16px rgb(var(--glow) / 0.5);
		animation: breathe 2.4s ease-in-out infinite;
	}
	.led.off {
		background: radial-gradient(circle at 35% 30%, #6b6264 0 15%, #3c3537 60%);
		box-shadow: inset 0 1px 1px rgb(0 0 0 / 0.6);
		animation: none;
	}
	@keyframes breathe {
		50% {
			opacity: 0.65;
		}
	}
	.screw {
		position: absolute;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 30%, #6a6264, #2a2527 70%);
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.15),
			0 1px 0 rgb(255 255 255 / 0.06),
			0 -1px 1px rgb(0 0 0 / 0.6);
	}
	.screw::after {
		content: '';
		position: absolute;
		inset: 5px 2px;
		border-radius: 1px;
		background: rgb(0 0 0 / 0.55);
		transform: rotate(var(--turn, 35deg));
	}
	.tl {
		top: 10px;
		left: 10px;
	}
	.tr {
		top: 10px;
		right: 10px;
		--turn: -20deg;
	}
	.bl {
		bottom: 10px;
		left: 10px;
		--turn: 80deg;
	}
	.br {
		right: 10px;
		bottom: 10px;
		--turn: 10deg;
	}

	/* recessed screen with a glass sheen across it */
	.screen {
		position: relative;
		overflow: hidden;
		border-radius: 16px;
		background: radial-gradient(120% 90% at 50% 0%, #1a1617, var(--screen));
		box-shadow:
			inset 0 2px 6px rgb(0 0 0 / 0.85),
			inset 0 0 0 1px rgb(0 0 0 / 0.6),
			0 1px 0 rgb(255 255 255 / 0.08);
	}
	.screen::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		border-radius: inherit;
		background:
			linear-gradient(
				115deg,
				rgb(255 255 255 / 0.07) 0%,
				rgb(255 255 255 / 0.025) 32%,
				transparent 33%
			),
			repeating-linear-gradient(rgb(255 255 255 / 0.012) 0 1px, transparent 1px 3px);
		box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.05);
	}
	.device .screen {
		padding: 28px 16px 16px;
	}
	/* the pipeline is full-bleed on /voxtral; here it lives inside the screen */
	.device .screen :global(.band) {
		width: auto;
		margin-inline: 0;
	}
	.device .screen :global(figcaption) {
		padding-inline: 24px;
	}

	/* ---------- TL;DR on an index card ---------- */
	.note {
		position: relative;
		padding: var(--s6) var(--s6) var(--s6) calc(var(--s6) + 18px);
		border-radius: 3px;
		color: var(--ink);
		background:
			linear-gradient(90deg, transparent 22px, rgb(201 65 111 / 0.45) 22px 23.5px, transparent 0),
			repeating-linear-gradient(transparent 0 31px, rgb(42 36 38 / 0.09) 31px 32px), var(--paper);
		background-position:
			0 0,
			0 17px,
			0 0;
		box-shadow:
			0 1px 1px rgb(0 0 0 / 0.3),
			0 6px 10px -4px rgb(0 0 0 / 0.4),
			0 24px 40px -16px rgb(0 0 0 / 0.6);
		transform: rotate(-0.4deg);
	}
	.note-label {
		margin-bottom: var(--s2);
		font: 500 var(--fs-small) / 1 var(--font-mono);
		letter-spacing: 0.06em;
		color: var(--ink-pink);
	}
	.note p:not(.note-label) {
		font-size: var(--fs-body);
		font-weight: 420;
		line-height: 32px;
	}
	.tape {
		position: absolute;
		top: -12px;
		left: 50%;
		width: 110px;
		height: 26px;
		translate: -50% 0;
		rotate: 2deg;
		background: linear-gradient(rgb(255 250 240 / 0.38), rgb(240 230 215 / 0.3));
		box-shadow: 0 1px 2px rgb(0 0 0 / 0.15);
		backdrop-filter: blur(1px);
		mask-image: linear-gradient(90deg, transparent, #000 3px, #000 calc(100% - 3px), transparent);
	}

	/* ---------- prose ---------- */
	.prose {
		display: flex;
		flex-direction: column;
		gap: var(--s4);
	}
	.prose h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 500;
		color: var(--text);
	}
	.prose p {
		line-height: 1.8;
	}

	/* ---------- instrument: scope + controls ---------- */
	.instrument {
		display: grid;
		grid-template-columns: 1fr 15rem;
		gap: 20px;
		width: min(100% - 2 * var(--gutter), 60rem);
		padding: 20px;
	}
	@media (max-width: 52rem) {
		.instrument {
			grid-template-columns: 1fr;
		}
	}
	.scope {
		padding: 8px;
	}
	.scope svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.grid {
		stroke: rgb(var(--glow) / 0.08);
		stroke-width: 1;
	}
	.tick,
	.axis {
		font: 400 11px var(--font-mono);
		fill: rgb(var(--glow) / 0.4);
	}
	.axis {
		fill: rgb(var(--glow) / 0.55);
	}
	.trace {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.head {
		stroke: #ffc2d5;
		stroke-width: 2;
	}
	.glow {
		stroke: rgb(var(--glow) / 0.55);
		stroke-width: 7;
		filter: blur(4px);
	}
	.vad {
		stroke: rgb(220 210 212 / 0.45);
		stroke-width: 1.5;
		stroke-dasharray: 5 5;
	}
	.trace-label {
		font: 400 12px var(--font-mono);
	}
	.head-label {
		fill: #ffc2d5;
	}
	.vad-label {
		fill: rgb(220 210 212 / 0.55);
	}
	.cross {
		stroke: rgb(var(--glow) / 0.25);
		stroke-dasharray: 2 4;
	}
	.op {
		fill: #fff;
		filter: drop-shadow(0 0 4px rgb(var(--glow)));
	}
	.op-halo {
		fill: rgb(var(--glow) / 0.18);
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 6px 4px;
	}
	.readouts {
		display: grid;
		gap: 10px;
	}
	.readout {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 14px;
		border-radius: 10px;
		background: linear-gradient(#0d0c0c, #151213);
		box-shadow:
			inset 0 2px 4px rgb(0 0 0 / 0.8),
			0 1px 0 rgb(255 255 255 / 0.07);
	}
	.readout output {
		font: 500 22px / 1 var(--font-mono);
		font-variant-numeric: tabular-nums;
		color: #ffc2d5;
		text-shadow:
			0 0 8px rgb(var(--glow) / 0.6),
			0 0 18px rgb(var(--glow) / 0.25);
	}
	.readout small {
		margin-left: 3px;
		font-size: 12px;
		opacity: 0.7;
	}

	/* a mixing-desk fader: a slot cut into the panel and a ridged cap */
	.fader {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.fader input {
		width: 100%;
		height: 36px;
		margin: 0;
		background: transparent;
		appearance: none;
		cursor: grab;
	}
	.fader input:active {
		cursor: grabbing;
	}
	.fader input::-webkit-slider-runnable-track {
		height: 8px;
		border-radius: 4px;
		background: #0b0a0a;
		box-shadow:
			inset 0 2px 3px rgb(0 0 0 / 0.9),
			0 1px 0 rgb(255 255 255 / 0.08);
	}
	.fader input::-moz-range-track {
		height: 8px;
		border-radius: 4px;
		background: #0b0a0a;
		box-shadow:
			inset 0 2px 3px rgb(0 0 0 / 0.9),
			0 1px 0 rgb(255 255 255 / 0.08);
	}
	.fader input::-webkit-slider-thumb {
		width: 22px;
		height: 36px;
		margin-top: -14px;
		border-radius: 5px;
		appearance: none;
		background:
			linear-gradient(90deg, transparent 10px, #f59eb9 10px 12px, transparent 12px),
			repeating-linear-gradient(transparent 0 3px, rgb(0 0 0 / 0.18) 3px 4px),
			linear-gradient(#5a5254, #2e292a);
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.25),
			0 2px 0 #121011,
			0 6px 10px rgb(0 0 0 / 0.6);
	}
	.fader input::-moz-range-thumb {
		width: 22px;
		height: 36px;
		border: 0;
		border-radius: 5px;
		background:
			linear-gradient(90deg, transparent 10px, #f59eb9 10px 12px, transparent 12px),
			repeating-linear-gradient(transparent 0 3px, rgb(0 0 0 / 0.18) 3px 4px),
			linear-gradient(#5a5254, #2e292a);
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.25),
			0 2px 0 #121011,
			0 6px 10px rgb(0 0 0 / 0.6);
	}
	.fader input:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
		border-radius: 6px;
	}
	.scale {
		display: flex;
		justify-content: space-between;
		font: 400 11px var(--font-mono);
		color: #6f6769;
	}

	/* a toggle: a lit pill track and a raised knob, with an LED */
	.switch {
		display: flex;
		align-items: center;
		gap: 12px;
		cursor: pointer;
	}
	.switch input {
		position: relative;
		flex: none;
		width: 46px;
		height: 26px;
		margin: 0;
		border-radius: 13px;
		appearance: none;
		background: #0b0a0a;
		box-shadow:
			inset 0 2px 4px rgb(0 0 0 / 0.9),
			0 1px 0 rgb(255 255 255 / 0.08);
		cursor: pointer;
		transition: background var(--dur);
	}
	.switch input:checked {
		background: linear-gradient(#b65a7a, #e88aaa);
	}
	.switch input::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: linear-gradient(#77706f, #3a3436);
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.3),
			0 2px 4px rgb(0 0 0 / 0.6);
		transition: translate 180ms cubic-bezier(0.3, 0.7, 0.3, 1.2);
	}
	.switch input:checked::after {
		translate: 20px 0;
	}
	.switch input:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}
	.switch .led {
		margin-left: auto;
	}

	/* ---------- printed chart taped to the page ---------- */
	.paper {
		position: relative;
		margin-block: 0;
		padding: var(--s6);
		border-radius: 2px;
		color: var(--ink);
		background:
			linear-gradient(rgb(70 120 160 / 0.08) 1px, transparent 1px) 0 0 / 16px 16px,
			linear-gradient(90deg, rgb(70 120 160 / 0.08) 1px, transparent 1px) 0 0 / 16px 16px,
			linear-gradient(rgb(70 120 160 / 0.14) 1px, transparent 1px) 0 0 / 80px 80px,
			linear-gradient(90deg, rgb(70 120 160 / 0.14) 1px, transparent 1px) 0 0 / 80px 80px,
			linear-gradient(170deg, #f8f2ea, #ece3d8);
		box-shadow:
			0 1px 1px rgb(0 0 0 / 0.3),
			0 8px 14px -6px rgb(0 0 0 / 0.45),
			0 30px 50px -20px rgb(0 0 0 / 0.6);
		transform: rotate(0.5deg);
	}
	.paper figcaption {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--s2) var(--s5);
		margin-bottom: var(--s5);
	}
	.paper-title {
		color: var(--ink);
		font-size: 1.125rem;
		font-weight: 560;
	}
	.legend {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font: 400 12px var(--font-mono);
		color: #5d5557;
	}
	.sw {
		width: 12px;
		height: 12px;
		margin-left: 10px;
		border-radius: 2px;
	}
	.rows {
		display: grid;
		gap: var(--s4);
	}
	.row {
		display: grid;
		grid-template-columns: 9.5rem 1fr;
		align-items: center;
		gap: var(--s4);
	}
	.set {
		font-size: var(--fs-small);
		color: #4a4244;
	}
	.pair {
		display: grid;
		gap: 4px;
	}
	/* printed bars: slightly uneven ink, value at the end */
	.ink {
		position: relative;
		display: block;
		height: 14px;
		border-radius: 1px;
	}
	.ink b {
		position: absolute;
		left: calc(100% + 8px);
		top: 50%;
		translate: 0 -50%;
		font: 500 12px var(--font-mono);
		color: var(--ink);
	}
	.sw.base,
	.ink.base::before {
		background: linear-gradient(rgb(42 36 38 / 0.82), rgb(42 36 38 / 0.9));
	}
	.sw.ours,
	.ink.ours::before {
		background: linear-gradient(rgb(201 65 111 / 0.86), rgb(201 65 111 / 0.94));
	}
	/* the ink sits on a pseudo-element so the grain mask doesn't clip the value label */
	.ink::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.6 1.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
	}
	.fine {
		margin-top: var(--s5);
		font: 400 11px var(--font-mono);
		color: #857c7e;
	}
</style>
