// /llms.txt (https://llmstxt.org): a markdown map of the site for language models, built from the
// post frontmatter so a new post shows up here on its own. Links are root-relative, which resolves
// against this file's URL.
import { posts } from '#lib/post/posts.js';
import { MISSION } from '#lib/site.js';

export const prerender = true;

export function GET() {
	const blog = posts.map((p) => {
		const day = new Date(p.date).toISOString().slice(0, 10);
		return `- [${p.title}](/${p.slug}): ${p.description ? `${p.description} ` : ''}(${day})`;
	});

	const body = [
		'# Speakrail',
		'',
		`> ${MISSION}`,
		'',
		'## Blog',
		'',
		...blog,
		'',
		'## Code and models',
		'',
		'- [GitHub](https://github.com/speakrail/speakrail): source code for the Speakrail pipeline',
		'- [Hugging Face](https://huggingface.co/speakrail): model weights and model cards',
		''
	].join('\n');

	return new Response(body, { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
}
