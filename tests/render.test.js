import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

test('the hero, tracks, and track workspace render', async () => {
  const server = await createServer({
    appType: 'custom',
    server: { middlewareMode: true },
    optimizeDeps: { noDiscovery: true },
  });

  try {
    const { default: AppProviders } = await server.ssrLoadModule(
      '/src/AppProviders.jsx',
    );
    const { default: AppRoutes } = await server.ssrLoadModule(
      '/src/AppRoutes.jsx',
    );
    const { phases, allTopics } = await server.ssrLoadModule(
      '/src/data/curriculum.js',
    );
    const { tracks, trackTopics } = await server.ssrLoadModule(
      '/src/data/tracks.js',
    );

    assert.equal(phases.length, 10);
    assert.equal(allTopics.length, 180);
    assert.equal(tracks.length, 3);
    assert.equal(trackTopics.length, 65);
    assert.deepEqual(
      tracks.map((track) => track.topics.length),
      [25, 23, 17],
    );

    const render = (path) =>
      renderToString(
        createElement(
          MemoryRouter,
          { initialEntries: [path] },
          createElement(
            AppProviders,
            null,
            createElement(AppRoutes),
          ),
        ),
      ).replace(/<!-- -->/g, '');

    const hero = render('/');
    assert.match(hero, /Learn how LLMs/);
    assert.match(hero, /actually run/);
    assert.match(hero, /Three tracks/);
    assert.match(hero, /Star on GitHub/);
    assert.match(hero, /Deep Learning &amp; LLM Foundations/);

    const tracksPage = render('/tracks');
    assert.match(tracksPage, /Choose a track/);
    assert.match(tracksPage, /How it works/);
    assert.equal(
      (tracksPage.match(/class="track-card"/g) ?? []).length,
      3,
    );
    assert.match(tracksPage, /25 topics/);
    assert.match(tracksPage, /23 topics/);
    assert.match(tracksPage, /17 topics/);

    const track = render('/track/1');
    assert.match(track, /Deep Learning &amp; LLM Foundations/);
    assert.match(track, /Tensors, shapes, strides, broadcasting/);
    assert.match(track, /25 topics/);
    assert.doesNotMatch(track, /Streaming multiprocessors/);

    const topic = render('/track/3/topic/49');
    assert.match(topic, /CPU versus GPU architecture/);
    assert.match(topic, /Notes for this topic are on the way/);
    assert.match(topic, /Mark complete/);
    assert.match(topic, /In this track/);

    const wrongTopic = render('/track/3/topic/1');
    assert.match(wrongTopic, /part of the path/);

    const missingTrack = render('/track/99');
    assert.match(missingTrack, /part of the path/);

    const { default: Markdown } = await server.ssrLoadModule(
      '/src/components/Markdown.jsx',
    );
    const markdownSample = [
      '## Tensor shapes',
      '',
      '| shape | meaning |',
      '| --- | --- |',
      '| `[B, T]` | batch and sequence |',
      '',
      '```python',
      'x = x.view(B, T, H)',
      '```',
      '',
      '[Next topic](/track/2/topic/50)',
      '',
      '[Vite](https://vite.dev)',
      '',
      '![Diagram](/images/diagram.png)',
    ].join('\n');

    const markdownHtml = renderToString(
      createElement(
        MemoryRouter,
        null,
        createElement(Markdown, null, markdownSample),
      ),
    );

    assert.match(markdownHtml, /id="tensor-shapes"/);
    assert.match(markdownHtml, /class="table-wrap"/);
    assert.match(markdownHtml, /language-python/);
    assert.match(markdownHtml, /href="\/track\/2\/topic\/50"/);
    assert.match(markdownHtml, /href="https:\/\/vite.dev"/);
    assert.match(markdownHtml, /src="(?:\/|\.\/)images\/diagram\.png"/);
    assert.match(markdownHtml, /loading="lazy"/);
  } finally {
    await server.close();
  }
});
