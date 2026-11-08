// A heading's id from its text: "Why 480 ms?" → "why-480-ms". Shared by the build, which puts the
// ids into the page (remark-headings.js), and the contents, which read them back (reading.svelte.js).
export const slug = (/** @type {string} */ s) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
