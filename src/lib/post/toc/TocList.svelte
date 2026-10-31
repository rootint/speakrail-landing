<!-- The post's sections as a list of tall, thumb-sized links, for the narrow-screen contents (a sheet
     or a dropdown). The section being read is white with a pink number. `onpick` runs before the
     jump, so a container can close itself first. -->
<script>
	/** @type {{ reading: import('../reading.svelte.js').Reading, onpick?: () => void }} */
	let { reading, onpick } = $props();
</script>

<ol class="toc-list">
	{#each reading.sections as s, i (s.id)}
		{@const current = reading.started && i === reading.active}
		<li>
			<a
				href="#{s.id}"
				class:current
				aria-current={current ? 'location' : undefined}
				onclick={() => onpick?.()}><span class="n">{i + 1}</span><span>{s.text}</span></a
			>
		</li>
	{/each}
</ol>

<style>
	.toc-list {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	a {
		display: flex;
		align-items: baseline;
		gap: var(--s3);
		padding-block: 11px; /* with the 22px line: a 44px row */
		font: var(--w-ui) 1rem / 22px var(--font-ui);
		color: var(--muted);
		text-decoration: none;
	}
	.n {
		flex: none;
		width: 1.5ch;
		font: var(--fs-small) var(--font-mono);
		color: var(--dim);
	}
	.current {
		color: var(--text);
	}
	.current .n {
		color: var(--accent);
	}
</style>
