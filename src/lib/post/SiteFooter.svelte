<!-- The site footer: a hairline, then the logo and year on the left and the same two links as the nav
     on the right, on the nav's 76rem column. -->
<script>
	import { resolve } from '$app/paths';
	import Wordmark from '#lib/logos/Wordmark.svelte';
</script>

<footer class="foot">
	<span class="left">
		<a class="home" href={resolve('/')} aria-label="Speakrail home"><Wordmark size={15} /></a>
		<span class="year">© {new Date().getFullYear()}</span>
	</span>
	<span class="links">
		<a href="https://huggingface.co/speakrail" target="_blank" rel="noreferrer">Hugging Face</a>
		<a href="https://github.com/speakrail/speakrail" target="_blank" rel="noreferrer">GitHub</a>
	</span>
</footer>

<style>
	.foot {
		--fg: var(--text);
		--acc: var(--accent);
		--bg: var(--surface-0);
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: var(--s4);
		padding: var(--s6) max(var(--gutter), (100% - 76rem) / 2);
		box-shadow: inset 0 1px 0 var(--grid);
		font-size: var(--fs-small);
		color: var(--muted);
	}
	.left,
	.links {
		display: flex;
		align-items: center;
		gap: var(--s5);
	}
	a {
		color: inherit;
		text-decoration: none;
		transition: color var(--dur);
	}
	a:hover {
		color: var(--text);
	}
	.home {
		display: flex;
	}
	/* the same grey as "rail" in the logo beside it: 5.8:1, above the 4.5:1 text minimum */
	.year {
		font-family: var(--font-mono);
		color: var(--dim);
	}
</style>
