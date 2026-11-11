<!-- Three timelines of one reply, on one time axis: the turn head without peek, an Unmute-style
     flush of the live ASR, and ours (peek on a copy at P ≥ 0.5, speculate, release at 0.9).
     Time 0 is the end of the user's last word (the dashed line). Each lane is a part of the
     pipeline; a solid bar is work being done, its pale tail is that part still streaming.
     All timings in ms, from the chart this was drawn from. Lane colours are a categorical palette
     in the site's hues, validated for colour-blind separation and contrast in both themes
     (dataviz validate_palette.js); text always stays in the ink colours. -->
<script>
	/**
	 * @typedef {'you' | 'asr' | 'peek' | 'llm' | 'tts' | 'speaker'} Kind
	 * @typedef {{ bar: [number, number], c: Kind, tail?: number, ghost?: boolean, pale?: boolean, light?: boolean, hatch?: boolean, label?: string, side?: 'right' | 'left' | 'tail' | 'inside', strong?: boolean, after?: string, end?: boolean, dashed?: boolean }} Bar  end: an inside label sits at the bar's right end, clear of a line crossing its start
	 *   pale: a quiet stretch (the user's silence); hatch: work on nothing (transcribing silence)
	 * @typedef {{ mark: number, label: string, side?: 'right' | 'left', strong?: boolean, hot?: boolean }} Mark
	 * @typedef {{ dots: [number, number], label?: string, side?: 'right' | 'left' }} Dots
	 * @typedef {{ span: [number, number], label: string }} Span
	 * @typedef {{ tick: number, label?: string }} Tick  a hard stop at the end of a bar, labelled after it
	 * @typedef {{ note: string, at: number, align?: 'start' | 'center' | 'end', strong?: boolean }} Note  small print in a short row
	 * @typedef {{ drop: number, c: Kind }} Drop  a short arrow straight down, from one lane's work into the next
	 * @typedef {{ ref: number }} Ref  a dashed tick inside a bar: where something happened in another chart
	 * @typedef {{ vline: number, part: 'start' | 'mid' | 'end' }} Vline  one lane's piece of a line dropped from a decision to where it waits
	 * @typedef {{ arrows: { from: number, to: number, label: string }[] }} Arrows  delays, as dashed arrows across a row
	 * @typedef {Bar | Mark | Dots | Span | Tick | Note | Vline | Arrows | Drop | Ref} Item
	 * @typedef {{ name: string, items: Item[], short?: boolean }} Lane
	 * @typedef {{ title: string, sub: string, lanes: Lane[] }} Chart
	 */

	/** @type {{ show?: number[], caption?: boolean }} which charts (numbered from 1) this copy draws */
	let { show = [1, 2, 3], caption = true } = $props();

	const START = -400;
	const END = 1500; // the axis runs to here; tails stream on to the edge

	/** @type {Chart[]} */
	const charts = [
		{
			title: 'Naive system – waiting for Voxtral’s last word',
			sub: 'The turn head decides that the turn is over (P(complete) + P(backchannel) ≥ 0.9) 303 ms after the last word is spoken. After that, Voxtral emits the final words in ~579 ms, and the transcript only catches up with the head’s decision 303 ms after the last word comes out.',
			lanes: [
				// the decision comes at 303 ms, but the transcript only catches up 579 ms later: a line
				// drops from the decision to the speech, where the second +579 ms arrow starts
				{
					name: 'turn head',
					items: [
						{ mark: 303, label: 'P(turn over) ≥ 0.9 at 303 ms', strong: true },
						{ vline: 303, part: 'start' }
					]
				},
				{
					name: 'speech',
					items: [
						{ bar: [START, 0], c: 'you', label: 'last words', side: 'inside', strong: true },
						{ bar: [0, 1383], c: 'you', pale: true, label: 'silence', side: 'inside' },
						{ vline: 303, part: 'mid' }
					]
				},
				{
					name: '',
					items: [
						{
							arrows: [
								{ from: 0, to: 579, label: '+579 ms' },
								{ from: 303, to: 882, label: '+579 ms' }
							]
						}
					]
				},
				{
					name: 'ASR words out',
					items: [
						{ bar: [183, 579], c: 'asr', label: 'last words', side: 'inside', strong: true },
						{ bar: [579, 882], c: 'asr', hatch: true, label: 'silence', side: 'inside' },
						{ tick: 882, label: 'transcript complete at 882 ms' }
					]
				},
				{
					name: 'LLM',
					items: [
						{
							bar: [882, 1022],
							c: 'llm',
							tail: END,
							label: 'first token at 1022 ms',
							side: 'left'
						}
					]
				},
				{
					name: 'TTS',
					items: [
						{
							bar: [1122, 1267],
							c: 'tts',
							tail: END,
							label: 'first audio at 1267 ms',
							side: 'left'
						}
					]
				},
				{
					name: 'speaker',
					items: [
						{
							bar: [1383, END],
							c: 'speaker',
							label: 'the reply is heard at 1383 ms',
							side: 'left',
							strong: true
						}
					]
				}
			]
		},
		{
			title: 'Looking into the future, Unmute style',
			sub: 'Start forwarding empty chunks into Voxtral and trigger a faster-than-real-time computation when the head fires a turn end. The fake silence now becomes part of the real stream. 800 ms of fake silence was chosen as Voxtral missed sentence punctuation at lower values.',
			lanes: [
				// the same decision at 303 ms, but now it triggers the flush: fake silence fills the ASR's
				// lookahead in 120 ms, so the transcript is complete at 423 instead of 882
				{
					name: 'turn head',
					items: [
						{ mark: 303, label: 'P(turn over) ≥ 0.9 at 303 ms → flush', strong: true },
						{ vline: 303, part: 'start' }
					]
				},
				{
					name: 'speech',
					items: [
						{ bar: [START, 0], c: 'you', label: 'last words', side: 'inside', strong: true },
						{ bar: [0, 924], c: 'you', pale: true, label: 'silence', side: 'inside' },
						{ vline: 303, part: 'mid' }
					]
				},
				{
					name: 'flush',
					items: [
						{
							bar: [303, 423],
							c: 'peek',
							label: '800 ms of fake silence pushed into the ASR',
							strong: true
						}
					]
				},
				{
					name: '',
					short: true,
					items: [
						{ drop: 360, c: 'peek' },
						{ note: 'fills the ASR’s 480 ms lookahead', at: 423 }
					]
				},
				{
					name: 'ASR words out',
					items: [
						{ bar: [183, 303], c: 'asr', label: 'real time', side: 'left' },
						{ bar: [303, 423], c: 'asr', light: true },
						{ tick: 423 },
						{
							bar: [423, 882],
							c: 'asr',
							hatch: true,
							label: 'real-time wait skipped',
							side: 'inside'
						}
					]
				},
				{
					name: '',
					short: true,
					items: [
						{
							note: 'at 423 ms the transcript is ready',
							at: 183,
							strong: true
						}
					]
				},
				{
					name: 'LLM',
					items: [
						{
							bar: [423, 563],
							c: 'llm',
							tail: END,
							label: 'first token at 563 ms',
							side: 'tail'
						}
					]
				},
				{
					name: 'TTS',
					items: [
						{
							bar: [663, 808],
							c: 'tts',
							tail: END,
							label: 'first audio at 808 ms',
							side: 'tail'
						}
					]
				},
				{
					name: 'speaker',
					items: [
						{
							bar: [924, END],
							c: 'speaker',
							label: 'the reply is heard at 924 ms',
							side: 'left',
							strong: true
						},
						{ ref: 1383 }
					]
				}
			]
		},
		{
			title: '“Peek” speculation on lower turn-release probabilities',
			sub: 'Now we add a speculative branch that triggers on earlier probabilities; this wins us 160 ms on average. If the P ≥ 0.5 turned out to be a pause, we just discard what was speculated.',
			lanes: [
				// the head is fairly sure at 143 ms and peeks then; the red line drops from that moment to
				// the peek it starts. "Done" at 303 only releases the reply that's already being prepared
				{
					name: 'turn head',
					items: [
						{ dots: [143, 303] },
						{ mark: 143, label: 'P ≥ 0.5: “probably done”', side: 'left', strong: true, hot: true },
						{ mark: 303, label: 'P ≥ 0.9 at 303 ms: “done”', strong: true },
						{ vline: 143, part: 'start' }
					]
				},
				{
					name: '',
					short: true,
					items: [
						{ span: [143, 303], label: '160 ms head start' },
						{ vline: 143, part: 'mid' }
					]
				},
				{
					name: 'speech',
					items: [
						{ bar: [START, 0], c: 'you', label: 'last words', side: 'inside', strong: true },
						{ bar: [0, 764], c: 'you', pale: true, label: 'silence', side: 'inside', end: true },
						{ vline: 143, part: 'mid' }
					]
				},
				{
					name: 'ASR (live stream)',
					items: [
						{
							bar: [183, 579],
							c: 'asr',
							ghost: true,
							label: 'words still arrive'
						},
						{ vline: 143, part: 'mid' }
					]
				},
				{
					name: 'peek / flush',
					items: [{ bar: [143, 263], c: 'peek', label: 'peek on a copy (120 ms)', side: 'left' }]
				},
				{
					name: 'LLM',
					items: [
						{
							bar: [263, 403],
							c: 'llm',
							tail: END,
							label: 'speculative request at 263 ms → first token at 403 ms',
							side: 'tail'
						}
					]
				},
				{
					name: 'TTS',
					items: [
						{
							bar: [503, 648],
							c: 'tts',
							tail: END,
							label: 'audio at 648 ms (held)',
							side: 'tail'
						}
					]
				},
				{
					name: 'speaker',
					items: [
						{
							bar: [764, END],
							c: 'speaker',
							label: 'the reply is heard at 764 ms',
							side: 'left',
							strong: true
						},
						{ ref: 924 },
						{ ref: 1383 }
					]
				}
			]
		},
		{
			title: 'Anticipating the end of the turn',
			sub: 'The head also predicts that the turn will end within 160 ms – at P ≥ 0.7 we peek before the speech is over. The peek at P ≥ 0.5 confirms the words, and if they changed, we discard what was speculated.',
			lanes: [
				// chart 3, one step earlier: the anticipation output fires at −5 ms and the red line drops
				// from it to the peek it starts; P ≥ 0.5 now only confirms, "done" at 303 releases
				{
					name: 'turn head',
					items: [
						{ dots: [143, 303] },
						{ mark: 143, label: 'P ≥ 0.5: “probably done”', side: 'left', strong: true },
						{ mark: 303, label: 'P ≥ 0.9 at 303 ms: “done”', strong: true }
					]
				},
				{
					name: 'anticipation',
					items: [
						{ mark: -5, label: 'P ≥ 0.7: “ends within 160 ms”', strong: true, hot: true },
						{ vline: -5, part: 'start' }
					]
				},
				{
					name: '',
					short: true,
					items: [
						{ span: [-5, 143], label: '148 ms head start' },
						{ vline: -5, part: 'mid' }
					]
				},
				{
					name: 'speech',
					items: [
						{ bar: [START, 0], c: 'you', label: 'last words', side: 'inside', strong: true },
						{ bar: [0, 616], c: 'you', pale: true, label: 'silence', side: 'inside', end: true },
						{ vline: -5, part: 'mid' }
					]
				},
				{
					name: 'ASR (live stream)',
					items: [
						{ bar: [183, 579], c: 'asr', ghost: true, label: 'words still arrive' },
						{ vline: -5, part: 'mid' }
					]
				},
				{
					name: 'peek / flush',
					items: [
						{ bar: [-5, 115], c: 'peek', label: 'peek (120 ms)', side: 'left' },
						{ bar: [143, 263], c: 'peek', dashed: true, label: 'confirm peek (120 ms)' }
					]
				},
				{
					name: 'LLM',
					items: [
						{
							bar: [115, 255],
							c: 'llm',
							tail: END,
							label: 'speculative request at 115 ms → first token at 255 ms',
							side: 'tail'
						}
					]
				},
				{
					name: 'TTS',
					items: [{ bar: [355, 500], c: 'tts', tail: END, label: 'audio at 500 ms', side: 'tail' }]
				},
				{
					name: 'speaker',
					items: [
						{
							bar: [616, END],
							c: 'speaker',
							label: 'the reply is heard at 616 ms',
							side: 'left',
							strong: true
						},
						{ ref: 764 },
						{ ref: 924 },
						{ ref: 1383 }
					]
				}
			]
		}
	];

	const shown = $derived(charts.map((c, i) => ({ c, n: i + 1 })).filter((x) => show.includes(x.n)));
	const pct = (/** @type {number} */ ms) => ((ms - START) / (END - START)) * 100;
	const ticks = [-400, -200, 0, 200, 400, 600, 800, 1000, 1200, 1400];

	/** where a bar's label goes: before it, or after it (which is inside its tail, if it has one) */
	const labelStyle = (/** @type {Bar} */ b) =>
		b.side === 'left'
			? `right: calc(${100 - pct(b.bar[0])}% + 6px)`
			: `left: calc(${pct(b.bar[1])}% + 6px)`;
	/** a note's anchor: starting at, centred on, or ending at its time */
	const noteStyle = (/** @type {Note} */ n) =>
		n.align === 'end'
			? `right: ${100 - pct(n.at)}%`
			: n.align === 'center'
				? `left: ${pct(n.at)}%; translate: -50% 0`
				: `left: ${pct(n.at)}%`;
	// the delay arrows are drawn in pixels (so their heads don't stretch): the row's width, measured
	let arrowsW = $state(560);
	const px = (/** @type {number} */ ms) => (pct(ms) / 100) * arrowsW;

	/** a mark's label: either side of the triangle */
	const markStyle = (/** @type {Mark} */ m) =>
		m.side === 'left'
			? `right: calc(${100 - pct(m.mark)}% + 10px)`
			: `left: calc(${pct(m.mark)}% + 10px)`;
</script>

<figure class="gantt">
	<div class="scroll">
		<div class="charts">
			{#each shown as { c, n } (c.title)}
				<section class="chart" aria-label="{n}: {c.title}">
					<p class="head">
						<span class="num">{n}.</span>
						<span class="title">{c.title}</span>
					</p>
					{#if c.sub}<p class="sub">{c.sub}</p>{/if}
					<div class="lanes">
						<!-- gridlines and where the user stopped, behind every lane -->
						<div class="grid" aria-hidden="true">
							{#each ticks as t (t)}<span class:zero={t === 0} style:left="{pct(t)}%"></span>{/each}
						</div>
						{#each c.lanes as lane, li (li)}
							<span class="lane-name">{lane.name}</span>
							<div class="track" class:short={lane.short}>
								{#each lane.items as it, ii (ii)}
									{#if 'bar' in it}
										<span
											class="bar {it.c}"
											class:ghost={it.ghost}
											class:pale={it.pale}
											class:hatch={it.hatch}
											class:light={it.light}
											class:dashed={it.dashed}
											style:left="{pct(it.bar[0])}%"
											style:width="{pct(it.bar[1]) - pct(it.bar[0])}%"
											>{#if it.side === 'inside'}<span
													class="in"
													class:strong={it.strong}
													class:end={it.end}>{it.label}</span
												>{/if}</span
										>
										{#if it.tail}
											<span
												class="tail {it.c}"
												style:left="calc({pct(it.bar[1])}% + 2px)"
												style:width="calc({pct(it.tail) - pct(it.bar[1])}% - 2px)"
											></span>
										{/if}
										{#if it.after}
											<span class="label quiet" style:left="calc({pct(it.bar[1])}% + 6px)"
												>{it.after}</span
											>
										{/if}
										{#if it.label && it.side !== 'inside'}
											<span class="label" class:strong={it.strong} style={labelStyle(it)}
												>{it.label}</span
											>
										{/if}
									{:else if 'mark' in it}
										<span
											class="mark"
											class:hot={it.hot}
											class:quiet={!it.label}
											style:left="{pct(it.mark)}%"
										></span>
										<span class="label" class:strong={it.strong} style={markStyle(it)}
											>{it.label}</span
										>
									{:else if 'dots' in it}
										<span
											class="dots"
											style:left="{pct(it.dots[0])}%"
											style:width="{pct(it.dots[1]) - pct(it.dots[0])}%"
										></span>
										{#if it.label}
											<span
												class="label"
												style={it.side === 'left'
													? `right: calc(${100 - pct(it.dots[0])}% + 6px)`
													: `left: calc(${pct(it.dots[1])}% + 6px)`}>{it.label}</span
											>
										{/if}
									{:else if 'tick' in it}
										<span class="tick" style:left="{pct(it.tick)}%"></span>
										{#if it.label}<span
												class="label strong"
												style:left="calc({pct(it.tick)}% + 8px)">{it.label}</span
											>{/if}
									{:else if 'note' in it}
										<span class="note" class:strong={it.strong} style={noteStyle(it)}
											>{it.note}</span
										>
									{:else if 'drop' in it}
										<span class="drop {it.c}" style:left="{pct(it.drop)}%"></span>
									{:else if 'ref' in it}
										<span class="ref" style:left="{pct(it.ref)}%" title="{it.ref} ms"></span>
									{:else if 'vline' in it}
										<span class="vline {it.part}" style:left="{pct(it.vline)}%"></span>
									{:else if 'arrows' in it}
										<svg class="arrows" bind:clientWidth={arrowsW} aria-hidden="true">
											<defs>
												<marker
													id="gantt-arrow"
													viewBox="0 0 8 8"
													refX="7"
													refY="4"
													markerWidth="7"
													markerHeight="7"
													orient="auto"
												>
													<path d="M0 0 L8 4 L0 8 z" />
												</marker>
											</defs>
											{#each it.arrows as a (a.from)}
												<line
													x1={px(a.from)}
													y1="1"
													x2={px(a.to) - 2}
													y2="22"
													marker-end="url(#gantt-arrow)"
												/>
											{/each}
										</svg>
										{#each it.arrows as a (a.from)}
											<span
												class="arrow-label"
												style:left="{pct(a.from) + (pct(a.to) - pct(a.from)) * 0.32}%"
												>{a.label}</span
											>
										{/each}
									{:else}
										<span
											class="span"
											style:left="{pct(it.span[0])}%"
											style:width="{pct(it.span[1]) - pct(it.span[0])}%"
											><span>{it.label}</span></span
										>
									{/if}
								{/each}
							</div>
						{/each}
						<span class="lane-name"></span>
						<div class="axis" aria-hidden="true">
							{#each ticks as t, i (t)}
								<span style:left="{pct(t)}%">{t}{i === ticks.length - 1 ? ' ms' : ''}</span>
							{/each}
						</div>
					</div>
				</section>
			{/each}
		</div>
	</div>
	{#if caption}
		<figcaption>
			Timings taken from real audio from Speakrail testing. 0 ms marks the real end of the word, as
			marked by a
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external link -->
			<a href="https://github.com/snakers4/silero-vad" target="_blank" rel="noreferrer"
				>Silero VAD</a
			>
			model. For the LLM we use the Gemma 4 12B model, and for TTS –
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external link -->
			<a href="https://huggingface.co/BreezeBlue/Breeze-TTS-2" target="_blank" rel="noreferrer"
				>Breeze TTS 2</a
			>. To reproduce these results, use the 24 GB config from the
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external link -->
			<a href="https://github.com/speakrail/speakrail" target="_blank" rel="noreferrer"
				>Speakrail GitHub</a
			>.
		</figcaption>
	{/if}
</figure>

<style>
	/* lane colours: a categorical palette in the site's hues, kept as calm as the brand pink (OKLCH
	   chroma 0.105, the pink is 0.108) and stepped for each theme. Validated as a set: colour-blind
	   separation of neighbouring lanes (lightness alternates to help it), contrast against the page */
	.gantt {
		--c-you: var(--chart-grey);
		--c-asr: #6a93d2;
		--c-peek: #ab5e7b;
		--c-llm: #60a46f;
		--c-tts: #9f7028;
		--c-speaker: #9286ce;
	}
	:global([data-theme='light']) .gantt {
		--c-asr: #3d639e;
		--c-peek: #914764;
		--c-llm: #488c58;
		--c-tts: #865903;
		--c-speaker: #64579a;
	}

	/* phones: keep the bars wide enough to label and scroll sideways instead */
	.scroll {
		overflow-x: auto;
		overflow-y: hidden; /* sideways only: a scrolling x-axis otherwise makes y scroll too */
		scrollbar-width: none; /* no bar: narrow screens swipe it, the fade on the right is the hint */
	}
	.scroll::-webkit-scrollbar {
		display: none;
	}
	@media (max-width: 41rem) {
		.scroll {
			mask-image: linear-gradient(90deg, #000 calc(100% - 40px), transparent);
		}
	}
	.charts {
		display: flex;
		flex-direction: column;
		gap: var(--s6);
		min-width: 680px;
	}

	.head {
		margin: 0;
		line-height: 1.4;
	}
	.num,
	.title {
		font: var(--w-ui-strong) var(--fs-ui) / 1.4 var(--font-ui);
		color: var(--text);
	}
	.num {
		font-family: var(--font-mono);
		color: var(--accent);
	}
	.sub {
		margin: 2px 0 var(--s3);
		font: var(--w-ui) var(--fs-caption) / 1.5 var(--font-ui);
		color: var(--muted);
	}

	/* lane names in a column, tracks beside them */
	.lanes {
		position: relative;
		display: grid;
		grid-template-columns: 112px 1fr;
		column-gap: var(--s3);
		row-gap: 6px;
	}
	.grid {
		position: absolute;
		inset: 0 0 22px calc(112px + var(--s3));
		pointer-events: none;
	}
	.grid span {
		position: absolute;
		inset-block: 0;
		border-left: 1px solid var(--grid);
	}
	.grid span.zero {
		border-left: 1px dashed var(--chart-grey);
	}
	.lane-name {
		font: var(--w-ui) 12px / 24px var(--font-ui);
		color: var(--muted);
		text-align: right;
		white-space: nowrap;
	}
	.track {
		position: relative;
		height: 24px;
	}
	.track.short {
		height: 16px;
	}

	.bar,
	.tail {
		z-index: 1; /* over the line dropped from a decision */
		position: absolute;
		top: 2px;
		height: 20px;
		border-radius: 4px;
	}
	.bar {
		background: var(--c);
	}
	.tail {
		background: color-mix(in srgb, var(--c) 24%, var(--surface-0));
	}
	.bar.pale {
		background: color-mix(in srgb, var(--c) 20%, var(--surface-0));
	}
	/* the words the flush brought out early */
	.bar.light {
		background: color-mix(in srgb, var(--c) 55%, var(--surface-0));
	}
	/* work that may be needed: the confirm peek, an empty dashed outline in its lane's colour */
	.bar.dashed {
		background: none;
		outline: 1.5px dashed var(--c);
		outline-offset: -1.5px;
	}
	.bar.hatch {
		background: repeating-linear-gradient(
			135deg,
			color-mix(in srgb, var(--c) 30%, var(--surface-0)) 0 4px,
			color-mix(in srgb, var(--c) 14%, var(--surface-0)) 4px 8px
		);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 45%, transparent);
	}
	/* a label inside its bar: page-coloured ink on the strong fills, the usual ink on pale ones */
	.bar > .in {
		display: block;
		padding-inline: 6px;
		overflow: hidden;
		font: var(--w-ui) 12px / 20px var(--font-ui);
		color: var(--body);
		white-space: nowrap;
	}
	.bar > .in.end {
		text-align: right;
	}
	.bar > .in.strong {
		font-weight: 600;
		color: var(--text);
	}
	.bar:not(.pale, .hatch, .ghost, .dashed) > .in {
		color: var(--surface-0);
	}
	.bar.ghost {
		background: color-mix(in srgb, var(--c) 30%, var(--surface-0));
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 60%, transparent);
	}
	.you {
		--c: var(--c-you);
	}
	.asr {
		--c: var(--c-asr);
	}
	.peek {
		--c: var(--c-peek);
	}
	.llm {
		--c: var(--c-llm);
	}
	.tts {
		--c: var(--c-tts);
	}
	.speaker {
		--c: var(--c-speaker);
	}

	/* every label wears the ink colours, never a lane colour */
	.label {
		position: absolute;
		z-index: 3; /* above bars, tails and the dropped line */
		top: 0;
		font: var(--w-ui) 12px / 24px var(--font-ui);
		color: var(--body);
		white-space: nowrap;
	}
	.label.quiet {
		font-size: 11px;
		color: var(--muted);
	}
	.label.strong {
		font-weight: 600;
		color: var(--text);
	}

	/* a decision of the turn head: a small downward triangle */
	.mark {
		position: absolute;
		top: 6px;
		width: 0;
		height: 0;
		translate: -5px 0;
		border-inline: 5px solid transparent;
		border-top: 9px solid var(--text);
	}
	/* the decision the red line drops from */
	/* an unlabelled moment, there for timing only */
	.mark.quiet {
		border-top-color: var(--chart-grey);
	}
	.mark.hot {
		border-top-color: var(--error);
	}
	.dots {
		position: absolute;
		top: 11px;
		border-top: 2px dotted var(--chart-grey);
	}
	.vline {
		position: absolute;
		z-index: 2; /* over the silence bar, so it runs unbroken to the arrow */
		top: 0;
		bottom: -6px; /* through the gap to the next lane */
		border-left: 2px solid var(--error);
		translate: -1px 0;
	}
	.vline.start {
		top: 12px;
	}
	.vline.end {
		bottom: 12px;
	}
	/* a hard stop: the transcript is complete here */
	.tick {
		position: absolute;
		z-index: 2; /* in front of the bars it ends */
		top: 0;
		width: 3px;
		height: 24px;
		translate: -1px 0;
		border-radius: 1px;
		background: var(--text);
	}
	.note {
		position: absolute;
		top: 0;
		font: var(--w-ui) 11px / 16px var(--font-ui);
		color: var(--muted);
		white-space: nowrap;
		z-index: 1; /* over the dropped line, on a page-coloured ground */
		background: var(--surface-0);
		padding-inline: 3px;
	}
	.note.strong {
		font-weight: 600;
		color: var(--text);
	}
	/* a short arrow straight down, through the small print and into the next lane */
	.drop {
		z-index: 2;
		position: absolute;
		top: -8px;
		bottom: -4px;
		border-left: 2px solid var(--c);
		translate: -1px 0;
	}
	.drop::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: -5px;
		border-inline: 4px solid transparent;
		border-top: 7px solid var(--c);
	}
	/* where the reply was heard in chart 1, for comparison */
	.ref {
		z-index: 2;
		position: absolute;
		top: 2px;
		height: 20px;
		border-left: 2px dashed var(--surface-0);
		translate: -1px 0;
	}
	.arrows {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 24px;
		overflow: visible;
	}
	.arrows line {
		stroke: var(--chart-grey);
		stroke-width: 1.25;
		stroke-dasharray: 5 4;
	}
	.arrows path {
		fill: var(--chart-grey);
	}
	.arrow-label {
		position: absolute;
		top: 4px;
		translate: -50% 0;
		padding-inline: 4px;
		background: var(--surface-0);
		font: 400 11px / 16px var(--font-mono);
		color: var(--muted);
		white-space: nowrap;
		z-index: 1; /* over the dropped line, on a page-coloured ground */
	}
	/* a stretch of time between two marks, with its length */
	.span {
		position: absolute;
		top: 8px;
		height: 0;
		border-top: 1px solid var(--muted);
	}
	.span::before,
	.span::after {
		content: '';
		position: absolute;
		top: -4px;
		height: 7px;
		border-left: 1px solid var(--muted);
	}
	.span::before {
		left: 0;
	}
	.span::after {
		right: 0;
	}
	/* the length goes just after the bracket, so it never covers it */
	.span > span {
		position: absolute;
		top: -8px;
		left: calc(100% + 8px);
		font: var(--w-ui) 11px / 16px var(--font-ui);
		color: var(--body);
		white-space: nowrap;
	}

	.axis {
		position: relative;
		height: 17px; /* 1px border + 16px of numbers: any less and they poke out by a pixel */
		border-top: 1px solid var(--grid);
	}
	.axis span {
		position: absolute;
		top: 2px;
		translate: -50% 0;
		font: 400 11px / 14px var(--font-mono);
		color: var(--dim);
		white-space: nowrap;
	}
	.axis span:first-child {
		translate: 0 0;
	}
</style>
