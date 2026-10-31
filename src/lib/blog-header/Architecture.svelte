<!-- 12 · Voxtral Realtime, left to right: audio in → encoder → adapter → decoder → text out, turn head on layer 11 -->
<script>
	// sizes are real (Voxtral-Mini-4B-Realtime-2602 params.json, turn_head.vxth.json);
	// the utterance and the head's output are illustrative
	const W = 1240;
	const H = 350;
	const Y = 120; // the main line everything flows along

	// "can we meet on … Friday?" as [bars, word]; null = silence
	/** @type {[number, string | null][]} */
	const segments = [
		[3, null],
		[9, 'can'],
		[7, 'we'],
		[9, 'meet'],
		[7, 'on'],
		[8, null],
		[13, 'Friday?'],
		[3, null]
	];
	const BAR = 4;
	const X0 = 8; // waveform's left edge
	/** @type {number[]} */
	const bars = [];
	/** @type {{ word: string, x: number }[]} */
	const words = [];
	for (const [len, word] of segments) {
		const start = bars.length;
		for (let k = 0; k < len; k++) {
			const i = bars.length;
			const hump = Math.sin((Math.PI * (k + 0.5)) / len);
			bars.push(
				word ? hump * (0.35 + 0.65 * Math.abs(Math.sin(i * 1.9) * Math.cos(i * 0.37))) : 0.03
			);
		}
		if (word) words.push({ word, x: X0 + (start + len / 2) * BAR });
	}

	const lines = (/** @type {number} */ n, /** @type {number} */ x0, /** @type {number} */ x1) =>
		Array.from({ length: n }, (_, i) => x0 + (i * (x1 - x0)) / (n - 1));
	const enc = lines(32, 300, 474);
	const dec = lines(26, 660, 924);
	const TAP = dec[10]; // layer 11

	const tokens = ['can', 'we', 'meet', 'on', 'Fri', 'day', '?'];
	/** @type {{ tok: string, x: number, w: number }[]} */
	const chips = [];
	let cx = 976;
	for (const tok of tokens) {
		const w = tok.length * 7.2 + 10;
		chips.push({ tok, x: cx, w });
		cx += w + 4;
	}
	const P_COMPLETE = 0.97;
</script>

<figure class="arch">
	<div class="band">
		<svg
			viewBox="0 0 {W} {H}"
			width={W}
			height={H}
			role="img"
			aria-label="Audio enters a causal audio encoder, an adapter and a text decoder, and comes out as text. A turn head reads decoder layer 11."
		>
			<defs>
				<marker
					id="arch-arrow"
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
					id="arch-arrow-hot"
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

			<!-- audio in -->
			<text class="k" x="60" y="62">audio in · 16 kHz</text>
			{#each bars as a, i (i)}
				{@const h = Math.max(1.5, a * 40)}
				<rect class="wave" x={X0 + i * BAR} y={Y - h} width="2" height={h * 2} rx="1" />
			{/each}
			{#each words as w (w.word)}
				<text class="word" x={w.x} y="196" text-anchor="middle">{w.word}</text>
			{/each}

			<line class="flow" x1="258" y1={Y} x2="282" y2={Y} marker-end="url(#arch-arrow)" />

			<!-- causal audio encoder -->
			<rect class="enc" x="284" y="60" width="206" height="120" rx="12" />
			<text class="name" x="300" y="84">Audio encoder</text>
			<text class="spec" x="300" y="102">32 layers · d 1280 · ≈970M</text>
			{#each enc as x (x)}
				<line class="enc-layer" x1={x} y1="116" x2={x} y2="166" />
			{/each}
			<text class="spec" x="284" y="200">causal · trained from scratch</text>

			<line class="flow" x1="490" y1={Y} x2="512" y2={Y} marker-end="url(#arch-arrow)" />

			<!-- adapter -->
			<rect class="adapter" x="514" y="84" width="42" height="72" rx="8" />
			<text class="spec" x="535" y="200" text-anchor="middle">Adapter</text>
			<text class="spec" x="535" y="216" text-anchor="middle">4× down</text>

			<line class="flow" x1="556" y1={Y} x2="585" y2={Y} marker-end="url(#arch-arrow)" />

			<!-- audio frame + previous token -->
			<circle class="sum" cx="600" cy={Y} r="13" />
			<path class="plus" d="M594 {Y} h12 M600 {Y - 6} v12" />
			<path class="loop" d="M956 {Y} V36 H600 V{Y - 15}" marker-end="url(#arch-arrow)" />
			<text class="spec" x="778" y="28" text-anchor="middle">previous token, fed back</text>

			<line class="flow" x1="613" y1={Y} x2="640" y2={Y} marker-end="url(#arch-arrow)" />

			<!-- text decoder -->
			<rect class="dec" x="642" y="60" width="300" height="120" rx="12" />
			<text class="name" x="660" y="84">Text decoder</text>
			<text class="spec" x="660" y="102">26 layers · d 3072 · ≈3.4B</text>
			{#each dec as x, i (x)}
				<line class="dec-layer" class:tap={i === 10} x1={x} y1="116" x2={x} y2="166" />
			{/each}
			<text class="spec" x="780" y="200">from Ministral 3B</text>
			<text class="spec" x="780" y="216">conditioned on the 480 ms delay</text>

			<!-- text out -->
			<line class="flow" x1="942" y1={Y} x2="970" y2={Y} marker-end="url(#arch-arrow)" />
			<text class="k" x="976" y="84">text out · a token every 80 ms</text>
			{#each chips as c (c.tok)}
				<rect class="chip" x={c.x} y={Y - 12} width={c.w} height="24" rx="6" />
				<text class="tok" x={c.x + c.w / 2} y={Y + 4} text-anchor="middle">{c.tok}</text>
			{/each}

			<!-- turn head on layer 11 -->
			<line class="tapline" x1={TAP} y1="166" x2={TAP} y2="238" marker-end="url(#arch-arrow-hot)" />
			<text class="spec hot" x={TAP - 8} y="228" text-anchor="end">layer 11</text>
			<rect class="head" x="700" y="240" width="242" height="96" rx="12" />
			<text class="name" x="716" y="264">Turn head</text>
			<text class="spec" x="926" y="264" text-anchor="end">2.4M params</text>
			<text class="spec" x="716" y="284">MLP 3072 → 768 → 5 classes</text>
			<rect class="track" x="716" y="298" width="210" height="4" rx="2" />
			<rect class="fill" x="716" y="298" width={210 * P_COMPLETE} height="4" rx="2" />
			<text class="spec hot" x="716" y="322">P(complete)</text>
			<text class="spec hot" x="926" y="322" text-anchor="end">{P_COMPLETE.toFixed(2)}</text>

			<line
				class="flow hot"
				x1="942"
				y1="288"
				x2="970"
				y2="288"
				marker-end="url(#arch-arrow-hot)"
			/>
			<rect class="pill" x="976" y="276" width="84" height="24" rx="12" />
			<text class="pill-t" x="1018" y="292" text-anchor="middle">&lt;complete&gt;</text>
			<text class="spec" x="1068" y="292">to the LLM</text>
		</svg>
	</div>
	<figcaption>
		Voxtral Mini 4B Realtime with the turn head on decoder layer 11. Sizes from the model's config;
		the utterance and the head's output are illustrative.
	</figcaption>
</figure>

<style>
	.arch {
		margin: 0;
	}
	/* full-bleed like option 11; scrolls sideways when the screen is narrower than the drawing */
	.band {
		width: 100vw;
		margin-inline: calc(50% - 50vw);
		overflow-x: auto;
		scrollbar-width: none;
		mask-image: linear-gradient(90deg, transparent, #000 48px, #000 calc(100% - 48px), transparent);
	}
	svg {
		display: block;
		width: 1240px;
		max-width: none;
		height: 350px;
		margin-inline: auto;
	}
	figcaption {
		margin-top: var(--s3);
		font: 400 var(--fs-caption) / 1.5 var(--font-mono);
		color: var(--muted);
	}

	text {
		font-family: var(--font-mono);
	}
	.k {
		font-size: 12px;
		fill: var(--muted);
	}
	.name {
		font: 500 15px var(--font-ui);
		fill: var(--text);
	}
	.spec {
		font-size: 11px;
		fill: var(--muted);
	}
	.hot {
		fill: var(--accent);
	}
	.word {
		font: italic 400 13px var(--font-ui);
		fill: var(--body);
	}
	.wave {
		fill: var(--chart-grey);
	}

	.flow,
	.loop {
		fill: none;
		stroke: var(--chart-grey);
		stroke-width: 1.5;
	}
	.loop {
		stroke-dasharray: 4 4;
	}
	.flow.hot,
	.tapline {
		stroke: var(--accent);
	}
	.tapline {
		stroke-width: 2;
	}
	.tip {
		fill: var(--chart-grey);
	}
	.tip.hot {
		fill: var(--accent);
	}

	.enc {
		fill: var(--accent-wash);
	}
	.enc-layer {
		stroke: rgb(245 158 185 / 0.3);
	}
	.adapter {
		fill: var(--surface-1);
		stroke: rgb(252 245 247 / 0.1);
	}
	.sum {
		fill: var(--surface-1);
		stroke: var(--chart-grey);
		stroke-width: 1.5;
	}
	.plus {
		stroke: var(--text);
		stroke-width: 1.5;
	}
	.dec {
		fill: var(--surface-2);
	}
	.dec-layer {
		stroke: rgb(252 245 247 / 0.14);
	}
	.dec-layer.tap {
		stroke: var(--accent);
		stroke-width: 2;
		filter: drop-shadow(0 0 4px rgb(245 158 185 / 0.8));
	}

	.chip {
		fill: var(--surface-1);
		stroke: rgb(252 245 247 / 0.1);
	}
	.tok {
		font-size: 12px;
		font-weight: 500;
		fill: var(--text);
	}

	.head {
		fill: var(--surface-1);
		stroke: rgb(245 158 185 / 0.45);
	}
	.track {
		fill: var(--surface-4);
	}
	.fill {
		fill: var(--accent);
	}
	.pill {
		fill: var(--accent);
	}
	.pill-t {
		font-size: 11px;
		font-weight: 500;
		fill: var(--on-accent);
	}
</style>
