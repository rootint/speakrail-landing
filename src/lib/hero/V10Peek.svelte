<!-- 10 · Peek: what the user said, against what Voxtral has written, which runs 480 ms behind. Once
     the turn head fires, peek pushes empty frames through faster than real time, so the last words
     land right away instead of 480 ms late. A ghost of the plain stream shows what was saved. -->
<script>
	import { loop } from './clock.svelte.js';
	import * as S from './scenario.js';

	const LAG = 0.48;
	const PEEK_DONE = S.HEAD_FIRES + 0.076; // peek reads the last words (the article's 176 → 252 ms)

	const clock = loop(S.LOOP - 2.6, S.END + 0.9);
	const now = $derived(clock.t);
	// a word is written LAG after it's said, or at PEEK_DONE if peek gets there first
	const written = (/** @type {import('./scenario.js').Word} */ w) => Math.min(w.b + LAG, PEEK_DONE);
	const peeked = $derived(now >= PEEK_DONE);
	const savedMs = Math.round((S.END + LAG - PEEK_DONE) * 1000);
</script>

<figure class="v">
	<div class="rows">
		<p class="k">you said</p>
		<p class="line">
			{#each S.WORDS as w (w.a)}<span class="w" class:on={now >= w.a}>{`${w.w} `}</span>{/each}
		</p>

		<p class="k">Voxtral wrote <span class="lag">{LAG * 1000} ms behind</span></p>
		<p class="line out">
			{#each S.WORDS as w (w.a)}<span
					class="w"
					class:on={now >= written(w)}
					class:jump={written(w) === PEEK_DONE && now >= PEEK_DONE}>{`${w.w} `}</span
				>{/each}
		</p>
	</div>

	<div class="bar">
		<span class="state" class:hot={peeked}>
			{#if now < S.END}
				transcript trails your speech by {LAG * 1000} ms
			{:else if now < S.HEAD_FIRES}
				you stopped · the turn head is deciding
			{:else if !peeked}
				turn head fires · peek: flush empty frames, 6× faster than real time
			{:else}
				last word written {savedMs} ms earlier than waiting it out
			{/if}
		</span>
	</div>
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
	.rows {
		display: grid;
		gap: var(--s2);
	}
	.k {
		margin: 0;
		font: 400 var(--fs-caption) / 1.4 var(--font-mono);
		color: var(--dim);
	}
	.k + .line + .k {
		margin-top: var(--s4);
	}
	.lag {
		margin-left: var(--s2);
		padding: 0.1em 0.5em;
		border-radius: 999px;
		background: var(--surface-2);
		color: var(--muted);
	}
	.line {
		margin: 0;
		font: 500 clamp(1.4rem, 3.6vw, 2rem) / 1.4 var(--font-ui);
		color: var(--text);
	}
	.line.out {
		color: var(--accent);
	}
	.w {
		opacity: 0.1;
		transition: opacity 120ms;
	}
	.w.on {
		opacity: 1;
	}
	/* the words peek brings in early land with a flash */
	.w.jump {
		animation: land 500ms ease-out;
	}
	@keyframes land {
		from {
			text-shadow: 0 0 18px var(--accent);
		}
	}
	.bar {
		padding-top: var(--s4);
		border-top: 1px solid var(--grid);
	}
	.state {
		font: 400 var(--fs-small) / 1.5 var(--font-mono);
		color: var(--muted);
	}
	.state.hot {
		color: var(--accent);
	}
	@media (prefers-reduced-motion: reduce) {
		.w,
		.w.jump {
			transition: none;
			animation: none;
		}
	}
</style>
