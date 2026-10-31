<!-- Bottom-centre stack for toast() messages; mounted once in the root layout. On a phone it keeps
     to the lane between the round buttons in the bottom corners (back to top, contents). -->
<script>
	import { flip } from 'svelte/animate';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import { dismiss, toasts } from './toasts.svelte.js';
</script>

<div class="toaster" role="status" aria-live="polite">
	{#each toasts as t (t.id)}
		<button
			type="button"
			class="toast"
			title="Dismiss"
			onclick={() => dismiss(t.id)}
			animate:flip={{ duration: 200 }}
			transition:fly={{ y: prefersReducedMotion.current ? 0 : 16, duration: 200 }}
		>
			{#if t.icon}<span class="glyph"><t.icon /></span>{/if}
			{t.message}
		</button>
	{/each}
</div>

<style>
	.toaster {
		position: fixed;
		bottom: calc(var(--s5) + env(safe-area-inset-bottom));
		left: 50%;
		z-index: 50;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--s2);
		/* clear of a 48px corner button plus a 12px gap on each side, the same both ways so the
		   toast stays centred: 222px on a 390px phone */
		width: min(100vw - 2 * (var(--s5) + 48px + var(--s3)), 26rem);
		translate: -50% 0;
		pointer-events: none;
	}
	/* look comes from the global .toast; this only makes it a quiet, clickable button */
	.toast {
		max-width: 100%;
		border: 0;
		text-align: left;
		cursor: pointer;
		pointer-events: auto;
	}
	.glyph {
		display: flex;
		flex: none;
		font-size: 1.15em;
		color: var(--accent);
	}
</style>
