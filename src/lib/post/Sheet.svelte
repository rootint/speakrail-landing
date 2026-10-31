<!-- A sheet that slides up from the bottom: the narrow-screen stand-in for what wide screens show
     beside the text. Open it with `show()`; it closes on a tap outside, Escape, a drag down, or
     `close()`. A native modal <dialog>, so focus stays inside it and returns to whatever opened it. -->
<script>
	/** @type {{ label: string, children?: import('svelte').Snippet }} */
	let { label, children } = $props();

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state();
	/** @type {HTMLDivElement | undefined} */
	let panel = $state();

	export function show() {
		dy = 0;
		dialog?.showModal();
		// focus the sheet itself rather than its first button, which would light up a focus ring
		panel?.focus();
	}
	export function close() {
		dialog?.close();
	}

	// a tap on the backdrop lands on the <dialog> itself; the panel inside fills the visible sheet
	/** @param {MouseEvent} e */
	function onclick(e) {
		if (e.target === dialog) close();
	}

	// drag down to dismiss: past 80px, or a quick flick, closes; anything less springs back
	const CLOSE_AT = 80;
	let dy = $state(0);
	let dragging = $state(false);
	let startY = 0;
	let startT = 0;
	let moved = false;

	/** @param {PointerEvent} e */
	function onpointerdown(e) {
		if (e.button !== 0) return;
		dragging = true;
		moved = false;
		startY = e.clientY;
		startT = e.timeStamp;
	}
	/** @param {PointerEvent & { currentTarget: HTMLElement }} e */
	function onpointermove(e) {
		if (!dragging) return;
		const d = e.clientY - startY;
		// capture only once it's clearly a drag, so a tap on a link still clicks it
		if (!moved && Math.abs(d) > 6) {
			moved = true;
			e.currentTarget.setPointerCapture(e.pointerId);
		}
		if (moved) dy = Math.max(0, d);
	}
	/** @param {PointerEvent} e */
	function onpointerup(e) {
		if (!dragging) return;
		dragging = false;
		const speed = dy / Math.max(1, e.timeStamp - startT); // px per ms
		if (dy > CLOSE_AT || (dy > 16 && speed > 0.5)) close();
		else dy = 0;
	}
</script>

<dialog class="sheet" bind:this={dialog} {onclick} aria-label={label}>
	<div
		class="panel"
		bind:this={panel}
		tabindex="-1"
		class:dragging
		style:translate="0 {dy}px"
		{onpointerdown}
		{onpointermove}
		{onpointerup}
		onpointercancel={onpointerup}
	>
		<button class="grab" type="button" aria-label="Close" onclick={close}
			><span class="handle"></span></button
		>
		{@render children?.()}
	</div>
</dialog>

<style>
	/* the page behind doesn't scroll while a sheet is up */
	:global(html:has(dialog.sheet[open])) {
		overflow: hidden;
	}

	.sheet {
		--ease: cubic-bezier(0.2, 0, 0, 1);
		width: min(100%, 40rem);
		max-width: none;
		max-height: 85dvh;
		margin: auto auto 0;
		padding: 0;
		border: 0;
		background: none;
		color: var(--text);
		overflow: visible;
		/* slides up on open and back down on close; overlay + display keep it on screen until the
		   slide-out ends */
		transform: translateY(100%);
		transition:
			transform 280ms var(--ease),
			overlay 280ms allow-discrete,
			display 280ms allow-discrete;
	}
	.sheet[open] {
		transform: none;
	}
	@starting-style {
		.sheet[open] {
			transform: translateY(100%);
		}
	}
	.sheet::backdrop {
		background: rgb(0 0 0 / 0);
		transition:
			background 280ms,
			overlay 280ms allow-discrete,
			display 280ms allow-discrete;
	}
	.sheet[open]::backdrop {
		background: rgb(0 0 0 / 0.5);
	}
	@starting-style {
		.sheet[open]::backdrop {
			background: rgb(0 0 0 / 0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sheet,
		.sheet::backdrop {
			transition-duration: 0.01s;
		}
	}

	.panel {
		max-height: 85dvh;
		overflow-y: auto;
		padding: 0 var(--s5) calc(var(--s6) + env(safe-area-inset-bottom));
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		/* surface-2, not the dialog level 4: the greys keep their contrast (muted 7.0:1, handle 3.1:1)
		   and the dimmed page behind still sets it apart */
		background: var(--surface-2);
		box-shadow: var(--ring-2), var(--shadow-4);
		touch-action: none; /* the drag is ours, not a page scroll */
		outline: none; /* focused on open only to hold focus inside; not a control */
		transition: translate 240ms var(--ease);
	}
	.panel.dragging {
		transition: none;
	}

	/* the handle: a short bar, inside a full-width strip that's easy to hit */
	.grab {
		display: grid;
		place-items: center;
		width: 100%;
		height: var(--s6);
		margin-bottom: var(--s2);
		padding: 0;
		border: 0;
		background: none;
		cursor: grab;
	}
	.handle {
		width: 36px;
		height: 4px;
		border-radius: 2px;
		background: var(--chart-grey);
	}
</style>
