// /sitemap.xml: the home page and every published post (drafts are left out by posts.server.js).
// Test and design pages, and the /ru copies, aren't listed.
import { posts } from '#lib/post/posts.server.js';
import { ORIGIN } from '#lib/site.js';

export const prerender = true;

export function GET() {
	const day = (/** @type {string} */ d) => new Date(d).toISOString().slice(0, 10);
	const urls = [
		{ loc: `${ORIGIN}/`, lastmod: posts[0] ? day(posts[0].date) : undefined },
		...posts.map((p) => ({ loc: `${ORIGIN}/${p.slug}`, lastmod: day(p.date) }))
	];
	const body = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...urls.map(
			(u) => `\t<url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`
		),
		'</urlset>',
		''
	].join('\n');
	return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
