import test from 'node:test';
import assert from 'node:assert/strict';

import {
  AREA_BOUNDS,
  DURATION_BOUNDS,
  WORKER_BOUNDS,
  buildQuoteSummaryText,
  calculateQuotationEstimate,
  clampArea,
  clampWeeks,
  clampWorkers,
  formatRWF,
} from './quotation';

test('formatRWF formats Rwandan Francs with the currency suffix', () => {
  const formatted = formatRWF(1500000);
  assert.ok(formatted.includes('1,500,000') || formatted.includes('1500000'));
  assert.ok(formatted.includes('RWF'));
});

test('calculateQuotationEstimate returns a realistic finishing range', () => {
  const result = calculateQuotationEstimate({
    serviceCategory: 'finishing',
    projectType: 'residential',
    areaSquareMeters: 200,
    tier: 'premium',
    needMaterialsIncluded: true,
  });

  assert.ok(result.estimatedMinRWF > 0);
  assert.ok(result.estimatedMaxRWF > result.estimatedMinRWF);
  assert.ok(result.suggestedDurationWeeks >= 2);
  assert.ok(result.breakdown.length >= 2);
  assert.ok(result.formattedRangeRWF.includes('RWF'));
});

test('every breakdown entry is expressed as a translation key', () => {
  const result = calculateQuotationEstimate({
    serviceCategory: 'painting',
    projectType: 'residential',
    areaSquareMeters: 100,
    tier: 'standard',
    needMaterialsIncluded: true,
  });

  result.breakdown.forEach((item) => {
    assert.ok(item.labelKey.startsWith('quote.calculator.breakdown.'));
    assert.ok(item.amountRWF >= 0);
  });

  result.noteKeys.forEach((key) => {
    assert.ok(key.startsWith('quote.calculator.notes.'));
  });
});

test('luxury tier costs more than standard tier for painting', () => {
  const standard = calculateQuotationEstimate({
    serviceCategory: 'painting',
    projectType: 'residential',
    areaSquareMeters: 100,
    tier: 'standard',
    needMaterialsIncluded: true,
  });

  const luxury = calculateQuotationEstimate({
    serviceCategory: 'painting',
    projectType: 'residential',
    areaSquareMeters: 100,
    tier: 'luxury_executive',
    needMaterialsIncluded: true,
  });

  assert.ok(luxury.estimatedMinRWF > standard.estimatedMinRWF);
});

test('labor-only calculation reduces estimate and flags client-supplied materials', () => {
  const withMaterials = calculateQuotationEstimate({
    serviceCategory: 'finishing',
    projectType: 'residential',
    areaSquareMeters: 150,
    tier: 'premium',
    needMaterialsIncluded: true,
  });

  const laborOnly = calculateQuotationEstimate({
    serviceCategory: 'finishing',
    projectType: 'residential',
    areaSquareMeters: 150,
    tier: 'premium',
    needMaterialsIncluded: false,
  });

  assert.ok(laborOnly.estimatedMinRWF < withMaterials.estimatedMinRWF);
  assert.ok(laborOnly.noteKeys.includes('quote.calculator.notes.materialsProvided'));
});

test('workforce matching calculates by worker count and duration', () => {
  const result = calculateQuotationEstimate({
    serviceCategory: 'workforce',
    projectType: 'commercial',
    workforceCount: 6,
    workforceDurationWeeks: 4,
    tier: 'standard',
  });

  assert.ok(result.estimatedMinRWF > 1000000);
  assert.equal(result.suggestedDurationWeeks, 4);

  const labour = result.breakdown.find((item) =>
    item.labelKey.endsWith('workforceLabour')
  );
  assert.ok(labour);
  assert.equal(labour?.params?.count, 6);
  assert.equal(labour?.params?.weeks, 4);
});

test('projects outside Kigali add a logistics note', () => {
  const inside = calculateQuotationEstimate({
    serviceCategory: 'finishing',
    projectType: 'residential',
    areaSquareMeters: 100,
    tier: 'premium',
    locationDistrict: 'Gasabo, Kigali',
  });

  const outside = calculateQuotationEstimate({
    serviceCategory: 'finishing',
    projectType: 'residential',
    areaSquareMeters: 100,
    tier: 'premium',
    locationDistrict: 'Muhanga',
  });

  assert.ok(!inside.noteKeys.includes('quote.calculator.notes.outsideKigali'));
  assert.ok(outside.noteKeys.includes('quote.calculator.notes.outsideKigali'));
});

test('scope inputs are clamped to the supported ranges', () => {
  assert.equal(clampArea(1), AREA_BOUNDS.min);
  assert.equal(clampArea(999999), AREA_BOUNDS.max);
  assert.equal(clampWorkers(0), WORKER_BOUNDS.min);
  assert.equal(clampWorkers(5000), WORKER_BOUNDS.max);
  assert.equal(clampWeeks(0), DURATION_BOUNDS.min);
  assert.equal(clampWeeks(500), DURATION_BOUNDS.max);
});

test('buildQuoteSummaryText contains the client details and the official slogan', () => {
  const estimate = calculateQuotationEstimate({
    serviceCategory: 'finishing',
    projectType: 'residential',
    areaSquareMeters: 120,
    tier: 'premium',
    needMaterialsIncluded: true,
  });

  const summary = buildQuoteSummaryText(
    {
      serviceCategory: 'finishing',
      projectType: 'residential',
      areaSquareMeters: 120,
      tier: 'premium',
      needMaterialsIncluded: true,
    },
    estimate,
    {
      name: 'Jean Pierre Habimana',
      phone: '+250 788 123 456',
      location: 'Gacuriro, Kigali',
      message: 'Need urgent ceiling and painting inspection.',
      serviceLabel: 'House Finishing and Decoration',
      estimateRange: estimate.formattedRangeRWF,
    }
  );

  assert.ok(summary.includes('NIYO IREME UNIT LTD'));
  assert.ok(summary.includes('Jean Pierre Habimana'));
  assert.ok(summary.includes('Gacuriro, Kigali'));
  assert.ok(summary.includes('Quality. Precision. Excellence.'));
  assert.ok(summary.includes('120 m²'));
});

