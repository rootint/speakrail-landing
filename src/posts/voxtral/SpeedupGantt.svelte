<!-- Two timelines of one reply, on one time axis: plain streaming Voxtral against the turn head with
     fork-peek and speculation. Time 0 is the end of the user's last word (the dotted line); each lane
     is a part of the pipeline, and the pink line is when the user starts hearing the reply.
     Timings in ms, from 0. Ones written on the original chart are marked "given"; the rest were
     read off its bars and are approximate: replace them with measured values. -->
<script>
	/**
	 * @typedef {{ from: number, to: number, label: string, kind: 'you' | 'ears' | 'wait' | 'brain' | 'voice', outside?: boolean }} Bar  outside: the label goes after a bar too short to hold it
	 * @typedef {{ at: number, label: string }} Mark
	 * @typedef {{ name: string, bars?: Bar[], marks?: Mark[] }} Lane
	 * @typedef {{ title: string, sub: string, lanes: Lane[], heard: number, heardLabel: string, labelSide: 'left' | 'right' }} Chart
	 */

	/** @type {Chart[]} */
	const charts = [
		{
			title: 'Plain streaming Voxtral',
			sub: 'LLM request 890–1,050 ms after the last word',
			lanes: [
				{ name: 'you', bars: [{ from: -260, to: 0, label: '… last word', kind: 'you' }] },
				{
					name: 'ears',
					bars: [
						{ from: 0, to: 480, label: 'words arrive 480 ms late', kind: 'ears' }, // given
						{ from: 480, to: 970, label: 'wait for silence', kind: 'wait' } // ≈
					]
				},
				{ name: 'brain', bars: [{ from: 970, to: 1090, label: 'LLM', kind: 'brain' }] }, // ≈
				{ name: 'voice', bars: [{ from: 1090, to: 1200, label: 'TTS', kind: 'voice' }] } // ≈
			],
			heard: 1200, // given: ≈ 1.2 s
			heardLabel: 'heard ≈ 1.2 s',
			labelSide: 'left'
		},
		{
			title: 'Turn head + fork-peek + speculation',
			sub: 'the head is sure 176 ms after you stop; peek reads your last words right away',
			lanes: [
				{ name: 'you', bars: [{ from: -260, to: 0, label: '… last word', kind: 'you' }] },
				{
					name: 'turn head',
					marks: [
						{ at: 176, label: 'P ≥ 0.5' }, // given
						{ at: 332, label: '0.9 rule' } // ≈
					]
				},
				{
					name: 'ears',
					bars: [{ from: 176, to: 252, label: 'peek', kind: 'ears', outside: true }]
				}, // ≈ end
				{
					name: 'brain',
					bars: [
						{ from: 254, to: 520, label: 'LLM drafts the reply', kind: 'brain', outside: true }
					] // ≈
				},
				{ name: 'voice', bars: [{ from: 520, to: 678, label: 'TTS', kind: 'voice' }] } // ≈ start
			],
			heard: 678, // given
			heardLabel: 'heard 678 ms',
			labelSide: 'right'
		}
	];

	// one axis for both charts, so a millisecond is as wide in each
	const START = -280;
	const END = 1330;
	const pct = (/** @type {number} */ ms) => `${((ms - START) / (END - START)) * 100}%`;
	const ticks = [0, 200, 400, 600, 800, 1000, 1200];
</script>

<figure class="gantt">
	<div class="scroll">
		<div class="charts">
			{#each charts as c, n (c.title)}
				<section class="chart" aria-label="{c.title}: {c.heardLabel}">
					<p class="head">
						<span class="num">{n + 1} ·</span>
						<span class="title">{c.title}</span>
						<span class="sub">{c.sub}</span>
					</p>
					<div class="lanes">
						{#each c.lanes as lane (lane.name)}
							<span class="lane-name">{lane.name}</span>
							<div class="track">
								{#each lane.bars ?? [] as b (b.from)}
									<span
										class="bar {b.kind}"
										style:left={pct(b.from)}
										style:width="calc({pct(b.to)} - {pct(b.from)})">{b.outside ? '' : b.label}</span
									>
									{#if b.outside}<span class="after" style:left="calc({pct(b.to)} + 6px)"
											>{b.label}</span
										>{/if}
								{/each}
								{#each lane.marks ?? [] as m (m.at)}
									<span class="mark" style:left={pct(m.at)}>{m.label}</span>
								{/each}
							</div>
						{/each}
						<!-- overlays across every lane: where the user stopped, and when they hear the reply -->
						<div class="overlay" aria-hidden="true">
							<span class="stop" style:left={pct(0)}></span>
							<span class="heard {c.labelSide}" style:left={pct(c.heard)}
								><span>{c.heardLabel}</span></span
							>
						</div>
					</div>
				</section>
			{/each}

			<div class="axis" aria-hidden="true">
				<span class="lane-name"></span>
				<div class="track">
					{#each ticks as t, i (t)}
						<span style:left={pct(t)}>{t}{i === ticks.length - 1 ? ' ms' : ''}</span>
					{/each}
				</div>
			</div>
		</div>
	</div>
	<figcaption>
		One reply, two pipelines, on the same time axis. 0 is the end of the user's last word; the pink
		line is when they start hearing the answer.
	</figcaption>
</figure>

<style>
	/* phones: keep the bars wide enough to label and scroll sideways instead */
	.scroll {
		overflow-x: auto;
		scrollbar-width: thin;
	}
	@media (max-width: 41rem) {
		.scroll {
			mask-image: linear-gradient(90deg, #000 calc(100% - 40px), transparent);
		}
	}
	.charts {
		display: flex;
		flex-direction: column;
		gap: var(--s5);
		min-width: 680px; /* any narrower and the turn head's two labels run into each other */
	}

	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: var(--s2);
		margin: 0 0 var(--s2);
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
		font: var(--w-ui) var(--fs-small) / 1.4 var(--font-ui);
		color: var(--muted);
	}

	/* lane names in a column, tracks beside them; the overlay spans every track */
	.lanes,
	.axis {
		position: relative;
		display: grid;
		grid-template-columns: 72px 1fr;
		column-gap: var(--s3);
		row-gap: 6px;
	}
	.lane-name {
		font: 400 12px / 24px var(--font-mono);
		color: var(--dim);
		text-align: right;
		white-space: nowrap;
	}
	.track {
		position: relative;
		height: 24px;
	}
	/* under the bars and labels: a label crossing the "heard" line stays readable */
	.overlay {
		z-index: 0;
		position: absolute;
		inset: -4px 0 -4px calc(72px + var(--s3));
		pointer-events: none;
	}

	.bar,
	.after,
	.mark {
		z-index: 1;
	}
	.bar {
		position: absolute;
		top: 0;
		height: 24px;
		box-sizing: border-box;
		padding: 0 6px;
		border-radius: 4px;
		font: var(--w-ui) 12px / 24px var(--font-ui);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: clip;
	}
	.you {
		background: var(--surface-2);
		color: var(--body);
		font-family: var(--font-mono);
	}
	.ears {
		background: color-mix(in srgb, var(--accent) 38%, var(--surface-1));
		color: var(--text);
	}
	.wait {
		background: var(--surface-sunk);
		box-shadow: var(--ring-sunk);
		color: var(--dim);
	}
	.brain {
		background: color-mix(in srgb, var(--accent) 70%, var(--surface-0));
		color: var(--on-accent);
	}
	.voice {
		background: var(--accent);
		color: var(--on-accent);
	}

	.after {
		position: absolute;
		top: 2px;
		height: 20px;
		padding-inline: 2px 4px;
		background: var(--surface-0);
		font: var(--w-ui) 12px / 20px var(--font-ui);
		color: var(--body);
		white-space: nowrap;
	}

	/* a moment on the turn head's lane: a tick and its label */
	.mark {
		position: absolute;
		top: 2px;
		height: 20px;
		padding-left: 6px;
		border-left: 2px solid var(--accent);
		font: 400 12px / 20px var(--font-mono);
		color: var(--body);
		white-space: nowrap;
	}
	.mark + .mark {
		border-left-color: var(--chart-grey);
		color: var(--muted);
	}

	.stop {
		position: absolute;
		inset-block: 0;
		border-left: 1px dashed var(--chart-grey);
	}
	.heard {
		position: absolute;
		inset-block: 0;
		width: 2px;
		translate: -1px 0;
		background: var(--accent);
	}
	.heard > span {
		position: absolute;
		top: 2px;
		font: 600 13px / 20px var(--font-mono);
		color: var(--accent);
		white-space: nowrap;
	}
	.heard.left > span {
		right: 8px;
	}
	.heard.right > span {
		left: 8px;
	}

	.axis .track {
		height: 18px;
		border-top: 1px solid var(--grid);
	}
	.axis .track span {
		position: absolute;
		top: 2px;
		translate: -50% 0;
		font: 400 var(--fs-caption) / 16px var(--font-mono);
		color: var(--dim);
		white-space: nowrap;
	}
</style>
