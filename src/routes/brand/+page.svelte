<script>
	const snippets = {
	"shell": {
		"label": "Shell",
		"file": "terminal",
		"lang": "bash",
		"html": "<span class=\"tok-c\"># clone and start everything (~75 GB on first run)</span>\n<span class=\"tok-p\">$ </span>git clone https://github.com/speakrail/speakrail &amp;&amp; cd speakrail\n<span class=\"tok-p\">$ </span>docker compose up -d\n\n<span class=\"tok-c\"># GPU on another machine? tunnel the UI</span>\n<span class=\"tok-p\">$ </span>ssh -L 8080:localhost:8080 your-gpu-box"
	},
	"env": {
		"label": ".env",
		"file": ".env",
		"lang": "dotenv",
		"html": "UI_PORT=<span class=\"tok-n\">8080</span>\nVOICE=<span class=\"tok-s\">female_a.wav</span>\nHOME_CITY=<span class=\"tok-s\">London</span>\nSILENCE_MS=<span class=\"tok-n\">1000</span>          <span class=\"tok-c\"># ends your turn when the head is unsure</span>\nLLM_GPU_MEMORY_UTILIZATION=<span class=\"tok-n\">0.48</span>\nSEARCH=<span class=\"tok-s\">searxng</span>"
	},
	"python": {
		"label": "Python",
		"file": "turn_policy.py",
		"lang": "python",
		"html": "<span class=\"tok-k\">from</span> speakrail <span class=\"tok-k\">import</span> TurnHead, Decision\n\n<span class=\"tok-k\">async def</span> <span class=\"tok-f\">on_event</span>(head: TurnHead) -&gt; Decision:\n    <span class=\"tok-c\"># called every 80 ms with fresh probabilities</span>\n    p = head.<span class=\"tok-f\">probs</span>()\n    <span class=\"tok-k\">if</span> p[<span class=\"tok-s\">\"backchannel\"</span>] &gt; <span class=\"tok-n\">0.6</span>:\n        <span class=\"tok-k\">return</span> Decision.LISTEN   <span class=\"tok-c\"># \"mm-hmm\" never stops a reply</span>\n    <span class=\"tok-k\">if</span> p[<span class=\"tok-s\">\"done\"</span>] &gt; <span class=\"tok-n\">0.5</span>:\n        <span class=\"tok-k\">return</span> Decision.SPEAK    <span class=\"tok-c\"># peek: start before the turn is confirmed</span>\n    <span class=\"tok-k\">return</span> Decision.LISTEN"
	}
};
	const groups = [{"name": "Seeds", "items": [{"token": "surface-0", "hex": "#161414", "note": "black · page", "ratio": "1.00:1"}, {"token": "text", "hex": "#fcf5f7", "note": "primary white", "ratio": "17.08:1"}, {"token": "accent", "hex": "#f59eb9", "note": "primary pink", "ratio": "9.15:1"}]}, {"name": "Neutrals", "items": [{"token": "grid", "hex": "#373133", "note": "gridlines", "ratio": "1.44:1"}, {"token": "border", "hex": "#474243", "note": "dividers", "ratio": "1.86:1"}, {"token": "chart-grey", "hex": "#736c6e", "note": "control borders", "ratio": "3.58:1"}, {"token": "muted", "hex": "#b1abac", "note": "captions", "ratio": "8.12:1"}, {"token": "body", "hex": "#e9e3e4", "note": "paragraphs", "ratio": "14.48:1"}, {"token": "text", "hex": "#fcf5f7", "note": "headings", "ratio": "17.08:1"}]}, {"name": "Pink", "items": [{"token": "accent-wash", "hex": "#321d23", "note": "note surface", "ratio": "1.17:1"}, {"token": "accent-deep", "hex": "#572f3c", "note": "selection", "ratio": "1.64:1"}, {"token": "accent-dim", "hex": "#d3839c", "note": "2nd series", "ratio": "6.55:1"}, {"token": "accent-press", "hex": "#e792ac", "note": "pressed", "ratio": "7.96:1"}, {"token": "accent", "hex": "#f59eb9", "note": "links, marks", "ratio": "9.15:1"}, {"token": "accent-hover", "hex": "#ffabc6", "note": "hover", "ratio": "10.39:1"}]}, {"name": "Status", "items": [{"token": "error", "hex": "#faa18f", "note": "errors", "ratio": "9.23:1"}, {"token": "warning", "hex": "#e3af65", "note": "warnings", "ratio": "9.25:1"}, {"token": "success", "hex": "#7fc88e", "note": "success", "ratio": "9.22:1"}]}];
	const levels = [{"id": "sunk", "level": "−1", "hex": "#100f0f", "ring": "inset shade", "use": "code wells, inputs, tracks"}, {"id": "0", "level": "0", "hex": "#161414", "ring": "none", "use": "page"}, {"id": "1", "level": "1", "hex": "#1f1c1d", "ring": "ring-1 · shadow-1", "use": "callouts, cards, figures, table heads"}, {"id": "2", "level": "2", "hex": "#252122", "ring": "ring-2 · shadow-2", "use": "hovered cards, active tab, inline code"}, {"id": "3", "level": "3", "hex": "#2b2728", "ring": "ring-3 · shadow-3", "use": "menus, popovers, tooltips, toasts"}, {"id": "4", "level": "4", "hex": "#312e2f", "ring": "ring-4 · shadow-4", "use": "dialogs, over a scrim"}];

	let tab = $state('shell');
	let copied = $state(false);
	let notify = $state(true);

	const plain = (h) =>
		h.replace(/<[^>]+>/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');

	async function copy() {
		await navigator.clipboard.writeText(plain(snippets[tab].html).replace(/^\$ /gm, ''));
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<svelte:head>
	<title>Speakrail · Brand book</title>
</svelte:head>

<nav class="site-nav" aria-label="Main">
	<div class="measure">
		<a class="wordmark" href="/">speakrail<span class="cursor" aria-hidden="true"></span></a>
		<a class="tab" href="#reports">Reports</a>
		<a class="tab" href="#components" aria-current="page">Design</a>
		<a class="tab" href="https://github.com/speakrail/speakrail">GitHub</a>
	</div>
</nav>

<main class="measure prose">
	<!-- ============================================================ HERO -->
	<header class="hero">
		<p class="overline">Brand book · v0.2 · dark</p>
		<h1 class="display">Listens while it <em class="brand">talks</em>.</h1>
		<p class="lede">
			Speakrail is a full-duplex voice assistant that runs on a single RTX 4090. This page is the
			design system for its technical reports: every color, surface, type style and component,
			shown in place.
		</p>
		<div class="row">
			<a class="btn btn-primary" href="https://github.com/speakrail/speakrail">Run it locally</a>
			<a class="btn btn-secondary" href="#reports">Read the report</a>
			<a class="btn btn-ghost" href="#components">Components →</a>
		</div>
		<figure class="hero-figure">
			<svg class="waveform" viewBox="0 0 680 120" role="img" aria-label="Two voice waveforms on one line: the user above in grey, Speakrail below in pink. They overlap where the user backchannels while Speakrail is talking.">
	<rect class="wf-rest" x="0" y="59" width="3" height="2" rx="1"/><rect class="wf-rest" x="5" y="59" width="3" height="2" rx="1"/><rect class="wf-rest" x="10" y="59" width="3" height="2" rx="1"/><rect class="wf-you" x="15" y="52.1" width="3" height="6.9" rx="1.5"/><rect class="wf-you" x="20" y="46.4" width="3" height="12.6" rx="1.5"/><rect class="wf-you" x="25" y="44.3" width="3" height="14.7" rx="1.5"/><rect class="wf-you" x="30" y="39.8" width="3" height="19.2" rx="1.5"/><rect class="wf-you" x="35" y="47.1" width="3" height="11.9" rx="1.5"/><rect class="wf-you" x="40" y="45.4" width="3" height="13.6" rx="1.5"/><rect class="wf-you" x="45" y="46.0" width="3" height="13.0" rx="1.5"/><rect class="wf-you" x="50" y="25.0" width="3" height="34.0" rx="1.5"/><rect class="wf-you" x="55" y="42.2" width="3" height="16.8" rx="1.5"/><rect class="wf-you" x="60" y="26.3" width="3" height="32.7" rx="1.5"/><rect class="wf-you" x="65" y="41.0" width="3" height="18.0" rx="1.5"/><rect class="wf-you" x="70" y="39.2" width="3" height="19.8" rx="1.5"/><rect class="wf-you" x="75" y="31.5" width="3" height="27.5" rx="1.5"/><rect class="wf-you" x="80" y="23.1" width="3" height="35.9" rx="1.5"/><rect class="wf-you" x="85" y="18.7" width="3" height="40.3" rx="1.5"/><rect class="wf-you" x="90" y="30.9" width="3" height="28.1" rx="1.5"/><rect class="wf-you" x="95" y="33.4" width="3" height="25.6" rx="1.5"/><rect class="wf-you" x="100" y="39.9" width="3" height="19.1" rx="1.5"/><rect class="wf-you" x="105" y="19.5" width="3" height="39.5" rx="1.5"/><rect class="wf-you" x="110" y="41.5" width="3" height="17.5" rx="1.5"/><rect class="wf-you" x="115" y="10.3" width="3" height="48.7" rx="1.5"/><rect class="wf-you" x="120" y="35.6" width="3" height="23.4" rx="1.5"/><rect class="wf-you" x="125" y="34.0" width="3" height="25.0" rx="1.5"/><rect class="wf-you" x="130" y="37.5" width="3" height="21.5" rx="1.5"/><rect class="wf-you" x="135" y="23.8" width="3" height="35.2" rx="1.5"/><rect class="wf-you" x="140" y="21.0" width="3" height="38.0" rx="1.5"/><rect class="wf-you" x="145" y="24.5" width="3" height="34.5" rx="1.5"/><rect class="wf-you" x="150" y="25.5" width="3" height="33.5" rx="1.5"/><rect class="wf-you" x="155" y="40.9" width="3" height="18.1" rx="1.5"/><rect class="wf-you" x="160" y="35.6" width="3" height="23.4" rx="1.5"/><rect class="wf-you" x="165" y="41.5" width="3" height="17.5" rx="1.5"/><rect class="wf-you" x="170" y="19.8" width="3" height="39.2" rx="1.5"/><rect class="wf-you" x="175" y="43.3" width="3" height="15.7" rx="1.5"/><rect class="wf-you" x="180" y="32.0" width="3" height="27.0" rx="1.5"/><rect class="wf-you" x="185" y="46.1" width="3" height="12.9" rx="1.5"/><rect class="wf-you" x="190" y="42.5" width="3" height="16.5" rx="1.5"/><rect class="wf-you" x="195" y="41.4" width="3" height="17.6" rx="1.5"/><rect class="wf-you" x="200" y="39.4" width="3" height="19.6" rx="1.5"/><rect class="wf-you" x="205" y="42.4" width="3" height="16.6" rx="1.5"/><rect class="wf-you" x="210" y="50.0" width="3" height="9.0" rx="1.5"/><rect class="wf-you" x="215" y="54.4" width="3" height="4.6" rx="1.5"/><rect class="wf-rest" x="220" y="59" width="3" height="2" rx="1"/><rect class="wf-rest" x="225" y="59" width="3" height="2" rx="1"/><rect class="wf-rest" x="230" y="59" width="3" height="2" rx="1"/><rect class="wf-rest" x="235" y="59" width="3" height="2" rx="1"/><rect class="wf-rest" x="240" y="59" width="3" height="2" rx="1"/><rect class="wf-rest" x="245" y="59" width="3" height="2" rx="1"/><rect class="wf-rest" x="250" y="59" width="3" height="2" rx="1"/><rect class="wf-rest" x="255" y="59" width="3" height="2" rx="1"/><rect class="wf-rest" x="260" y="59" width="3" height="2" rx="1"/><rect class="wf-rest" x="265" y="59" width="3" height="2" rx="1"/><rect class="wf-rest" x="270" y="59" width="3" height="2" rx="1"/><rect class="wf-you" x="275" y="54.2" width="3" height="4.8" rx="1.5"/><rect class="wf-you" x="280" y="46.8" width="3" height="12.2" rx="1.5"/><rect class="wf-you" x="285" y="47.8" width="3" height="11.2" rx="1.5"/><rect class="wf-you" x="290" y="29.9" width="3" height="29.1" rx="1.5"/><rect class="wf-you" x="295" y="46.1" width="3" height="12.9" rx="1.5"/><rect class="wf-you" x="300" y="34.0" width="3" height="25.0" rx="1.5"/><rect class="wf-you" x="305" y="45.0" width="3" height="14.0" rx="1.5"/><rect class="wf-you" x="310" y="32.6" width="3" height="26.4" rx="1.5"/><rect class="wf-you" x="315" y="30.0" width="3" height="29.0" rx="1.5"/><rect class="wf-you" x="320" y="20.4" width="3" height="38.6" rx="1.5"/><rect class="wf-you" x="325" y="22.5" width="3" height="36.5" rx="1.5"/><rect class="wf-you" x="330" y="33.2" width="3" height="25.8" rx="1.5"/><rect class="wf-you" x="335" y="41.4" width="3" height="17.6" rx="1.5"/><rect class="wf-you" x="340" y="36.0" width="3" height="23.0" rx="1.5"/><rect class="wf-you" x="345" y="13.6" width="3" height="45.4" rx="1.5"/><rect class="wf-you" x="350" y="39.0" width="3" height="20.0" rx="1.5"/><rect class="wf-you" x="355" y="14.6" width="3" height="44.4" rx="1.5"/><rect class="wf-you" x="360" y="39.4" width="3" height="19.6" rx="1.5"/><rect class="wf-you" x="365" y="41.0" width="3" height="18.0" rx="1.5"/><rect class="wf-you" x="370" y="36.0" width="3" height="23.0" rx="1.5"/><rect class="wf-you" x="375" y="21.9" width="3" height="37.1" rx="1.5"/><rect class="wf-sr" x="375" y="61" width="3" height="6.0" rx="1.5"/><rect class="wf-you" x="380" y="27.0" width="3" height="32.0" rx="1.5"/><rect class="wf-sr" x="380" y="61" width="3" height="10.5" rx="1.5"/><rect class="wf-you" x="385" y="30.9" width="3" height="28.1" rx="1.5"/><rect class="wf-sr" x="385" y="61" width="3" height="11.3" rx="1.5"/><rect class="wf-you" x="390" y="38.0" width="3" height="21.0" rx="1.5"/><rect class="wf-sr" x="390" y="61" width="3" height="8.4" rx="1.5"/><rect class="wf-you" x="395" y="46.6" width="3" height="12.4" rx="1.5"/><rect class="wf-sr" x="395" y="61" width="3" height="11.7" rx="1.5"/><rect class="wf-you" x="400" y="38.5" width="3" height="20.5" rx="1.5"/><rect class="wf-sr" x="400" y="61" width="3" height="12.5" rx="1.5"/><rect class="wf-you" x="405" y="47.0" width="3" height="12.0" rx="1.5"/><rect class="wf-sr" x="405" y="61" width="3" height="26.3" rx="1.5"/><rect class="wf-you" x="410" y="39.7" width="3" height="19.3" rx="1.5"/><rect class="wf-sr" x="410" y="61" width="3" height="11.5" rx="1.5"/><rect class="wf-you" x="415" y="54.3" width="3" height="4.7" rx="1.5"/><rect class="wf-sr" x="415" y="61" width="3" height="24.1" rx="1.5"/><rect class="wf-sr" x="420" y="61" width="3" height="12.3" rx="1.5"/><rect class="wf-sr" x="425" y="61" width="3" height="19.4" rx="1.5"/><rect class="wf-sr" x="430" y="61" width="3" height="20.5" rx="1.5"/><rect class="wf-sr" x="435" y="61" width="3" height="33.6" rx="1.5"/><rect class="wf-sr" x="440" y="61" width="3" height="29.2" rx="1.5"/><rect class="wf-sr" x="445" y="61" width="3" height="25.3" rx="1.5"/><rect class="wf-sr" x="450" y="61" width="3" height="17.9" rx="1.5"/><rect class="wf-sr" x="455" y="61" width="3" height="19.9" rx="1.5"/><rect class="wf-sr" x="460" y="61" width="3" height="36.7" rx="1.5"/><rect class="wf-sr" x="465" y="61" width="3" height="22.1" rx="1.5"/><rect class="wf-sr" x="470" y="61" width="3" height="43.4" rx="1.5"/><rect class="wf-sr" x="475" y="61" width="3" height="17.0" rx="1.5"/><rect class="wf-sr" x="480" y="61" width="3" height="19.8" rx="1.5"/><rect class="wf-sr" x="485" y="61" width="3" height="20.5" rx="1.5"/><rect class="wf-sr" x="490" y="61" width="3" height="40.4" rx="1.5"/><rect class="wf-sr" x="495" y="61" width="3" height="33.8" rx="1.5"/><rect class="wf-sr" x="500" y="61" width="3" height="39.8" rx="1.5"/><rect class="wf-sr" x="505" y="61" width="3" height="30.6" rx="1.5"/><rect class="wf-sr" x="510" y="61" width="3" height="18.8" rx="1.5"/><rect class="wf-sr" x="515" y="61" width="3" height="30.2" rx="1.5"/><rect class="wf-sr" x="520" y="61" width="3" height="27.3" rx="1.5"/><rect class="wf-you" x="525" y="41.9" width="3" height="17.1" rx="1.5"/><rect class="wf-sr" x="525" y="61" width="3" height="49.0" rx="1.5"/><rect class="wf-you" x="530" y="14.4" width="3" height="44.6" rx="1.5"/><rect class="wf-sr" x="530" y="61" width="3" height="20.7" rx="1.5"/><rect class="wf-you" x="535" y="41.2" width="3" height="17.8" rx="1.5"/><rect class="wf-sr" x="535" y="61" width="3" height="34.5" rx="1.5"/><rect class="wf-you" x="540" y="35.6" width="3" height="23.4" rx="1.5"/><rect class="wf-sr" x="540" y="61" width="3" height="17.4" rx="1.5"/><rect class="wf-you" x="545" y="46.0" width="3" height="13.0" rx="1.5"/><rect class="wf-sr" x="545" y="61" width="3" height="31.8" rx="1.5"/><rect class="wf-sr" x="550" y="61" width="3" height="27.6" rx="1.5"/><rect class="wf-sr" x="555" y="61" width="3" height="43.6" rx="1.5"/><rect class="wf-sr" x="560" y="61" width="3" height="33.0" rx="1.5"/><rect class="wf-sr" x="565" y="61" width="3" height="27.0" rx="1.5"/><rect class="wf-sr" x="570" y="61" width="3" height="16.2" rx="1.5"/><rect class="wf-sr" x="575" y="61" width="3" height="23.2" rx="1.5"/><rect class="wf-sr" x="580" y="61" width="3" height="38.6" rx="1.5"/><rect class="wf-sr" x="585" y="61" width="3" height="22.3" rx="1.5"/><rect class="wf-sr" x="590" y="61" width="3" height="37.5" rx="1.5"/><rect class="wf-sr" x="595" y="61" width="3" height="14.3" rx="1.5"/><rect class="wf-sr" x="600" y="61" width="3" height="14.9" rx="1.5"/><rect class="wf-sr" x="605" y="61" width="3" height="16.6" rx="1.5"/><rect class="wf-sr" x="610" y="61" width="3" height="32.3" rx="1.5"/><rect class="wf-sr" x="615" y="61" width="3" height="23.2" rx="1.5"/><rect class="wf-sr" x="620" y="61" width="3" height="25.8" rx="1.5"/><rect class="wf-sr" x="625" y="61" width="3" height="17.0" rx="1.5"/><rect class="wf-sr" x="630" y="61" width="3" height="11.2" rx="1.5"/><rect class="wf-sr" x="635" y="61" width="3" height="18.1" rx="1.5"/><rect class="wf-sr" x="640" y="61" width="3" height="14.5" rx="1.5"/><rect class="wf-sr" x="645" y="61" width="3" height="21.6" rx="1.5"/><rect class="wf-sr" x="650" y="61" width="3" height="8.4" rx="1.5"/><rect class="wf-sr" x="655" y="61" width="3" height="10.0" rx="1.5"/><rect class="wf-sr" x="660" y="61" width="3" height="4.6" rx="1.5"/><rect class="wf-sr" x="665" y="61" width="3" height="6.3" rx="1.5"/><rect class="wf-rest" x="670" y="59" width="3" height="2" rx="1"/><rect class="wf-rest" x="675" y="59" width="3" height="2" rx="1"/>
	<text class="wf-label" x="0" y="10">you</text>
	<text class="wf-label sr" x="680" y="118" text-anchor="end">speakrail</text>
</svg>
		</figure>
		<div class="stats">
			<div class="stat ours"><div class="num">94.0</div><div class="lbl">conversational dynamics, top open-weights</div></div>
			<div class="stat"><div class="num">0.7<small>s</small></div><div class="lbl">median reply, last word to ear</div></div>
			<div class="stat"><div class="num">80<small>ms</small></div><div class="lbl">turn-head step</div></div>
			<div class="stat"><div class="num">24<small>GB</small></div><div class="lbl">one consumer GPU</div></div>
		</div>
	</header>

	<!-- ============================================================ 01 COLOR -->
	<div class="section-head">
		<p class="overline">01 · Color</p>
		<h2>One pink, warm neutrals</h2>
	</div>
	<p>
		Three seeds define everything: the black page <code>#161414</code>, the primary white
		<code>#fcf5f7</code> and the primary pink <code>#f59eb9</code>. Every neutral sits on the
		white's hue in OKLCH, with lightness solved for a target contrast rather than picked by eye.
		Pink is never a background for content. It marks what matters: links, our results, the one
		primary action.
	</p>
	{#each groups as g (g.name)}
		<h4>{g.name}</h4>
		<div class="swatches" class:seeds={g.name === 'Seeds'}>
			{#each g.items as s (s.token + s.hex)}
				<div class="sw">
					<i style:background={s.hex}></i>
					<b>{s.token}</b>
					<span>{s.hex} · {s.token === 'surface-0' ? 'page' : s.ratio}</span>
					<span>{s.note}</span>
				</div>
			{/each}
		</div>
	{/each}
	<p class="help">Contrast is measured against the page. Text tokens stay above target on every surface up to level 2.</p>

	<!-- ============================================================ 02 ELEVATION -->
	<div class="section-head">
		<p class="overline">02 · Elevation</p>
		<h2>Height is light</h2>
	</div>
	<p>
		On a near-black page a shadow has nowhere to fall, so height is carried by lightness. Each
		level is a step brighter (+0.025 OKLCH L), gets a hairline catching light from above, and
		casts a shadow that only becomes visible at levels 3 and 4, where floating surfaces need to
		separate from whatever they cover. Wells, like code blocks and inputs, sink one step below the
		page.
	</p>
	<div class="levels">
		{#each levels as l (l.id)}
			<div class="level lv-{l.id}">
				<span class="lv-num">{l.level}</span>
				<span class="lv-hex">{l.hex}</span>
				<span class="lv-use">{l.use}</span>
			</div>
		{/each}
	</div>

	<div class="stage" aria-label="Elevation demo">
		<div class="card stage-card">
			<p class="overline">Level 1 · card</p>
			<h4>Knowing when you're done talking</h4>
			<p>A turn-taking head on the recognizer's hidden states.</p>
			<pre class="well stage-well"><code><span class="tok-p">$ </span>docker compose up -d</code></pre>
		</div>
		<div class="menu stage-menu" role="menu" aria-label="Level 3 menu">
			<button class="menu-item active" role="menuitem">Copy link <kbd>⌘C</kbd></button>
			<button class="menu-item" role="menuitem">Open in GitHub</button>
			<div class="menu-sep"></div>
			<button class="menu-item" role="menuitem">Download PDF</button>
		</div>
		<div class="dialog stage-dialog" role="dialog" aria-label="Level 4 dialog">
			<p class="overline">Level 4 · dialog</p>
			<h3>Allow the microphone?</h3>
			<p>Browsers only allow it on localhost or over HTTPS.</p>
			<div class="actions">
				<button class="btn btn-ghost btn-sm">Not now</button>
				<button class="btn btn-primary btn-sm">Allow</button>
			</div>
		</div>
	</div>

	<div class="table-wrap">
		<table class="data config">
			<thead><tr><th>Level</th><th>Surface</th><th>Edge + shadow</th><th>Used for</th></tr></thead>
			<tbody>
				{#each levels as l (l.id)}
					<tr><td>{l.level}</td><td>{l.hex}</td><td>{l.ring}</td><td>{l.use}</td></tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- ============================================================ 03 TYPE -->
	<div class="section-head">
		<p class="overline">03 · Typography</p>
		<h2>Two faces, nothing else</h2>
	</div>
	<div class="faces">
		<div class="face card">
			<span class="face-aa read">Aa</span>
			<b>Kripa</b>
			<span class="help">Reading + UI · variable 100–900 · body 340</span>
		</div>
		<div class="face card">
			<span class="face-aa mono">Aa</span>
			<b>Lilex</b>
			<span class="help">Code + data · variable 100–700 · code 360</span>
		</div>
	</div>

	<div class="spec">
		<div><span class="k">display · 55 / 1.1</span><span class="t-display">Full duplex</span></div>
		<div><span class="k">h1 · 35 / 1.2</span><span class="t-h1">Knowing when you're done</span></div>
		<div><span class="k">h2 · 28 / 1.2</span><span class="t-h2">How turn-taking works</span></div>
		<div><span class="k">h3 · 22.5 / 1.2</span><span class="t-h3">Peek and speculation</span></div>
		<div><span class="k">h4 · 18 / 1.2 · 600</span><span class="t-h4">Limitations</span></div>
		<div><span class="k">lede · 21 / 1.7</span><span class="t-lede">Most assistants wait for silence.</span></div>
		<div><span class="k">body · 18 / 1.9 · 340</span><span>The reply reaches your ear about 0.7 s after your last word.</span></div>
		<div><span class="k">ui · 15 / 1.4</span><span class="t-ui">Reports · Design · GitHub</span></div>
		<div><span class="k">caption · 13 / 1.6</span><span class="t-cap">Figure 1. Median latency on recorded conversations.</span></div>
		<div><span class="k">overline · lilex 13</span><span class="overline">01 · Color</span></div>
		<div><span class="k">code · lilex 16 / 1.9 · 360</span><code class="t-code">docker compose logs -f</code></div>
	</div>

	<h4>Kripa weights</h4>
	<div class="waterfall">
		{#each [200, 300, 340, 400, 500, 600, 700, 800] as w (w)}
			<div><span class="k">{w}</span><span style:font-weight={w}>Speak while listening</span></div>
		{/each}
	</div>

	<h4>Lilex ligatures and look-alikes</h4>
	<pre class="well"><code>-&gt; =&gt; != === &gt;= &lt;= :: |&gt; &lt;/ /&gt; www
0O 1lI 5S 8B  rn m  {'{'} [ ( ) ] {'}'}</code></pre>

	<!-- ============================================================ 04 REPORT -->
	<div class="section-head" id="reports">
		<p class="overline">04 · Report</p>
		<h2>A sample technical report</h2>
	</div>
	<p class="help">Everything below is how a real report renders: plain markdown elements plus figures.</p>

	<article class="prose report">
		<div class="report-meta">
			<span class="badge accent">REPORT</span>
			<span class="badge">v0.2</span>
			<span class="meta">October 2026 · 12 min read</span>
		</div>
		<h1>Knowing when you're <em class="brand">done</em> talking</h1>
		<p class="lede">
			Most voice assistants wait for silence. That's why they cut you off when you pause to think,
			and feel slow when you're clearly finished.
		</p>
		<p>
			Speakrail listens to <em>how</em> you're speaking. A small head on the recognizer's hidden
			states decides, every 80&nbsp;ms, whether you're <strong>speaking</strong>, <strong>finished</strong>,
			pausing mid-thought, or just backchanneling<sup class="fn"><a href="#fn1">1</a></sup>. The
			<a href="https://huggingface.co/speakrail/Voxtral-Mini-4B-Realtime-2602-TurnHead">model card</a>
			has the training details. The whole stack starts with <code>docker compose up -d</code>; press
			<kbd>⌘</kbd> <kbd>K</kbd> in the debug view to jump to any turn.
		</p>

		<figure>
			<div class="figure-panel elev-1">
				<div class="fig-title">The pipeline</div>
				<div class="fig-sub">Three models on one 24 GB card. Pink is where Speakrail's own weights live.</div>
				<svg class="diagram" viewBox="0 0 680 210" role="img" aria-label="Pipeline: microphone to Voxtral Mini 4B with a turn-taking head, every 80 ms; to Gemma 4 12B with the Speakrail LoRA, which makes one decision per event in about 60 ms; to Breeze TTS 2; to the speaker. Median 0.7 to 0.8 seconds end to end.">
	<defs><marker id="pl-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L8 4L0 8z" class="pl-headfill"/></marker></defs>
	<g class="pl-glyph" transform="translate(6 65.0)"><rect x="7" y="0" width="12" height="18" rx="6"/><path d="M2 12a11 11 0 0 0 22 0M13 23v5"/></g><g class="pl-glyph" transform="translate(650 66.0)"><path d="M2 9h5l7-6v20l-7-6H2z"/><path d="M18 8a6 6 0 0 1 0 10M21 4a11 11 0 0 1 0 18"/></g><path class="pl-arrow" d="M44 79.0H50" marker-end="url(#pl-head)"/><path class="pl-arrow" d="M236 79.0H242" marker-end="url(#pl-head)"/><path class="pl-arrow" d="M428 79.0H434" marker-end="url(#pl-head)"/><path class="pl-arrow" d="M620 79.0H636" marker-end="url(#pl-head)"/><rect class="pl-node" x="56" y="40" width="176" height="78" rx="10"/><text class="pl-title" x="72" y="73">Voxtral Mini 4B</text><text class="pl-sub" x="72" y="96">audio.cpp · turn head</text><rect class="pl-node ours" x="248" y="40" width="176" height="78" rx="10"/><text class="pl-title ours" x="264" y="73">Gemma 4 12B</text><text class="pl-sub" x="264" y="96">+ Speakrail LoRA</text><rect class="pl-node" x="440" y="40" width="176" height="78" rx="10"/><text class="pl-title" x="456" y="73">Breeze TTS 2</text><text class="pl-sub" x="456" y="96">streaming voice</text><path class="pl-tick" d="M144.0 124v10"/><text class="pl-ann" x="144.0" y="152" text-anchor="middle">every 80 ms</text><path class="pl-tick" d="M336.0 124v10"/><text class="pl-ann" x="336.0" y="152" text-anchor="middle">1 token ≈ 60 ms</text><path class="pl-tick" d="M528.0 124v10"/><text class="pl-ann" x="528.0" y="152" text-anchor="middle">first audio ≈ 0.2 s</text><text class="pl-ann" x="336.0" y="24" text-anchor="middle">speak · listen · interrupt · yield · interject</text><path class="pl-bracket" d="M40 172v6H642v-6"/><text class="pl-ann strong" x="340.0" y="200" text-anchor="middle">0.7–0.8 s from your last word to the reply (median)</text>
</svg>
			</div>
			<figcaption>Figure 1. Audio flows left to right; every stage streams, nothing waits for a full sentence.</figcaption>
		</figure>

		<h2>How turn-taking works</h2>
		<p>
			Silence alone is a bad signal. People pause mid-sentence, trail off, and say
			<mark>"mm-hmm"</mark> without wanting the floor. Speakrail splits the problem in two:
		</p>
		<ul>
			<li><strong>The turn head</strong> reads Voxtral's hidden states and outputs four probabilities every 80&nbsp;ms.</li>
			<li><strong>The turn-taking LLM</strong>, Gemma 4 12B with a LoRA, reads your words as they arrive and makes each decision in a single token, in about 60&nbsp;ms.</li>
			<li><strong>Listening notes</strong> capture what you want while you're still talking, so corrected requests come out right.</li>
		</ul>

		<figure>
			<div class="figure-panel elev-1">
				<div class="fig-title">One exchange, second by second</div>
				<div class="fig-sub">The pause stays under the threshold; the real end of turn crosses it at once.</div>
				<svg class="diagram" viewBox="0 0 680 244" role="img" aria-label="Timeline of one exchange. The user pauses mid-sentence; the turn head's probability that the user is done rises to 0.35, below the 0.5 threshold, so Speakrail holds. When the user finishes, the probability jumps above 0.5 and Speakrail replies 0.7 seconds later. A mm-hmm backchannel during the reply dips the probability but stays above threshold, so Speakrail keeps talking.">
	<text class="tl-lane" x="82" y="41" text-anchor="end">you</text><text class="tl-lane sr" x="82" y="91" text-anchor="end">speakrail</text><rect class="tl-you" x="96.0" y="24" width="151.5" height="26" rx="6"/><text class="tl-say" x="106.0" y="41.5">what’s the weather…</text><rect class="tl-you" x="304.3" y="24" width="94.7" height="26" rx="6"/><text class="tl-say" x="314.3" y="41.5">…in Lisbon?</text><rect class="tl-you" x="522.0" y="24" width="75.7" height="26" rx="6"/><text class="tl-say" x="532.0" y="41.5">mm-hmm</text><rect class="tl-pause" x="250.5" y="24" width="50.8" height="26" rx="6"/><text class="tl-note" x="275.9" y="41.5" text-anchor="middle">pause</text><rect class="tl-sr" x="465.2" y="74" width="198.8" height="26" rx="6"/><text class="tl-say sr" x="475.2" y="91.5">sunny, 24° and breezy…</text><path class="tl-bracket" d="M398.9 54V87.0H461.2"/><text class="tl-note pink" x="432.1" y="81.0" text-anchor="middle">0.7 s</text><rect class="tl-plot" x="96" y="140" width="568" height="72" rx="4"/><path class="tl-area" d="M96.0 208.4 L97.9 208.4 L99.8 208.4 L101.7 208.4 L103.6 208.4 L105.5 208.4 L107.4 208.4 L109.3 208.4 L111.1 208.4 L113.0 208.4 L114.9 208.4 L116.8 208.4 L118.7 208.4 L120.6 208.4 L122.5 208.4 L124.4 208.4 L126.3 208.4 L128.2 208.4 L130.1 208.4 L132.0 208.4 L133.9 208.4 L135.8 208.4 L137.7 208.4 L139.5 208.4 L141.4 208.4 L143.3 208.4 L145.2 208.4 L147.1 208.4 L149.0 208.4 L150.9 208.4 L152.8 208.4 L154.7 208.4 L156.6 208.4 L158.5 208.4 L160.4 208.4 L162.3 208.4 L164.2 208.4 L166.1 208.4 L167.9 208.4 L169.8 208.4 L171.7 208.4 L173.6 208.4 L175.5 208.4 L177.4 208.4 L179.3 208.4 L181.2 208.4 L183.1 208.4 L185.0 208.4 L186.9 208.4 L188.8 208.4 L190.7 208.4 L192.6 208.4 L194.5 208.4 L196.3 208.4 L198.2 208.4 L200.1 208.4 L202.0 208.4 L203.9 208.4 L205.8 208.4 L207.7 208.4 L209.6 208.4 L211.5 208.4 L213.4 208.4 L215.3 208.4 L217.2 208.4 L219.1 208.4 L221.0 208.4 L222.9 208.4 L224.7 208.3 L226.6 208.3 L228.5 208.3 L230.4 208.2 L232.3 208.1 L234.2 207.9 L236.1 207.7 L238.0 207.4 L239.9 207.0 L241.8 206.4 L243.7 205.8 L245.6 204.9 L247.5 203.9 L249.4 202.6 L251.3 201.2 L253.1 199.6 L255.0 197.9 L256.9 196.1 L258.8 194.2 L260.7 192.4 L262.6 190.8 L264.5 189.3 L266.4 188.1 L268.3 187.3 L270.2 186.9 L272.1 186.9 L274.0 187.3 L275.9 188.1 L277.8 189.3 L279.7 190.8 L281.5 192.4 L283.4 194.2 L285.3 196.1 L287.2 197.9 L289.1 199.6 L291.0 201.2 L292.9 202.6 L294.8 203.9 L296.7 204.9 L298.6 205.8 L300.5 206.4 L302.4 207.0 L304.3 207.4 L306.2 207.7 L308.1 207.9 L309.9 208.1 L311.8 208.2 L313.7 208.3 L315.6 208.3 L317.5 208.3 L319.4 208.4 L321.3 208.4 L323.2 208.4 L325.1 208.4 L327.0 208.4 L328.9 208.4 L330.8 208.4 L332.7 208.4 L334.6 208.4 L336.5 208.4 L338.3 208.4 L340.2 208.4 L342.1 208.4 L344.0 208.4 L345.9 208.4 L347.8 208.4 L349.7 208.4 L351.6 208.4 L353.5 208.4 L355.4 208.4 L357.3 208.4 L359.2 208.4 L361.1 208.4 L363.0 208.4 L364.9 208.4 L366.7 208.4 L368.6 208.4 L370.5 208.4 L372.4 208.4 L374.3 208.4 L376.2 208.3 L378.1 208.3 L380.0 208.2 L381.9 208.2 L383.8 208.0 L385.7 207.9 L387.6 207.6 L389.5 207.2 L391.4 206.7 L393.3 205.9 L395.1 204.7 L397.0 203.0 L398.9 200.7 L400.8 197.5 L402.7 193.4 L404.6 188.3 L406.5 182.4 L408.4 176.0 L410.3 169.6 L412.2 163.7 L414.1 158.6 L416.0 154.5 L417.9 151.3 L419.8 149.0 L421.7 147.3 L423.5 146.1 L425.4 145.3 L427.3 144.8 L429.2 144.4 L431.1 144.1 L433.0 144.0 L434.9 143.8 L436.8 143.8 L438.7 143.7 L440.6 143.7 L442.5 143.6 L444.4 143.6 L446.3 143.6 L448.2 143.6 L450.1 143.6 L451.9 143.6 L453.8 143.6 L455.7 143.6 L457.6 143.6 L459.5 143.6 L461.4 143.6 L463.3 143.6 L465.2 143.6 L467.1 143.6 L469.0 143.6 L470.9 143.6 L472.8 143.6 L474.7 143.6 L476.6 143.6 L478.5 143.6 L480.3 143.6 L482.2 143.6 L484.1 143.6 L486.0 143.6 L487.9 143.6 L489.8 143.6 L491.7 143.6 L493.6 143.6 L495.5 143.6 L497.4 143.6 L499.3 143.6 L501.2 143.6 L503.1 143.6 L505.0 143.6 L506.9 143.6 L508.7 143.6 L510.6 143.6 L512.5 143.7 L514.4 143.7 L516.3 143.8 L518.2 143.8 L520.1 144.0 L522.0 144.1 L523.9 144.4 L525.8 144.7 L527.7 145.1 L529.6 145.6 L531.5 146.3 L533.4 147.2 L535.3 148.2 L537.1 149.4 L539.0 150.8 L540.9 152.2 L542.8 153.9 L544.7 155.5 L546.6 157.2 L548.5 158.7 L550.4 160.2 L552.3 161.4 L554.2 162.3 L556.1 162.8 L558.0 163.0 L559.9 162.8 L561.8 162.3 L563.7 161.4 L565.5 160.2 L567.4 158.7 L569.3 157.2 L571.2 155.5 L573.1 153.9 L575.0 152.2 L576.9 150.8 L578.8 149.4 L580.7 148.2 L582.6 147.2 L584.5 146.3 L586.4 145.6 L588.3 145.1 L590.2 144.7 L592.1 144.4 L593.9 144.1 L595.8 144.0 L597.7 143.8 L599.6 143.8 L601.5 143.7 L603.4 143.7 L605.3 143.6 L607.2 143.6 L609.1 143.6 L611.0 143.6 L612.9 143.6 L614.8 143.6 L616.7 143.6 L618.6 143.6 L620.5 143.6 L622.3 143.6 L624.2 143.6 L626.1 143.6 L628.0 143.6 L629.9 143.6 L631.8 143.6 L633.7 143.6 L635.6 143.6 L637.5 143.6 L639.4 143.6 L641.3 143.6 L643.2 143.6 L645.1 143.6 L647.0 143.6 L648.9 143.6 L650.7 143.6 L652.6 143.6 L654.5 143.6 L656.4 143.6 L658.3 143.6 L660.2 143.6 L662.1 143.6 L664.0 143.6 L664 212 L96 212Z"/><path class="tl-thresh" d="M96 176.0H664"/><path class="tl-curve" d="M96.0 208.4 L97.9 208.4 L99.8 208.4 L101.7 208.4 L103.6 208.4 L105.5 208.4 L107.4 208.4 L109.3 208.4 L111.1 208.4 L113.0 208.4 L114.9 208.4 L116.8 208.4 L118.7 208.4 L120.6 208.4 L122.5 208.4 L124.4 208.4 L126.3 208.4 L128.2 208.4 L130.1 208.4 L132.0 208.4 L133.9 208.4 L135.8 208.4 L137.7 208.4 L139.5 208.4 L141.4 208.4 L143.3 208.4 L145.2 208.4 L147.1 208.4 L149.0 208.4 L150.9 208.4 L152.8 208.4 L154.7 208.4 L156.6 208.4 L158.5 208.4 L160.4 208.4 L162.3 208.4 L164.2 208.4 L166.1 208.4 L167.9 208.4 L169.8 208.4 L171.7 208.4 L173.6 208.4 L175.5 208.4 L177.4 208.4 L179.3 208.4 L181.2 208.4 L183.1 208.4 L185.0 208.4 L186.9 208.4 L188.8 208.4 L190.7 208.4 L192.6 208.4 L194.5 208.4 L196.3 208.4 L198.2 208.4 L200.1 208.4 L202.0 208.4 L203.9 208.4 L205.8 208.4 L207.7 208.4 L209.6 208.4 L211.5 208.4 L213.4 208.4 L215.3 208.4 L217.2 208.4 L219.1 208.4 L221.0 208.4 L222.9 208.4 L224.7 208.3 L226.6 208.3 L228.5 208.3 L230.4 208.2 L232.3 208.1 L234.2 207.9 L236.1 207.7 L238.0 207.4 L239.9 207.0 L241.8 206.4 L243.7 205.8 L245.6 204.9 L247.5 203.9 L249.4 202.6 L251.3 201.2 L253.1 199.6 L255.0 197.9 L256.9 196.1 L258.8 194.2 L260.7 192.4 L262.6 190.8 L264.5 189.3 L266.4 188.1 L268.3 187.3 L270.2 186.9 L272.1 186.9 L274.0 187.3 L275.9 188.1 L277.8 189.3 L279.7 190.8 L281.5 192.4 L283.4 194.2 L285.3 196.1 L287.2 197.9 L289.1 199.6 L291.0 201.2 L292.9 202.6 L294.8 203.9 L296.7 204.9 L298.6 205.8 L300.5 206.4 L302.4 207.0 L304.3 207.4 L306.2 207.7 L308.1 207.9 L309.9 208.1 L311.8 208.2 L313.7 208.3 L315.6 208.3 L317.5 208.3 L319.4 208.4 L321.3 208.4 L323.2 208.4 L325.1 208.4 L327.0 208.4 L328.9 208.4 L330.8 208.4 L332.7 208.4 L334.6 208.4 L336.5 208.4 L338.3 208.4 L340.2 208.4 L342.1 208.4 L344.0 208.4 L345.9 208.4 L347.8 208.4 L349.7 208.4 L351.6 208.4 L353.5 208.4 L355.4 208.4 L357.3 208.4 L359.2 208.4 L361.1 208.4 L363.0 208.4 L364.9 208.4 L366.7 208.4 L368.6 208.4 L370.5 208.4 L372.4 208.4 L374.3 208.4 L376.2 208.3 L378.1 208.3 L380.0 208.2 L381.9 208.2 L383.8 208.0 L385.7 207.9 L387.6 207.6 L389.5 207.2 L391.4 206.7 L393.3 205.9 L395.1 204.7 L397.0 203.0 L398.9 200.7 L400.8 197.5 L402.7 193.4 L404.6 188.3 L406.5 182.4 L408.4 176.0 L410.3 169.6 L412.2 163.7 L414.1 158.6 L416.0 154.5 L417.9 151.3 L419.8 149.0 L421.7 147.3 L423.5 146.1 L425.4 145.3 L427.3 144.8 L429.2 144.4 L431.1 144.1 L433.0 144.0 L434.9 143.8 L436.8 143.8 L438.7 143.7 L440.6 143.7 L442.5 143.6 L444.4 143.6 L446.3 143.6 L448.2 143.6 L450.1 143.6 L451.9 143.6 L453.8 143.6 L455.7 143.6 L457.6 143.6 L459.5 143.6 L461.4 143.6 L463.3 143.6 L465.2 143.6 L467.1 143.6 L469.0 143.6 L470.9 143.6 L472.8 143.6 L474.7 143.6 L476.6 143.6 L478.5 143.6 L480.3 143.6 L482.2 143.6 L484.1 143.6 L486.0 143.6 L487.9 143.6 L489.8 143.6 L491.7 143.6 L493.6 143.6 L495.5 143.6 L497.4 143.6 L499.3 143.6 L501.2 143.6 L503.1 143.6 L505.0 143.6 L506.9 143.6 L508.7 143.6 L510.6 143.6 L512.5 143.7 L514.4 143.7 L516.3 143.8 L518.2 143.8 L520.1 144.0 L522.0 144.1 L523.9 144.4 L525.8 144.7 L527.7 145.1 L529.6 145.6 L531.5 146.3 L533.4 147.2 L535.3 148.2 L537.1 149.4 L539.0 150.8 L540.9 152.2 L542.8 153.9 L544.7 155.5 L546.6 157.2 L548.5 158.7 L550.4 160.2 L552.3 161.4 L554.2 162.3 L556.1 162.8 L558.0 163.0 L559.9 162.8 L561.8 162.3 L563.7 161.4 L565.5 160.2 L567.4 158.7 L569.3 157.2 L571.2 155.5 L573.1 153.9 L575.0 152.2 L576.9 150.8 L578.8 149.4 L580.7 148.2 L582.6 147.2 L584.5 146.3 L586.4 145.6 L588.3 145.1 L590.2 144.7 L592.1 144.4 L593.9 144.1 L595.8 144.0 L597.7 143.8 L599.6 143.8 L601.5 143.7 L603.4 143.7 L605.3 143.6 L607.2 143.6 L609.1 143.6 L611.0 143.6 L612.9 143.6 L614.8 143.6 L616.7 143.6 L618.6 143.6 L620.5 143.6 L622.3 143.6 L624.2 143.6 L626.1 143.6 L628.0 143.6 L629.9 143.6 L631.8 143.6 L633.7 143.6 L635.6 143.6 L637.5 143.6 L639.4 143.6 L641.3 143.6 L643.2 143.6 L645.1 143.6 L647.0 143.6 L648.9 143.6 L650.7 143.6 L652.6 143.6 L654.5 143.6 L656.4 143.6 L658.3 143.6 L660.2 143.6 L662.1 143.6 L664.0 143.6"/><text class="tl-axis" x="82" y="180.0" text-anchor="end">0.5</text><text class="tl-lane" x="82" y="152" text-anchor="end">p(done)</text><circle class="tl-dot " cx="271.1" cy="186.8" r="4"/><text class="tl-note " x="271.1" y="164.8" text-anchor="middle">hold</text><circle class="tl-dot pink" cx="415.0" cy="156.4" r="4"/><text class="tl-note pink" x="405.0" y="160.4" text-anchor="end">speak</text><circle class="tl-dot " cx="558.0" cy="163.0" r="4"/><text class="tl-note " x="558.0" y="204.0" text-anchor="middle">keep talking</text><path class="tl-ticks" d="M96.0 216v6M103.6 216v3M111.1 216v3M118.7 216v3M126.3 216v3M133.9 216v3M141.4 216v3M149.0 216v3M156.6 216v3M164.2 216v3M171.7 216v3M179.3 216v3M186.9 216v3M194.5 216v3M202.0 216v3M209.6 216v3M217.2 216v3M224.7 216v3M232.3 216v3M239.9 216v3M247.5 216v3M255.0 216v3M262.6 216v3M270.2 216v3M277.8 216v3M285.3 216v6M292.9 216v3M300.5 216v3M308.1 216v3M315.6 216v3M323.2 216v3M330.8 216v3M338.3 216v3M345.9 216v3M353.5 216v3M361.1 216v3M368.6 216v3M376.2 216v3M383.8 216v3M391.4 216v3M398.9 216v3M406.5 216v3M414.1 216v3M421.7 216v3M429.2 216v3M436.8 216v3M444.4 216v3M451.9 216v3M459.5 216v3M467.1 216v3M474.7 216v6M482.2 216v3M489.8 216v3M497.4 216v3M505.0 216v3M512.5 216v3M520.1 216v3M527.7 216v3M535.3 216v3M542.8 216v3M550.4 216v3M558.0 216v3M565.5 216v3M573.1 216v3M580.7 216v3M588.3 216v3M595.8 216v3M603.4 216v3M611.0 216v3M618.6 216v3M626.1 216v3M633.7 216v3M641.3 216v3M648.9 216v3M656.4 216v3M664.0 216v6"/><text class="tl-axis" x="96.0" y="238" text-anchor="middle">0 s</text><text class="tl-axis" x="190.7" y="238" text-anchor="middle">1 s</text><text class="tl-axis" x="285.3" y="238" text-anchor="middle">2 s</text><text class="tl-axis" x="380.0" y="238" text-anchor="middle">3 s</text><text class="tl-axis" x="474.7" y="238" text-anchor="middle">4 s</text><text class="tl-axis" x="569.3" y="238" text-anchor="middle">5 s</text><text class="tl-axis" x="664.0" y="238" text-anchor="middle">6 s</text>
</svg>
			</div>
			<figcaption>Figure 2. Illustrative trace. Tick marks along the axis are the head's 80 ms steps.</figcaption>
		</figure>

		<h3>Five decisions</h3>
		<p>On every event, the model emits exactly one of:</p>
		<ol>
			<li><code>speak</code>: take the turn and start replying.</li>
			<li><code>listen</code>: keep listening, the user isn't done.</li>
			<li><code>interrupt</code>: cut in, because the user asked to be stopped or is clearly wrong about something.</li>
			<li><code>yield</code>: stop talking, the user is taking the floor.</li>
			<li><code>interject</code>: add something brief without taking the turn, like counting reps.</li>
		</ol>

		<blockquote>
			You can interrupt it, say "mm-hmm" without stopping it, and pause mid-sentence without being cut off.
			<cite>— Speakrail README</cite>
		</blockquote>

		<h2>Results</h2>
		<p>
			On Full-Duplex-Bench v1.0 and v1.5, scored with the Artificial Analysis formula, Speakrail
			reaches <strong>94.0</strong> on conversational dynamics, the top open-weights score.
		</p>

		<figure>
			<div class="figure-panel elev-1">
				<div class="fig-title">Conversational dynamics</div>
				<div class="fig-sub">Full-Duplex-Bench, Artificial Analysis formula. Higher is better.</div>
				<svg class="chart" viewBox="0 0 680 156" role="img" aria-label="Bar chart of conversational dynamics scores: Speakrail 94.0, baseline a 89.6, baseline b 87.0, cascade 69.1."><line class="grid" x1="100.0" x2="100.0" y1="0" y2="128"/><text x="100.0" y="148" text-anchor="middle">0</text><line class="grid" x1="208.0" x2="208.0" y1="0" y2="128"/><text x="208.0" y="148" text-anchor="middle">20</text><line class="grid" x1="316.0" x2="316.0" y1="0" y2="128"/><text x="316.0" y="148" text-anchor="middle">40</text><line class="grid" x1="424.0" x2="424.0" y1="0" y2="128"/><text x="424.0" y="148" text-anchor="middle">60</text><line class="grid" x1="532.0" x2="532.0" y1="0" y2="128"/><text x="532.0" y="148" text-anchor="middle">80</text><line class="grid" x1="640.0" x2="640.0" y1="0" y2="128"/><text x="640.0" y="148" text-anchor="middle">100</text><text class="lbl ours" x="88" y="19" text-anchor="end">speakrail</text><rect class="bar ours" x="100" y="5" width="507.6" height="20" rx="3"/><text class="val ours" x="615.6" y="19">94.0</text><text class="lbl" x="88" y="51" text-anchor="end">baseline a</text><rect class="bar" x="100" y="37" width="483.8" height="20" rx="3"/><text class="val" x="591.8" y="51">89.6</text><text class="lbl" x="88" y="83" text-anchor="end">baseline b</text><rect class="bar" x="100" y="69" width="469.8" height="20" rx="3"/><text class="val" x="577.8" y="83">87.0</text><text class="lbl" x="88" y="115" text-anchor="end">cascade</text><rect class="bar" x="100" y="101" width="373.1" height="20" rx="3"/><text class="val" x="481.1" y="115">69.1</text></svg>
			</div>
			<figcaption>Figure 3. Speakrail in pink, everyone else in grey. Baseline values are placeholders.</figcaption>
		</figure>

		<div class="table-wrap">
			<table class="data">
				<thead><tr><th>System</th><th>Pause</th><th>Turn-taking</th><th>Interrupt</th><th>Backchannel</th><th>Overall</th></tr></thead>
				<tbody>
					<tr class="ours"><td>speakrail</td><td class="best">96.1</td><td>93.4</td><td class="best">92.8</td><td class="best">94.2</td><td class="best">94.0</td></tr>
					<tr><td>baseline a</td><td>91.2</td><td class="best">94.1</td><td>85.5</td><td>88.7</td><td>89.6</td></tr>
					<tr><td>baseline b</td><td>88.4</td><td>87.9</td><td>90.3</td><td>82.1</td><td>87.0</td></tr>
					<tr><td>cascade</td><td>72.5</td><td>80.2</td><td>61.8</td><td>55.4</td><td>69.1</td></tr>
				</tbody>
			</table>
		</div>
		<p class="help">Table 1. Best per column in pink, even when it isn't ours. Placeholder data except overall.</p>

		<h3>Latency</h3>
		<p>On real recorded conversations the reply reaches your ear about 0.7–0.8&nbsp;s after your last word (median).</p>
		<figure>
			<div class="figure-panel elev-1">
				<div class="fig-title">Latency distribution</div>
				<div class="fig-sub">Share of turns answered within a given time.</div>
				<svg class="chart" viewBox="0 0 640 215" role="img" aria-label="Cumulative latency curves: Speakrail answers most turns within 1 second; the baselines are slower.">
	<line class="grid" x1="44" x2="44" y1="18" y2="190"/><line class="grid" x1="230.7" x2="230.7" y1="18" y2="190"/><line class="grid" x1="417.3" x2="417.3" y1="18" y2="190"/><line class="grid" x1="604" x2="604" y1="18" y2="190"/>
	<line class="grid" x1="44" x2="604" y1="190" y2="190"/><line class="grid" x1="44" x2="604" y1="104" y2="104"/><line class="grid" x1="44" x2="604" y1="18" y2="18"/>
	<text x="44" y="208" text-anchor="middle">0 s</text><text x="230.7" y="208" text-anchor="middle">1 s</text><text x="417.3" y="208" text-anchor="middle">2 s</text><text x="604" y="208" text-anchor="middle">3 s</text>
	<text x="36" y="194" text-anchor="end">0%</text><text x="36" y="108" text-anchor="end">50%</text><text x="36" y="22" text-anchor="end">100%</text>
	<path class="line b2" d="M44.0 189.4L72.0 189.0L100.0 188.4L128.0 187.2L156.0 185.3L184.0 182.1L212.0 177.0L230.7 171.9L249.3 165.3L268.0 156.7L286.7 146.1L305.3 133.5L324.0 119.2L342.7 104.0L361.3 88.8L380.0 74.5L398.7 61.9L417.3 51.3L436.0 42.7L454.7 36.1L473.3 31.0L492.0 27.3L510.7 24.6L529.3 22.7L548.0 21.3L566.7 20.3L585.3 19.6L604.0 19.2"/>
	<path class="line b1" d="M44.0 189.7L72.0 189.5L100.0 188.8L128.0 187.6L156.0 185.0L174.7 181.8L193.3 177.0L212.0 169.5L230.7 158.6L249.3 143.7L268.0 125.1L286.7 104.0L305.3 82.9L324.0 64.3L342.7 49.4L361.3 38.5L380.0 31.0L398.7 26.2L417.3 23.0L436.0 21.1L454.7 19.9L473.3 19.2L492.0 18.7L520.0 18.3L548.0 18.2L604.0 18.0"/>
	<path class="line ours" d="M44.0 189.7L62.7 189.2L81.3 188.3L100.0 186.0L118.7 181.2L137.3 171.0L156.0 151.7L165.3 137.9L174.7 121.7L184.0 104.0L193.3 86.3L202.7 70.1L212.0 56.3L221.3 45.3L230.7 37.0L249.3 26.8L268.0 22.0L286.7 19.7L305.3 18.8L333.3 18.2L370.7 18.0L604.0 18.0"/>
	<text class="lbl ours" x="176" y="100" text-anchor="end">speakrail</text><text x="279" y="128" text-anchor="end">baseline a</text><text x="352" y="118">baseline b</text>
</svg>
			</div>
			<figcaption>Figure 4. Cumulative distribution of reply latency. Placeholder data.</figcaption>
		</figure>

		<h2>Reproducing the numbers</h2>
		<p>Everything has a default. The first start takes about 20 minutes: 22&nbsp;GB of models download and verify, services warm up, and short reply openers are pre-rendered in your voice.</p>

		<div class="code elev-1">
			<div class="code-head">
				<div class="tabs" role="tablist" aria-label="Snippet">
					{#each Object.entries(snippets) as [id, s] (id)}
						<button role="tab" aria-selected={tab === id} onclick={() => (tab = id)}>{s.label}</button>
					{/each}
				</div>
				<span class="file">{snippets[tab].file}</span>
				<button class="btn btn-ghost btn-sm" onclick={copy}>{copied ? 'Copied' : 'Copy'}</button>
			</div>
			<pre><code>{@html snippets[tab].html}</code></pre>
		</div>

		<div class="callout note">
			<span class="icon">i</span><span class="title">Note</span>
			<div class="body">Browsers only allow the microphone on localhost or over HTTPS. On a remote GPU box, use an SSH tunnel.</div>
		</div>
		<div class="callout warning">
			<span class="icon">!</span><span class="title">Warning</span>
			<div class="body">Breeze TTS 2 weights and the audio they generate are for research and non-commercial use only.</div>
		</div>
		<div class="callout success">
			<span class="icon">✓</span><span class="title">Works on</span>
			<div class="body">RTX 3090 and 4090 with prebuilt images. RTX 5090 needs a build from source.</div>
		</div>
		<div class="callout error">
			<span class="icon">×</span><span class="title">Port already taken</span>
			<div class="body">If the app shows as <code>Created</code>, pick a free <code>UI_PORT</code> and recreate the container. A plain restart isn't enough.</div>
		</div>

		<h3>Configuration</h3>
		<div class="table-wrap">
			<table class="data config">
				<thead><tr><th>Setting</th><th>Default</th><th>What it does</th></tr></thead>
				<tbody>
					<tr><td>UI_PORT</td><td>8080</td><td>where the web UI listens</td></tr>
					<tr><td>VOICE</td><td>female_a.wav</td><td>reference clip in app/voices/</td></tr>
					<tr><td>SILENCE_MS</td><td>1000</td><td>silence that ends your turn when the head is unsure</td></tr>
					<tr><td>TOOL_HOLD_MS</td><td>300</td><td>tools run only after you've been quiet this long</td></tr>
					<tr><td>SEARCH</td><td>off</td><td>searxng, serper or brave</td></tr>
				</tbody>
			</table>
		</div>

		<h4>Limitations</h4>
		<ul>
			<li>English only, one conversation at a time.</li>
			<li>Echo cancellation comes from the client; a bare mic and speaker will hear the assistant as you.</li>
			<li>Written-format instructions are weaker than base Gemma: the model is tuned for short spoken answers.</li>
		</ul>

		<div class="footnotes">
			<ol><li id="fn1">Backchannels are short listener sounds like "mm-hmm" that don't claim the turn.</li></ol>
		</div>
	</article>

	<!-- ============================================================ 05 COMPONENTS -->
	<div class="section-head" id="components">
		<p class="overline">05 · Components</p>
		<h2>Building blocks</h2>
	</div>

	<h4>Buttons</h4>
	<div class="row">
		<button class="btn btn-primary">Run it locally</button>
		<button class="btn btn-secondary">Read the report</button>
		<button class="btn btn-outline">Model card</button>
		<button class="btn btn-ghost">All reports →</button>
	</div>
	<div class="row">
		<button class="btn btn-primary btn-sm">Small primary</button>
		<button class="btn btn-secondary btn-sm">Small secondary</button>
		<button class="btn btn-primary" aria-busy="true"><span class="spinner" aria-hidden="true"></span>Starting…</button>
		<button class="btn btn-primary" disabled>Disabled</button>
		<button class="btn btn-secondary btn-icon" aria-label="Copy">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="5" width="9" height="9" rx="2"/><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5"/></svg>
		</button>
	</div>
	<p class="help">One primary per view. Secondary is a level-2 surface, outline is for pink secondary actions, ghost is text.</p>

	<h4>Badges</h4>
	<div class="row">
		<span class="badge accent">NEW</span>
		<span class="badge">v0.2</span>
		<span class="badge">APACHE-2.0</span>
		<span class="badge success"><span class="dot"></span>RUNNING</span>
		<span class="badge warning"><span class="dot"></span>WARMING UP</span>
		<span class="badge error"><span class="dot"></span>OFFLINE</span>
	</div>

	<h4>Form</h4>
	<form class="form card" onsubmit={(e) => e.preventDefault()} novalidate>
		<div class="field">
			<label for="email">Email</label>
			<input class="input" id="email" type="email" placeholder="name@company.com" autocomplete="email" />
			<span class="help">We'll write when new reports are out. No spam.</span>
		</div>
		<div class="field invalid">
			<label for="email-err">Email</label>
			<input class="input" id="email-err" type="email" value="name@company" aria-invalid="true" aria-describedby="email-err-msg" />
			<span class="err" id="email-err-msg"><span aria-hidden="true">!</span>That address is missing a domain, like .com.</span>
		</div>
		<div class="field">
			<label for="gpu">Your GPU</label>
			<select class="input" id="gpu"><option>RTX 4090</option><option>RTX 3090</option><option>RTX 5090</option><option>Something else</option></select>
		</div>
		<div class="field">
			<label for="msg">What would you use it for?</label>
			<textarea class="input" id="msg" placeholder="A kitchen assistant that counts my reps…"></textarea>
		</div>
		<label class="check"><input type="checkbox" checked /> Send me release notes too</label>
		<label class="check"><input class="switch" type="checkbox" bind:checked={notify} /> Email me when a report is out</label>
		<div class="row"><button class="btn btn-primary" type="submit">Join the waitlist</button><button class="btn btn-ghost" type="button">Cancel</button></div>
	</form>

	<h4>Cards</h4>
	<div class="cards">
		<a class="card" href="#reports">
			<span class="overline">Report · Oct 2026</span>
			<h3>Knowing when you're done talking</h3>
			<p>A turn-taking head on the recognizer's hidden states, every 80 ms.</p>
		</a>
		<a class="card" href="#reports">
			<span class="overline">Report · Sep 2026</span>
			<h3>Peek and speculation</h3>
			<p>Starting the reply before the turn is confirmed, without talking over you.</p>
		</a>
	</div>

	<h4>Progress</h4>
	<div class="progress-demo">
		<div class="progress-row"><span class="help">Downloading models · 14.2 / 22 GB</span><span class="help">65%</span></div>
		<div class="progress" role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100"><span style="width: 65%"></span></div>
	</div>

	<h4>Overlays</h4>
	<div class="overlays">
		<div class="ov-col">
			<span class="tooltip">Turn head · p(done) 0.92</span>
			<div class="toast" role="status"><span class="ok">✓</span> Copied to clipboard <button class="btn btn-ghost btn-sm">Undo</button></div>
			<div class="menu" role="menu" aria-label="Report actions">
				<button class="menu-item" role="menuitem">Copy link <kbd>⌘C</kbd></button>
				<button class="menu-item active" role="menuitem">Open in GitHub</button>
				<div class="menu-sep"></div>
				<button class="menu-item" role="menuitem">Download PDF <kbd>⌘P</kbd></button>
			</div>
		</div>
		<div class="ov-scrim">
			<div class="dialog" role="dialog" aria-label="Delete session">
				<h3>Delete this session?</h3>
				<p>The log, context and audio for this conversation will be removed from <code>SESSIONS_DIR</code>.</p>
				<div class="actions">
					<button class="btn btn-ghost btn-sm">Cancel</button>
					<button class="btn btn-primary btn-sm">Delete</button>
				</div>
			</div>
		</div>
	</div>
</main>

<footer class="site-footer">
	<div class="measure">
		<span>speakrail · Apache-2.0</span>
		<span>Set in Kripa and Lilex</span>
	</div>
</footer>

<style>
	/* ---------- hero ---------- */
	.hero {
		padding-top: var(--s8);
	}
	.hero > * + * {
		margin-top: var(--s5);
	}
	.display {
		margin: var(--s3) 0 0;
		font-size: var(--fs-display);
		line-height: 1.08;
		letter-spacing: -0.025em;
		font-weight: 600;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s3);
		align-items: center;
	}
	.hero-figure {
		margin: var(--s7) 0 var(--s5);
	}
	.waveform {
		display: block;
		width: 100%;
		height: auto;
	}
	.waveform :global(.wf-you) {
		fill: var(--chart-grey);
	}
	.waveform :global(.wf-sr) {
		fill: var(--accent);
	}
	.waveform :global(.wf-rest) {
		fill: var(--grid);
	}
	.waveform :global(.wf-label) {
		font: 12px var(--font-mono);
		fill: var(--muted);
	}
	.waveform :global(.wf-label.sr) {
		fill: var(--accent);
	}
	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: var(--s3);
	}

	/* ---------- section heads ---------- */
	.section-head {
		margin-top: var(--s9) !important;
		padding-top: var(--s5);
		box-shadow: inset 0 1px 0 var(--grid);
	}
	.section-head h2 {
		margin: var(--s2) 0 0;
		font-size: var(--fs-h2);
	}
	.prose > h4 {
		margin-top: var(--s7);
	}

	/* ---------- swatches ---------- */
	.swatches {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
		gap: var(--s4) var(--s3);
	}
	.swatches.seeds {
		grid-template-columns: repeat(3, 1fr);
	}
	.swatches.seeds i {
		height: 112px;
	}
	.sw {
		display: grid;
		font: var(--w-code) 12px/1.5 var(--font-mono);
		color: var(--muted);
	}
	.sw i {
		height: 56px;
		margin-bottom: var(--s2);
		border-radius: var(--radius);
		box-shadow: inset 0 0 0 1px rgb(252 245 247 / 0.08);
	}
	.sw b {
		font-weight: 500;
		color: var(--text);
	}

	/* ---------- elevation ---------- */
	.levels {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: var(--s3);
		margin-top: var(--s6) !important;
		padding: var(--s5);
		border-radius: var(--radius-lg);
		background: var(--surface-0);
		box-shadow: inset 0 0 0 1px var(--grid);
	}
	.level {
		display: grid;
		align-content: space-between;
		gap: var(--s2);
		min-height: 148px;
		padding: var(--s3);
		border-radius: var(--radius);
	}
	.lv-sunk {
		background: var(--surface-sunk);
		box-shadow: var(--ring-sunk);
	}
	.lv-0 {
		background: var(--surface-0);
		box-shadow: inset 0 0 0 1px dashed;
		outline: 1px dashed var(--border);
		outline-offset: -1px;
	}
	.lv-1 {
		background: var(--surface-1);
		box-shadow: var(--ring-1), var(--shadow-1);
	}
	.lv-2 {
		background: var(--surface-2);
		box-shadow: var(--ring-2), var(--shadow-2);
		transform: translateY(-2px);
	}
	.lv-3 {
		background: var(--surface-3);
		box-shadow: var(--ring-3), var(--shadow-3);
		transform: translateY(-4px);
	}
	.lv-4 {
		background: var(--surface-4);
		box-shadow: var(--ring-4), var(--shadow-4);
		transform: translateY(-6px);
	}
	.lv-num {
		font: 500 1.75rem/1 var(--font-mono);
		color: var(--text);
	}
	.lv-hex {
		font: var(--w-code) 12px/1.4 var(--font-mono);
		color: var(--muted);
	}
	.lv-use {
		font: var(--w-ui) 12px/1.4 var(--font-ui);
		color: var(--muted);
	}

	.stage {
		position: relative;
		height: 420px;
		margin-block: var(--s6) !important;
		border-radius: var(--radius-lg);
		background: var(--surface-0);
		box-shadow: inset 0 0 0 1px var(--grid);
		overflow: hidden;
	}
	.stage-card {
		position: absolute;
		top: 28px;
		left: 28px;
		width: 56%;
	}
	.stage-well {
		margin-top: var(--s4);
		padding: var(--s2) var(--s3);
	}
	.stage-menu {
		position: absolute;
		top: 216px;
		left: 30%;
	}
	.stage-dialog {
		position: absolute;
		right: 28px;
		top: 120px;
		width: 280px;
	}
	.stage-dialog h3 {
		font-size: var(--fs-h4);
		font-weight: 600;
		margin-top: var(--s2);
	}

	/* ---------- type specimen ---------- */
	.faces {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--s3);
		margin-top: var(--s6) !important;
	}
	.face {
		display: grid;
		gap: var(--s1);
	}
	.face b {
		font-size: var(--fs-h4);
	}
	.face-aa {
		font-size: 4.5rem;
		line-height: 1.1;
		color: var(--text);
	}
	.face-aa.read {
		font-weight: 500;
	}
	.face-aa.mono {
		font-family: var(--font-mono);
		font-weight: 400;
		color: var(--accent);
	}
	.spec,
	.waterfall {
		display: grid;
		gap: var(--s4);
		margin-top: var(--s6) !important;
	}
	.spec > div,
	.waterfall > div {
		display: grid;
		grid-template-columns: 168px 1fr;
		gap: var(--s4);
		align-items: baseline;
	}
	.waterfall > div {
		grid-template-columns: 48px 1fr;
		font-size: var(--fs-h3);
		line-height: 1.3;
		color: var(--text);
	}
	.k {
		font: var(--w-code) 12px/1.4 var(--font-mono);
		color: var(--muted);
	}
	.t-display {
		font-size: var(--fs-display);
		font-weight: 600;
		line-height: 1.1;
		letter-spacing: -0.025em;
		color: var(--text);
	}
	.t-h1,
	.t-h2,
	.t-h3,
	.t-h4 {
		font-weight: var(--w-head);
		line-height: 1.2;
		color: var(--text);
	}
	.t-h1 {
		font-size: var(--fs-h1);
		letter-spacing: -0.015em;
	}
	.t-h2 {
		font-size: var(--fs-h2);
	}
	.t-h3 {
		font-size: var(--fs-h3);
	}
	.t-h4 {
		font-size: var(--fs-h4);
		font-weight: 600;
	}
	.t-lede {
		font-size: var(--fs-lede);
		color: var(--text);
	}
	.t-ui {
		font-size: var(--fs-ui);
		line-height: 1.4;
		color: var(--text);
	}
	.t-cap {
		font-size: var(--fs-caption);
		font-weight: var(--w-ui);
		color: var(--muted);
	}
	.t-code {
		justify-self: start;
		color: var(--text);
	}

	/* ---------- report ---------- */
	.report {
		margin-top: var(--s7) !important;
	}
	.report-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--s2) var(--s3);
	}
	.report-meta + h1 {
		margin-top: var(--s4);
	}
	.code-head .tabs {
		padding: 2px;
	}
	.code-head .tabs button {
		height: 26px;
		padding: 0 var(--s3);
		font-size: var(--fs-caption);
	}
	.code-head .file {
		margin-right: 0;
		margin-left: auto;
	}

	/* ---------- diagrams ---------- */
	.diagram {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.diagram :global(text) {
		font-family: var(--font-mono);
		font-size: 12px;
		fill: var(--muted);
	}
	.diagram :global(.pl-node) {
		fill: var(--surface-2);
		stroke: rgb(252 245 247 / 0.1);
	}
	.diagram :global(.pl-node.ours) {
		fill: var(--accent-wash);
		stroke: var(--accent);
		stroke-width: 1.5;
	}
	.diagram :global(.pl-title) {
		font-family: var(--font-read);
		font-size: 15px;
		font-weight: 600;
		fill: var(--text);
	}
	.diagram :global(.pl-title.ours) {
		fill: var(--accent);
	}
	.diagram :global(.pl-sub) {
		font-size: 11px;
	}
	.diagram :global(.pl-arrow),
	.diagram :global(.pl-tick),
	.diagram :global(.pl-bracket) {
		fill: none;
		stroke: var(--chart-grey);
		stroke-width: 1.5;
	}
	.diagram :global(.pl-headfill) {
		fill: var(--chart-grey);
	}
	.diagram :global(.pl-glyph) {
		fill: none;
		stroke: var(--muted);
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.diagram :global(.pl-ann) {
		font-size: 11px;
	}
	.diagram :global(.pl-ann.strong) {
		font-size: 12px;
		fill: var(--text);
	}

	.diagram :global(.tl-lane) {
		fill: var(--muted);
	}
	.diagram :global(.tl-lane.sr) {
		fill: var(--accent);
	}
	.diagram :global(.tl-you) {
		fill: var(--surface-3);
		stroke: rgb(252 245 247 / 0.1);
	}
	.diagram :global(.tl-pause) {
		fill: none;
		stroke: var(--chart-grey);
		stroke-dasharray: 3 3;
	}
	.diagram :global(.tl-sr) {
		fill: var(--accent);
	}
	.diagram :global(.tl-say) {
		font-family: var(--font-read);
		font-size: 13px;
		fill: var(--body);
	}
	.diagram :global(.tl-say.sr) {
		fill: var(--on-accent);
		font-weight: 500;
	}
	.diagram :global(.tl-note) {
		font-size: 11px;
	}
	.diagram :global(.tl-note.pink) {
		fill: var(--accent);
	}
	.diagram :global(.tl-bracket) {
		fill: none;
		stroke: var(--accent-dim);
		stroke-width: 1.2;
		stroke-dasharray: 2 3;
	}
	.diagram :global(.tl-plot) {
		fill: var(--surface-sunk);
	}
	.diagram :global(.tl-area) {
		fill: var(--accent-deep);
		opacity: 0.55;
	}
	.diagram :global(.tl-curve) {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2;
		stroke-linejoin: round;
	}
	.diagram :global(.tl-thresh) {
		stroke: var(--muted);
		stroke-dasharray: 4 4;
	}
	.diagram :global(.tl-dot) {
		fill: var(--surface-1);
		stroke: var(--muted);
		stroke-width: 2;
	}
	.diagram :global(.tl-dot.pink) {
		fill: var(--accent);
		stroke: var(--surface-1);
	}
	.diagram :global(.tl-ticks) {
		stroke: var(--chart-grey);
	}
	.diagram :global(.tl-axis) {
		font-size: 11px;
	}

	/* ---------- components ---------- */
	.form {
		display: grid;
		gap: var(--s5);
		max-width: 460px;
	}
	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: var(--s3);
	}
	.progress-demo {
		display: grid;
		gap: var(--s2);
		max-width: 460px;
	}
	.progress-row {
		display: flex;
		justify-content: space-between;
	}
	.overlays {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--s5);
		padding: var(--s5);
		border-radius: var(--radius-lg);
		background: var(--surface-0);
		box-shadow: inset 0 0 0 1px var(--grid);
	}
	.ov-col {
		display: grid;
		gap: var(--s5);
		justify-items: start;
		align-content: start;
	}
	.ov-scrim {
		display: grid;
		place-items: center;
		padding: var(--s5);
		border-radius: var(--radius);
		background:
			repeating-linear-gradient(
				135deg,
				var(--surface-1) 0 10px,
				var(--surface-0) 10px 20px
			);
		position: relative;
	}
	.ov-scrim::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: var(--scrim);
	}
	.ov-scrim .dialog {
		position: relative;
	}

	@media (max-width: 720px) {
		.levels {
			grid-template-columns: repeat(3, 1fr);
		}
		.overlays,
		.faces {
			grid-template-columns: 1fr;
		}
		.spec > div {
			grid-template-columns: 1fr;
			gap: var(--s1);
		}
		.display,
		.t-display {
			font-size: var(--fs-h1);
		}
		.stage {
			height: auto;
			display: grid;
			gap: var(--s4);
			padding: var(--s4);
		}
		.stage > * {
			position: static;
			width: auto;
		}
	}
</style>
