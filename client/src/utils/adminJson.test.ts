import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAdminJsonObject } from './adminJson';

test('admin JSON editor accepts only an object and preserves structured values', () => {
  assert.deepEqual(parseAdminJsonObject('{"title":"Service","gallery":[]}'), {
    value: { title: 'Service', gallery: [] }, error: '',
  });
  assert.equal(parseAdminJsonObject('[1,2]').error, 'Enter a JSON object to apply changes.');
});

test('admin JSON editor reports a line and column without discarding the source', () => {
  const source = '{\n  "title": }';
  const result = parseAdminJsonObject(source);
  assert.equal(result.value, null);
  assert.match(result.error, /Invalid JSON at line 2, column \d+\./);
  assert.equal(source, '{\n  "title": }');
});
