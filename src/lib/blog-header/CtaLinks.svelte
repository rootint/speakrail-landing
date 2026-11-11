<!-- The big pink "Get on 🤗" button and a quiet arXiv link (the pills from 6) -->
<script>
	import ArrowUpRight from '~icons/iconoir/arrow-up-right';
	import Page from '~icons/iconoir/page';
	import PageEdit from '~icons/iconoir/page-edit';
	import { toast } from '#lib/toast/toasts.svelte.js';
	import HfLogo from './HfLogo.svelte';
</script>

<div class="cta">
	<a
		class="big"
		href="https://huggingface.co/speakrail/speakrail-voxtral-realtime-2602-turnhead-2611"
		target="_blank"
		rel="noreferrer"
		aria-label="Get it on Hugging Face"
	>
		Model card <HfLogo size="1.5em" />
		<ArrowUpRight />
	</a>
	<!-- TODO: once the paper has an arXiv id, make this a link to it again -->
	<button
		type="button"
		class="quiet"
		onclick={() => toast('Not written yet, coming soon', { icon: PageEdit })}
		><Page /> Read on arXiv</button
	>
</div>

<style>
	.cta {
		margin-bottom: var(--s4); /* + the 32px gap between header blocks = 48px below the button */
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
		padding: 0;
		border: 0;
		background: none;
		font-size: var(--fs-ui);
		color: var(--body);
		text-decoration: none;
		cursor: pointer;
	}
	.quiet:hover {
		color: var(--text);
	}
</style>
