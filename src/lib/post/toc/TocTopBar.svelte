<!-- Options 2 and 4: a slim bar at the top naming the section being read; tapping it drops the whole
     contents down under it.
       mode="nav": a second row of the nav, there only while the nav is pinned (after a scroll up).
       mode="sticky": always there once reading starts, under the nav while it shows and at the top
                      of the screen otherwise, with one progress segment per section. -->
<script>
	import NavArrowDown from '~icons/iconoir/nav-arrow-down';
	import TocList from './TocList.svelte';

	/** @type {{ reading: import('../reading.svelte.js').Reading, mode: 'nav' | 'sticky', navPinned: boolean }} */
	let { reading, mode, navPinned } = $props();

	let open = $state(false);
	const visible = $derived(reading.started && (mode === 'sticky' || navPinned));
	const n = $derived(reading.active + 1);
	// close the list when the bar itself goes away
	$effect(() => {
		if (!visible) open = false;
	});

	const fill = (/** @type {number} */ i) =>
		i < reading.active ? 1 : i === reading.active ? reading.progress : 0;
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (open = false)} />

{#if open}
	<button class="scrim" type="button" aria-label="Close contents" onclick={() => (open = false)}
	></button>
{/if}

<div
	class="toc-top {mode}"
	class:visible
	class:under-nav={mode === 'sticky' && navPinned}
	class:open
>
	<button
		type="button"
		class="row"
		tabindex={visible ? 0 : -1}
		aria-expanded={open}
		aria-label="Contents, section {n} of {reading.sections.length}: {reading.sections[
			reading.active
		]?.text}"
		onclick={() => (open = !open)}
	>
		<span class="n">{n}</span>
		<span class="t">{reading.sections[reading.active]?.text}</span>
		<span class="chev"><NavArrowDown /></span>
	</button>

	{#if mode === 'sticky'}
		<!-- one segment per section: done, part-way, to come -->
		<span class="segments" aria-hidden="true">
			{#each reading.sections as s, i (s.id)}
				<span class="seg"><span class="seg-fill" style:scale="{fill(i)} 1"></span></span>
			{/each}
		</span>
	{:else}
		<span class="fill" style:scale="{reading.progress} 1" aria-hidden="true"></span>
	{/if}

	{#if open}
		<div class="drop"><TocList {reading} onpick={() => (open = false)} /></div>
	{/if}
</div>

<style>
	.toc-top {
		--ease: cubic-bezier(0.2, 0, 0, 1);
		position: fixed;
		left: 0;
		right: 0;
		z-index: 9; /* under the nav (10), so the nav row slides out from behind it */
		background: var(--surface-0);
		box-shadow: inset 0 -1px 0 var(--grid);
		transition:
			translate 240ms var(--ease),
			top 240ms var(--ease);
	}
	@media (min-width: 76.0625rem) {
		.toc-top,
		.scrim {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.toc-top {
			transition: none;
		}
	}
	/* the nav row hangs under the nav and slides in and out with it */
	.nav {
		top: 64px;
		translate: 0 calc(-100% - 64px);
	}
	.nav.visible {
		translate: 0 0;
	}
	/* the sticky bar sits at the very top, and steps down under the nav while the nav shows */
	.sticky {
		top: 0;
		translate: 0 -100%;
	}
	.sticky.visible {
		translate: 0 0;
	}
	.sticky.under-nav {
		top: 64px;
	}

	.row {
		display: flex;
		align-items: center;
		gap: var(--s3);
		width: 100%;
		height: 44px;
		padding: 0 var(--gutter);
		border: 0;
		background: none;
		font: var(--w-ui) var(--fs-ui) / 1 var(--font-ui);
		color: var(--text);
		text-align: left;
		cursor: pointer;
	}
	.n {
		font: var(--fs-small) var(--font-mono);
		color: var(--accent);
	}
	.t {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		line-height: 1.4;
	}
	.chev {
		display: flex;
		color: var(--muted);
		transition: rotate 200ms var(--ease);
	}
	.open .chev {
		rotate: 180deg;
	}

	.fill {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 2px;
		background: var(--accent);
		transform-origin: left;
		transition: scale 160ms linear;
	}
	.segments {
		position: absolute;
		left: var(--gutter);
		right: var(--gutter);
		bottom: 0;
		display: flex;
		gap: 3px;
		height: 2px;
	}
	.seg {
		flex: 1;
		overflow: hidden;
		border-radius: 1px;
		background: var(--grid);
	}
	.seg-fill {
		display: block;
		height: 100%;
		background: var(--accent);
		transform-origin: left;
		transition: scale 160ms linear;
	}

	.drop {
		max-height: 70dvh;
		overflow-y: auto;
		padding: var(--s1) var(--gutter) var(--s4);
		border-radius: 0 0 var(--radius-lg) var(--radius-lg);
		background: var(--surface-2);
		box-shadow: var(--shadow-3);
	}
	.scrim {
		position: fixed;
		inset: 0;
		z-index: 9;
		padding: 0;
		border: 0;
		background: rgb(0 0 0 / 0.5);
	}
</style>
