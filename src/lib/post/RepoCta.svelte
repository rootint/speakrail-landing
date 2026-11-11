<!-- The end-of-post call to action: a short line about the repo and a pink pill that goes to it. -->
<script>
	import Github from '~icons/iconoir/github';
	import ArrowUpRight from '~icons/iconoir/arrow-up-right';

	const REPO = 'https://github.com/speakrail/speakrail';
</script>

<aside class="repo" aria-label="Speakrail on GitHub">
	<div class="repo-text">
		<p class="repo-title">Speakrail is open source</p>
		<p class="repo-sub">
			Clone it, run it on your own machine, and leave feedback. Issues and PRs are welcome!
		</p>
	</div>
	<a class="repo-go" href={REPO} target="_blank" rel="noreferrer"
		><Github /> Check on GitHub <ArrowUpRight /></a
	>
</aside>

<style>
	.repo {
		display: flex;
		align-items: center;
		gap: var(--s5);
		padding: var(--s6);
		border-radius: var(--radius-lg);
		background: var(--surface-1);
	}
	@media (max-width: 36rem) {
		.repo {
			flex-direction: column;
			align-items: flex-start;
		}
	}
	.repo-text {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--s1);
	}
	p {
		margin: 0;
	}
	.repo-title {
		font-size: 1.125rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--text);
	}
	.repo-sub {
		font-size: var(--fs-small);
		line-height: 1.6;
		color: var(--muted);
	}
	.repo-go {
		display: inline-flex;
		flex: none;
		align-items: center;
		gap: var(--s2);
		height: 44px;
		padding-inline: 20px;
		border-radius: 999px;
		background: var(--accent);
		color: var(--on-accent);
		font: 500 var(--fs-ui) / 1 var(--font-ui);
		text-decoration: none;
		transition: background var(--dur);
	}
	.repo-go:hover {
		background: var(--accent-hover);
		color: var(--on-accent);
	}
</style>
