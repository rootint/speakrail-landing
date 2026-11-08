// One scripted moment for every hero variant, so they tell the same story: the user pauses to
// think mid-sentence (a 700 ms silence timer would cut in), then finishes; the turn head is sure
// 176 ms after the last word and the reply is heard 678 ms after it (the article's numbers).
// While the system talks, the user says "mm-hmm": a backchannel, not a turn.
// Times are in seconds from the start of the loop. Everything is deterministic, so the server
// and the browser draw the same frame.

/** @typedef {{ w: string, a: number, b: number }} Word */

/** @type {Word[]} the user */
export const WORDS = [
	{ w: 'So', a: 0.1, b: 0.28 },
	{ w: 'I', a: 0.32, b: 0.4 },
	{ w: 'was', a: 0.44, b: 0.6 },
	{ w: 'thinking', a: 0.66, b: 1.05 },
	{ w: 'we', a: 1.12, b: 1.25 },
	{ w: 'could…', a: 1.3, b: 1.7 },
	{ w: 'maybe', a: 2.6, b: 2.92 },
	{ w: 'go', a: 2.98, b: 3.12 },
	{ w: 'tomorrow?', a: 3.18, b: 3.7 }
];

export const PAUSE = /** @type {const} */ ([1.7, 2.6]); // the thinking pause
export const END = 3.7; // the user's last word ends
export const HEAD_MS = 176;
export const HEARD_MS = 678;
export const HEAD_FIRES = END + HEAD_MS / 1000; // P(complete) crosses 0.5
export const HEARD = END + HEARD_MS / 1000; // the reply starts playing
export const TIMER_MS = 700;
export const TIMER_FIRES = PAUSE[0] + TIMER_MS / 1000; // where a silence timer would answer: mid-pause

/** @type {Word[]} the system's reply */
export const REPLY = [
	{ w: 'Sure,', a: HEARD, b: HEARD + 0.3 },
	{ w: 'tomorrow', a: HEARD + 0.36, b: HEARD + 0.82 },
	{ w: 'works.', a: HEARD + 0.88, b: HEARD + 1.2 },
	{ w: 'Morning', a: HEARD + 1.4, b: HEARD + 1.78 },
	{ w: 'or', a: HEARD + 1.82, b: HEARD + 1.92 },
	{ w: 'afternoon?', a: HEARD + 1.98, b: HEARD + 2.55 }
];

/** the user's backchannel, while the system talks */
export const MMHMM = { w: 'mm-hmm', a: HEARD + 1.05, b: HEARD + 1.38 };

export const LOOP = 8.2; // seconds before it starts over

const clamp = (/** @type {number} */ x, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
const within = (/** @type {Word[]} */ ws, /** @type {number} */ t) =>
	ws.find((w) => t >= w.a && t < w.b);

/** speech loudness 0..1 for a list of words: syllable-ish bumps that fade at word edges */
const loudness = (
	/** @type {Word[]} */ ws,
	/** @type {number} */ t,
	/** @type {number} */ seed
) => {
	const w = within(ws, t);
	if (!w) return 0.02;
	const edge = clamp(Math.min(t - w.a, w.b - t) / 0.05);
	const syl = Math.abs(Math.sin((t - w.a) * 19 + seed)) * (0.6 + 0.4 * Math.sin(t * 7.3 + seed));
	return clamp(0.15 + 0.85 * syl) * edge;
};
export const userLoud = (/** @type {number} */ t) => loudness([...WORDS, MMHMM], t, 1);
export const replyLoud = (/** @type {number} */ t) => loudness(REPLY, t, 4);

/** the turn head's P(complete) for the user's turn */
export function pComplete(/** @type {number} */ t) {
	const jitter = 0.015 * Math.sin(t * 23) + 0.01 * Math.sin(t * 61);
	// the pause: a small, unsure rise that never gets near the threshold
	const pause = 0.2 * Math.exp(-(((t - 2.05) / 0.28) ** 2));
	// the real end: a fast logistic rise through 0.5 exactly at HEAD_FIRES
	const end = 0.94 / (1 + Math.exp(-(t - HEAD_FIRES) / 0.035));
	return clamp(0.03 + pause + end + jitter, 0.01, 0.99);
}

/** P(backchannel): high only while the user says "mm-hmm" over the reply */
export function pBackchannel(/** @type {number} */ t) {
	const mid = (MMHMM.a + MMHMM.b) / 2 + 0.08;
	return clamp(0.02 + 0.86 * Math.exp(-(((t - mid) / 0.2) ** 2)));
}

/** all three classes, summing to 1. During the backchannel, "complete" gives way */
export function probs(/** @type {number} */ t) {
	const backchannel = pBackchannel(t);
	const complete = pComplete(t) * (1 - backchannel);
	return { complete, incomplete: clamp(1 - complete - backchannel), backchannel };
}

/** the words already said by time t (of a list), and the one being said */
export const said = (/** @type {Word[]} */ ws, /** @type {number} */ t) =>
	ws.filter((w) => t >= w.a);

export const fmtMs = (/** @type {number} */ s) => `${Math.round(s * 1000)} ms`;
