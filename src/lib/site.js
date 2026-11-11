// Site-wide copy that appears in more than one place (the home page and /llms.txt).

/** The public address, no trailing slash: canonical links, the sitemap and structured data use it.
 * The bare domain; www.speakrail.com doesn't serve the site. */
export const ORIGIN = 'https://speakrail.com';

// markdown-style links, [label](https://…), are rendered as links on the home page and kept as is in
// /llms.txt, which is markdown itself
export const MISSION =
	"We are building a speech-to-speech companion that runs entirely on your computer – never degraded, never sunsetted, and always yours. You can give it the voice you want, the capabilities you want and make it behave like you want. We strive to make talking to it as natural as talking to a person, while making sure it doesn't need a datacenter to run properly. We are just getting started – and if you want to help us in our journey, [install](https://github.com/speakrail/speakrail) it on your computer, try it out and leave us some feedback – it will be greatly appreciated.";
