<!-- mdsvex layout for every post body: it swaps markdown's plain elements for our own.
     Images become figures with the title as the caption; ## headings copy a link to themselves. -->
<script context="module">
	import Figure from './Figure.svelte';
	import Heading from './Heading.svelte';
	export { Figure as img, Heading as h2 };
</script>

<script>
	let { children } = $props();
</script>

{@render children?.()}
