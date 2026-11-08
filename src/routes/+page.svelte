<script>
	import { resolve } from '$app/paths';
	import NavArrowRight from '~icons/iconoir/nav-arrow-right';
	import SiteFooter from '#lib/post/SiteFooter.svelte';
	import SiteNav from '#lib/post/SiteNav.svelte';
	import { MISSION } from '#lib/site.js';

	/** @type {{ data: { posts: import('#lib/post/posts.server.js').PostSummary[] } }} */
	let { data } = $props();

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
</svelte:head>

<div class="page">
	<SiteNav />

	<main class="home">
		<p class="mission">{MISSION}</p>

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
		padding-block: var(--s8) var(--s9);
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
