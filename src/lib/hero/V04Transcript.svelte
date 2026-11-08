<!-- 4 · Transcript with verdicts: the user's words in large type as they're spoken, and at each
     silence a chip with the turn head's call: a thinking pause gets "keep listening", the real end
     gets "end of turn" 176 ms later. Then the reply. Pure HTML, so it reflows on any screen. -->
<script>
	import { loop } from './clock.svelte.js';
	import * as S from './scenario.js';

	const clock = loop(S.LOOP, S.HEARD + 1.3);
	const now = $derived(clock.t);
	const p = $derived(S.pComplete(now));
	const before = S.WORDS.filter((w) => w.b <= S.PAUSE[0]);
	const after = S.WORDS.filter((w) => w.a >= S.PAUSE[1]);
	const PAUSE_CHIP = S.PAUSE[0] + 0.25; // when the pause chip shows
	const pausePeak = S.pComplete(2.05);
</script>

<figure class="v">
	<div class="live" aria-hidden="true">
		<span class="dot" class:on={now < S.END}></span>
		{now < S.END ? 'listening' : now < S.HEARD ? 'your turn is over' : 'replying'}
		<span class="p">P(done) {p.toFixed(2)}</span>
	</div>

	<p class="said">
		{#each before as w (w.a)}<span class="w" class:on={now >= w.a}>{`${w.w} `}</span>{/each}
		<span class="chip wait" class:on={now >= PAUSE_CHIP}
			>pause · {pausePeak.toFixed(2)} · keep listening</span
		>
		{#each after as w (w.a)}<span class="w" class:on={now >= w.a}>{` ${w.w}`}</span>{/each}
		<span class="chip done" class:on={now >= S.HEAD_FIRES}>end of turn · {S.HEAD_MS} ms</span>
	</p>

	<p class="reply" class:on={now >= S.HEARD}>
		<span class="who">reply, heard {S.HEARD_MS} ms after you stopped</span>
		{#each S.REPLY as w (w.a)}<span class="w" class:on={now >= w.a}>{`${w.w} `}</span>{/each}
	</p>

	<p class="sr">
		A user says “So I was thinking we could… maybe go tomorrow?”. At the thinking pause the turn
		head says keep listening; {S.HEAD_MS} ms after the last word it calls the end of the turn, and the
		reply is heard {S.HEARD_MS} ms after it.
	</p>
</figure>

<style>
	.v {
		display: flex;
		flex-direction: column;
		gap: var(--s5);
		margin: 0;
		padding: var(--s6) var(--s5);
		border-radius: var(--radius-lg);
		background: var(--surface-1);
		box-shadow: var(--ring-1);
	}
	.live {
		display: flex;
		align-items: center;
		gap: var(--s2);
		font: 400 var(--fs-caption) / 1 var(--font-mono);
		color: var(--dim);
	}
	.live .p {
		margin-left: auto;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--chart-grey);
	}
	.dot.on {
		background: var(--accent);
		animation: pulse 1s ease-in-out infinite;
	}
	@keyframes pulse {
		50% {
			opacity: 0.35;
		}
	}
	.said {
		margin: 0;
		font: 500 clamp(1.5rem, 4vw, 2.25rem) / 1.5 var(--font-ui);
		color: var(--text);
	}
	.w {
		opacity: 0.12;
		transition: opacity 120ms;
	}
	.w.on {
		opacity: 1;
	}
	.chip {
		display: inline-block;
		margin-inline: 0.3em;
		padding: 0.15em 0.6em;
		border-radius: 999px;
		vertical-align: 0.35em;
		font: 400 var(--fs-caption) / 1.5 var(--font-mono);
		white-space: nowrap;
		opacity: 0;
		translate: 0 4px;
		transition:
			opacity 200ms,
			translate 200ms;
	}
	.chip.on {
		opacity: 1;
		translate: 0 0;
	}
	.chip.wait {
		background: var(--surface-2);
		color: var(--muted);
	}
	.chip.done {
		background: var(--accent);
		color: var(--on-accent);
	}
	.reply {
		margin: 0;
		font: 400 clamp(1.15rem, 3vw, 1.5rem) / 1.5 var(--font-ui);
		color: var(--accent);
		opacity: 0;
		transition: opacity 200ms;
	}
	.reply.on {
		opacity: 1;
	}
	.who {
		display: block;
		font: 400 var(--fs-caption) / 1.6 var(--font-mono);
		color: var(--dim);
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}
	@media (prefers-reduced-motion: reduce) {
		.dot.on {
			animation: none;
		}
	}
</style>
