<!-- A term with a short definition: dotted underline in the text, and a tooltip with `tip` on hover,
     keyboard focus or tap. The tooltip is centred on the term but kept inside the viewport. Its box
     must never hang past the edge, even while closed or mid-fade: on phones that widens the whole
     page, and with it anything fixed to the viewport, like the source sheet. So it's out of the
     layout while closed, and placed with `left` in px rather than a sideways transform (Chrome
     counts the untransformed box when sizing the page). -->
<script>
	import { tick } from 'svelte';

	/** @type {{ tip: string, children: import('svelte').Snippet }} */
	let { tip, children } = $props();

	const PAD = 12; // least room between the tooltip and the edge of the screen

	let open = $state(false);
	let x = $state(0); // the tooltip's left edge, in px from the term's
	/** @type {HTMLSpanElement | undefined} */
	let anchor = $state();
	/** @type {HTMLSpanElement | undefined} */
	let bubble = $state();
	const id = $props.id();

	// place it before it's painted: centred on the term, then pushed back inside the screen
	async function show() {
		open = true;
		await tick();
		if (!anchor || !bubble) return;
		const a = anchor.getBoundingClientRect();
		const w = bubble.offsetWidth;
		const right = document.documentElement.clientWidth - PAD;
		const left = Math.max(PAD, Math.min(a.left + a.width / 2 - w / 2, right - w));
		x = Math.round(left - a.left);
	}
	const hide = () => (open = false);
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && hide()} />

<span class="term" bind:this={anchor}>
	<button
		type="button"
		aria-describedby={id}
		onmouseenter={show}
		onmouseleave={hide}
		onfocus={show}
		onblur={hide}
		onclick={() => (open ? hide() : show())}>{@render children()}</button
	><span {id} role="tooltip" class="tip" class:open bind:this={bubble} style:left="{x}px"
		>{tip}</span
	>
</span>

<style>
	.term {
		position: relative;
	}
	button {
		all: unset;
		cursor: help;
		text-decoration: underline dotted var(--dim);
		text-decoration-thickness: 1px;
		text-underline-offset: 0.25em;
	}
	button:hover,
	button:focus-visible {
		text-decoration-color: var(--accent);
	}
	button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
		border-radius: 2px;
	}
	.tip {
		position: absolute;
		bottom: calc(100% + 6px);
		left: 0;
		z-index: 20;
		width: max-content;
		max-width: min(18rem, calc(100vw - 24px));
		padding: var(--s2) var(--s3);
		border-radius: var(--radius-sm);
		background: var(--surface-3);
		box-shadow: var(--ring-3), var(--shadow-3);
		font: var(--w-ui) var(--fs-caption) / 1.5 var(--font-ui);
		color: var(--text);
		text-align: left;
		pointer-events: none;
		/* closed: out of the layout altogether (see the top); display flips at the end of the fade */
		display: none;
		opacity: 0;
		transform: translateY(2px);
		transition:
			opacity 120ms,
			transform 120ms,
			display 120ms allow-discrete;
	}
	.tip.open {
		display: block;
		opacity: 1;
		transform: none;
	}
	@starting-style {
		.tip.open {
			opacity: 0;
			transform: translateY(2px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.tip {
			transition: none;
		}
	}
</style>
