import { paraglideVitePlugin } from '@inlang/paraglide-js';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { icons as iconoir } from '@iconify-json/iconoir';
import { getIconData, iconToHTML, iconToSVG } from '@iconify/utils';
import { mdsvex } from 'mdsvex';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import { remarkExternalLinks } from './src/lib/post/remark-external-links.js';
import { remarkFigures } from './src/lib/post/remark-figures.js';
import { remarkHeadings } from './src/lib/post/remark-headings.js';

export default defineConfig({
	plugins: [
		sveltekit({
			// posts are markdown with Svelte components in it (.svx, via mdsvex); see src/posts/README.md
			extensions: ['.svelte', '.svx'],
			preprocess: [
				mdsvex({
					extensions: ['.svx'],
					layout: import.meta.dirname + '/src/lib/post/Markdown.svelte',
					remarkPlugins: [remarkFigures, remarkHeadings, remarkExternalLinks]
				})
			],
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				// mdsvex's compiled output is legacy Svelte, so .svx files stay out of runes mode.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') || filename.endsWith('.svx')
						? undefined
						: true
			},
			// Post components carry their CSS in the server-rendered HTML instead of a separate file.
			// A post is imported lazily (src/routes/[slug]/+page.js), and SvelteKit only links a lazy
			// import's stylesheet when the client and server builds name its chunk the same, which
			// they don't for .svx posts. The page then painted unstyled until the JS arrived: every
			// tooltip showing, headings' copy-links as plain blue links.
			dynamicCompileOptions: ({ filename }) => {
				const dirs = filename.split(/[/\\]/).join('/');
				if (dirs.includes('/src/posts/') || dirs.includes('/src/lib/post/')) {
					return { css: 'injected' };
				}
			},
			adapter: adapter()
		}),

		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		}),

		// iconoir via `import Icon from '~icons/iconoir/<name>'`, compiled to inline SVG.
		// Served as a custom collection so the default stroke can be 1.7 instead of iconoir's 1.5.
		Icons({
			compiler: 'svelte',
			customCollections: {
				iconoir: (name) => {
					const data = getIconData(iconoir, name);
					if (!data) return undefined;
					const { attributes, body } = iconToSVG(data, { height: '1.2em' }); // unplugin-icons' default scale
					return iconToHTML(
						body.replaceAll('stroke-width="1.5"', 'stroke-width="1.7"'),
						attributes
					);
				}
			}
		})
	]
});
