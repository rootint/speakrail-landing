<!-- TEMP: switches between the five narrow-screen contents options so they can be tried on a phone.
     Remove it, and the options not picked, once one is chosen. -->
<script>
	/** @type {{ value: number }} */
	let { value = $bindable(1) } = $props();

	const OPTIONS = ['Bottom bar', 'Nav row', 'Round button', 'Sticky header', 'Inline list'];
</script>

<div class="picker" role="radiogroup" aria-label="Contents option (temporary)">
	<p class="picker-title">TEMP · contents option</p>
	<div class="picker-options">
		{#each OPTIONS as name, i (name)}
			<button
				type="button"
				role="radio"
				aria-checked={value === i + 1}
				class:on={value === i + 1}
				onclick={() => (value = i + 1)}>{i + 1} {name}</button
			>
		{/each}
	</div>
</div>

<style>
	.picker {
		margin-bottom: var(--s6);
		padding: var(--s3);
		border-radius: var(--radius);
		box-shadow: inset 0 0 0 1px var(--grid);
	}
	@media (min-width: 76.0625rem) {
		.picker {
			display: none;
		}
	}
	.picker-title {
		margin: 0 0 var(--s2);
		font: 400 var(--fs-caption) / 1.4 var(--font-mono);
		color: var(--muted);
	}
	.picker-options {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s2);
	}
	button {
		height: 36px;
		padding-inline: var(--s3);
		border: 0;
		border-radius: 999px;
		background: var(--surface-2);
		font: var(--w-ui) var(--fs-small) / 1 var(--font-ui);
		color: var(--body);
		cursor: pointer;
	}
	.on {
		background: var(--accent);
		color: var(--on-accent);
	}
</style>
