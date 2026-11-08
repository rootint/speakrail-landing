// What the reader is looking at: the post's sections and which one is current.
// Create it in the page script (it hooks into mount); the contents rail reads it.
import { onMount } from 'svelte';
import { onScrollFrame } from './scroll-frame.js';
import { slug } from './slug.js';

export class Reading {
	/** @type {{ id: string, text: string }[]} */
	sections = $state([]);
	active = $state(0);
	/** whether the reading line has reached the first heading yet */
	started = $state(false);
	/** how far through the current section the reading line is, 0 to 1 */
	progress = $state(0);

	/** @type {HTMLElement[]} */
	#headings = [];

	/** @param {string} selector headings that start a section */
	constructor(selector = 'article h2') {
		onMount(() => {
			this.#headings = [...document.querySelectorAll(selector)].filter(
				(h) => h instanceof HTMLElement
			);
			this.sections = this.#headings.map((h) => {
				const text = h.textContent?.trim() ?? '';
				if (!h.id) h.id = slug(text); // the build gives post headings theirs; this is for any other
				return { id: h.id, text };
			});
			return onScrollFrame(() => this.#spy());
		});
	}

	// the reading line is a third of the way down the screen: the current section is the last
	// heading above it, and progress is how far the line is from that heading to the next one (the
	// last section runs to the end of its container). At the very bottom the last section is done.
	#spy() {
		const h = this.#headings;
		if (!h.length) return;
		const line = innerHeight / 3;
		const tops = h.map((el) => el.getBoundingClientRect().top);
		const end = h[0].parentElement?.getBoundingClientRect().bottom ?? tops[tops.length - 1];
		let current = 0;
		tops.forEach((t, i) => {
			if (t <= line) current = i;
		});
		const from = tops[current];
		const to = tops[current + 1] ?? end;
		const atEnd = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
		this.started = atEnd || tops[0] <= line;
		this.active = atEnd ? h.length - 1 : current;
		this.progress = atEnd ? 1 : Math.min(1, Math.max(0, (line - from) / (to - from)));
	}
}
