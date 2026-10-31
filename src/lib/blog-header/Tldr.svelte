<!-- 14 · TL;DR as a pull quote: pink rule on the left (same as .prose blockquote), pink label, plain body text -->
<aside class="tldr" aria-label="TL;DR">
	<p class="label">TL;DR</p>
	<p>
		You can achieve great turn-taking without losing WER on Voxtral Realtime by just attaching a
		turn head to layer 11 of the model’s decoder. The weights are available on Hugging Face,
		benchmarks are there as well. To try the model in real life, try using Speakrail, it will most
		likely launch on your hardware.
	</p>
</aside>

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
