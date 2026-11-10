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
    globalThis.window = { location: { hash: '#/phase/3' } };
    try {
      const gpuPage = renderToString(createElement(App));
      assert.match(gpuPage, /All phases/);
      assert.match(gpuPage, /id="phase-3"/);
      assert.doesNotMatch(gpuPage, /id="phase-1"/);
      assert.doesNotMatch(gpuPage, /id="phase-2"/);
      globalThis.window.location.hash = '#/phase/4';
      const agentPage = renderToString(createElement(App));
      assert.match(agentPage, /Topics coming soon/);
      assert.doesNotMatch(agentPage, /id="phase-4"/);
    } finally {
      delete globalThis.window;
    }
  } finally {
    await server.close();
  }
});
