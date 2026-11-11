<!-- The social preview card (og:image) for one post, at the standard 1200×630: the wordmark, the
     post's address and title, and a strip of the header's dot graphic, always in the dark theme.
     Screenshotted into src/posts/<slug>/og.png by scripts/og-images.mjs. -->
<script>
	import DecoderDots from '#lib/blog-header/DecoderDots.svelte';
	import Wordmark from '#lib/logos/Wordmark.svelte';
	import { ORIGIN } from '#lib/site.js';

	/** @type {{ data: { slug: string, title: string } }} */
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.title}: preview card</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="og">
	<div class="top">
		<span class="brand"><Wordmark size={34} /></span>
		<span class="url">{ORIGIN.replace('https://', '')}/{data.slug}</span>
	</div>
	<h1>{data.title}</h1>
	<div class="dots"><DecoderDots rows={5} /></div>
</div>

<style>
	.og {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		width: 1200px;
		height: 630px;
		padding: 56px 64px 48px;
		background: #161414;
		color: #fcf5f7;
		/* the dark theme's tokens, whatever theme the page itself is in */
		--text: #fcf5f7;
		--muted: #b1abac;
		--dim: #959091;
		--accent: #f59eb9;
		--surface-0: #161414;
	}
	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.brand {
		--fg: #fcf5f7;
		--acc: #f59eb9;
		--bg: #161414;
	}
	.url {
		font: 400 22px / 1 var(--font-mono);
		color: var(--dim);
	}
	h1 {
		margin: 52px 0 0;
		max-width: 1000px;
		font: 560 64px / 1.2 var(--font-ui);
		letter-spacing: -0.01em;
		color: var(--text);
	}
	.dots {
		margin-top: auto;
	}
</style>
