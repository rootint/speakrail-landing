<!-- 14 · TL;DR as a pull quote: pink rule on the left (same as .prose blockquote), pink label, plain
     body text. The text comes from the post's frontmatter (`tldr:`); without it, nothing renders.
     Links are written the markdown way, [text](https://…), and open in a new tab. -->
<script>
	import { splitLinks } from '#lib/post/inline-links.js';

	/** @type {{ text?: string }} */
	let { text = '' } = $props();

	const parts = $derived(splitLinks(text));
</script>

{#if text}
	<aside class="tldr" aria-label="TL;DR">
		<p class="label">TL;DR</p>
		<p>
			{#each parts as part, i (i)}{#if 'href' in part}<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external link from the frontmatter -->
					<a href={part.href} target="_blank" rel="noreferrer">{part.label}</a
					>{:else}{part.text}{/if}{/each}
		</p>
	</aside>
{/if}

<style>
	.tldr {
		position: relative;
		padding-left: calc(var(--s5) + 2px);
	}
	/* the rule is its own bar (not a border) so its ends can be rounded */
	.tldr::before {
		content: '';
		position: absolute;
		inset: 0 auto 0 0;
		width: 2px;
		border-radius: 1px;
		background: var(--accent);
	}
	p {
		margin: 0;
		line-height: 1.8;
		color: var(--body);
	}
	.label {
		margin-bottom: var(--s2);
		font: 500 var(--fs-caption) / 1.4 var(--font-mono);
		letter-spacing: 0.08em;
		color: var(--accent);
	}
</style>
