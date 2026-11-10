import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

test('the roadmap renders without a runtime error', async () => {
  const server = await createServer({
    appType: 'custom',
    server: { middlewareMode: true },
    optimizeDeps: { noDiscovery: true },
  });
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx');
    const html = renderToString(createElement(App));
    assert.match(html, /Deep Learning &amp; LLM Foundations/);
    assert.match(html, /Search topics/);
  } finally {
    await server.close();
  }
});
