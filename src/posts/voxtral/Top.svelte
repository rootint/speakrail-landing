<!-- The section under the title: the model card and arXiv buttons, the pipeline animation, the TL;DR
     (its text is `tldr:` in index.svx's frontmatter). -->
<script>
	import CtaLinks from '#lib/blog-header/CtaLinks.svelte';
	import Pipeline from '#lib/blog-header/Pipeline.svelte';
	import Tldr from '#lib/blog-header/Tldr.svelte';

	/** @type {{ metadata: { tldr?: string } }} */
	let { metadata } = $props();
</script>

<CtaLinks />
<!-- <Pipeline /> -->
<Tldr text={metadata.tldr} />
