import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildBreadcrumbNode,
  buildFaqNode,
  buildOrganizationNode,
  buildServiceListNode,
  buildWebPageNode,
  buildWebsiteNode,
} from './structuredData';

/**
 * These tests lock the structured-data contract: the JSON-LD must stay valid,
 * single-typed where required, and never invent ratings, reviews or coverage.
 */

const roundTrip = (value: unknown) => JSON.parse(JSON.stringify(value));

test('organization node is a GeneralContractor with verified contact details', () => {
  const node = buildOrganizationNode('A construction company.', 'https://example.com/og.png');
  const types = node['@type'] as string[];

  assert.ok(types.includes('GeneralContractor'));
  assert.equal(node.telephone, '+250 781 294 928');
  assert.equal(node.email, 'info@niyoireme.rw');
  assert.equal(roundTrip(node).address.addressCountry, 'RW');
  assert.equal(roundTrip(node).address.addressLocality, 'Kimironko');
});

test('organization node publishes the confirmed Monday-Friday opening hours', () => {
  const hours = buildOrganizationNode('x', 'y').openingHoursSpecification[0];

  assert.deepEqual(hours.dayOfWeek, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  assert.equal(hours.opens, '08:00');
  assert.equal(hours.closes, '17:00');
});

test('organization node does not fabricate ratings or reviews', () => {
  const node = buildOrganizationNode('x', 'y') as Record<string, unknown>;

  assert.equal(node.aggregateRating, undefined);
  assert.equal(node.review, undefined);
});

test('website and webpage nodes link back to the organization by @id', () => {
  const website = buildWebsiteNode('en');
  const page = buildWebPageNode('/about', 'en', 'About', 'About us');

  assert.equal(website.publisher['@id'].includes('#organization'), true);
  assert.equal(page.isPartOf['@id'].includes('#website'), true);
  assert.equal(page.about['@id'].includes('#organization'), true);
  assert.equal(page.inLanguage, 'en');
});

test('breadcrumb nodes are ordered and carry language alternates', () => {
  const node = buildBreadcrumbNode('/services/painting', 'rw', [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Painting', path: '/services/painting' },
  ]);

  assert.equal(node.itemListElement.length, 3);
  assert.deepEqual(
    node.itemListElement.map((item) => item.position),
    [1, 2, 3]
  );
  assert.ok(node.itemListElement[0].item.endsWith('?lang=rw'));
});

test('service list node wraps each division as a Service with a provider reference', () => {
  const node = buildServiceListNode([
    { name: 'Painting', description: 'Interior and exterior.', path: '/services/painting' },
  ]);

  assert.equal(node.itemListElement.length, 1);
  assert.equal(node.itemListElement[0].item['@type'], 'Service');
  assert.equal(node.itemListElement[0].item.provider['@id'].includes('#organization'), true);
});

test('faq node reflects only the supplied visible question and answer pairs', () => {
  const node = buildFaqNode([{ question: 'How much?', answer: 'It depends on scope.' }]);

  assert.equal(node.mainEntity.length, 1);
  assert.equal(node.mainEntity[0]['@type'], 'Question');
  assert.equal(node.mainEntity[0].acceptedAnswer.text, 'It depends on scope.');
});
