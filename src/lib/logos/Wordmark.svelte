<!-- The Speakrail wordmark: "speak" in full, "rail" quieter, with a pink underline under the r, the
     letter being predicted right now. Colours come from --fg / --acc / --bg. -->
<script>
	/** @type {{ size?: number }} */
	let { size = 18 } = $props();
</script>

<span class="wm" style:font-size="{size}px" role="img" aria-label="Speakrail"
	><span class="name">speak<span class="ghost"><span class="now">r</span>ail</span></span></span
>

<style>
	.wm {
		display: inline-flex;
		align-items: center;
		line-height: 1;
		white-space: nowrap;
		color: var(--fg);
	}
	.name {
		font: 460 1em / 1 var(--font-ui);
		letter-spacing: 0.015em;
	}
	/* mixed rather than faded, so the pink underline stays full strength; 55% is 5.8:1 on the page,
	   clear of the 4.5:1 text minimum while still reading as the quieter half */
	.ghost {
		color: color-mix(in srgb, var(--fg) 55%, var(--bg));
	}
	/* mixing in sRGB isn't symmetric: on the light page the same 5.8:1 takes 66% */
	:global([data-theme='light']) .ghost {
		color: color-mix(in srgb, var(--fg) 66%, var(--bg));
	}
	.now {
		text-decoration: underline var(--acc);
		text-decoration-thickness: 0.06em;
		text-underline-offset: 0.14em;
	}
</style>
