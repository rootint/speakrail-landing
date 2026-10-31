<script>
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import ArrowUpRight from '~icons/iconoir/arrow-up-right';
	import Github from '~icons/iconoir/github';
	import GraphUp from '~icons/iconoir/graph-up';
	import Play from '~icons/iconoir/play';
	import XLogo from '~icons/iconoir/x';
	import Architecture from '#lib/blog-header/Architecture.svelte';
	import Listen from '#lib/blog-header/Listen.svelte';
	import CtaLinks from '#lib/blog-header/CtaLinks.svelte';
	import Experiment from '#lib/logos/Experiment.svelte';
	import Cite from '#lib/post/Cite.svelte';
	import Outline from '#lib/post/Outline.svelte';
	import { Reading } from '#lib/post/reading.svelte.js';
	import SourceNotes from '#lib/post/SourceNotes.svelte';
	import { defineSources } from '#lib/post/sources.js';
	import sampleLatency from '#lib/assets/blog/sample-latency.png';
	import sampleSpectrogram from '#lib/assets/blog/sample-spectrogram.jpg';
	import Contour from '#lib/blog-header/Contour.svelte';
	import Pipeline from '#lib/blog-header/Pipeline.svelte';
	import SideMeta from '#lib/blog-header/SideMeta.svelte';
	import Spectrum from '#lib/blog-header/Spectrum.svelte';
	import Tldr from '#lib/blog-header/Tldr.svelte';

	const reading = new Reading('article h2');
	const sources = defineSources([
		{
			id: 'voxtral-realtime',
			title: 'Voxtral Realtime',
			authors: 'Liu et al.',
			year: 2026,
			venue: 'arXiv:2602.11298',
			url: 'https://arxiv.org/abs/2602.11298'
		},
		{
			id: 'dsm',
			title: 'Streaming Sequence-to-Sequence Learning with Delayed Streams Modeling',
			authors: 'Zeghidour et al.',
			year: 2025,
			venue: 'arXiv:2509.08753',
			url: 'https://arxiv.org/abs/2509.08753'
		}
	]);

	// TODO: numbers and section names below are placeholders
	const repo = 'speakrail/Voxtral-Mini-4B-Realtime-2602-TurnHead';
	const contents = [
		'Why turn-taking is hard',
		'Reading turns from layer 11',
		'Results: turn latency and WER',
		'Try it in Speakrail'
	];

	// TEMP: A/B variants for the post header. 14 is the pick; the others and the switcher stay
	// until they're deleted. ?v=<n> still previews any of them.
	// 0 = nothing · 2–3 first ideas · 6, 8 from other research blogs · 11 experimental · 12 architecture · 13 abstract · 14 pipeline · 15 = 14 without the animation
	const variants = [0, 2, 3, 6, 8, 11, 12, 13, 14, 15];
	let v = $state(14);
	const SWITCHER = false; // the floating 0–15 picker and its arrow/number keys

	// TEMP: sliders for tuning the nav logo; set TUNER to false (or delete) once the values are picked
	const TUNER = false;
	const logoDefaults = { size: 18, weight: 460, tracking: 0.015 };
	let logo = $state({ ...logoDefaults });
	let copied = $state(false);
	async function copyLogo() {
		await navigator.clipboard.writeText(
			`size ${logo.size}px · weight ${logo.weight} · letter-spacing ${logo.tracking}em`
		);
		copied = true;
		setTimeout(() => (copied = false), 1400);
	}

	// from the top the nav scrolls off with the page; once it's gone, a scroll up pins it back in
	// and a scroll down slides it away again
	const NAV_H = 64;
	let navOff = $state(0); // how far the unpinned nav has scrolled off, 0 to NAV_H
	let navPinned = $state(false);
	let lastY = 0;
	// jumping within the page (contents, citation numbers) scrolls up too, but that isn't the
	// reader asking for the nav: keep it away until the jump's scrolling has settled
	let navLocked = false;
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let unlock;
	function holdNav() {
		navLocked = true;
		navPinned = false;
		clearTimeout(unlock);
		unlock = setTimeout(() => (navLocked = false), 200);
	}
	/** @param {MouseEvent} e */
	function onclick(e) {
		if (e.target instanceof Element && e.target.closest('a[href^="#"]')) holdNav();
	}

	function onscroll() {
		const y = Math.max(0, scrollY);
		const d = y - lastY;
		navOff = Math.min(y, NAV_H);
		if (navLocked) {
			lastY = y;
			holdNav(); // still moving: push the unlock back
			return;
		}
		if (y === 0) navPinned = false;
		else if (y >= NAV_H && d < -4) navPinned = true;
		else if (y >= NAV_H && d > 4) navPinned = false;
		if (y === 0 || Math.abs(d) > 4) lastY = y;
	}

	onMount(() => {
		const q = new URLSearchParams(location.search).get('v');
		if (q !== null && variants.includes(Number(q))) v = Number(q);
	});

	/** @param {KeyboardEvent} e */
	function onkeydown(e) {
		// the numbers have gaps, so arrows step through the list rather than doing arithmetic on v
		const i = variants.indexOf(v);
		if (e.key === 'ArrowRight') v = variants[(i + 1) % variants.length];
		else if (e.key === 'ArrowLeft') v = variants[(i - 1 + variants.length) % variants.length];
		else if (/^\d$/.test(e.key) && variants.includes(Number(e.key))) v = Number(e.key);
	}
</script>

<svelte:head>
	<title>Speakrail · Your ASR already knows when you're done talking</title>
</svelte:head>

<svelte:window onkeydown={SWITCHER ? onkeydown : undefined} {onscroll} {onclick} />

{#snippet hfLogo(/** @type {number} */ size)}
	<!-- placeholder mark — swap for the official Hugging Face logo -->
	<svg class="hf-logo" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
		<circle cx="20" cy="20" r="20" fill="#ffd21e" />
		<circle cx="14" cy="17" r="2.2" fill="#3a3b45" />
		<circle cx="26" cy="17" r="2.2" fill="#3a3b45" />
		<path
			d="M13 24c2 3 4.5 4.5 7 4.5s5-1.5 7-4.5"
			fill="none"
			stroke="#3a3b45"
			stroke-width="2.2"
			stroke-linecap="round"
		/>
	</svg>
{/snippet}

<nav
	class="site"
	class:pinned={navPinned}
	class:glide={navOff === NAV_H}
	style:--nav-off={navPinned ? 0 : navOff}
	aria-label="Site"
>
	<a
		class="home"
		href={resolve('/')}
		style:--wm-weight={logo.weight}
		style:--wm-tracking="{logo.tracking}em"><Experiment id={41} size={logo.size} /></a
	>
	<span class="links">
		<a href="https://huggingface.co/speakrail">Hugging Face</a>
		<a href="https://github.com/speakrail/speakrail">GitHub</a>
	</span>
</nav>

<main class="post">
	<header>
		<p class="eyebrow">
			<time datetime="2026-11-01T08:37Z"
				>Nov 1, 2026<span class="clock">&nbsp;at 8:37 UTC</span></time
			>
			by
			<a class="handle" href="https://x.com/danil_rootint"
				><span class="xlogo"><XLogo /></span>@danil_rootint</a
			>
		</p>
		<h1 class:bare={v === 0}>Your ASR already knows when you're done talking</h1>
	</header>

	{#if v !== 0}
		<div class="extras">
			{#if v === 2}
				<!-- B · numbers + link row -->
				<div class="lede">
					<p class="label accent">TL;DR</p>
					<p>
						Bolt a tiny head onto layer 11 of Voxtral Realtime's decoder and it learns when you've
						finished talking, without costing any WER.
					</p>
				</div>

				<div class="stats">
					<div class="stat">
						<span class="value">11</span><span>decoder layer the head reads</span>
					</div>
					<div class="stat">
						<span class="value">±0</span><span>WER change vs. the base model</span>
					</div>
					<div class="stat"><span class="value">XX ms</span><span>turn decision latency</span></div>
				</div>

				<nav class="buttons" aria-label="Resources">
					<a
						class="btn primary"
						href="https://huggingface.co/speakrail/Voxtral-Mini-4B-Realtime-2602-TurnHead"
						>{@render hfLogo(20)} Get the weights <ArrowUpRight /></a
					>
					<a
						class="btn"
						href="https://huggingface.co/speakrail/Voxtral-Mini-4B-Realtime-2602-TurnHead"
						><GraphUp /> Benchmarks</a
					>
					<a class="btn" href="https://github.com/speakrail/speakrail"><Github /> GitHub</a>
					<a class="btn" href={resolve('/')}><Play /> Try Speakrail</a>
				</nav>
			{:else if v === 3}
				<!-- C · resource cards + contents -->
				<nav class="resources" aria-label="Resources">
					<a href="https://huggingface.co/speakrail/Voxtral-Mini-4B-Realtime-2602-TurnHead">
						<span class="label">Weights <ArrowUpRight /></span>
						<span class="title">Hugging Face</span>
						<span class="sub">{repo}</span>
					</a>
					<a href="https://huggingface.co/speakrail/Voxtral-Mini-4B-Realtime-2602-TurnHead">
						<span class="label">Results <ArrowUpRight /></span>
						<span class="title">Benchmarks</span>
						<span class="sub">WER + turn latency</span>
					</a>
					<a href="https://github.com/speakrail/speakrail">
						<span class="label">Run it <ArrowUpRight /></span>
						<span class="title">Speakrail</span>
						<span class="sub">github.com/speakrail</span>
					</a>
				</nav>

				<p class="tldr-line">
					<span class="tag">TL;DR</span>
					<span
						>A small head on layer 11 of Voxtral Realtime's decoder predicts the end of your turn,
						with no loss in WER.</span
					>
				</p>

				<nav class="toc" aria-label="In this post">
					<p class="label">In this post</p>
					<ol>
						{#each contents as item, i (item)}
							<li><a href="#section-{i + 1}">{item}</a></li>
						{/each}
					</ol>
				</nav>
			{:else if v === 6}
				<SideMeta />
			{:else if v === 8}
				<Listen />
			{:else if v === 11}
				<Spectrum />
			{:else if v === 12}
				<Architecture />
			{:else if v === 13}
				<Contour />
			{:else if v === 14}
				<CtaLinks />
				<Pipeline />
				<Tldr />
			{:else if v === 15}
				<CtaLinks />
				<Tldr />
			{/if}
		</div>
	{/if}

	<!-- TEMP: placeholder sections to see the headings and the contents rail -->
	<div class="body">
		<!-- the contents pin 24px below where the nav sits, so they stay put when it slides in -->
		<div class="rail left"><Outline {reading} top={NAV_H + 24} /></div>
		<!-- margin notes sit beside the sentences that cite them -->
		<div class="rail right"><SourceNotes {sources} /></div>
		<article class="prose">
			<h2>Why turn-taking is important</h2>
			<p>
				Voxtral Realtime is a 4B-parameter model trained end-to-end for streaming speech
				recognition, and at a 480&nbsp;ms delay it is competitive with the leading realtime
				transcription APIs.<Cite
					source={sources['voxtral-realtime']}
					note="At a 480 ms delay it's on par with Scribe v2 Realtime and Whisper; at 960 ms it matches or beats offline models such as Voxtral Mini Transcribe V2. TEST, a deliberately long note: it is a 4B-parameter model that supports 13 languages, ships under Apache 2.0, and is trained for streaming from the start rather than adapted from an offline model with chunking."
				/>
			</p>
			<p>
				Voxtral Realtime builds on Delayed Streams Modeling.<Cite
					source={sources['dsm']}
					note="TEST: placed right under a long note, so it has to move down to clear it."
				/>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
				et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
				ut aliquip ex ea commodo consequat.
			</p>
			<p>
				Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
				pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
				mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem
				accusantium doloremque laudantium.
			</p>

			<h2>Why everything sucks</h2>
			<p>
				Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
				consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam
				est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
			</p>
			<p>
				Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam,
				nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea
				voluptate velit esse quam nihil molestiae consequatur.
			</p>
			<figure>
				<img
					src={sampleLatency}
					width="1392"
					height="560"
					alt="Two histograms of reply latency: the turn head clusters around 230 ms, a silence timer around 720 ms"
				/>
				<figcaption>
					Reply latency over 4,000 turns. Pink: the turn head. Grey: a 700 ms silence timer. Sample
					data.
				</figcaption>
			</figure>
			<p>
				At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
				voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati
				cupiditate non provident.
			</p>

			<h2>Why turn-taking sucks</h2>
			<p>
				Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
				Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta
				nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere
				possimus.
			</p>
			<p>
				Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut
				et voluptates repudiandae sint et molestiae non recusandae.
			</p>

			<h2>Fixing gaps</h2>
			<p>
				Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores
				alias consequatur aut perferendis doloribus asperiores repellat. Lorem ipsum dolor sit amet,
				consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
			</p>
			<figure>
				<img
					src={sampleSpectrogram}
					width="1392"
					height="720"
					alt="Spectrogram of two spoken phrases separated by a pause, with a dashed line where the turn ends"
				/>
				<figcaption>
					Two phrases with a breath between them. The dashed line is where the head calls the turn;
					the pause in the middle doesn't fool it. Sample image.
				</figcaption>
			</figure>
			<p>
				Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae
				consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. Ut enim ad minim
				veniam, quis nostrud exercitation ullamco laboris.
			</p>
			<p>
				Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
				anim id est laborum.
			</p>

			<h2>Deployment</h2>
			<p>
				Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
				laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
				architecto beatae vitae dicta sunt explicabo.
			</p>
			<p>
				Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
				velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam
				quaerat voluptatem.
			</p>
		</article>

		<!-- the full list; on narrow screens (no rail) this is where the numbers lead -->
		<section class="bibliography" aria-label="Sources">
			<p class="bib-title">Sources</p>
			<ol>
				{#each Object.values(sources) as s (s.id)}
					<li id="source-{s.id}">
						<span class="bib-n">{s.n}</span>
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external source URL -->
						<span>{s.authors} <a href={s.url}>{s.title}</a>. {s.venue}, {s.year}.</span>
					</li>
				{/each}
			</ol>
		</section>
	</div>
</main>

{#if TUNER}
	<aside class="tuner" aria-label="Logo tuner">
		<p class="tuner-title">Logo</p>
		<label>
			<span>Size <output>{logo.size}px</output></span>
			<input type="range" min="10" max="32" step="0.5" bind:value={logo.size} />
		</label>
		<label>
			<span>Weight <output>{logo.weight}</output></span>
			<input type="range" min="100" max="900" step="10" bind:value={logo.weight} />
		</label>
		<label>
			<span>Letter spacing <output>{logo.tracking.toFixed(3)}em</output></span>
			<input type="range" min="-0.08" max="0.2" step="0.005" bind:value={logo.tracking} />
		</label>
		<div class="tuner-actions">
			<button onclick={() => (logo = { ...logoDefaults })}>Reset</button>
			<button onclick={copyLogo}>{copied ? 'Copied' : 'Copy values'}</button>
		</div>
	</aside>
{/if}

{#if SWITCHER}
	<nav class="ab" aria-label="Header variant">
		{#each variants as n (n)}
			<button class:on={v === n} aria-pressed={v === n} onclick={() => (v = n)}>{n}</button>
		{/each}
	</nav>
{/if}

<style>
	/* 696px = the 12-column Figma grid (36px columns, 24px gutters) */
	.post {
		--edge: rgb(252 245 247 / 0.1);
		width: min(100% - 2 * var(--gutter), 43.5rem);
		margin-inline: auto;
		padding-block: var(--s8) var(--s9); /* + the 64px nav = the old 128px above the eyebrow */
	}

	/* site nav: the #28 "stream" wordmark home, two plain text links */
	.site {
		--fg: var(--text);
		--acc: var(--accent);
		--bg: var(--surface-0);
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 64px;
		/* full-width bar, content on the same 76rem column as the post */
		padding-inline: max(var(--gutter), (100% - 76rem) / 2);
		background: var(--surface-0);
		transform: translateY(calc(var(--nav-off, 0) * -1px));
	}
	.site:focus-within {
		transform: none;
	}
	.site.pinned {
		box-shadow: inset 0 -1px 0 var(--grid);
	}
	/* animate only the pin/unpin below the fold; near the top it follows the scroll 1:1 */
	.site.glide {
		transition: transform 240ms cubic-bezier(0.2, 0, 0, 1);
	}
	@media (prefers-reduced-motion: reduce) {
		.site.glide {
			transition: none;
		}
	}
	.home {
		display: flex;
	}
	.links {
		display: flex;
		gap: var(--s5);
	}
	.links a {
		font-size: var(--fs-ui);
		color: var(--muted);
		transition: color var(--dur);
	}
	.links a:hover {
		color: var(--text);
	}

	/* header and variant paragraphs; the article below keeps .prose spacing */
	.post :is(header, .extras) p {
		margin: 0;
		line-height: 1.8;
	}

	/* contents in the left margin, sources in the right; as tall as the article so they can stick */
	.body {
		position: relative;
	}
	.rail {
		position: absolute;
		top: 0; /* the first heading's top margin collapses through .body, so 0 is level with it */
		bottom: 0;
		z-index: 8; /* above the edge tints (5) so they stay crisp, under the nav (10) */
	}
	/* each rail takes what the margin has room for (minus the gap and the page gutter), up to its
	   max; both hide together once that drops under 11rem */
	.rail.left {
		right: calc(100% + var(--s8));
		width: clamp(11rem, (100vw - 100%) / 2 - var(--s8) - var(--gutter), 13rem);
	}
	.rail.right {
		left: calc(100% + var(--s8));
		width: clamp(11rem, (100vw - 100%) / 2 - var(--s8) - var(--gutter), 15rem);
	}
	@media (max-width: 76rem) {
		.rail {
			display: none;
		}
	}
	.prose p {
		line-height: 1.8;
	}
	.prose h2 {
		margin-bottom: var(--s6);
		/* a jump from the contents lands the heading clear of the nav */
		scroll-margin-top: calc(64px + var(--s6));
	}
	.bibliography {
		margin-top: var(--s8);
		padding-top: var(--s5);
		box-shadow: inset 0 1px 0 var(--grid);
	}
	.bib-title {
		margin: 0 0 var(--s3);
		font: 400 var(--fs-caption) / 1.4 var(--font-mono);
		color: var(--chart-grey);
	}
	.bibliography ol {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.bibliography li {
		display: flex;
		gap: var(--s3);
		font-size: var(--fs-small);
		line-height: 1.6;
		color: var(--muted);
		scroll-margin-top: calc(64px + var(--s6));
	}
	.bib-n {
		flex: none;
		font-family: var(--font-mono);
		color: var(--accent);
	}
	.prose figure {
		margin-block: var(--s6);
	}
	.prose img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: var(--radius-lg);
	}
	/* matches the caption under the pipeline animation */
	.prose figcaption {
		margin-top: var(--s3);
		font: 400 var(--fs-caption) / 1.5 var(--font-mono);
		color: var(--muted);
	}

	.eyebrow {
		font-family: var(--font-mono);
		font-size: var(--fs-small);
		font-weight: 400;
		color: var(--muted);
	}
	/* hovering the date slides the time out; mono, so " at 8:37 UTC" is exactly 12ch */
	.clock {
		display: inline-block;
		width: 0;
		overflow: hidden;
		vertical-align: bottom;
		white-space: pre;
		transition: width 250ms ease-out;
	}
	time:hover .clock {
		width: 12ch;
	}
	time:hover {
		color: var(--body);
	}
	/* the handle links to X; hovering slides the X logo in front of it */
	.handle {
		color: inherit;
		transition: color var(--dur);
	}
	.xlogo {
		display: inline-flex;
		align-items: center;
		width: 0;
		overflow: hidden;
		vertical-align: -0.2em;
		transition: width 250ms ease-out;
	}
	.handle:hover .xlogo,
	.handle:focus-visible .xlogo {
		width: 1.5em; /* the 1.2em icon + a little gap */
	}
	.handle:hover,
	.handle:focus-visible {
		color: var(--body);
	}
	@media (prefers-reduced-motion: reduce) {
		.clock,
		.xlogo {
			transition: none;
		}
	}

	h1 {
		margin: var(--s4) 0 calc(var(--s5) + var(--s4)); /* 40px, between steps on the scale */
		font-size: clamp(2rem, 1.2rem + 3.5vw, 2.75rem);
		font-weight: 500;
		line-height: 1.4;
	}
	h1.bare {
		margin-bottom: var(--s9);
	}

	.extras {
		display: flex;
		flex-direction: column;
		gap: var(--s6);
		margin-bottom: var(--s8);
	}

	a {
		text-decoration: none;
	}

	/* small mono overline used across variants */
	.label {
		font: 400 var(--fs-caption) / 1.4 var(--font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.label.accent {
		font-weight: 500;
		color: var(--accent);
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: var(--s2);
		height: var(--control-h);
		padding-inline: 18px;
		border-radius: 999px;
		font: var(--w-ui-strong) var(--fs-ui) / 1 var(--font-ui);
		color: var(--body);
		box-shadow: inset 0 0 0 1px rgb(252 245 247 / 0.16);
		white-space: nowrap;
		transition:
			background var(--dur),
			color var(--dur);
	}
	.btn :global(svg:not(.hf-logo)) {
		color: var(--muted);
	}
	.btn.primary {
		background: var(--accent);
		color: var(--on-accent);
		box-shadow: none;
	}
	.btn.primary :global(svg) {
		color: var(--on-accent);
	}
	a.btn:hover {
		background: var(--surface-2);
		color: var(--text);
	}
	a.btn.primary:hover {
		background: var(--accent-hover);
		color: var(--on-accent);
	}

	/* ---------- B ---------- */
	.lede p:last-child {
		margin-top: var(--s2);
		font-size: var(--fs-lede);
		line-height: 1.5;
		color: var(--text);
	}
	.stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--s4);
	}
	.stat {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 20px;
		border-radius: var(--radius-lg);
		background: var(--surface-1);
		box-shadow: inset 0 0 0 1px var(--edge);
		font-size: var(--fs-small);
		line-height: 1.4;
		color: var(--muted);
	}
	.stat .value {
		font: 500 2rem / 1.2 var(--font-mono);
		color: var(--text);
	}
	.buttons {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s3);
	}

	/* ---------- C ---------- */
	.resources {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--s5);
	}
	.resources a {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 20px;
		border-radius: var(--radius-lg);
		background: var(--surface-1);
		box-shadow: inset 0 0 0 1px var(--edge);
		transition: background var(--dur);
	}
	.resources a:hover {
		background: var(--surface-2);
	}
	.resources .label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 6px;
	}
	.resources .label :global(svg) {
		font-size: 18px;
		color: var(--accent);
	}
	.resources .title {
		font-size: 1.0625rem;
		font-weight: 500;
		line-height: 1.3;
		color: var(--text);
	}
	.resources .sub {
		overflow-wrap: anywhere;
		font: 400 var(--fs-caption) / 1.4 var(--font-mono);
		color: var(--muted);
	}

	.post .tldr-line {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		line-height: 1.6;
	}
	.tag {
		flex: none;
		margin-top: 2px;
		padding: 4px 10px;
		border-radius: 999px;
		background: var(--accent-wash);
		font: 500 var(--fs-caption) / 1.2 var(--font-mono);
		letter-spacing: 0.08em;
		color: var(--accent);
	}

	.toc ol {
		margin: var(--s2) 0 0;
		padding: 0;
		list-style: none;
		counter-reset: item;
	}
	.toc li {
		counter-increment: item;
		border-bottom: 1px solid var(--grid);
	}
	.toc a {
		display: flex;
		gap: var(--s4);
		padding-block: var(--s3);
		font-size: 1rem;
		line-height: 1.5;
		color: var(--body);
		transition: color var(--dur);
	}
	.toc a::before {
		content: counter(item, decimal-leading-zero);
		font: 400 var(--fs-small) / 1.7 var(--font-mono);
		color: var(--accent);
	}
	.toc a:hover {
		color: var(--text);
	}

	@media (max-width: 40rem) {
		.stats,
		.resources {
			grid-template-columns: 1fr;
		}
	}

	/* the full-bleed animation band (100vw includes the scrollbar) must not cause sideways scroll */
	:global(html) {
		overflow-x: clip;
	}

	/* ---------- TEMP logo tuner ---------- */
	.tuner {
		position: fixed;
		right: var(--s4);
		bottom: var(--s4);
		z-index: 10;
		display: flex;
		flex-direction: column;
		gap: var(--s3);
		width: 15rem;
		padding: var(--s4);
		border-radius: var(--radius-lg);
		background: var(--surface-3);
		box-shadow: var(--ring-3), var(--shadow-3);
		font-size: var(--fs-small);
	}
	.tuner-title {
		font: 500 var(--fs-caption) / 1.4 var(--font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.tuner label {
		display: flex;
		flex-direction: column;
		gap: var(--s1);
		color: var(--body);
	}
	.tuner label span {
		display: flex;
		justify-content: space-between;
	}
	.tuner output {
		font: 400 var(--fs-caption) / 1.4 var(--font-mono);
		font-variant-numeric: tabular-nums;
		color: var(--muted);
	}
	.tuner input {
		width: 100%;
		accent-color: var(--accent);
	}
	.tuner-actions {
		display: flex;
		gap: var(--s2);
	}
	.tuner-actions button {
		flex: 1;
		height: 32px;
		border: 0;
		border-radius: 999px;
		background: var(--surface-4);
		color: var(--body);
		font: inherit;
		cursor: pointer;
	}
	.tuner-actions button:hover {
		color: var(--text);
	}

	/* ---------- TEMP variant switcher ---------- */
	.ab {
		position: fixed;
		width: max-content;
		max-width: calc(100% - 2 * var(--s4));
		overflow-x: auto;
		scrollbar-width: none;
		left: 50%;
		bottom: var(--s5);
		translate: -50% 0;
		display: flex;
		gap: var(--s1);
		padding: var(--s1);
		border-radius: 999px;
		background: var(--surface-3);
		box-shadow: var(--ring-3), var(--shadow-3);
	}
	.ab button {
		flex: none;
		width: 40px;
		height: 40px;
		border: 0;
		border-radius: 999px;
		background: none;
		color: var(--muted);
		font: var(--w-ui-strong) var(--fs-ui) / 1 var(--font-mono);
		cursor: pointer;
		transition:
			background var(--dur),
			color var(--dur);
	}
	.ab button:hover {
		background: var(--surface-4);
		color: var(--text);
	}
	.ab button.on {
		background: var(--accent);
		color: var(--on-accent);
	}
</style>
