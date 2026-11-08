<!-- A section heading in a post body (markdown's ##). Clicking or tapping it copies a link to the
     section. With a mouse, a pink copy mark appears on hover and turns into a tick on click. Touch
     screens have no hover to reveal the mark, so a tap says "Title copied!" in a toast instead.
     The heading text sits in a real #link, not a button: reader modes drop buttons and everything in
     them, and a link still works when opened in a new tab or without JavaScript. -->
<script>
	import Check from '~icons/iconoir/check';
	import Copy from '~icons/iconoir/copy';
	import Link from '~icons/iconoir/link';
	import { toast } from '#lib/toast/toasts.svelte.js';

	// the id comes from the build (remark-headings.js)
	/** @type {{ id?: string, children?: import('svelte').Snippet }} */
	let { id, children } = $props();

	/** @type {HTMLAnchorElement | undefined} */
	let link = $state();
	let copied = $state(false); // holds the mark up after a copy
	let tick = $state(false); // which icon; outlasts `copied` so the mark fades out as a tick
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let reset;
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let untick;
	const FADE = 200; // a little over the mark's --dur fade-out

	const canHover = () => matchMedia('(hover: hover)').matches;
	const hovering = () => canHover() && !!link?.matches(':hover');

	/** @param {MouseEvent} e */
	async function copy(e) {
		// a click with a modifier (new tab, new window) is the link doing its own thing
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		e.preventDefault();
		const url = `${location.origin}${location.pathname}#${id ?? ''}`;
		try {
			await navigator.clipboard.writeText(url);
		} catch {
			// no Clipboard API off https (say, the dev server opened over the LAN): the old way
			const area = Object.assign(document.createElement('textarea'), { value: url });
			area.style.cssText = 'position:fixed;opacity:0';
			document.body.append(area);
			area.select();
			const ok = document.execCommand('copy');
			area.remove();
			if (!ok) return toast("Couldn't copy the link", { icon: Link });
		}
		if (!canHover()) return toast('Title copied!', { icon: Link });
		copied = tick = true;
		clearTimeout(reset);
		clearTimeout(untick);
		reset = setTimeout(() => {
			copied = false;
			// still under the pointer: the mark stays up, ready to copy again
			if (hovering()) tick = false;
			// otherwise it fades out as a tick, and turns back only once it's gone
			else untick = setTimeout(() => (tick = false), FADE);
		}, 1600);
	}

	// pointing at it again mid-fade: show the copy mark straight away
	function onpointerenter() {
		if (copied) return;
		clearTimeout(untick);
		tick = false;
	}
</script>

<h2 {id}>
	<!-- described rather than labelled: a label would replace the heading's own text for screen
	     readers, and extra text inside would end up in the contents and the section id -->
	<a
		href="#{id}"
		class="copy-link"
		class:copied
		bind:this={link}
		{onpointerenter}
		aria-description="Copies a link to this section"
		onclick={copy}
		>{@render children?.()}<span class="mark" aria-hidden="true"
			>{#if tick}<Check />{:else}<Copy />{/if}</span
		></a
	>
</h2>

<style>
	/* the whole heading is the link, looking exactly like the heading */
	.copy-link {
		color: inherit;
		text-decoration: none;
	}
	.mark {
		display: inline-flex;
		margin-left: 0.3em;
		font-size: 0.6em; /* the icon's 1.2em box on the baseline centres on the capitals */
		color: var(--accent);
		opacity: 0;
		transition: opacity var(--dur);
	}
	/* touch screens have no hover: there the mark only shows as the tick after a tap */
	@media (hover: hover) {
		.copy-link:hover .mark,
		.copied .mark {
			opacity: 1;
		}
	}
	.copy-link:focus-visible .mark {
		opacity: 1;
	}
</style>
