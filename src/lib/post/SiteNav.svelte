<!-- The site nav: "speak|rail" home on the left, two plain links on the right.
     From the top it scrolls away with the page; once it's gone, a scroll up pins it back in and a
     scroll down slides it away. Jumps within the page (contents, citation numbers) don't bring it back. -->
<script>
	import { resolve } from '$app/paths';
	import Experiment from '#lib/logos/Experiment.svelte';

	const NAV_H = 64;
	let off = $state(0); // how far the unpinned nav has scrolled off, 0 to NAV_H
	let pinned = $state(false);
	let lastY = 0;

	// a jump scrolls too, but that isn't the reader asking for the nav: hold it until the jump settles.
	// Jumps are in-page links and anything marked data-jump (the back-to-top button).
	let held = false;
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let release;
	function hold() {
		held = true;
		pinned = false;
		clearTimeout(release);
		release = setTimeout(() => (held = false), 200);
	}

	/** @param {MouseEvent} e */
	function onclick(e) {
		if (e.target instanceof Element && e.target.closest('a[href^="#"], [data-jump]')) hold();
	}

	function onscroll() {
		const y = Math.max(0, scrollY);
		const d = y - lastY;
		off = Math.min(y, NAV_H);
		if (held) {
			lastY = y;
			hold(); // still moving: push the release back
			return;
		}
		if (y === 0) pinned = false;
		else if (y >= NAV_H && d < -4) pinned = true;
		else if (y >= NAV_H && d > 4) pinned = false;
		if (y === 0 || Math.abs(d) > 4) lastY = y;
	}
</script>

<svelte:window {onscroll} {onclick} />

<nav
	class="site"
	class:pinned
	class:glide={off === NAV_H}
	style:--nav-off={pinned ? 0 : off}
	aria-label="Site"
>
	<a class="home" href={resolve('/')}><Experiment id={41} size={18} /></a>
	<span class="links">
		<a href="https://huggingface.co/speakrail">Hugging Face</a>
		<a href="https://github.com/speakrail/speakrail">GitHub</a>
	</span>
</nav>

<style>
	.site {
		--fg: var(--text);
		--acc: var(--accent);
		--bg: var(--surface-0);
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 64px;
		/* full-width bar, content on a 76rem column */
		padding-inline: max(var(--gutter), (100% - 76rem) / 2);
		background: var(--surface-0);
		transform: translateY(calc(var(--nav-off, 0) * -1px));
	}
	.site:focus-within {
		transform: none;
	}
	.site.pinned {
		box-shadow: inset 0 -1px 0 var(--grid);
	}
	/* animate only the pin/unpin below the fold; near the top it follows the scroll 1:1 */
	.site.glide {
		transition: transform 240ms cubic-bezier(0.2, 0, 0, 1);
	}
	@media (prefers-reduced-motion: reduce) {
		.site.glide {
			transition: none;
		}
	}
	a {
		text-decoration: none;
	}
	.home {
		display: flex;
	}
	.links {
		display: flex;
		gap: var(--s5);
	}
	.links a {
		font-size: var(--fs-ui);
		color: var(--muted);
		transition: color var(--dur);
	}
	.links a:hover {
		color: var(--text);
	}
</style>
