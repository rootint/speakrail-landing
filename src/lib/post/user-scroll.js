// Calls `fn` when the reader starts scrolling for themselves: the wheel or trackpad, a touch, or a
// scrolling key. Scrolls the page makes (jumps, the back-to-top glide) don't count, so this is how
// those get out of the reader's way. Returns a function that stops listening.
import { on } from 'svelte/events';

const KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

/** @param {() => void} fn */
export function onUserScroll(fn) {
	const offs = [
		on(window, 'wheel', fn, { passive: true }),
		on(window, 'touchstart', fn, { passive: true }),
		on(window, 'keydown', (e) => KEYS.has(e.key) && fn())
	];
	return () => offs.forEach((off) => off());
}
