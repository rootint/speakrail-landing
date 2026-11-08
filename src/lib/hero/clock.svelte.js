// A looping clock for the hero animations: seconds since it started, modulo `period`, updated every
// frame. The server, and readers who ask for reduced motion, get the frame at `still` instead.
import { onMount } from 'svelte';

/**
 * @param {number} period seconds before it loops
 * @param {number} still the time to show when not animating
 */
export function loop(period, still) {
	let t = $state(still);
	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let raf = 0;
		let t0 = 0;
		const tick = (/** @type {number} */ ms) => {
			t0 ||= ms;
			t = ((ms - t0) / 1000) % period;
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});
	return {
		get t() {
			return t;
		}
	};
}
