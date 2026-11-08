<!-- A recorded conversation to listen to, with both sides drawn on one time axis: the user above the
     line, the system below, and every response gap (the user stops → the system starts) marked with
     its length, so the latency shows without listening. `demo` names files in ./demos/:
       <demo>.webm  Opus, the mono mix (played first where the browser has Opus)
       <demo>.m4a   AAC, the same mix, for browsers without Opus in WebM
       <demo>.json  the waveform and gaps, from the stereo recording (left = user, right = system)
     Each card's axis runs the length of its own recording; pass the same `span` (seconds) to every
     card to put them on one shared scale instead, so a second is as wide in each and
     their gaps compare by eye. Only one plays at a time. -->
<script module>
	// every demo on the page, so starting one pauses the rest; a registry, not UI state
	/** @type {Set<HTMLAudioElement>} */
	// eslint-disable-next-line svelte/prefer-svelte-reactivity -- nothing renders from it
	const players = new Set();
</script>

<script>
	import { onMount } from 'svelte';
	import Play from '~icons/iconoir/play-solid';
	import Pause from '~icons/iconoir/pause-solid';

	/**
	 * @typedef {{ duration: number, step: number, user: number[], system: number[],
	 *   gaps: { from: number, to: number }[] }} Wave
	 */

	/** @type {{ demo: string, title: string, description?: string, span?: number }} */
	let { demo, title, description = '', span } = $props();

	const urls = /** @type {Record<string, string>} */ (
		import.meta.glob('./demos/*.{webm,m4a}', { eager: true, query: '?url', import: 'default' })
	);
	const waves = /** @type {Record<string, Wave>} */ (
		import.meta.glob('./demos/*.json', { eager: true, import: 'default' })
	);
	const wave = $derived(waves[`./demos/${demo}.json`]);
	const opus = $derived(urls[`./demos/${demo}.webm`]);
	const aac = $derived(urls[`./demos/${demo}.m4a`]);

	/** @type {HTMLAudioElement | undefined} */
	let audio = $state();
	let time = $state(0);
	let paused = $state(true);

	onMount(() => {
		if (!audio) return;
		players.add(audio);
		return () => {
			if (audio) players.delete(audio);
		};
	});

	function toggle() {
		if (!audio) return;
		if (audio.paused) {
			for (const p of players) if (p !== audio) p.pause();
			if (audio.ended) audio.currentTime = 0;
			audio.play();
		} else audio.pause();
	}

	// the drawing: one filled envelope per side, mirrored about the centre line (y 0..100)
	/** @param {number[]} v @param {1 | -1} dir up for the user, down for the system */
	const envelope = (v, dir) => {
		const x = (/** @type {number} */ i) => (i * wave.step).toFixed(2);
		const y = (/** @type {number} */ a) => (50 - dir * a * 46).toFixed(1);
		return `M0 50 ${v.map((a, i) => `L${x(i)} ${y(a)}`).join(' ')} L${x(v.length)} 50 Z`;
	};
	const userPath = $derived(envelope(wave.user, 1));
	const systemPath = $derived(envelope(wave.system, -1));

	const axis = $derived(span ?? wave.duration); // seconds across the track
	const pct = (/** @type {number} */ s) => `${(s / axis) * 100}%`;
	const played = $derived(Math.min(time, wave.duration));
	const clock = (/** @type {number} */ s) =>
		`${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
	// in seconds in every card, so "0.1 s" and "1.25 s" compare at a glance; trailing zeros dropped
	const gapLabel = (/** @type {number} */ s) => `${Number(s.toFixed(2))} s`;

	// gap labels that would touch go up a row; measured at the card's width (600 until it's known)
	let plotWidth = $state(600);
	const LABEL_PX = 52;
	const labels = $derived.by(() => {
		/** @type {number[]} right edge of the last label in each row */
		const ends = [];
		return wave.gaps.map((g) => {
			const x = ((g.from + g.to) / 2 / axis) * plotWidth;
			let row = ends.findIndex((end) => x - LABEL_PX / 2 >= end);
			if (row < 0) row = ends.length;
			ends[row] = x + LABEL_PX / 2;
			return { ...g, row };
		});
	});
	const rows = $derived(Math.max(1, ...labels.map((l) => l.row + 1)));

	// seeking: click or drag on the waveform, or arrow keys when it has focus
	/** @type {HTMLDivElement | undefined} */
	let track = $state();
	let dragging = false;
	/** @param {PointerEvent} e */
	function seekTo(e) {
		if (!audio || !track) return;
		const r = track.getBoundingClientRect();
		const s = ((e.clientX - r.left) / r.width) * axis;
		audio.currentTime = Math.max(0, Math.min(wave.duration, s));
		time = audio.currentTime;
	}
	/** @param {KeyboardEvent} e */
	function onkeydown(e) {
		if (!audio) return;
		const d = { ArrowLeft: -1, ArrowRight: 1, PageDown: -5, PageUp: 5 }[e.key];
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			toggle();
		} else if (d !== undefined) {
			e.preventDefault();
			audio.currentTime = Math.max(0, Math.min(wave.duration, audio.currentTime + d));
		} else if (e.key === 'Home') audio.currentTime = 0;
	}
</script>

<div class="demo" role="group" aria-label={title}>
	<div class="head">
		<button
			class="play"
			type="button"
			onclick={toggle}
			aria-label="{paused ? 'Play' : 'Pause'}: {title}"
		>
			{#if paused}<Play />{:else}<Pause />{/if}
		</button>
		<div class="caption">
			<span class="title">{title}</span>
			{#if description}<span class="desc">{description}</span>{/if}
		</div>
		<span class="clock">{clock(played)} / {clock(wave.duration)}</span>
	</div>

	<div class="plot">
		<!-- response gaps, labelled above the waveform -->
		<div
			class="gap-labels"
			aria-hidden="true"
			bind:clientWidth={plotWidth}
			style:height="{rows * 18}px"
		>
			{#each labels as g (g.from)}
				<span
					class="gap-label"
					style:left={pct((g.from + g.to) / 2)}
					style:top="{(rows - 1 - g.row) * 18}px">{gapLabel(g.to - g.from)}</span
				>
			{/each}
		</div>

		<div class="lanes" aria-hidden="true"><span>User</span><span>System</span></div>
		<div
			class="track"
			bind:this={track}
			role="slider"
			tabindex="0"
			aria-label="Seek: {title}"
			aria-valuemin="0"
			aria-valuemax={Math.round(wave.duration)}
			aria-valuenow={Math.round(played)}
			aria-valuetext="{clock(played)} of {clock(wave.duration)}"
			onpointerdown={(e) => {
				dragging = true;
				e.currentTarget.setPointerCapture(e.pointerId);
				seekTo(e);
			}}
			onpointermove={(e) => dragging && seekTo(e)}
			onpointerup={() => (dragging = false)}
			onpointercancel={() => (dragging = false)}
			{onkeydown}
		>
			<span class="axis"></span>
			{#each wave.gaps as g (g.from)}
				<span class="gap" style:left={pct(g.from)} style:width={pct(g.to - g.from)}></span>
			{/each}

			<!-- the recording: dim, with the played part drawn over it in full colour -->
			<svg
				class="wave"
				style:width={pct(wave.duration)}
				viewBox="0 0 {wave.duration} 100"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<path class="u" d={userPath} />
				<path class="s" d={systemPath} />
			</svg>
			<svg
				class="wave lit"
				style:width={pct(wave.duration)}
				style:clip-path="inset(0 {100 - (played / wave.duration) * 100}% 0 0)"
				viewBox="0 0 {wave.duration} 100"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<path class="u" d={userPath} />
				<path class="s" d={systemPath} />
			</svg>
			{#if played > 0}<span class="playhead" style:left={pct(played)}></span>{/if}
		</div>
	</div>

	<audio bind:this={audio} bind:currentTime={time} bind:paused preload="metadata">
		<source src={opus} type="audio/webm; codecs=opus" />
		<source src={aac} type="audio/mp4; codecs=mp4a.40.2" />
	</audio>
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		gap: var(--s5);
		margin-block: var(--s6);
		padding: var(--s5);
		border-radius: var(--radius-lg);
		background: var(--surface-1);
		box-shadow: var(--ring-1);
	}
	/* small print right after the cards (<p class="demo-notes"> in the post) hangs close, like a caption */
	.demo:has(+ :global(.demo-notes)) {
		margin-bottom: var(--s3);
	}

	/* ---- play button, title and description, clock ---- */
	.head {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: var(--s4);
	}
	/* phones: the clock moves under the description, so the title keeps the width */
	@media (max-width: 36rem) {
		.head {
			grid-template-columns: auto 1fr;
			align-items: start;
			row-gap: var(--s1);
		}
		.clock {
			grid-column: 2;
		}
	}
	.play {
		display: grid;
		place-items: center;
		width: var(--control-h);
		height: var(--control-h);
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: var(--accent);
		color: var(--on-accent);
		font-size: 18px;
		cursor: pointer;
		transition: background var(--dur);
	}
	.play:hover {
		background: var(--accent-hover);
	}
	.caption {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.title {
		font: var(--w-ui-strong) var(--fs-ui) / 1.4 var(--font-ui);
		color: var(--text);
	}
	.desc {
		font: var(--w-ui) var(--fs-small) / 1.5 var(--font-ui);
		color: var(--muted);
	}
	.clock {
		align-self: start;
		font: 400 var(--fs-caption) / 1.4 var(--font-mono);
		font-variant-numeric: tabular-nums;
		color: var(--dim);
	}

	/* ---- the plot: gap labels, waveform track, seconds ---- */
	/* lane names in a narrow column on the left; the gap labels above line up with the track */
	.plot {
		display: grid;
		grid-template-columns: auto 1fr;
		column-gap: var(--s2);
		row-gap: var(--s1);
	}
	.gap-labels,
	.track {
		grid-column: 2;
	}
	.lanes {
		grid-column: 1;
		display: grid;
		grid-template-rows: 1fr 1fr;
		align-items: center;
		font: 400 11px / 1 var(--font-mono);
		color: var(--dim);
		text-align: right;
	}
	.gap-labels {
		position: relative;
		height: 18px;
		font: 400 var(--fs-caption) / 18px var(--font-mono);
	}
	.gap-label {
		position: absolute;
		top: 0;
		translate: -50% 0;
		white-space: nowrap;
	}
	.gap-label {
		color: var(--text);
	}

	.track {
		position: relative;
		height: 112px;
		border-radius: var(--radius-sm);
		background: var(--surface-sunk);
		box-shadow: var(--ring-sunk);
		cursor: pointer;
		touch-action: none;
		overflow: hidden;
	}
	.track:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	.axis {
		position: absolute;
		inset: 50% 0 auto;
		height: 1px;
		background: var(--grid);
	}
	/* a response gap: the stretch where nobody talks because the system hasn't started yet */
	.gap {
		position: absolute;
		inset-block: 0;
		min-width: 2px;
		background: color-mix(in srgb, var(--text) 9%, transparent);
		box-shadow:
			inset 1px 0 0 color-mix(in srgb, var(--text) 30%, transparent),
			inset -1px 0 0 color-mix(in srgb, var(--text) 30%, transparent);
	}

	.wave {
		position: absolute;
		inset-block: 0;
		left: 0;
		height: 100%;
	}
	.wave .u {
		fill: color-mix(in srgb, var(--muted) 40%, transparent);
	}
	.wave .s {
		fill: color-mix(in srgb, var(--accent) 40%, transparent);
	}
	.wave.lit .u {
		fill: var(--muted);
	}
	.wave.lit .s {
		fill: var(--accent);
	}
	.playhead {
		position: absolute;
		inset-block: 0;
		width: 2px;
		translate: -1px 0;
		background: var(--text);
		pointer-events: none;
	}
</style>
