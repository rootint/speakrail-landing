<!-- mdsvex layout for every post body: it swaps markdown's plain elements for our own.
     Right now that's images, which become figures with the title as the caption. -->
<script context="module">
	import Figure from './Figure.svelte';
	export { Figure as img };
</script>

<script>
	let { children } = $props();
</script>

{@render children?.()}
