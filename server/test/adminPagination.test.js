import test from 'node:test';
import assert from 'node:assert/strict';
import { adminListQuery, adminListResponse } from '../utils/adminPagination.js';

test('admin list query clamps page size and treats search text as plain text', () => {
  const result = adminListQuery({ query: { page: '-3', limit: '5000', search: '  renovation.*  ' } }, { fields: ['title', 'slug'] });
  assert.equal(result.page, 1);
  assert.equal(result.limit, 10);
  assert.equal(result.query.$or.length, 2);
  assert.equal(result.query.$or[0].title.source, 'renovation\\.\\*');
});

test('admin list query preserves supported page sizes and optional filters', () => {
  const result = adminListQuery({ query: { page: '3', limit: '25' } }, { fields: ['title'], filter: { isActive: true } });
  assert.equal(result.page, 3);
  assert.equal(result.limit, 25);
  assert.equal(result.query.isActive, true);
  assert.equal(result.query.$or, undefined);
});

test('admin list response reports filtered totals and stable empty pagination', () => {
  assert.deepEqual(adminListResponse([{ title: 'One' }], 26, 2, 25), {
    success: true, data: [{ title: 'One' }], count: 1, total: 26, page: 2, limit: 25, pages: 2,
  });
  assert.deepEqual(adminListResponse([], 0, 1, 10), {
    success: true, data: [], count: 0, total: 0, page: 1, limit: 10, pages: 1,
  });
});
