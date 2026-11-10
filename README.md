# LLM Inference Engineering

A static React roadmap for learning LLM inference engineering, based on the included public learning path. Browse 10 phases and 180 ordered topics; lessons can be added as they are developed.

## Run locally

Install Node.js 20.19+ or 22.12+, then run:

```sh
npm install
npm run dev
```

Open the local address printed by Vite. To produce and preview the static build, run `npm run build` and `npm run preview`.

## Publish with GitHub Pages

1. Commit and push the site files to GitHub.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. Push to `master` or run the **Deploy to GitHub Pages** workflow from the Actions tab.

The workflow builds the React site and publishes `dist/`. The expected address is `https://jaganzutual.github.io/LLM-Inference-Engineering/`; GitHub shows the confirmed URL in the Pages settings after deployment. Vite uses relative asset paths so the site works under the repository subpath. No backend is required.

## Update the roadmap

Edit `src/App.jsx` for the page and interactions, `styles.css` for presentation, and `topics.json` for the syllabus. Push changes to `master` to update the site after GitHub Pages is configured.
