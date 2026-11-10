import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

test('the curriculum and all core routes render', async () => {
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

    assert.equal(phases.length, 10);
    assert.equal(allTopics.length, 180);
    assert.equal(
      phases.reduce((count, phase) => count + phase.topics.length, 0),
      180,
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
      );

    const home = render('/');
    assert.match(home, /Learn how LLMs actually run/);
    assert.match(home, /180 topics/);
    assert.match(home, /Deep Learning &amp; LLM Foundations/);
    assert.match(home, /Search topics/);

    const phase = render('/phase/3');
    assert.match(phase, /GPU Architecture &amp; Performance/);
    assert.match(phase, /CPU versus GPU architecture/);
    assert.doesNotMatch(phase, /Tensors, shapes, strides, broadcasting/);

    const topic = render('/topic/49');
    assert.match(topic, /CPU versus GPU architecture/);
    assert.match(topic, /Notes for this topic are on the way/);
    assert.match(topic, /Mark complete/);

    const missingPhase = render('/phase/99');
    assert.match(missingPhase, /part of the path/);

    const missingTopic = render('/topic/9999');
    assert.match(missingTopic, /part of the path/);

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
      '[Next topic](/topic/50)',
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
    assert.match(markdownHtml, /href="\/topic\/50"/);
    assert.match(markdownHtml, /href="https:\/\/vite.dev"/);
    assert.match(markdownHtml, /src="(?:\/|\.\/)images\/diagram\.png"/);
    assert.match(markdownHtml, /loading="lazy"/);
  } finally {
    await server.close();
  }
});
