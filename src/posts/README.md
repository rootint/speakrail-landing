# Posts

Every folder here is a post at `/<folder name>`. `voxtral/` is served at `/voxtral`.

```
src/posts/voxtral/
  index.svx           the post: frontmatter + markdown, with Svelte components where you need them
  Top.svelte          optional: the section under the title (buttons, a demo, a TL;DR...)
  sample-latency.png  images used in the post sit next to it
  TimeoutDemo.svelte  components only this post uses can sit next to it too
```

## Frontmatter

```yaml
---
title: "Your ASR already knows when you're done talking"
description: One sentence for search results and link previews.
date: 2026-11-01T08:37:00Z # shown as "Nov 1, 2026", the time slides out on hover (UTC)
author: danil_rootint # X handle, shown as @danil_rootint and linked
tldr: >- # optional; the TL;DR box, if the post's Top.svelte shows one. '>-' joins the lines into one paragraph
  One or two sentences
  that can wrap over several lines here.
sources: # optional; numbered 1, 2, 3... in this order
  - id: voxtral-realtime
    title: Voxtral Realtime
    authors: Liu et al.
    year: 2026
    venue: arXiv:2602.11298
    url: https://arxiv.org/abs/2602.11298
---
```

Quote the title if it has a colon or starts with a quote mark.

Add `draft: true` to keep a post out of the site while it's unfinished: it gets no page and isn't in the blog list, the previous/next links or `llms.txt`. Delete the line to publish.

## Body

- `## Heading`: a section. Each one gets a numbered entry in the contents on the left.
- Paragraphs, **bold**, _italic_, `code`, [links](https://example.com) and lists are plain markdown.
- An image on its own line becomes a figure. The quoted title is its caption:

  ```md
  ![What the image shows, for screen readers](sample-latency.png 'The caption under the image.')
  ```

  A bare file name is looked up in the post's folder. `/...` paths and full URLs are used as they are.

- Svelte components: import them in a `<script>` block at the top of the body, then use them on their own line:

  ```svelte
  <script>
  	import Cite from '#lib/post/Cite.svelte';
  	import TimeoutDemo from './TimeoutDemo.svelte';
  </script>

  <TimeoutDemo />
  ```

- Citations: put `<Cite id="voxtral-realtime" />` right after the sentence, with no space before it. The `id` is one from `sources:`.
  - Add `note="..."` to show a sentence about the source in the right margin, next to that line.
  - Every post with sources gets the full list at the end automatically.

## Top section

`Top.svelte` is an ordinary Svelte component. It renders between the title and the body, so each post can have its own buttons, animation or TL;DR. Leave it out and the body starts right under the title.
