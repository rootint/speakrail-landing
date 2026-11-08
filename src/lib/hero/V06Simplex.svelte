<!-- 6 · Three choices: the head's three outputs as a point in a triangle (complete = reply,
     incomplete = wait, backchannel = keep talking), moving as the conversation plays, with a fading
     trail. The thinking pause barely moves it; the real end pulls it to "reply"; the user's
     "mm-hmm" over the reply pulls it to "keep talking". -->
<script>
	import { loop } from './clock.svelte.js';
	import * as S from './scenario.js';

	const W = 960;
	const H = 380;
	// corners: the triangle sits on the right, the transcript on the left
	const C = { x: 685, y: 34 }; // complete, centred over the other two
	const I = { x: 520, y: 340 }; // incomplete
	const B = { x: 850, y: 340 }; // backchannel
	const at = (/** @type {{ complete: number, incomplete: number, backchannel: number }} */ p) => ({
		x: p.complete * C.x + p.incomplete * I.x + p.backchannel * B.x,
		y: p.complete * C.y + p.incomplete * I.y + p.backchannel * B.y
	});

	const clock = loop(S.LOOP, S.HEAD_FIRES + 0.5);
	const now = $derived(clock.t);
	const pt = $derived(at(S.probs(now)));
	const trail = $derived(
		Array.from({ length: 36 }, (_, i) => {
			const t = now - (36 - i) * 0.035;
			return { i, ...at(S.probs(Math.max(0, t))) };
		})
	);
	const state = $derived.by(() => {
		const p = S.probs(now);
		if (p.backchannel > 0.5)
			return { who: 'you', text: S.MMHMM.w, verdict: 'backchannel → keep talking' };
		if (now >= S.HEARD)
			return {
				who: 'reply',
				text: S.said(S.REPLY, now)
					.map((w) => w.w)
					.join(' '),
				verdict: 'replying'
			};
		if (p.complete >= 0.5) return { who: 'you', text: 'tomorrow?', verdict: 'complete → reply' };
		if (now > S.PAUSE[0] && now < S.PAUSE[1])
			return { who: 'you', text: 'could…', verdict: 'thinking pause → wait' };
		return {
			who: 'you',
			text: S.said(S.WORDS, now)
				.map((w) => w.w)
				.slice(-3)
				.join(' '),
			verdict: 'speaking → wait'
		};
	});
</script>

<figure class="v">
	<svg
		viewBox="0 0 {W} {H}"
		role="img"
		aria-label="The turn head's three outputs drawn as a point in a triangle with the corners reply, wait and keep talking. It stays near wait through a thinking pause, jumps to reply when the user finishes, and moves to keep talking when the user says mm-hmm over the reply."
	>
		<!-- left: what's happening -->
		<text class="who" x="0" y="120">{state.who}</text>
		<text class="said" x="0" y="160">{state.text}</text>
		<text class="verdict" x="0" y="204">{state.verdict}</text>

		<!-- the triangle -->
		<path class="tri" d="M{C.x} {C.y} L{I.x} {I.y} L{B.x} {B.y} Z" />
		<text class="corner" x={C.x} y={C.y - 12}>complete · reply</text>
		<text class="corner" x={I.x} y={I.y + 28}>incomplete · wait</text>
		<text class="corner" x={B.x} y={B.y + 28}>backchannel · keep talking</text>
		{#each trail as p (p.i)}
			<circle class="trail" cx={p.x} cy={p.y} r={1.5 + p.i * 0.09} style:opacity={p.i / 36} />
		{/each}
		<circle class="halo" cx={pt.x} cy={pt.y} r="16" />
		<circle class="pt" cx={pt.x} cy={pt.y} r="7" />
	</svg>
</figure>

<style>
	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.who {
		font: 400 13px var(--font-mono);
		fill: var(--dim);
	}
	.said {
		font: 500 30px var(--font-ui);
		fill: var(--text);
	}
	.verdict {
		font: 500 16px var(--font-mono);
		fill: var(--accent);
	}
	.tri {
		fill: var(--surface-1);
		stroke: var(--border);
	}
	.corner {
		font: 400 13px var(--font-mono);
		fill: var(--muted);
		text-anchor: middle;
	}
	.trail {
		fill: var(--accent);
	}
	.halo {
		fill: color-mix(in srgb, var(--accent) 20%, transparent);
	}
	.pt {
		fill: var(--accent);
	}
</style>
