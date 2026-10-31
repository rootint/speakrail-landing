<script>
	import Post from '#lib/post/Post.svelte';

	/** @type {{ data: import('svelte').ComponentProps<typeof Post> }} */
	let { data } = $props();
</script>

<!-- keyed so moving from one post to another starts a fresh frame -->
{#key data.slug}
	<Post {...data} />
{/key}
