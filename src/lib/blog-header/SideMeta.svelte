<!-- 6 · big CTA + metadata column in the left margin on wide screens (Anthropic style) -->
<script>
	import ArrowUpRight from '~icons/iconoir/arrow-up-right';
	import Github from '~icons/iconoir/github';
</script>

<div class="wrap">
	<aside class="side">
		<div>
			<p class="k">Published</p>
			<p class="v">Nov 1, 2026</p>
		</div>
		<div>
			<p class="k">Author</p>
			<p class="v">@danil_rootint</p>
		</div>
		<div>
			<p class="k">Topics</p>
			<p class="v">Turn-taking<br />Speech recognition<br />Voxtral</p>
		</div>
	</aside>

	<div class="cta">
		<a
			class="big"
			href="https://huggingface.co/speakrail/speakrail-voxtral-realtime-2602-turnhead-2611"
			target="_blank"
			rel="noreferrer"
		>
			Read the model card <ArrowUpRight />
		</a>
		<a class="quiet" href="https://github.com/speakrail/speakrail" target="_blank" rel="noreferrer"
			><Github /> View code</a
		>
	</div>
</div>

<style>
	.wrap {
		position: relative;
	}
	p {
		margin: 0;
	}
	.side {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s4) var(--s6);
		margin-bottom: var(--s5);
	}
	.k {
		font: 400 var(--fs-caption) / 1.4 var(--font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.v {
		margin-top: var(--s1);
		font-size: var(--fs-small);
		line-height: 1.6;
		color: var(--body);
	}
	/* wide screens: metadata moves into the left margin, level with the CTA */
	@media (min-width: 75rem) {
		.side {
			position: absolute;
			top: 0;
			right: calc(100% + var(--s8));
			flex-direction: column;
			flex-wrap: nowrap;
			width: 11rem;
			margin: 0;
			padding-right: var(--s5);
			border-right: 1px solid var(--grid);
			text-align: right;
		}
	}
	.cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--s5);
	}
	.big {
		display: inline-flex;
		align-items: center;
		gap: var(--s3);
		height: 56px;
		padding-inline: var(--s6);
		border-radius: 999px;
		background: var(--accent);
		color: var(--on-accent);
		font: 500 1.125rem / 1 var(--font-ui);
		text-decoration: none;
		transition: background var(--dur);
	}
	.big:hover {
		background: var(--accent-hover);
		color: var(--on-accent);
	}
	.quiet {
		display: inline-flex;
		align-items: center;
		gap: var(--s2);
		font-size: var(--fs-ui);
		color: var(--body);
		text-decoration: none;
	}
	.quiet:hover {
		color: var(--text);
	}
</style>
