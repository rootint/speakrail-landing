// The colour theme: dark by default, light once the reader picks it with the sun in the nav.
// The pick is kept in localStorage; a script in app.html applies it before the first paint, so
// a light page never flashes dark. The colours themselves are tokens in src/styles.css.

const KEY = 'theme';

/** @returns {'light' | 'dark'} */
export const currentTheme = () =>
	document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

/** @param {'light' | 'dark'} theme */
export function setTheme(theme) {
	const root = document.documentElement;
	const apply = () => {
		// transitions off for a frame, so everything turns at once instead of at its own pace
		root.dataset.themeSwitching = '';
		if (theme === 'light') root.dataset.theme = 'light';
		else delete root.dataset.theme;
		requestAnimationFrame(() => requestAnimationFrame(() => delete root.dataset.themeSwitching));
	};
	try {
		localStorage.setItem(KEY, theme);
	} catch {
		// storage blocked (private mode): the theme still switches, just isn't remembered
	}
	// a cross-fade where the browser has one and the reader doesn't mind motion
	if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches)
		document.startViewTransition(apply);
	else apply();
}
