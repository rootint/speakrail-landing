<!-- Typographic experiments with the name, all in Kripa / Lilex. Colours come from --fg / --acc / --bg.
     Bars that continue the letters use Kripa's own metrics at weight 480 (measured):
     x-height (ı) 0.548em, l 0.745em, stem 0.09em, stem-to-stem gap with the -0.025em tracking 0.131em. -->
<script>
	/** @type {{ id: number, size?: number }} */
	let { id, size = 44 } = $props();

	const weightsWave = [250, 400, 650, 850, 700, 450, 300, 550, 800];
	const weightsFade = [820, 720, 620, 520, 440, 360, 290, 230, 170];
	const envelope = [0.7, 0.9, 1.2, 1.35, 1.1, 0.85, 1, 1.25, 0.8];
	const letters = 'speakrail'.split('');
</script>

<span class="x" style:font-size="{size}px" role="img" aria-label="Speakrail">
	{#if id === 21}
		<!-- il → wave: ı and l are the first two bars, the waveform carries on in pink -->
		<span class="k"
			>speakraıl<i class="bar a first" style:--h="0.42em"></i><i class="bar a" style:--h="0.62em"
			></i><i class="bar a" style:--h="0.3em"></i><i class="bar a" style:--h="0.46em"></i><i
				class="bar a"
				style:--h="0.16em"
			></i></span
		>
	{:else if id === 22}
		<!-- i · wave · l: a small waveform squeezed between the i and the l -->
		<span class="k"
			>speakraı<i class="bar a after-i" style:--h="0.18em"></i><i class="bar a" style:--h="0.4em"
			></i><i class="bar a" style:--h="0.26em"></i><i class="bar a before-l" style:--h="0.58em"
			></i>l</span
		>
	{:else if id === 23}
		<!-- waveform il: i and l get a pink negative half below the line, then the wave fades -->
		<span class="k"
			>speakra<i class="bar fg wave first-wave" style:--h="0.548em" style:--d="0.22em"></i><i
				class="bar fg wave"
				style:--h="0.745em"
				style:--d="0.34em"
			></i><i class="bar a wave" style:--h="0.4em" style:--d="0.4em"></i><i
				class="bar a wave"
				style:--h="0.22em"
				style:--d="0.22em"
			></i><i class="bar a wave" style:--h="0.1em" style:--d="0.1em"></i></span
		>
	{:else if id === 24}
		<!-- echo: the name and its fading pink reflection, like sound off a hard floor -->
		<span class="echo"
			><span class="k">speakrail</span><span class="k mirror" aria-hidden="true">speakrail</span
			></span
		>
	{:else if id === 25}
		<!-- loudness: each letter's weight is how loud it was said -->
		<span class="k">
			{#each letters as ch, i (i)}<span style:font-weight={weightsWave[i]}>{ch}</span>{/each}
		</span>
	{:else if id === 26}
		<!-- fade out: the voice gets quieter letter by letter, then the turn ends -->
		<span class="k">
			{#each letters as ch, i (i)}<span
					style:font-weight={weightsFade[i]}
					style:opacity={1 - i * 0.07}>{ch}</span
				>{/each}<span class="a">.</span>
		</span>
	{:else if id === 27}
		<!-- envelope: letters stretched like an amplitude envelope around the centre line -->
		<span class="k env">
			{#each letters as ch, i (i)}<span style:scale="1 {envelope[i]}">{ch}</span>{/each}
		</span>
	{:else if id === 28}
		<!-- stream: "speak" has been said, "rail" is still being predicted -->
		<span class="k light">speak<i class="caret"></i><span class="ghost">rail</span></span>
	{:else if id === 41}
		<!-- stream + r: an underscore cursor under the r, the letter being predicted right now -->
		<span class="k light">speak<span class="ghost"><span class="now">r</span>ail</span></span>
	{:else if id === 29}
		<!-- bubble a: the a in speak is a speech bubble -->
		<span class="k"
			>spe<svg class="bubble" viewBox="0 0 58 56" aria-hidden="true"
				><circle cx="27" cy="28" r="22.5" /><path d="M45 41L55 55L39 49" /></svg
			>krail</span
		>
	{:else if id === 30}
		<!-- rails il: the i and the l are two rails, pink sleepers between them (1 unit = 0.01em) -->
		<span class="k"
			>speakra<svg class="rails" viewBox="0 0 38 74.5" aria-hidden="true"
				><rect class="r" x="0" y="19.7" width="9" height="54.8" /><rect
					class="r"
					x="29"
					y="0"
					width="9"
					height="74.5"
				/><rect class="t" x="9" y="64" width="20" height="4.5" /><rect
					class="t"
					x="9"
					y="50"
					width="20"
					height="4.5"
				/><rect class="t" x="9" y="36" width="20" height="4.5" /><rect
					class="t"
					x="9"
					y="22"
					width="20"
					height="4.5"
				/></svg
			></span
		>
	{:else if id === 31}
		<!-- sine: the "ea" is replaced by a wave -->
		<span class="k"
			>sp<svg class="sine" viewBox="0 0 96 56" aria-hidden="true"
				><path d="M5 28C17 3 33 3 47 28S77 53 91 28" /></svg
			>krail</span
		>
	{:else if id === 32}
		<!-- tag: the name as a self-closing component -->
		<span class="m"><span class="a">&lt;</span>speakrail<span class="a"> /&gt;</span></span>
	{:else if id === 33}
		<!-- chat: speak on the left, the reply rail on the right, like two messages -->
		<span class="k chat"><span>speak</span><span class="a">rail</span></span>
	{:else if id === 34}
		<!-- talk-over: rail starts before speak has finished -->
		<span class="k"><span>speak</span><span class="a over">rail</span></span>
	{:else if id === 35}
		<!-- streaming: the end of the word is still arriving in slices -->
		<span class="k"
			>speakr<span class="slices"
				><span class="ghostw">ail</span><span class="sl s1">ail</span><span class="sl s2 a"
					>ail</span
				><span class="sl s3">ail</span></span
			></span
		>
	{:else if id === 36}
		<!-- spectrum fill: the letters are filled with spectrogram stripes -->
		<span class="k spectro">speakrail</span>
	{:else if id === 37}
		<!-- tempo: spoken slowly, then the reply comes fast -->
		<span class="k"><span class="slow">speak</span><span class="a fast">rail</span></span>
	{:else if id === 38}
		<!-- train: every letter is a carriage, the engine is pink -->
		<span class="train">
			{#each letters as ch, i (i)}<span class="car" class:engine={i === 8}>{ch}</span>{/each}
		</span>
	{:else if id === 39}
		<!-- broadcast: the dot of the i is a signal going out -->
		<span class="k"
			>speakra<i class="anchor"
				><svg class="waves" viewBox="0 0 40 22" aria-hidden="true"
					><path d="M14 19A6 6 0 0 1 26 19M8 19A12 12 0 0 1 32 19M2 19A18 18 0 0 1 38 19" /></svg
				></i
			>ıl</span
		>
	{:else if id === 40}
		<!-- grid: nine letters, nine cells, the last l in pink -->
		<span class="m grid">
			{#each letters as ch, i (i)}<span class:a={i === 8}>{ch}</span>{/each}
		</span>
	{/if}
</span>

<style>
	.x {
		display: inline-flex;
		align-items: center;
		line-height: 1;
		white-space: nowrap;
		color: var(--fg);
	}
	.k {
		font: 480 1em / 1 var(--font-ui);
		letter-spacing: -0.025em;
	}
	.m {
		font: 450 0.92em / 1 var(--font-mono);
		letter-spacing: -0.04em;
	}
	.a {
		color: var(--acc);
	}
	i {
		display: inline-block;
		font-style: normal;
	}

	/* bars sized and spaced like Kripa's own stems, sitting on the baseline */
	.bar {
		position: relative;
		width: 0.09em;
		height: var(--h);
		margin-left: 0.131em;
		vertical-align: baseline;
		background: var(--acc);
	}
	.bar.fg {
		background: var(--fg);
	}
	.bar.first {
		margin-left: 0.068em; /* after l: 0.131 minus l's right side-bearing net of tracking */
	}
	.bar.after-i {
		margin-left: 0.088em;
	}
	.bar.before-l {
		margin-right: 0.043em;
	}
	.bar.first-wave {
		margin-left: 0.043em;
	}
	/* 23: the negative half of the waveform, below the baseline */
	.wave::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		height: var(--d);
		margin-top: 0.03em;
		background: var(--acc);
	}

	/* 24 */
	.echo {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
	}
	.mirror {
		margin-top: -0.12em;
		scale: 1 -0.75;
		color: var(--acc);
		mask-image: linear-gradient(to top, #000, transparent 75%);
	}

	/* 27 */
	.env span {
		display: inline-block;
		transform-origin: 50% 62%;
	}

	/* 28 */
	.caret {
		width: 0.07em;
		height: 0.82em;
		margin: 0 0.05em 0 0.06em;
		vertical-align: -0.08em;
		background: var(--acc);
	}
	/* a lighter cut of the name, closer to the page's titles */
	.k.light {
		font-weight: var(--wm-weight, 460);
		letter-spacing: var(--wm-tracking, 0.015em);
	}
	/* mixed rather than faded, so the pink underline in 41 stays full strength */
	.ghost {
		color: color-mix(in srgb, var(--fg) 45%, var(--bg));
	}
	.now {
		text-decoration: underline var(--acc);
		text-decoration-thickness: 0.06em;
		text-underline-offset: 0.14em;
	}

	/* 29 */
	.bubble {
		width: 0.58em;
		height: 0.56em;
		margin: 0 0.02em 0 0.01em;
		vertical-align: -0.01em;
		fill: none;
		stroke: var(--acc);
		stroke-width: 9;
		stroke-linejoin: round;
	}

	/* 30 */
	.rails {
		width: 0.38em;
		height: 0.745em;
		margin-left: 0.14em;
		vertical-align: baseline;
	}
	.rails .r {
		fill: var(--fg);
	}
	.rails .t {
		fill: var(--acc);
	}

	/* 31 */
	.sine {
		width: 0.96em;
		height: 0.56em;
		margin: 0 0.04em;
		vertical-align: -0.01em;
		fill: none;
		stroke: var(--acc);
		stroke-width: 9;
		stroke-linecap: round;
	}

	/* 33 */
	.chat {
		display: inline-grid;
		line-height: 0.95;
	}
	.chat span:last-child {
		margin-left: 1.15em;
	}

	/* 34: rail overlaps speak, cut out with a halo in the background colour */
	.over {
		position: relative;
		margin-left: -0.16em;
		text-shadow:
			0.035em 0 var(--bg),
			-0.035em 0 var(--bg),
			0 0.035em var(--bg),
			0 -0.035em var(--bg);
	}

	/* 35 */
	.slices {
		position: relative;
		display: inline-block;
	}
	.ghostw {
		visibility: hidden;
	}
	.sl {
		position: absolute;
		inset: 0;
	}
	/* each slice lags further behind, as if the bottom of the word is still on its way */
	.s1 {
		clip-path: inset(0 0 64% 0);
	}
	.s2 {
		clip-path: inset(36% 0 34% 0);
		translate: 0.12em 0;
	}
	.s3 {
		clip-path: inset(66% 0 0 0);
		translate: 0.26em 0;
		opacity: 0.45;
	}

	/* 36 */
	.spectro {
		font-weight: 620;
		background: repeating-linear-gradient(
			90deg,
			var(--fg) 0 0.05em,
			var(--acc) 0.05em 0.08em,
			var(--fg) 0.08em 0.1em,
			var(--acc) 0.1em 0.16em
		);
		background-clip: text;
		color: transparent;
	}

	/* 37 */
	.slow {
		letter-spacing: 0.32em;
	}
	.fast {
		letter-spacing: -0.06em;
	}

	/* 38 */
	.train {
		display: inline-flex;
		gap: 0.14em;
		padding-bottom: 0.22em;
		background: linear-gradient(var(--fg), var(--fg)) bottom / 100% 0.035em no-repeat;
	}
	.car {
		position: relative;
		display: grid;
		place-items: center;
		/* the car's own font-size is half the lockup's, so its em values are doubled */
		width: 1.24em;
		height: 1.48em;
		padding-bottom: 0.12em;
		border-radius: 0.24em;
		box-shadow: inset 0 0 0 0.08em var(--fg);
		font: 480 0.5em / 1 var(--font-mono);
	}
	/* coupler to the next car, and two wheels */
	.car:not(:last-child)::after {
		content: '';
		position: absolute;
		left: 100%;
		top: 60%;
		width: 0.28em;
		height: 0.07em;
		background: var(--fg);
	}
	.car::before {
		content: '';
		position: absolute;
		bottom: -0.3em;
		left: 0.2em;
		right: 0.2em;
		height: 0.24em;
		background:
			radial-gradient(circle, var(--fg) 0.11em, transparent 0.12em) left / 0.24em 0.24em no-repeat,
			radial-gradient(circle, var(--fg) 0.11em, transparent 0.12em) right / 0.24em 0.24em no-repeat;
	}
	.car.engine {
		background: var(--acc);
		box-shadow: none;
		color: var(--bg);
	}

	/* 39: a zero-size anchor on the baseline just before the ı; the arcs sit above its stem */
	.anchor {
		position: relative;
		width: 0;
		height: 0;
		vertical-align: baseline;
	}
	.waves {
		position: absolute;
		bottom: 0.6em;
		left: calc(0.113em - 0.25em);
		width: 0.5em;
		max-width: none; /* the global svg max-width would collapse it inside the 0-wide anchor */
		height: 0.275em;
		fill: none;
		stroke: var(--acc);
		stroke-width: 3.6;
		stroke-linecap: round;
	}

	/* 40 */
	.grid {
		display: inline-grid;
		grid-template-columns: repeat(3, 0.6em);
		row-gap: 0.06em;
		letter-spacing: 0;
		line-height: 0.9;
		text-align: center;
	}
</style>
