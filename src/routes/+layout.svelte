<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '#lib/paraglide/runtime.js';
	import favicon from '#lib/assets/favicon.svg';
	import kripaLatin from '#lib/assets/fonts/kripa-latin.woff2';
	import lilexLatin from '#lib/assets/fonts/lilex-latin.woff2';
	import Toaster from '#lib/toast/Toaster.svelte';
	import '../styles.css';

	let { children } = $props();

	// SvelteKit turns the browser's own scroll restoring off and, on a reload, scrolls back itself once
	// its script has run, so the page first paints at the top and then jumps. Handing it back to the
	// browser on the way out lets a reload open where it was left (SvelteKit 2 did this; 3 dropped it).
	function onbeforeunload() {
		history.scrollRestoration = 'auto';
	}
	// ...but a page that comes back from the back/forward cache doesn't start over, so nothing turns it
	// off again, and the browser would then fight SvelteKit over scroll on in-site back and forward.
	// That's why 3 dropped it (sveltejs/kit#17244); taking it back here keeps both.
	/** @param {PageTransitionEvent} e */
	function onpageshow(e) {
		if (e.persisted) history.scrollRestoration = 'manual';
	}
</script>

<svelte:window {onbeforeunload} {onpageshow} />

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preload" href={kripaLatin} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={lilexLatin} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{@render children()}

<!-- a faint black tint at the top and bottom of the viewport; under the nav, over the content -->
<div class="edge top" aria-hidden="true"></div>
<div class="edge bottom" aria-hidden="true"></div>

<Toaster />

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }))}>{locale}</a>
	{/each}
</div>

<style>
	.edge {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 5;
		height: 64px;
		pointer-events: none;
		/* the page colour fading out, with eased stops so the fade has no visible edge */
		--bg: var(--surface-0);
		--fade:
			color-mix(in srgb, var(--bg) 80%, transparent),
			color-mix(in srgb, var(--bg) 55%, transparent) 25%,
			color-mix(in srgb, var(--bg) 28%, transparent) 50%,
			color-mix(in srgb, var(--bg) 9%, transparent) 75%, transparent;
	}
	.top {
		top: 0;
		background: linear-gradient(to bottom, var(--fade));
	}
	.bottom {
		bottom: 0;
		background: linear-gradient(to top, var(--fade));
	}
	/* dark mode only: on a light page the fades just read as a grey haze over the text */
	:global([data-theme='light']) .edge {
		display: none;
	}
</style>
