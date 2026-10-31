<!-- Speakrail symbol explorations: solid marks on a 48×48 grid. Colours come from the theme the mark
     sits on: --fg (main), --acc (one detail), --bg (knock-outs, so cut shapes show the background). -->
<script>
	/** @type {{ id: number, size?: number | string }} */
	let { id, size = 48 } = $props();
	// gradient ids must be unique per instance: each copy resolves --fg from where it sits
	const uid = $props.id();
</script>

<svg
	class="mark"
	width={size}
	height={size}
	viewBox="0 0 48 48"
	fill="none"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{#if id === 1}
		<!-- dialogue: two speech bubbles, the reply in pink -->
		<circle class="f" cx="19" cy="19" r="14" />
		<path class="f" d="M8 27L4 38L17 32Z" />
		<circle class="a bgs" cx="32" cy="31" r="12" stroke-width="3" />
	{:else if id === 2}
		<!-- express: level bars that blur in from the left, like they're moving fast -->
		<defs>
			<linearGradient id="{uid}-fade" x1="0" x2="1" y1="0" y2="0">
				<stop offset="0" stop-color="var(--fg)" stop-opacity="0" />
				<stop offset="0.55" stop-color="var(--fg)" />
			</linearGradient>
		</defs>
		<rect x="12" y="7" width="32" height="6" rx="3" fill="url(#{uid}-fade)" />
		<rect x="4" y="17" width="40" height="6" rx="3" fill="url(#{uid}-fade)" />
		<rect x="16" y="27" width="28" height="6" rx="3" fill="url(#{uid}-fade)" />
		<rect x="8" y="37" width="36" height="6" rx="3" fill="url(#{uid}-fade)" />
	{:else if id === 3}
		<!-- transcribe: a voice turning into a text cursor -->
		<path class="fs" stroke-width="5" d="M7 18V30M15 11V37M23 16V32" />
		<path class="as" stroke-width="5" d="M35 7V41" />
	{:else if id === 4}
		<!-- rail bubble: a speech bubble with two rails through it -->
		<path
			class="f"
			d="M14 5H34A10 10 0 0 1 44 15V26A10 10 0 0 1 34 36H22L11 44V35.5A10 10 0 0 1 4 26V15A10 10 0 0 1 14 5Z"
		/>
		<rect class="b" x="13" y="14" width="22" height="4.5" rx="2.25" />
		<rect class="a" x="13" y="23" width="22" height="4.5" rx="2.25" />
	{:else if id === 5}
		<!-- back and forth: an S made of two arrows passing the turn -->
		<path class="fs" stroke-width="6" d="M35 13A11 11 0 1 0 24 24" />
		<path class="as" stroke-width="6" d="M24 24A11 11 0 1 1 13 35" />
		<path class="f" d="M30 6L41 13L30 19Z" />
		<path class="a" d="M18 29L7 35L18 42Z" />
	{:else if id === 6}
		<!-- burst: a voice going out in every direction, one ray in pink -->
		<path
			class="fs"
			stroke-width="5.5"
			d="M24 4V12M24 36V44M4 24H12M9.86 9.86L15.51 15.51M32.49 32.49L38.14 38.14M9.86 38.14L15.51 32.49M38.14 9.86L32.49 15.51"
		/>
		<path class="as" stroke-width="5.5" d="M36 24H44" />
	{:else if id === 7}
		<!-- fast mic: a microphone with speed lines -->
		<rect class="f" x="22" y="4" width="14" height="25" rx="7" />
		<path class="fs" stroke-width="4" d="M16 21A13 13 0 0 0 42 21M29 34V43M23 43H35" />
		<path class="as" stroke-width="3.5" d="M3 11H14M6 18H14M2 25H12" />
	{:else if id === 8}
		<!-- code wave: a voice inside angle brackets -->
		<path class="fs" stroke-width="5" d="M14 11L5 24L14 37M34 11L43 24L34 37" />
		<path class="as" stroke-width="4.5" d="M19 19V29M24 13V35M29 17V31" />
	{:else if id === 9}
		<!-- prompt: a terminal tile, the cursor is a sound wave -->
		<rect class="f" x="4" y="4" width="40" height="40" rx="11" />
		<path class="bgs" stroke-width="4.5" d="M13 17L20 24L13 31" />
		<path class="as" stroke-width="4.5" d="M24 27C26 21 29 21 31 24S36 27 38 21" />
	{:else if id === 10}
		<!-- on track: rails running into the distance -->
		<path class="fs" stroke-width="4.5" d="M7 44L19 5M41 44L29 5" />
		<path class="as" stroke-width="3.5" d="M11 37H37M14.5 27.5H33.5M17 19H31M19.5 11.5H28.5" />
	{:else if id === 11}
		<!-- fast reply: a speech bubble with a lightning bolt cut out -->
		<path
			class="f"
			d="M15 4H33A11 11 0 0 1 44 15V25A11 11 0 0 1 33 36H23L12 44V35A11 11 0 0 1 4 25V15A11 11 0 0 1 15 4Z"
		/>
		<path class="a" d="M27 8L15 22H23L20 32L33 17H25Z" />
	{:else if id === 12}
		<!-- bullet: the nose of a fast train, a pink stripe, a rail underneath -->
		<path class="f" d="M4 35V23C4 16 9 12 16 12H29C38 12 44 20 44 30V35Z" />
		<path class="b" d="M30 16.5C35 16.5 39 20 40.2 25H30Z" />
		<rect class="a" x="4" y="28" width="40" height="3.5" />
		<path class="fs" stroke-width="2.5" d="M3 41H45" />
	{:else if id === 13}
		<!-- your turn: a pause bar handing over to play -->
		<rect class="f" x="5" y="9" width="9" height="30" rx="3.5" />
		<path class="a as" stroke-width="3" d="M21 10.5L42 24L21 37.5Z" />
	{:else if id === 14}
		<!-- signal: a rail signal, the bottom lamp lit -->
		<rect class="f" x="13" y="3" width="22" height="42" rx="11" />
		<circle class="b" cx="24" cy="14" r="4.5" />
		<circle class="b" cx="24" cy="24" r="4.5" />
		<circle class="a" cx="24" cy="34" r="5" />
	{:else if id === 15}
		<!-- duplex: two loops, both sides talk at once -->
		<path class="fs" stroke-width="7" d="M24 24C18 14 6 14 6 24S18 34 24 24" />
		<path class="as" stroke-width="7" d="M24 24C30 14 42 14 42 24S30 34 24 24" />
	{:else if id === 16}
		<!-- striped S: an S built from speed bars -->
		<rect class="f" x="14" y="5" width="29" height="6" rx="3" />
		<rect class="f" x="5" y="13" width="15" height="6" rx="3" />
		<rect class="a" x="9" y="21" width="30" height="6" rx="3" />
		<rect class="f" x="28" y="29" width="15" height="6" rx="3" />
		<rect class="f" x="5" y="37" width="29" height="6" rx="3" />
	{:else if id === 17}
		<!-- live: a record-style ring with the voice at its centre -->
		<circle class="fs" stroke-width="5" cx="24" cy="24" r="18" />
		<circle class="a" cx="24" cy="24" r="8" />
	{:else if id === 18}
		<!-- flap: one split-flap tile with an S -->
		<rect class="f" x="5" y="3" width="38" height="42" rx="7" />
		<text class="flap-s" x="24" y="35" text-anchor="middle">S</text>
		<rect class="b" x="5" y="23" width="38" height="2" />
	{:else if id === 19}
		<!-- sr: a heavy monogram for the boxed badge -->
		<text class="sr" x="24" y="34" text-anchor="middle">SR</text>
	{/if}
</svg>

<style>
	.mark {
		display: block;
		flex: none;
	}
	.f {
		fill: var(--fg);
	}
	.a {
		fill: var(--acc);
	}
	.b {
		fill: var(--bg);
	}
	.fs {
		stroke: var(--fg);
	}
	.as {
		stroke: var(--acc);
	}
	.bgs {
		stroke: var(--bg);
	}
	.flap-s {
		font: 600 30px var(--font-mono);
		fill: var(--bg);
	}
	.sr {
		font: 800 24px var(--font-ui);
		letter-spacing: -0.04em;
		fill: var(--fg);
	}
</style>
