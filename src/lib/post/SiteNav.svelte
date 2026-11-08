<!-- The site nav: "speak|rail" home on the left; the Hugging Face and GitHub logos and the theme
     switch (a sun in dark mode, a moon in light) on the right.
     From the top it scrolls away with the page; once it's gone, a scroll up pins it back in and a
     scroll down slides it away. Jumps within the page (contents, citation numbers) don't bring it back. -->
<script>
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import Wordmark from '#lib/logos/Wordmark.svelte';
	import HuggingFace from '#lib/logos/HuggingFace.svelte';
	import Github from '~icons/iconoir/github';
	import HalfMoon from '~icons/iconoir/half-moon';
	import SunLight from '~icons/iconoir/sun-light';
	import { currentTheme, setTheme } from '#lib/theme.js';
	import { onScrollFrame } from './scroll-frame.js';
	import { onUserScroll } from './user-scroll.js';

	// the page is prerendered without knowing the theme: both icons are in the HTML and CSS shows
	// the right one, so this only has to be right for screen readers once the page is running
	let light = $state(false);
	onMount(() => (light = currentTheme() === 'light'));
	function toggleTheme() {
		light = !light;
		setTheme(light ? 'light' : 'dark');
	}

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
		// a link whose click was taken over (a heading copying its link) doesn't jump anywhere
		if (e.defaultPrevented) return;
		if (e.target instanceof Element && e.target.closest('a[href^="#"], [data-jump]')) hold();
	}

	// the reader scrolling for themselves ends the hold: the nav answers them straight away, even
	// partway through a jump they've just cut short (the back-to-top button stops for them too)
	$effect(() =>
		onUserScroll(() => {
			held = false;
			clearTimeout(release);
		})
	);

	function follow() {
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
	$effect(() => onScrollFrame(follow));
</script>

<svelte:window {onclick} />

<nav
	class="site"
	class:pinned
	class:glide={off === NAV_H}
	style:--nav-off={pinned ? 0 : off}
	aria-label="Site"
>
	<a class="home" href={resolve('/')}><Wordmark size={18} /></a>
	<!-- logos only: the names are there for screen readers, and as tooltips -->
	<span class="links">
		<a href="https://huggingface.co/speakrail" target="_blank" rel="noreferrer" title="Hugging Face"
			><span class="logo"><HuggingFace /></span><span class="name">Hugging Face</span></a
		>
		<a href="https://github.com/speakrail/speakrail" target="_blank" rel="noreferrer" title="GitHub"
			><span class="logo"><Github /></span><span class="name">GitHub</span></a
		>
		<button
			type="button"
			class="theme"
			title="Light mode"
			aria-label="Light mode"
			aria-pressed={light}
			onclick={toggleTheme}
			><span class="sun"><SunLight /></span><span class="moon"><HalfMoon /></span></button
		>
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
	/* tabbing into the nav brings it back; a click doesn't, or a button keeping focus after it's
	   clicked (the theme switch) would hold the nav on screen */
	.site:has(:focus-visible) {
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
		/* the logos are smaller than their tap areas: pull the row out by the difference so the last
		   logo, not its tap area, lines up with the column's edge */
		margin-right: calc((var(--control-h) - 20px) / -2);
	}
	/* bare logos, greyed out; under the pointer they get their colour back */
	.links a,
	.theme {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--control-h);
		height: var(--control-h);
		border-radius: var(--radius); /* for the focus ring */
		color: var(--muted);
		transition: color var(--dur);
	}
	.logo {
		display: flex;
		font-size: 1.0625rem;
		filter: grayscale(1);
		opacity: 0.6;
		transition:
			filter var(--dur),
			opacity var(--dur);
	}
	@media (hover: hover) {
		.links a:hover {
			color: var(--text);
		}
		.links a:hover .logo {
			filter: none;
			opacity: 1;
		}
	}
	/* the theme switch: a plain button with the same 44px square; the icon brightens on hover */
	.theme {
		padding: 0;
		border: 0;
		background: none;
		font-size: 1.0625rem;
		cursor: pointer;
	}
	@media (hover: hover) {
		.theme:hover {
			color: var(--text);
		}
		.theme:hover :is(.sun, .moon) {
			opacity: 1;
		}
	}
	/* as quiet as the greyed logos beside it */
	.sun,
	.moon {
		display: flex;
		opacity: 0.6;
		transition: opacity var(--dur);
	}
	.theme:focus-visible :is(.sun, .moon) {
		opacity: 1;
	}
	.moon,
	:global([data-theme='light']) .sun {
		display: none;
	}
	:global([data-theme='light']) .moon {
		display: flex;
	}
	.links a:focus-visible .logo {
		filter: none;
		opacity: 1;
	}
	.name {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
