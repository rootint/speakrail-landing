// Toasts: call toast('message', { icon }) from anywhere; <Toaster /> in the root layout shows them.

/** @typedef {{ id: number, message: string, icon?: import('svelte').Component }} Toast */

/** @type {Toast[]} */
export const toasts = $state([]);

// plain object, not a Map: the timers aren't state, so they don't need to be reactive
/** @type {Record<number, ReturnType<typeof setTimeout>>} */
const timers = {};
let nextId = 0;

/**
 * Show a toast. The same message again while it's still up restarts its timer instead of stacking.
 * @param {string} message
 * @param {{ icon?: import('svelte').Component, duration?: number }} [options]
 */
export function toast(message, { icon, duration = 3200 } = {}) {
	const shown = toasts.find((t) => t.message === message);
	const id = shown?.id ?? ++nextId;
	if (!shown) toasts.push({ id, message, icon });
	clearTimeout(timers[id]);
	timers[id] = setTimeout(() => dismiss(id), duration);
	return id;
}

/** @param {number} id */
export function dismiss(id) {
	clearTimeout(timers[id]);
	delete timers[id];
	const i = toasts.findIndex((t) => t.id === id);
	if (i !== -1) toasts.splice(i, 1);
}
