<!-- 14 · TL;DR as a pull quote: pink rule on the left (same as .prose blockquote), pink label, plain
     body text. The text comes from the post's frontmatter (`tldr:`); without it, nothing renders. -->
<script>
	/** @type {{ text?: string }} */
	let { text = '' } = $props();
</script>

{#if text}
	<aside class="tldr" aria-label="TL;DR">
		<p class="label">TL;DR</p>
		<p>{text}</p>
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
