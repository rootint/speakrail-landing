// Everything on the page that follows the scroll (the nav, the reading progress, the contents)
// goes through one passive scroll and resize listener, and runs at most once per frame: all of it
// reads the layout together in one animation frame, then Svelte writes the DOM once, instead of
// each part reading and writing on its own for every event.
// A frame requested from a scroll event runs before that same frame paints, so nothing lags behind.
import { on } from 'svelte/events';

/** @type {Set<() => void>} */
const subscribers = new Set();
let frame = 0;
/** @type {(() => void)[] | undefined} */
let offs;

function run() {
	frame = 0;
	for (const fn of subscribers) fn();
}
function schedule() {
	frame ||= requestAnimationFrame(run);
}

/**
 * Run `fn` now (well, next frame) and then once per frame whenever the page scrolls or resizes.
 * @param {() => void} fn
 * @returns {() => void} stop
 */
export function onScrollFrame(fn) {
	subscribers.add(fn);
	offs ??= [on(window, 'scroll', schedule, { passive: true }), on(window, 'resize', schedule)];
	schedule();
	return () => {
		subscribers.delete(fn);
		if (subscribers.size) return;
		offs?.forEach((off) => off());
		offs = undefined;
		cancelAnimationFrame(frame);
		frame = 0;
	};
}
