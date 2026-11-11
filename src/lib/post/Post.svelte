<!-- The frame every post renders in: nav, date + author, title, the post's own top section, then the
     markdown body with the contents on the left, margin notes on the right and the sources at the end.
     `metadata` is the post's frontmatter (see src/posts/README.md). -->
<script>
	import { onMount, setContext } from 'svelte';
	import { on } from 'svelte/events';
	import { resolve } from '$app/paths';
	import NavArrowLeft from '~icons/iconoir/nav-arrow-left';
	import NavArrowRight from '~icons/iconoir/nav-arrow-right';
	import ArrowUp from '~icons/iconoir/arrow-up';
	import XLogo from '~icons/iconoir/x';
	import CiteSheet from './CiteSheet.svelte';
	import Outline from './Outline.svelte';
	import RepoCta from './RepoCta.svelte';
	import { Reading } from './reading.svelte.js';
	import SiteFooter from './SiteFooter.svelte';
	import SiteNav from './SiteNav.svelte';
	import SourceNotes from './SourceNotes.svelte';
	import { onScrollFrame } from './scroll-frame.js';
	import { defineSources } from './sources.js';
	import TocFab from './toc/TocFab.svelte';
	import { onUserScroll } from './user-scroll.js';

	/**
	 * @typedef {{
	 *   title: string,
	 *   description?: string,
	 *   date: string,
	 *   author?: string,
	 *   tldr?: string,
	 *   sources?: import('./sources.js').SourceInput[]
	 * }} Metadata
	 */

	/** @typedef {import('./posts.server.js').PostSummary | null} Neighbour */
	/** @type {{ slug: string, metadata: Metadata, Content: import('svelte').Component, Top?: import('svelte').Component | null, older?: Neighbour, newer?: Neighbour }} */
	let { slug, metadata, Content, Top = null, older = null, newer = null } = $props();

	// read once: a post's frontmatter doesn't change while it's on screen
	const { title, description, date, author } = metadata;
	const sources = defineSources(metadata.sources ?? []);
	// narrow screens show a citation's source in a bottom sheet instead of the margin
	/** @type {CiteSheet | undefined} */
	let sheet = $state();
	setContext('post', {
		slug,
		sources,
		showSource: (/** @type {import('./sources.js').Source} */ s, /** @type {string} */ note) =>
			sheet?.show(s, note)
	});

	const reading = new Reading('article h2');

	const when = new Date(date);
	const day = when.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC'
	});
	const clock = ` at ${when.getUTCHours()}:${String(when.getUTCMinutes()).padStart(2, '0')} UTC`;
	const NAV_H = 64;

	// how much of the page has been scrolled through, 0 to 1, for the bar at the very top
	let progress = $state(0);
	// the back-to-top button shows once the reader is a screen down, and rides up with the footer
	// so it never sits on top of it
	let deep = $state(false);
	let lift = $state(0);
	onMount(() => {
		const foot = document.querySelector('footer.foot');
		return onScrollFrame(() => {
			const scrollable = document.documentElement.scrollHeight - innerHeight;
			progress = scrollable > 0 ? Math.min(1, Math.max(0, scrollY / scrollable)) : 0;
			deep = scrollY > innerHeight;
			lift = foot ? Math.max(0, innerHeight - foot.getBoundingClientRect().top) : 0;
		});
	});
	// the glide up is the reader's to stop: scrolling of their own cuts it short where it is and the
	// page is theirs again, instead of being dragged on to the top
	/** @type {(() => void) | undefined} */
	let endGlide;
	function toTop() {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return scrollTo({ top: 0 });
		endGlide?.();
		scrollTo({ top: 0, behavior: 'smooth' });
		const offInput = onUserScroll(() => {
			endGlide?.();
			scrollTo({ top: scrollY, behavior: 'instant' }); // a new scroll cancels the smooth one
		});
		const offEnd = on(window, 'scrollend', () => endGlide?.());
		endGlide = () => {
			offInput();
			offEnd();
			endGlide = undefined;
		};
	}
	$effect(() => () => endGlide?.());

	// what reader modes and search engines read for the title, author and date: the <title> carries
	// the site name, so the bare title goes in og:title and all three in schema.org's BlogPosting
	const ld = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: title,
		description,
		datePublished: when.toISOString(),
		author: author
			? { '@type': 'Person', name: `@${author}`, url: `https://x.com/${author}` }
			: undefined
	}).replaceAll('<', '\\u003c');
</script>

<svelte:head>
	<title>{title}</title>
	{#if description}<meta name="description" content={description} />{/if}
	<meta property="og:title" content={title} />
	<meta property="og:type" content="article" />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- our own frontmatter, with < escaped -->
	{@html `<script type="application/ld+json">${ld}</` + `script>`}
</svelte:head>

<div class="progress" style:--p={progress} aria-hidden="true"></div>

<!-- data-jump: the nav treats it like an in-page link and stays away while it scrolls up -->
<button
	type="button"
	class="to-top"
	class:shown={deep}
	style:--lift="{lift}px"
	tabindex={deep ? 0 : -1}
	aria-label="Back to top"
	data-jump
	onclick={toTop}><ArrowUp /></button
>

<SiteNav />

<main class="post">
	<header>
		<p class="eyebrow">
			<time datetime={when.toISOString()}
				>{day}<span class="clock" style:--w="{clock.length}ch">{clock}</span></time
			>
			{#if author}
				by
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external profile -->
				<a class="handle" href="https://x.com/{author}" target="_blank" rel="author noreferrer"
					><span class="xlogo"><XLogo /></span>@{author}</a
				>
			{/if}
		</p>
		<h1>{title}</h1>
	</header>

	{#if Top}
		<div class="top"><Top {metadata} /></div>
	{/if}

	<div class="body">
		<!-- the contents pin 24px below where the nav sits, so they stay put when it slides in -->
		<div class="rail left"><Outline {reading} top={NAV_H + 24} /></div>
		<!-- margin notes sit beside the sentences that cite them -->
		<div class="rail right"><SourceNotes {sources} /></div>

		<article class="prose"><Content /></article>

		{#if Object.keys(sources).length}
			<!-- the full list; on narrow screens (no rails) this is where the numbers lead -->
			<section class="bibliography" aria-label="Sources">
				<p class="bib-title">Sources</p>
				<ol>
					{#each Object.values(sources) as s (s.id)}
						<li id="source-{s.id}">
							<span class="bib-n">{s.n}</span>
							<span>
								{s.authors}
								<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external source URL -->
								<a href={s.url} target="_blank" rel="noreferrer">{s.title}</a>. {s.venue}, {s.year}.
							</span>
						</li>
					{/each}
				</ol>
			</section>
		{/if}
	</div>

	<div class="end"><RepoCta /></div>

	{#if older || newer}
		<!-- previous = the older post, next = the newer one; an empty cell keeps "next" on the right -->
		<nav class="pager" aria-label="More posts">
			{#if older}
				<a class="turn prev" href={resolve('/[slug]', { slug: older.slug })}>
					<span class="dir"><NavArrowLeft /> Previous</span>
					<span class="turn-title">{older.title}</span>
				</a>
			{:else}<span></span>{/if}
			{#if newer}
				<a class="turn next" href={resolve('/[slug]', { slug: newer.slug })}>
					<span class="dir">Next <NavArrowRight /></span>
					<span class="turn-title">{newer.title}</span>
				</a>
			{/if}
		</nav>
	{/if}
</main>

<SiteFooter />

<CiteSheet bind:this={sheet} />

<!-- narrow screens have no contents rail: a round button in the other corner opens them instead -->
<TocFab {reading} {lift} />

<style>
	/* full-bleed figures (100vw) mustn't make the page scroll sideways */
	:global(html) {
		overflow-x: clip;
	}

	/* reading progress: a thin pink line across the very top, above the nav and the edge tints */
	.progress {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 11;
		height: 2px;
		background: var(--accent);
		transform: scaleX(var(--p));
		transform-origin: left;
	}

	/* bottom-left, fades in once the reader is a screen down */
	.to-top {
		position: fixed;
		left: var(--s5);
		bottom: calc(var(--s5) + var(--lift, 0px));
		z-index: 9; /* over the edge tint (5), under the nav (10) */
		display: grid;
		place-items: center;
		width: 48px; /* the same as the contents button in the other corner */
		height: 48px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		font-size: 1.1rem;
		color: var(--muted);
		background: var(--surface-2);
		box-shadow: var(--ring-2), var(--shadow-2);
		cursor: pointer;
		opacity: 0;
		pointer-events: none;
		translate: 0 8px;
		transition:
			opacity 200ms,
			translate 200ms ease-out,
			color var(--dur),
			background var(--dur);
	}
	.to-top.shown {
		opacity: 1;
		pointer-events: auto;
		translate: 0 0;
	}
	/* real hover only: on a touch screen :hover sticks to the last thing tapped, so the button would
	   stay lit after a tap and go dark again on the next tap elsewhere */
	@media (hover: hover) {
		.to-top:hover {
			color: var(--text);
			background: var(--surface-3);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.to-top {
			translate: 0 0;
		}
	}

	/* registered so it animates, and so full-bleed children inherit each in-between value */
	@property --shift {
		syntax: '<length>';
		inherits: true;
		initial-value: 0px;
	}

	/* 696px = the 12-column Figma grid (36px columns, 24px gutters) */
	.post {
		width: min(100% - 2 * var(--gutter), 43.5rem);
		margin-inline: auto;
		padding-block: var(--s8) var(--s9); /* + the 64px nav = 128px above the eyebrow */
		/* centred, but slid left by --shift on tablets; full-bleed children slide back by the same */
		translate: var(--shift) 0;
		transition: --shift 400ms cubic-bezier(0.2, 0, 0, 1);
	}
	@media (prefers-reduced-motion: reduce) {
		.post {
			transition: none;
		}
	}
	/* tablets: no contents, but the notes stay beside the text. The column narrows if it has to so
	   column + gap + notes fit between the gutters, and slides left so the three sit centred as a
	   group, ending on the left gutter */
	@media (min-width: 48.0625rem) and (max-width: 76rem) {
		.post {
			--rail: clamp(11rem, 100vw - 43.5rem - var(--s8) - 2 * var(--gutter), 15rem);
			--shift: calc((var(--s8) + var(--rail)) / -2);
			width: min(43.5rem, 100% - 2 * var(--gutter) - var(--s8) - var(--rail));
		}
	}

	/* ---------- header ---------- */
	.eyebrow {
		margin: 0;
		font: 400 var(--fs-small) / 1.8 var(--font-mono);
		color: var(--muted);
	}
	/* hovering the date slides the time out; mono, so the time is exactly its length in ch */
	.clock {
		display: inline-block;
		width: 0;
		overflow: hidden;
		vertical-align: bottom;
		white-space: pre;
		transition: width 250ms ease-out;
	}
	time:hover .clock {
		width: var(--w);
	}
	time:hover {
		color: var(--body);
	}
	/* the handle links to X; hovering slides the X logo in front of it */
	.handle {
		color: inherit;
		text-decoration: none;
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

	/* the post's own top section (actions, a demo, a TL;DR...) */
	.top {
		display: flex;
		flex-direction: column;
		gap: var(--s6);
		margin-bottom: var(--s8);
	}

	/* ---------- body: contents on the left, notes on the right, as tall as the article ---------- */
	.body {
		position: relative;
	}
	.rail {
		position: absolute;
		top: 0; /* the first heading's top margin collapses through .body, so 0 is level with it */
		bottom: 0;
		z-index: 8; /* above the edge tints (5) so they stay crisp, under the nav (10) */
	}
	/* desktop: each rail takes what the margin has room for (minus the gap and the page gutter), up
	   to its max. Under 76rem the contents go and the notes take the room the column slid away from;
	   under 48rem (phones) the notes go too, and the numbers open a bottom sheet instead */
	.rail.left {
		right: calc(100% + var(--s8));
		width: clamp(11rem, (100vw - 100%) / 2 - var(--s8) - var(--gutter), 13rem);
	}
	.rail.right {
		left: calc(100% + var(--s8));
		width: clamp(11rem, (100vw - 100%) / 2 - var(--s8) - var(--gutter), 15rem);
	}
	@media (max-width: 76rem) {
		.rail.left {
			display: none;
		}
		.rail.right {
			width: var(--rail);
		}
	}
	@media (max-width: 48rem) {
		.rail.right {
			display: none;
		}
	}

	/* markdown content comes from the post's own component, hence :global inside the article */
	.prose :global(p) {
		line-height: 1.8;
	}
	.prose :global(h2) {
		margin-bottom: var(--s6);
		/* a jump from the contents lands the heading clear of the nav, at the same 88px the contents
		   pin at (NAV_H + 24), so jumping to the first section doesn't leave them 8px low */
		scroll-margin-top: calc(64px + var(--s5));
	}
	/* phones: less air around headings (64/32 → 48/28), still clearly more above than below so each
	   heading stays with the text it introduces */
	@media (max-width: 48rem) {
		.prose :global(h2) {
			margin-top: var(--s7);
			margin-bottom: calc(var(--s5) + var(--s1));
		}
	}
	.prose :global(figure) {
		margin-block: var(--s6);
	}
	.prose :global(figure img) {
		display: block;
		width: 100%;
		height: auto;
		border-radius: var(--radius-lg);
	}
	/* matches the caption under the pipeline animation */
	.prose :global(figcaption) {
		margin-top: var(--s3);
		font: 400 var(--fs-caption) / 1.5 var(--font-mono);
		color: var(--muted);
	}

	/* ---------- the repo call to action closes the text; previous / next stand apart below ---------- */
	.end {
		margin-top: var(--s7);
	}
	.pager {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--s4);
		margin-top: var(--s8);
	}
	@media (max-width: 36rem) {
		.pager {
			grid-template-columns: 1fr;
		}
	}
	.turn {
		display: flex;
		flex-direction: column;
		gap: var(--s2);
		padding: 20px var(--s5);
		border-radius: var(--radius-lg);
		box-shadow: inset 0 0 0 1px var(--grid);
		text-decoration: none;
		transition: background var(--dur);
	}
	.turn:hover {
		background: var(--surface-1);
	}
	.next {
		align-items: flex-end;
		text-align: right;
	}
	.dir {
		display: inline-flex;
		align-items: center;
		gap: var(--s1);
		font: 400 var(--fs-small) / 1.4 var(--font-mono);
		color: var(--muted);
	}
	.turn-title {
		font-size: 1rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--text);
		transition: color var(--dur);
	}
	.turn:hover .turn-title {
		color: var(--accent-hover);
	}

	/* ---------- sources at the end ---------- */
	.bibliography {
		margin-top: var(--s8);
		padding-top: var(--s5);
		box-shadow: inset 0 1px 0 var(--grid);
	}
	.bib-title {
		margin: 0 0 var(--s3);
		font: 400 var(--fs-caption) / 1.4 var(--font-mono);
		color: var(--dim); /* --chart-grey is for graphics (3.6:1); text needs 4.5 */
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
</style>
