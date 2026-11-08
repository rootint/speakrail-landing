// The blog list, read at build time (see posts.server.js for why it stays on the server).
import { posts } from '#lib/post/posts.server.js';

export const load = () => ({ posts });
