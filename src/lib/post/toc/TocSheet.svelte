<!-- The contents in a bottom sheet; picking a section closes it and jumps there. -->
<script>
	import Sheet from '../Sheet.svelte';
	import TocList from './TocList.svelte';

	/** @type {{ reading: import('../reading.svelte.js').Reading }} */
	let { reading } = $props();

	/** @type {Sheet | undefined} */
	let sheet = $state();
	export function show() {
		sheet?.show();
	}
</script>

<Sheet bind:this={sheet} label="Contents">
	<h2 class="toc-title">Contents</h2>
	<TocList {reading} onpick={() => sheet?.close()} />
</Sheet>

<style>
	.toc-title {
		margin: 0 0 var(--s2);
		font: 500 1.125rem / 1.4 var(--font-ui);
		color: var(--text);
	}
</style>
