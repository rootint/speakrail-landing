<script>
	import { resolve } from '$app/paths';
	import NavArrowRight from '~icons/iconoir/nav-arrow-right';
	import MissionArt from '#lib/home/MissionArt.svelte';
	import RepoCta from '#lib/post/RepoCta.svelte';
	import SiteFooter from '#lib/post/SiteFooter.svelte';
	import SiteNav from '#lib/post/SiteNav.svelte';
	import { splitLinks } from '#lib/post/inline-links.js';
	import { MISSION, ORIGIN } from '#lib/site.js';

	/** @type {{ data: { posts: import('#lib/post/posts.server.js').PostSummary[] } }} */
	let { data } = $props();

	// what search results and link previews show for the home page
	const DESCRIPTION =
		'At Speakrail, we build local speech-to-speech pipelines that run entirely on your own GPU, plus research on turn-taking, latency and open speech models.';

	// structured data: the site and the organisation behind it
	const ld = JSON.stringify([
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: 'Speakrail',
			url: `${ORIGIN}/`,
			description: DESCRIPTION
		},
		{
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: 'Speakrail',
			url: `${ORIGIN}/`,
			sameAs: ['https://github.com/speakrail', 'https://huggingface.co/speakrail']
		}
	]).replaceAll('<', '\\u003c');

	const day = (/** @type {string} */ d) =>
		new Date(d).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			timeZone: 'UTC'
		});
</script>

<svelte:head>
	<title>Speakrail</title>
	<meta name="description" content={DESCRIPTION} />
	<meta property="og:title" content="Speakrail" />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{ORIGIN}/" />
	<meta property="og:site_name" content="Speakrail" />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- our own constants, with < escaped -->
	{@html `<script type="application/ld+json">${ld}</` + `script>`}
</svelte:head>

<div class="page">
	<SiteNav clear />

	<!-- outside the text column: the drawing runs the full width of the window, up behind the nav -->
	<MissionArt />

	<main class="home">
		<p class="mission">
			{#each splitLinks(MISSION) as part, i (i)}{#if 'href' in part}<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external link in the mission text -->
					<a href={part.href} target="_blank" rel="noreferrer">{part.label}</a
					>{:else}{part.text}{/if}{/each}
		</p>

		<section class="blog" aria-labelledby="blog-title">
			<h2 id="blog-title">Blog</h2>
			<p class="sub">Read our latest news</p>

			<ol class="posts">
				{#each data.posts as p (p.slug)}
					<li>
						<a class="post-link" href={resolve('/[slug]', { slug: p.slug })}>
							<span class="post-text">
								<time datetime={new Date(p.date).toISOString()}>{day(p.date)}</time>
								<span class="post-title">{p.title}</span>
							</span>
							<span class="go" aria-hidden="true"><NavArrowRight /></span>
						</a>
					</li>
				{/each}
			</ol>
		</section>

		<!-- the same card that ends every post -->
		<div class="repo"><RepoCta /></div>
	</main>

	<SiteFooter />
</div>

<style>
	/* the footer sits at the bottom of the window even when the page is short */
	.page {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
	}
	.home {
		flex: 1;
	}
	/* same column as a post */
	.home {
		width: min(100% - 2 * var(--gutter), 43.5rem);
		margin-inline: auto;
		padding-block: 0 var(--s9); /* the drawing above brings its own space */
	}
	p {
		margin: 0;
	}
	.mission {
		font-size: var(--fs-body);
		line-height: 1.8;
		color: var(--text);
	}

	.blog {
		margin-top: var(--s9);
	}
	.repo {
		margin-top: var(--s8);
	}
	h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 500;
	}
	.sub {
		margin-top: var(--s1);
		font-size: var(--fs-small);
		color: var(--muted);
	}

	/* one post per row, a hairline between rows */
	.posts {
		margin: var(--s5) 0 0;
		padding: 0;
		list-style: none;
	}
	.posts li + li {
		box-shadow: inset 0 1px 0 var(--grid);
	}
	.post-link {
		display: flex;
		align-items: center;
		gap: var(--s5);
		padding-block: var(--s5);
		text-decoration: none;
	}
	.post-text {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--s1);
	}
	/* a small chevron on the right fades in on hover: this row is a link */
	.go {
		display: flex;
		font-size: 0.875rem;
		color: var(--accent-hover);
		opacity: 0;
		translate: -4px 0;
		transition:
			opacity var(--dur),
			translate 200ms ease-out;
	}
	.post-link:hover .go,
	.post-link:focus-visible .go {
		opacity: 1;
		translate: 0 0;
	}
	@media (prefers-reduced-motion: reduce) {
		.go {
			translate: 0 0;
		}
	}
	time {
		font: 400 var(--fs-small) / 1.4 var(--font-mono);
		color: var(--muted);
	}
	.post-title {
		font-size: 1.125rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--text);
		transition: color var(--dur);
	}
	.post-link:hover .post-title {
		color: var(--accent-hover);
	}
</style>
