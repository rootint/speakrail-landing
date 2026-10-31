<script>
	import Experiment from '#lib/logos/Experiment.svelte';
	import Lockup from '#lib/logos/Lockup.svelte';
	import Mark from '#lib/logos/Mark.svelte';

	// each concept: which symbol, how the name is set, the colour theme it's shown on, and what it says
	/** @type {{ name: string, mark: number, style: 'title' | 'lower' | 'mono' | 'badge' | 'board', theme: string, idea: string }[]} */
	const concepts = [
		{
			name: 'Dialogue',
			mark: 1,
			style: 'title',
			theme: 'ink',
			idea: 'Two speech bubbles: you, then the reply in pink.'
		},
		{
			name: 'Express',
			mark: 2,
			style: 'lower',
			theme: 'pink',
			idea: 'Level bars blurring in from the left: a voice, moving fast.'
		},
		{
			name: 'Transcribe',
			mark: 3,
			style: 'lower',
			theme: 'night',
			idea: 'Sound turning into a text cursor: speech to text while you talk.'
		},
		{
			name: 'Rail bubble',
			mark: 4,
			style: 'title',
			theme: 'paper',
			idea: 'A speech bubble with two rails through it: the name, drawn.'
		},
		{
			name: 'Back & forth',
			mark: 5,
			style: 'title',
			theme: 'blush',
			idea: 'An S made of two arrows passing the turn back and forth.'
		},
		{
			name: 'Burst',
			mark: 6,
			style: 'title',
			theme: 'ink',
			idea: 'A voice going out in every direction, one ray answering in pink.'
		},
		{
			name: 'Fast mic',
			mark: 7,
			style: 'title',
			theme: 'pink',
			idea: 'A microphone with speed lines: realtime voice.'
		},
		{
			name: 'Code wave',
			mark: 8,
			style: 'mono',
			theme: 'night',
			idea: 'A voice inside angle brackets: voice AI as a developer tool.'
		},
		{
			name: 'Prompt',
			mark: 9,
			style: 'lower',
			theme: 'paper',
			idea: 'A terminal tile whose cursor is a sound wave.'
		},
		{
			name: 'On track',
			mark: 10,
			style: 'title',
			theme: 'blush',
			idea: 'Rails running into the distance, pink sleepers.'
		},
		{
			name: 'Fast reply',
			mark: 11,
			style: 'title',
			theme: 'ink',
			idea: 'A speech bubble with a lightning bolt: answers without the wait.'
		},
		{
			name: 'Bullet',
			mark: 12,
			style: 'title',
			theme: 'pink',
			idea: 'The nose of a bullet train on a rail: speed, and the name.'
		},
		{
			name: 'Your turn',
			mark: 13,
			style: 'title',
			theme: 'night',
			idea: 'A pause bar handing over to play: listen, then speak.'
		},
		{
			name: 'Signal',
			mark: 14,
			style: 'title',
			theme: 'paper',
			idea: 'A rail signal with the bottom lamp lit: go ahead.'
		},
		{
			name: 'Duplex',
			mark: 15,
			style: 'title',
			theme: 'blush',
			idea: 'Two loops: both sides can talk at once.'
		},
		{
			name: 'Striped S',
			mark: 16,
			style: 'title',
			theme: 'ink',
			idea: 'An S built from speed bars.'
		},
		{
			name: 'Live',
			mark: 17,
			style: 'title',
			theme: 'pink',
			idea: 'A record-style ring with the voice at its centre.'
		},
		{
			name: 'Flap',
			mark: 18,
			style: 'mono',
			theme: 'night',
			idea: 'One split-flap tile with an S, from the arrival-board idea.'
		},
		{
			name: 'Badge',
			mark: 19,
			style: 'badge',
			theme: 'pink',
			idea: 'A boxed lockup with a tagline, like a rating card.'
		},
		{
			name: 'Departure board',
			mark: 18,
			style: 'board',
			theme: 'ink',
			idea: 'SPEAK / RAIL on split-flap tiles, the last one flipped to go.'
		}
	];

	// typographic experiments: the name itself becomes the mark
	const experiments = [
		{
			name: 'il → wave',
			theme: 'ink',
			idea: 'The i is a short bar, the l a tall one; the waveform carries on in pink.'
		},
		{
			name: 'i · wave · l',
			theme: 'night',
			idea: 'A small waveform squeezed in between the i and the l.'
		},
		{
			name: 'Waveform il',
			theme: 'pink',
			idea: 'The i and l get a negative half below the line, then the wave fades.'
		},
		{
			name: 'Echo',
			theme: 'ink',
			idea: 'The name and its fading pink reflection, like sound off a hard floor.'
		},
		{
			name: 'Loudness',
			theme: 'paper',
			idea: 'Each letter’s weight is how loud it was said (Kripa is variable, 100–900).'
		},
		{
			name: 'Fade out',
			theme: 'night',
			idea: 'Quieter letter by letter, then the full stop: the turn is over.'
		},
		{
			name: 'Envelope',
			theme: 'blush',
			idea: 'Letters stretched like an amplitude envelope around the centre line.'
		},
		{
			name: 'Stream',
			theme: 'ink',
			idea: '“speak” is said, “rail” is still being predicted, like a streaming model.'
		},
		{ name: 'Bubble a', theme: 'pink', idea: 'The a in speak is a speech bubble.' },
		{
			name: 'Rails il',
			theme: 'paper',
			idea: 'The i and l are two rails with pink sleepers between them.'
		},
		{ name: 'Sine', theme: 'night', idea: 'The “ea” is replaced by a wave: sp∿krail.' },
		{ name: 'Tag', theme: 'ink', idea: 'The name as a self-closing component.' },
		{
			name: 'Chat',
			theme: 'blush',
			idea: 'speak on the left, the reply on the right, like two messages.'
		},
		{
			name: 'Talk-over',
			theme: 'ink',
			idea: 'rail starts before speak has finished, cutting into it.'
		},
		{ name: 'Streaming', theme: 'night', idea: 'The end of the word is still arriving in slices.' },
		{
			name: 'Spectrum fill',
			theme: 'ink',
			idea: 'The letters are filled with spectrogram stripes.'
		},
		{ name: 'Tempo', theme: 'paper', idea: 'Spoken slowly, then the reply comes fast.' },
		{ name: 'Train', theme: 'blush', idea: 'Every letter is a carriage; the engine is pink.' },
		{ name: 'Broadcast', theme: 'pink', idea: 'The dot of the i is a signal going out.' },
		{
			name: 'Grid',
			theme: 'ink',
			idea: 'Nine letters, nine cells: a square mark for avatars and stickers.'
		},
		{
			name: 'Stream, r',
			theme: 'ink',
			idea: 'Stream with an underscore cursor: the pink line under the r is where the model is now.'
		}
	].map((e, i) => ({ ...e, id: 21 + i }));
</script>

<svelte:head>
	<title>Speakrail · Logo explorations</title>
</svelte:head>

<main class="page">
	<header>
		<p class="eyebrow">Brand · work in progress</p>
		<h1>Logo explorations</h1>
		<p class="lede">
			Twenty symbol-and-name lockups aiming at a clean AI-startup look: developer-friendly, fast,
			readable at a glance. Each is shown on a brand colour, as an app icon, and at nav size.
		</p>
	</header>

	<ol class="grid">
		{#each concepts as c, i (i)}
			<li class="card">
				<div class="hero t-{c.theme}">
					<Lockup mark={c.mark} style={c.style} size={c.style === 'board' ? 46 : 40} />
				</div>
				<div class="foot">
					<span class="icon t-{c.theme}"><Mark id={c.mark} size={26} /></span>
					<div class="meta">
						<p class="name"><span class="num">{String(i + 1).padStart(2, '0')}</span> {c.name}</p>
						<p class="idea">{c.idea}</p>
					</div>
					<span class="nav t-ink" aria-hidden="true">
						<Lockup mark={c.mark} style={c.style} size={c.style === 'board' ? 15 : 18} />
					</span>
				</div>
			</li>
		{/each}
	</ol>

	<h2>Experiments</h2>
	<p class="lede">
		The name itself as the mark: letters swapped, stretched, weighted and continued, all in Kripa
		and Lilex.
	</p>
	<ol class="grid">
		{#each experiments as e (e.id)}
			<li class="card">
				<div class="hero t-{e.theme}"><Experiment id={e.id} size={e.id === 40 ? 40 : 44} /></div>
				<div class="foot">
					<div class="meta">
						<p class="name"><span class="num">{e.id}</span> {e.name}</p>
						<p class="idea">{e.idea}</p>
					</div>
					<span class="nav t-ink" aria-hidden="true"
						><Experiment id={e.id} size={e.id === 40 ? 11 : 18} /></span
					>
				</div>
			</li>
		{/each}
	</ol>
</main>

<style>
	.page {
		width: min(100% - 2 * var(--gutter), 76rem);
		margin-inline: auto;
		padding-block: var(--s9);
	}
	p {
		margin: 0;
	}
	.eyebrow {
		font: 400 var(--fs-small) / 1.4 var(--font-mono);
		color: var(--muted);
	}
	h1 {
		margin: var(--s4) 0;
		font-size: clamp(2rem, 1.2rem + 3.5vw, 2.75rem);
		font-weight: 500;
		line-height: 1.3;
	}
	h2 {
		margin: var(--s9) 0 var(--s3);
		font-size: 1.75rem;
		font-weight: 500;
	}
	.lede {
		max-width: 42rem;
		line-height: 1.7;
		color: var(--body);
	}

	/* colour themes: --fg main, --acc the one detail, --bg for knock-outs (must equal the background) */
	.t-ink {
		--fg: #fcf5f7;
		--acc: #f59eb9;
		--bg: #161414;
	}
	.t-night {
		--fg: #fcf5f7;
		--acc: #f59eb9;
		--bg: #2a1820;
	}
	.t-pink {
		--fg: #161414;
		--acc: #fcf5f7;
		--bg: #f59eb9;
	}
	/* on light grounds the seed pink is too pale, so a deeper pink stands in */
	.t-blush {
		--fg: #161414;
		--acc: #d1497a;
		--bg: #fbe4eb;
	}
	.t-paper {
		--fg: #161414;
		--acc: #d1497a;
		--bg: #fcf5f7;
	}
	.t-ink,
	.t-night,
	.t-pink,
	.t-blush,
	.t-paper {
		background: var(--bg);
		color: var(--fg);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 30rem), 1fr));
		gap: var(--s5);
		margin: var(--s8) 0 0;
		padding: 0;
		list-style: none;
	}
	.card {
		display: flex;
		flex-direction: column;
		gap: var(--s4);
		padding: var(--s3) var(--s3) var(--s4);
		border-radius: 28px;
		background: var(--surface-1);
		box-shadow: inset 0 0 0 1px rgb(252 245 247 / 0.1);
	}
	.hero {
		display: grid;
		place-items: center;
		aspect-ratio: 16 / 10;
		border-radius: 18px;
	}
	.hero.t-ink {
		box-shadow: inset 0 0 0 1px rgb(252 245 247 / 0.08);
	}
	.foot {
		display: flex;
		align-items: center;
		gap: var(--s4);
		padding-inline: var(--s3);
	}
	.icon {
		display: grid;
		place-items: center;
		flex: none;
		width: 48px;
		height: 48px;
		border-radius: 12px;
	}
	.icon.t-ink {
		box-shadow: inset 0 0 0 1px rgb(252 245 247 / 0.12);
	}
	.meta {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.name {
		font-weight: 500;
		color: var(--text);
	}
	.num {
		margin-right: 6px;
		font: 400 var(--fs-small) var(--font-mono);
		color: var(--accent);
	}
	.idea {
		font-size: var(--fs-small);
		line-height: 1.45;
		color: var(--muted);
	}
	/* nav-size check, on the page colour */
	.nav {
		display: flex;
		align-items: center;
		flex: none;
		height: 40px;
		padding-inline: 12px;
		border-radius: 999px;
		box-shadow: inset 0 0 0 1px rgb(252 245 247 / 0.1);
	}
	@media (max-width: 40rem) {
		.nav {
			display: none;
		}
	}
</style>
