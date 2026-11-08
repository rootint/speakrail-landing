<!-- DuplexCascade (Yang et al., 2026, fig. 1), redrawn in the site's colours: streaming ASR words are
     flushed every Δt = 0.6 s into a text micro-turn; the LLM answers each micro-turn with the next
     system one, whose special tokens say whether to wait, backchannel or respond; streaming TTS
     speaks it. Drawn at the column's width (696px), so 1 unit = 1px on desktop; narrower screens
     scroll it sideways rather than shrink the text. Colours are theme tokens, so it follows the
     light/dark switch. -->
<script>
	const W = 696;
	const H = 468;

	// every box's corner: --radius-sm, the scale's step for small elements. A number, not the token,
	// because rx is an SVG attribute; the drawing is 1:1 in the full-width column, so 10 units are
	// 10px there (a narrowed tablet column scales it down a little, text and corners alike)
	const R = 10;

	// micro-turn boundaries: where the buffer flushes (x of the Δt ticks)
	const T0 = 20;
	const T1 = 296;
	const T2 = 572;

	// rows (y, height)
	const TTS = { y: 36, h: 32 };
	const OUT = { y: 96, h: 48 };
	const LLM = { y: 180, h: 36 };
	const HIST = { y: 236, h: 48 };
	const DT = 304; // the Δt brackets
	const BUF = { y: 316, h: 32 };
	const ASR = { y: 396, h: 32 };

	/** @typedef {{ t: string, k?: 'tok' | 'ctl' }} Seg  plain words; tok = <User>/<EOS>; ctl = a turn token */
	/** @typedef {{ x: number, w: number, lines: Seg[][], kind: 'user' | 'sys', small?: boolean }} Box */

	/** @type {Box[]} the LLM's output micro-turns, above it */
	const outs = [
		{
			x: T1 - 98,
			w: 196,
			kind: 'sys',
			lines: [
				[{ t: '<System>', k: 'tok' }],
				[{ t: '<System Backchannel>', k: 'ctl' }, { t: ' ' }, { t: '<EOS>', k: 'tok' }]
			]
		},
		{
			x: T2 - 114,
			w: 228,
			kind: 'sys',
			lines: [
				[{ t: '<System>', k: 'tok' }, { t: ' ' }, { t: '<User finish speaking>', k: 'ctl' }],
				[{ t: 'It is Tokyo ' }, { t: '<EOS>', k: 'tok' }]
			]
		}
	];

	/** @type {Box[]} the dialogue so far, as the LLM reads it: user micro-turns and its own replies */
	const history = [
		{
			x: T1 - 8 - 212,
			w: 212,
			kind: 'user',
			small: true,
			lines: [[{ t: '<User>', k: 'tok' }, { t: ' What is the capital ' }, { t: '<EOS>', k: 'tok' }]]
		},
		{
			x: T1 + 8,
			w: 108,
			kind: 'sys',
			small: true,
			lines: [
				[{ t: '<System>', k: 'tok' }, { t: ' ' }, { t: '<System', k: 'ctl' }],
				[{ t: 'Backchannel>', k: 'ctl' }],
				[{ t: '<EOS>', k: 'tok' }]
			]
		},
		{
			x: T2 - 8 - 146,
			w: 146,
			kind: 'user',
			small: true,
			lines: [[{ t: '<User>', k: 'tok' }, { t: ' of Japan ' }, { t: '<EOS>', k: 'tok' }]]
		},
		{
			x: T2 + 8,
			w: 114,
			kind: 'sys',
			small: true,
			lines: [
				[{ t: '<System>', k: 'tok' }, { t: ' ' }, { t: '<User', k: 'ctl' }],
				[{ t: 'finish speaking>', k: 'ctl' }],
				[{ t: 'It is Tokyo ' }, { t: '<EOS>', k: 'tok' }]
			]
		}
	];

	// what the TTS says at each flush, and the ASR's words as they arrive
	const spoken = [
		{ x: T1, t: 'uh-huh' },
		{ x: T2, t: 'It is Tokyo' }
	];
	const words = [
		{ x: 84, t: 'What' },
		{ x: 132, t: 'is' },
		{ x: 172, t: 'the' },
		{ x: 222, t: 'capital' },
		{ x: 364, t: 'of' },
		{ x: 420, t: 'Japan' }
	];

	const TOKENS = [
		'<System Backchannel>',
		'<User is speaking>',
		'<User finish speaking>',
		'<User is interrupting>'
	];

	// waveforms: a bar every 4px, loud where someone is talking. Deterministic, so server and client
	// draw the same thing.
	/**
	 * @param {number} cy centre line
	 * @param {[number, number][]} talk x ranges with speech
	 * @param {number} seed
	 */
	const waveform = (cy, talk, seed) => {
		const bars = [];
		for (let x = 112; x < W; x += 4) {
			const on = talk.some(([a, b]) => x >= a && x < b);
			const a = on
				? 2 + 10 * Math.abs(Math.sin(x * 0.09 + seed)) * (0.55 + 0.45 * Math.sin(x * 0.023 + seed))
				: 1;
			bars.push({ x, y: cy - a, h: 2 * a });
		}
		return bars;
	};
	const userWave = waveform(
		H - 16,
		[
			[112, 292],
			[340, 470]
		],
		1
	);
	const sysWave = waveform(
		16,
		[
			[T1 + 6, T1 + 44],
			[T2 + 6, T2 + 104]
		],
		4
	);

	// text baselines inside a box, centred as a block
	const LEAD = { normal: 14, small: 12 };
	/** @param {Box} b @param {number} y @param {number} h */
	const baselines = (b, y, h) => {
		const lead = b.small ? LEAD.small : LEAD.normal;
		const top = y + h / 2 - ((b.lines.length - 1) * lead) / 2 + 4;
		return b.lines.map((_, i) => top + i * lead);
	};
</script>

<figure class="dc">
	<div class="scroll">
		<svg
			viewBox="0 0 {W} {H}"
			role="img"
			aria-label="DuplexCascade: a streaming ASR transcribes the user's audio; a buffer sends the words heard in each 0.6 second window to the LLM as a micro-turn; the LLM answers each micro-turn with special tokens such as System Backchannel or User finish speaking plus any reply text, which a streaming TTS speaks."
		>
			<defs>
				<marker
					id="dc-arrow"
					viewBox="0 0 8 8"
					refX="7"
					refY="4"
					markerWidth="7"
					markerHeight="7"
					orient="auto-start-reverse"
				>
					<path class="head" d="M0 0 L8 4 L0 8 z" />
				</marker>
			</defs>

			<!-- system audio, out of the TTS -->
			<text class="lane" x="0" y="20">System audio</text>
			{#each sysWave as b (b.x)}<rect
					class="wave sys-wave"
					x={b.x}
					y={b.y}
					width="2"
					height={b.h}
				/>{/each}

			<!-- the LLM's replies feed back into its history; drawn first so the bars cover them -->
			<line
				class="feedback"
				x1={T1 + 62}
				y1={OUT.y + OUT.h}
				x2={T1 + 62}
				y2={HIST.y - 3}
				marker-end="url(#dc-arrow)"
			/>
			<line
				class="feedback"
				x1={T2 + 66}
				y1={OUT.y + OUT.h}
				x2={T2 + 66}
				y2={HIST.y - 3}
				marker-end="url(#dc-arrow)"
			/>

			<!-- streaming TTS -->
			<rect class="bar" x="0.5" y={TTS.y} width={W - 1} height={TTS.h} rx={R} />
			<text class="name" x={W / 2} y={TTS.y + TTS.h / 2 + 5}>Streaming TTS</text>
			{#each spoken as s (s.x)}
				<line
					class="flow"
					x1={s.x}
					y1={OUT.y}
					x2={s.x}
					y2={TTS.y + TTS.h + 2}
					marker-end="url(#dc-arrow)"
				/>
				<text class="said" x={s.x + 8} y={TTS.y + TTS.h + 20}>{s.t}</text>
			{/each}

			<!-- the turn tokens the LLM was fine-tuned with -->
			<text class="legend-title" x="0" y={OUT.y + 6}>Conversational special tokens</text>
			{#each TOKENS as t, i (t)}
				<text class="legend-tok" x="0" y={OUT.y + 24 + i * 14}>{t}</text>
			{/each}

			<!-- what the LLM writes at each flush -->
			{#each outs as b (b.x)}
				<line
					class="flow"
					x1={b.x + b.w / 2}
					y1={LLM.y}
					x2={b.x + b.w / 2}
					y2={OUT.y + OUT.h + 2}
					marker-end="url(#dc-arrow)"
				/>
				<rect class={b.kind} x={b.x} y={OUT.y} width={b.w} height={OUT.h} rx={R} />
				{#each baselines(b, OUT.y, OUT.h) as y, i (i)}
					<text class="mono" x={b.x + b.w / 2} {y}
						>{#each b.lines[i] as s, j (j)}<tspan class={s.k}>{s.t}</tspan>{/each}</text
					>
				{/each}
			{/each}

			<!-- the LLM -->
			<rect class="llm" x="0.5" y={LLM.y} width={W - 1} height={LLM.h} rx={R} />
			<text class="name" x={W / 2} y={LLM.y + LLM.h / 2 + 5}
				>LLM fine-tuned on conversational micro-turn sequences</text
			>

			<!-- the dialogue so far -->
			<rect class="past" x="-12" y={HIST.y} width="78" height={HIST.h} rx={R} />
			<text class="lane small" x="31" y={HIST.y + 20}>micro-turn</text>
			<text class="lane small" x="31" y={HIST.y + 34}>history</text>
			{#each history as b (b.x)}
				<rect class={b.kind} x={b.x} y={HIST.y} width={b.w} height={HIST.h} rx={R} />
				{#each baselines(b, HIST.y, HIST.h) as y, i (i)}
					<text class="mono" class:small={b.small} x={b.x + b.w / 2} {y}
						>{#each b.lines[i] as s, j (j)}<tspan class={s.k}>{s.t}</tspan>{/each}</text
					>
				{/each}
			{/each}

			<!-- each flush: the buffer's words go up to the LLM as one micro-turn -->
			{#each [T1, T2] as x (x)}
				<line class="flush" x1={x - 2} y1={BUF.y} x2={x - 2} y2={LLM.y + LLM.h + 6} />
				<line class="flush" x1={x + 2} y1={BUF.y} x2={x + 2} y2={LLM.y + LLM.h + 6} />
				<path
					class="flush-head"
					d="M{x - 6} {LLM.y + LLM.h + 8} L{x} {LLM.y + LLM.h + 1} L{x + 6} {LLM.y + LLM.h + 8} z"
				/>
			{/each}

			<!-- Δt = 0.6 s windows -->
			{#each [T0, T1, T2] as x (x)}<line
					class="tick"
					x1={x}
					y1={DT - 7}
					x2={x}
					y2={DT + 7}
				/>{/each}
			{#each [[T0, T1], [T1, T2]] as [a, b] (a)}
				<line
					class="span"
					x1={a + 3}
					y1={DT}
					x2={b - 3}
					y2={DT}
					marker-start="url(#dc-arrow)"
					marker-end="url(#dc-arrow)"
				/>
				<rect class="label-bg" x={(a + b) / 2 - 40} y={DT - 9} width="80" height="18" />
				<text class="dt" x={(a + b) / 2} y={DT + 4}>Δt = 0.6 s</text>
			{/each}
			<text class="dt" x={T2 + 40} y={DT + 4}>…</text>

			<!-- the buffer -->
			<rect class="bar" x="0.5" y={BUF.y} width={W - 1} height={BUF.h} rx={R} />
			<text class="name" x={W / 2} y={BUF.y + BUF.h / 2 + 5}
				>Buffer: the words heard in the last Δt, sent as one micro-turn</text
			>

			<!-- streaming ASR and its words -->
			{#each words as w (w.x)}
				<line
					class="flow"
					x1={w.x}
					y1={ASR.y}
					x2={w.x}
					y2={BUF.y + BUF.h + 2}
					marker-end="url(#dc-arrow)"
				/>
				<text class="word" x={w.x + 6} y={BUF.y + BUF.h + 30}>{w.t}</text>
			{/each}
			<rect class="bar" x="0.5" y={ASR.y} width={W - 1} height={ASR.h} rx={R} />
			<text class="name" x={W / 2} y={ASR.y + ASR.h / 2 + 5}>Streaming ASR</text>

			<!-- user audio, into the ASR -->
			<text class="lane" x="0" y={H - 12}>User audio</text>
			{#each userWave as b (b.x)}<rect class="wave" x={b.x} y={b.y} width="2" height={b.h} />{/each}
		</svg>
	</div>
	<figcaption>
		DuplexCascade: every 0.6 s, the words heard so far reach the LLM as one micro-turn, and it
		answers with special tokens (backchannel, keep listening, answer) plus any text for the TTS to
		speak. Adapted from Yang et al., 2026.
	</figcaption>
</figure>

<style>
	/* phones: keep the text readable and scroll the drawing sideways instead */
	.scroll {
		overflow-x: auto;
		scrollbar-width: thin;
	}
	/* the drawing is wider than the column here: fade the right edge so it reads as "there's more" */
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
		white-space: pre;
	}
	.name {
		font: 500 14px var(--font-ui);
		fill: var(--text);
		text-anchor: middle;
	}
	.lane,
	.legend-title {
		font: 400 13px var(--font-ui);
		fill: var(--muted);
	}
	.lane.small {
		font-size: 11px;
		text-anchor: middle;
	}
	.legend-title {
		font-size: 12px;
	}
	.mono {
		font: 400 11px var(--font-mono);
		fill: var(--text);
		text-anchor: middle;
	}
	.mono.small {
		font-size: 10px;
	}
	.legend-tok {
		font: 400 10.5px var(--font-mono);
		fill: var(--accent);
	}
	/* the turn tokens are the point of the figure: pink. Structural ones (<User>, <EOS>) recede */
	.ctl {
		fill: var(--accent);
	}
	.tok {
		fill: var(--dim);
	}
	.said,
	.word {
		font: 400 13px var(--font-mono);
		fill: var(--body);
	}
	.dt {
		font: 400 12px var(--font-mono);
		fill: var(--muted);
		text-anchor: middle;
	}

	.bar {
		fill: var(--surface-1);
		stroke: var(--grid);
	}
	.llm {
		fill: var(--accent-wash);
		stroke: color-mix(in srgb, var(--accent) 45%, transparent);
	}
	.user {
		fill: var(--surface-2);
	}
	.sys {
		fill: color-mix(in srgb, var(--accent-wash) 55%, var(--surface-0));
		stroke: color-mix(in srgb, var(--accent) 35%, transparent);
	}
	.past {
		fill: none;
		stroke: var(--border);
		stroke-dasharray: 3 3;
	}
	.label-bg {
		fill: var(--surface-0);
	}

	.flow,
	.span,
	.tick {
		stroke: var(--chart-grey);
		stroke-width: 1.25;
	}
	.feedback {
		stroke: var(--chart-grey);
		stroke-width: 1.25;
		stroke-dasharray: 2 3;
	}
	.head {
		fill: var(--chart-grey);
	}
	.flush {
		stroke: var(--muted);
		stroke-width: 1.5;
	}
	.flush-head {
		fill: var(--muted);
	}

	.wave {
		fill: var(--chart-grey);
	}
	.sys-wave {
		fill: var(--accent);
	}
</style>
