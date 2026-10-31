// A post's bibliography. Sources are numbered in the order they're listed, so list them in the
// order the text first cites them.

/** @typedef {{ id: string, title: string, authors: string, year: number, venue: string, url: string }} SourceInput */
/** @typedef {SourceInput & { n: number }} Source */

/**
 * @param {SourceInput[]} list
 * @returns {Record<string, Source>}
 */
export function defineSources(list) {
	return Object.fromEntries(list.map((s, i) => [s.id, { ...s, n: i + 1 }]));
}
