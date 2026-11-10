# LLM Inference Engineering

A learning platform for LLM inference engineering. The curriculum contains **10 phases and 180 topics**, ordered from deep-learning foundations through production inference, kernels, and distributed systems.

The app is the base layer: navigation, search, progress, topic pages, and a markdown pipeline are in place. Lesson notes and video walkthroughs are added over time.

## Run locally

Install Node.js 20.19+ or 22.12+, then run:

```sh
npm install
npm run dev
```

Open the local address printed by Vite. To produce and preview the static build:

```sh
npm run build
npm run preview
```

## Routes

Hash routing is used so the static build works under the GitHub Pages repository subpath.

| Route | Page |
| --- | --- |
| `/#/` | Curriculum overview |
| `/#/phase/3` | Phase page |
| `/#/topic/49` | Topic page |

## Project structure

```text
src/
  data/curriculum.js     Phase definitions, topic grouping, route helpers
  data/videos.js         Optional YouTube IDs keyed by topic number
  lib/content.js         Markdown loading, read time, heading extraction
  lib/progress.jsx       Completion state persisted in localStorage
  lib/theme.jsx          Light/dark theme provider
  components/            App shell, sidebar, header, search, cards, topic rows
  pages/                 Home, phase, topic, and 404 pages
  content/               Lesson markdown files (none yet)
  styles/                Tokens, base, layout, components, pages, markdown
topics.json              The 180-topic syllabus
.github/workflows/       GitHub Pages deployment
```

## Adding lesson content

Create a markdown file in `src/content/` named after the topic number with three digits:

```text
src/content/049.md
```

The topic page loads it automatically. Content is rendered with GitHub-flavored markdown, so tables, task lists, and fenced code blocks work. Start headings at `##`; the page already renders the topic title as the `h1`. `##` and `###` headings become the "On this page" outline.

Internal links such as `/topic/50` are routed by the app. External links open in a new tab. There is no content file yet, so every topic shows the "notes in progress" state.

## Adding a video walkthrough

Add the YouTube video ID to `src/data/videos.js`:

```js
const videos = {
  49: 'YOUR_VIDEO_ID',
};
```

The topic page renders a responsive, privacy-enhanced YouTube player. Without an entry, the meta row shows "Video coming soon."

## Progress

Completion is stored in `localStorage` under `inference:progress:v1`. There is no account or backend. Progress syncs between tabs in the same browser. The header, sidebar, home page, and phase pages all read from the same state.

## Theme

The app ships with dark and light themes. The initial theme follows the operating system, and the toggle in the header stores the user's choice under `inference:theme`.

## Publish with GitHub Pages

1. Commit and push the site files to GitHub.
2. Open **Settings → Pages** and select **GitHub Actions** as the source.
3. Push to `master` or run the **Deploy to GitHub Pages** workflow.

The existing workflow in `.github/workflows/pages.yml` installs dependencies, runs `tests/render.test.js`, builds with Vite, and publishes `dist/`. Vite uses relative asset paths, so the site works under the repository subpath.

## Tests

```sh
npm test
```

The render test verifies the curriculum counts, all core routes, the topic empty state, and 404 handling.
