# LLM Inference Engineering

A focused learning platform for LLM inference engineering.

The public site has a separate hero page, a track picker, and three self-contained tracks:

| Track | Topics |
| --- | --- |
| **01 Deep Learning & LLM Foundations** | 25 |
| **02 LLM Inference Fundamentals** | 23 |
| **03 GPU Architecture & Performance** | 17 |

The full syllabus still contains 10 phases and 180 topics in `topics.json` and `src/data/curriculum.js`; the remaining phases are reserved for future tracks. Lesson notes and videos are not written yet.

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
| `/#/` | Hero page |
| `/#/tracks` | Track picker |
| `/#/track/3` | Track overview |
| `/#/track/3/topic/49` | Topic page |
| `/#/phase/3` | Redirects to `/#/track/3` |
| `/#/topic/49` | Redirects to `/#/track/3/topic/49` |

Topic pages use a persistent track sidebar on desktop, the Contents drawer on mobile, and omit the site footer.

## Project structure

```text
src/
  data/tracks.js         Published tracks, track metadata, route helpers
  data/curriculum.js     All 10 phases, topic grouping, legacy helpers
  data/videos.js         Optional YouTube IDs keyed by topic number
  lib/content.js         Markdown loading, read time, heading extraction
  lib/github.jsx         Cached GitHub star count
  lib/theme.jsx          Light/dark theme provider
  components/            Hero/track shell, sidebar, search, cards, topic rows
  pages/                 Hero, tracks, track, topic, and 404 pages
  content/               Lesson markdown files (none yet)
  styles/                Tokens, base, layout, components, pages, landing,
                         markdown
topics.json              The full 180-topic syllabus
.github/workflows/       GitHub Pages deployment
```

## Adding a track

The 3 published tracks are defined by ids in `src/data/tracks.js`:

```js
const trackMeta = [
  { id: 1, shortTitle: 'Foundations', ... },
  { id: 2, shortTitle: 'Inference', ... },
  { id: 3, shortTitle: 'GPU Performance', ... },
];
```

Each id maps to a phase in `src/data/curriculum.js`. To publish another track, add its phase id and presentation copy to `trackMeta`. The top-bar switcher, contents drawer, search, and landing page will pick it up automatically. The remaining phases are 4–10.

## Adding lesson content

Create a markdown file in `src/content/` named after the topic number with three digits:

```text
src/content/049.md
```

The topic page loads it automatically. Content is rendered with GitHub-flavored markdown, so tables, task lists, and fenced code blocks work. Start headings at `##`; the page renders the topic title as the `h1`. `##` and `###` headings become the "On this page" outline.

Internal links use the track-scoped route, for example `/track/3/topic/50`. External links open in a new tab. There is no content file yet, so every topic shows the "notes coming soon" state.

## Adding a video walkthrough

Add the YouTube video ID to `src/data/videos.js`:

```js
const videos = {
  49: 'YOUR_VIDEO_ID',
};
```

The topic page renders a responsive, privacy-enhanced YouTube player. Without an entry, the meta row shows "Video coming soon."

## Progress tracking

Not implemented yet. The app currently has no completion state, progress bars, percentages, or “mark complete” controls. Those can be added later without changing the track or topic structure.

## GitHub stars

The header and footer show the repository's star count. It is fetched once from the public GitHub API and cached in `localStorage` for one hour under `inference:github-stars:v1`. If the request fails, the rest of the UI continues to work.

## Theme

The app starts in a true-black theme with white text and a black-and-white light alternative. Lime is reserved for small signals only: the brand mark, the active tab underline, and the active topic marker. The toggle in the header stores the user's choice under `inference:theme`.

## Publish with GitHub Pages

1. Commit and push the site files to GitHub.
2. Open **Settings → Pages** and select **GitHub Actions** as the source.
3. Push to `master` or run the **Deploy to GitHub Pages** workflow.

The workflow in `.github/workflows/pages.yml` installs dependencies, runs `tests/render.test.js`, builds with Vite, and publishes `dist/`. Vite uses relative asset paths, so the site works under the repository subpath.

## Tests

```sh
npm test
```

The render test verifies the track counts, hero and track routes, the topic empty state, 404 handling, and the markdown pipeline.
