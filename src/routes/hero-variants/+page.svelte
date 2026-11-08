<!-- TEMP: ten candidates for the figure at the top of /voxtral, to click through and pick one.
     ← / → or the buttons switch; the number is kept in the URL (#3), so a pick can be shared. -->
<script>
	import { onMount } from 'svelte';
	import V01 from '#lib/hero/V01Trace.svelte';
	import V02 from '#lib/hero/V02Lanes.svelte';
	import V03 from '#lib/hero/V03Decoder.svelte';
	import V04 from '#lib/hero/V04Transcript.svelte';
	import V05 from '#lib/hero/V05Race.svelte';
	import V06 from '#lib/hero/V06Simplex.svelte';
	import V07 from '#lib/hero/V07Frames.svelte';
	import V08 from '#lib/hero/V08Scale.svelte';
	import V09 from '#lib/hero/V09Gauge.svelte';
	import V10 from '#lib/hero/V10Peek.svelte';

	const variants = [
		{
			C: V01,
			name: 'Probability trace',
			what: 'The waveform as it’s spoken, the head’s P(complete) drawn live under it; the silence timer’s cut-in and the head’s firing marked on one time axis.'
		},
		{
			C: V02,
			name: 'Two lanes, two endings',
			what: 'The same turn twice: a silence timer talks into the thinking pause, the turn head waits and answers 678 ms after the last word.'
		},
		{
			C: V03,
			name: 'Inside the decoder',
			what: 'The 26 frozen decoder layers pulsing every 80 ms frame, layer 11 tapped, and the head’s three outputs live.'
		},
		{
			C: V04,
			name: 'Transcript with verdicts',
			what: 'Big type, word by word, with the head’s call as a chip at each silence, then the reply. Plain HTML: reflows on phones.'
		},
		{
			C: V05,
			name: 'The race',
			what: 'The article’s two pipelines racing from the last word, at half speed with a stopwatch: ≈1.2 s against 678 ms.'
		},
		{
			C: V06,
			name: 'Three choices',
			what: 'The head’s three outputs as a point in a triangle (reply, wait, keep talking), with a trail; “mm-hmm” pulls it to keep talking.'
		},
		{
			C: V07,
			name: 'Every 80 ms',
			what: 'A spectrogram filling in frame by frame, and one cell per frame tinted by P(complete); the first one past 0.5 gets a ring.'
		},
		{
			C: V08,
			name: 'Scale',
			what: 'The frozen 4.4B model as ~1,800 squares the size of the 2.4M turn head; the head is the one pink square. +0.1 ms, WER ±0.'
		},
		{
			C: V09,
			name: 'The gauge',
			what: 'One needle for P(complete) with the 0.5 firing mark, and a big status word: listening, thinking pause, your turn, backchannel.'
		},
		{
			C: V10,
			name: 'Peek',
			what: 'What you said against what Voxtral has written 480 ms behind; when the head fires, peek flushes the last words in early.'
		}
	];

	let i = $state(0);
	const v = $derived(variants[i]);
	const go = (/** @type {number} */ d) => {
		i = (i + d + variants.length) % variants.length;
		history.replaceState(history.state, '', `#${i + 1}`);
	};
	onMount(() => {
		const n = Number(location.hash.slice(1));
		if (n >= 1 && n <= variants.length) i = n - 1;
	});
</script>

<svelte:head>
	<title>Hero variants · {i + 1}/10</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'ArrowRight') go(1);
		if (e.key === 'ArrowLeft') go(-1);
	}}
/>

<main>
	<header>
		<div class="nav">
			<button type="button" onclick={() => go(-1)} aria-label="Previous variant">←</button>
			<span class="count">{i + 1} / {variants.length}</span>
			<button type="button" onclick={() => go(1)} aria-label="Next variant">→</button>
		</div>
		<h1>{v.name}</h1>
		<p>{v.what}</p>
	</header>

	<!-- the post's title block, so each variant is seen where it would sit -->
	<section class="mock">
		<p class="eyebrow">Nov 9, 2026 · @danil_rootint</p>
		<p class="title">Adapting ASR models for full-duplex speech-to-speech</p>
		{#key i}<div class="stage"><v.C /></div>{/key}
	</section>

	<ol class="dots" aria-label="All variants">
		{#each variants as w, n (w.name)}
			<li>
				<button type="button" class:on={n === i} onclick={() => go(n - i)}
					>{n + 1} · {w.name}</button
				>
			</li>
		{/each}
	</ol>
</main>

<style>
	main {
		max-width: 1040px;
		margin: 0 auto;
		padding: 96px var(--gutter) var(--s9);
	}
	header {
		display: grid;
		gap: var(--s2);
		max-width: 696px;
		margin-bottom: var(--s7);
	}
	.nav {
		display: flex;
		align-items: center;
		gap: var(--s3);
	}
	.nav button {
		width: var(--control-h);
		height: var(--control-h);
		border: 0;
		border-radius: 50%;
		background: var(--surface-2);
		color: var(--text);
		font-size: 18px;
		cursor: pointer;
	}
	.nav button:hover {
		background: var(--accent);
		color: var(--on-accent);
	}
	.count {
		font: 400 var(--fs-small) / 1 var(--font-mono);
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}
	h1 {
		margin: var(--s3) 0 0;
		font: var(--w-head) var(--fs-h2) / var(--lh-head) var(--font-ui);
		color: var(--text);
	}
	header p {
		margin: 0;
		color: var(--muted);
		line-height: 1.6;
	}
	.mock {
		padding-top: var(--s6);
		border-top: 1px solid var(--grid);
	}
	.eyebrow {
		margin: 0;
		font: 400 var(--fs-caption) / 1.4 var(--font-mono);
		color: var(--dim);
	}
	.title {
		max-width: 696px;
		margin: var(--s3) 0 var(--s7);
		font: var(--w-head) clamp(2rem, 5vw, 3rem) / 1.1 var(--font-ui);
		color: var(--text);
	}
	.stage {
		max-width: 960px;
	}
	.dots {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s2);
		margin: var(--s8) 0 0;
		padding: 0;
		list-style: none;
	}
	.dots button {
		padding: 6px 12px;
		border: 0;
		border-radius: 999px;
		background: var(--surface-1);
		box-shadow: var(--ring-1);
		font: 400 var(--fs-small) / 1.4 var(--font-ui);
		color: var(--muted);
		cursor: pointer;
	}
	.dots button.on {
		background: var(--accent);
		color: var(--on-accent);
	}
</style>
