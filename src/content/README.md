# Lesson content

This folder is intentionally empty. Add one markdown file per topic when you are ready:

```text
001.md
002.md
...
180.md
```

The filename must be the three-digit topic number. The app ignores everything else in this folder, including this README. Topic numbers map to tracks through `src/data/tracks.js`:

- `001–025` → Track 01, Foundations
- `026–048` → Track 02, Inference
- `049–065` → Track 03, GPU Performance

## Format

- Do not add an `#` H1. The topic page renders the title.
- Use `##` for main sections and `###` for subsections.
- GitHub-flavored markdown is supported: tables, task lists, fenced code blocks, blockquotes.
- Start with a short introduction, then move into the lesson.
- Internal links use the track-scoped route, for example `/track/3/topic/50`.
- External links open in a new tab.

## Images and files

Put images in `public/images/`, then reference them with either form:

```md
![KV cache diagram](images/kv-cache.png)
![KV cache diagram](/images/kv-cache.png)
```

Both resolve correctly in development and under the GitHub Pages subpath. PDFs and other static files in `public/` work the same way, for example `/files/cheatsheet.pdf`.

## Video

Add the YouTube video ID to `src/data/videos.js` after recording the walkthrough:

```js
const videos = {
  49: 'YOUR_VIDEO_ID',
};
```

## Reading time

Reading time is estimated from the markdown word count and shown automatically.
