import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../app.js';

let server;
let origin;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) {
    server.closeAllConnections();
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});

test('health endpoint is available without authentication', async () => {
  const response = await fetch(`${origin}/api/health`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
});

test('protected service, blog, content, settings and upload operations reject anonymous requests', async () => {
  const checks = [
    ['GET', '/api/services/admin'],
    ['POST', '/api/services'],
    ['GET', '/api/blog/admin'],
    ['POST', '/api/blog'],
    ['GET', '/api/content/admin'],
    ['POST', '/api/content'],
    ['PUT', '/api/settings/whatsapp-contacts'],
    ['POST', '/api/upload'],
  ];
  for (const [method, path] of checks) {
    const response = await fetch(`${origin}${path}`, { method, headers: method === 'GET' ? {} : { 'Content-Type': 'application/json' }, body: method === 'GET' ? undefined : JSON.stringify({}) });
    assert.equal(response.status, 401, `${method} ${path} must require an admin session`);
  }
});

test('API responses include security headers and unknown routes return 404', async () => {
  const health = await fetch(`${origin}/api/health`);
  assert.equal(health.headers.get('x-content-type-options'), 'nosniff');
  const missing = await fetch(`${origin}/api/not-a-route`);
  assert.equal(missing.status, 404);
});
