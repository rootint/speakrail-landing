<!-- The section under the title: the model card and arXiv buttons, the decoder graphic, the TL;DR
     (its text is `tldr:` in index.svx's frontmatter). -->
<script>
	import CtaLinks from '#lib/blog-header/CtaLinks.svelte';
	import DecoderDots from '#lib/blog-header/DecoderDots.svelte';
	import Tldr from '#lib/blog-header/Tldr.svelte';

	/** @type {{ metadata: { tldr?: string } }} */
	let { metadata } = $props();
</script>

<CtaLinks />
<DecoderDots />
<Tldr text={metadata.tldr} />
