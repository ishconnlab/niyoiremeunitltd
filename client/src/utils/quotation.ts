import {
  QuotationCalculationInput,
  QuotationEstimateResult,
  FinishingTier,
  ProjectType,
} from '../types';

/**
 * Indicative pricing engine.
 *
 * The engine is intentionally free of user-facing copy: every label and note is
 * emitted as a translation key so the same estimate renders in English and
 * Kinyarwanda. The numbers are indicative market estimates in Rwandan Francs,
 * never a contract price.
 */

export const TIER_MULTIPLIERS: Record<FinishingTier, number> = {
  standard: 1.0,
  premium: 1.45,
  luxury_executive: 2.1,
};

export const AREA_BOUNDS = { min: 10, max: 10000 } as const;
export const WORKER_BOUNDS = { min: 1, max: 100 } as const;
export const DURATION_BOUNDS = { min: 1, max: 52 } as const;

export function formatRWF(amount: number, locale = 'en-RW'): string {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));

  return `${formatted} RWF`;
}

export function clampArea(value?: number): number {
  if (value === undefined || value === null || Number.isNaN(value)) return 100;
  return Math.min(Math.max(value, AREA_BOUNDS.min), AREA_BOUNDS.max);
}

export function clampWorkers(value?: number): number {
  if (value === undefined || value === null || Number.isNaN(value)) return 4;
  return Math.min(Math.max(value, WORKER_BOUNDS.min), WORKER_BOUNDS.max);
}

export function clampWeeks(value?: number): number {
  if (value === undefined || value === null || Number.isNaN(value)) return 2;
  return Math.min(Math.max(value, DURATION_BOUNDS.min), DURATION_BOUNDS.max);
}

export function calculateQuotationEstimate(
  input: QuotationCalculationInput
): QuotationEstimateResult {
  const {
    serviceCategory,
    projectType,
    areaSquareMeters,
    tier = 'premium',
    workforceCount,
    workforceDurationWeeks,
    locationDistrict,
    needMaterialsIncluded = true,
  } = input;

  const area = clampArea(areaSquareMeters);
  const workers = clampWorkers(workforceCount);
  const weeks = clampWeeks(workforceDurationWeeks);
  const multiplier = TIER_MULTIPLIERS[tier] ?? TIER_MULTIPLIERS.premium;

  const breakdown: QuotationEstimateResult['breakdown'] = [];
  const noteKeys: string[] = [];

  if (serviceCategory === 'workforce') {
    const baseWeeklyRate = 75000 * multiplier;
    const totalLabour = baseWeeklyRate * workers * weeks;
    const coordination = totalLabour * 0.15;
    const safety = totalLabour * 0.08;

    const totalMin = Math.round(totalLabour * 0.9 + coordination + safety);
    const totalMax = Math.round(totalLabour * 1.15 + coordination + safety);

    breakdown.push({
      labelKey: 'quote.calculator.breakdown.workforceLabour',
      params: { count: workers, weeks },
      amountRWF: Math.round(totalLabour),
    });
    breakdown.push({
      labelKey: 'quote.calculator.breakdown.workforceSafety',
      amountRWF: Math.round(safety),
    });
    breakdown.push({
      labelKey: 'quote.calculator.breakdown.workforceCoordinator',
      amountRWF: Math.round(coordination),
    });

    noteKeys.push('quote.calculator.notes.verification');
    noteKeys.push('quote.calculator.notes.replacement');

    return {
      estimatedMinRWF: totalMin,
      estimatedMaxRWF: totalMax,
      formattedRangeRWF: `${formatRWF(totalMin)} “ ${formatRWF(totalMax)}`,
      suggestedDurationWeeks: weeks,
      breakdown,
      noteKeys,
    };
  }

  let rateMin = 0;
  let rateMax = 0;
  let estimatedDuration = 2;

  if (serviceCategory === 'painting') {
    rateMin = 4200 * multiplier;
    rateMax = 6200 * multiplier;
    estimatedDuration = Math.max(1, Math.ceil(area / 150));
  } else if (serviceCategory === 'finishing') {
    rateMin = 24000 * multiplier;
    rateMax = 38000 * multiplier;
    estimatedDuration = Math.max(2, Math.ceil(area / 60));
  } else if (projectType === 'renovation') {
    rateMin = 45000 * multiplier;
    rateMax = 75000 * multiplier;
    estimatedDuration = Math.max(3, Math.ceil(area / 40));
  } else {
    rateMin = 135000 * multiplier;
    rateMax = 210000 * multiplier;
    estimatedDuration = Math.max(6, Math.ceil(area / 25));
  }

  const materialsFactor = needMaterialsIncluded ? 1 : 0.45;
  const adjustedMin = Math.round(area * rateMin * materialsFactor);
  const adjustedMax = Math.round(area * rateMax * materialsFactor);
  const average = (adjustedMin + adjustedMax) / 2;

  if (needMaterialsIncluded) {
    breakdown.push({
      labelKey: 'quote.calculator.breakdown.materials',
      amountRWF: Math.round(average * 0.55),
    });
    breakdown.push({
      labelKey: 'quote.calculator.breakdown.labour',
      amountRWF: Math.round(average * 0.32),
    });
    breakdown.push({
      labelKey: 'quote.calculator.breakdown.supervision',
      amountRWF: Math.round(average * 0.13),
    });
  } else {
    breakdown.push({
      labelKey: 'quote.calculator.breakdown.labourOnly',
      amountRWF: Math.round(average * 0.75),
    });
    breakdown.push({
      labelKey: 'quote.calculator.breakdown.supervisionOnly',
      amountRWF: Math.round(average * 0.25),
    });
    noteKeys.push('quote.calculator.notes.materialsProvided');
  }

  if (locationDistrict && !locationDistrict.toLowerCase().includes('kigali')) {
    noteKeys.push('quote.calculator.notes.outsideKigali');
  }

  noteKeys.push('quote.calculator.notes.siteInspection');

  return {
    estimatedMinRWF: adjustedMin,
    estimatedMaxRWF: adjustedMax,
    formattedRangeRWF: `${formatRWF(adjustedMin)} “ ${formatRWF(adjustedMax)}`,
    suggestedDurationWeeks: estimatedDuration,
    breakdown,
    noteKeys,
  };
}

export interface QuoteSummaryContext {
  name?: string;
  phone?: string;
  location?: string;
  message?: string;
  serviceLabel?: string;
  projectTypeLabel?: string;
  tierLabel?: string;
  estimateRange?: string;
  durationWeeks?: number;
}

/**
 * Builds a plain-text summary of a quotation request for WhatsApp.
 * The returned string is not URL-encoded; use `buildWhatsAppUrl` for that.
 */
export function buildQuoteSummaryText(
  input: QuotationCalculationInput,
  estimate: QuotationEstimateResult,
  context: QuoteSummaryContext = {}
): string {
  const lines: string[] = [];

  lines.push('*NIYO IREME UNIT LTD — QUOTATION REQUEST*');
  lines.push('--------------------------------------');

  if (context.name) lines.push(`*Name:* ${context.name}`);
  if (context.phone) lines.push(`*Phone:* ${context.phone}`);
  if (context.location) lines.push(`*Project location:* ${context.location}`);
  if (context.serviceLabel) lines.push(`*Service:* ${context.serviceLabel}`);
  if (context.projectTypeLabel) lines.push(`*Project type:* ${context.projectTypeLabel}`);
  if (context.tierLabel) lines.push(`*Finish standard:* ${context.tierLabel}`);

  if (input.serviceCategory === 'workforce') {
    lines.push(
      `*Workers needed:* ${clampWorkers(input.workforceCount)} artisans for ${clampWeeks(
        input.workforceDurationWeeks
      )} weeks`
    );
  } else {
    lines.push(`*Approximate area:* ${clampArea(input.areaSquareMeters)} m²`);
    lines.push(
      `*Materials included:* ${input.needMaterialsIncluded ? 'Yes' : 'No (labour and supervision only)'}`
    );
  }

  lines.push('--------------------------------------');
  if (context.estimateRange) lines.push(`*Indicative estimate:* ${context.estimateRange}`);
  lines.push(`*Indicative duration:* about ${estimate.suggestedDurationWeeks} weeks`);

  if (context.message) {
    lines.push('');
    lines.push(`*Project details:* ${context.message}`);
  }

  lines.push('');
  lines.push('Quality. Precision. Excellence.');
  lines.push('Please arrange a site visit for my project.');

  return lines.join('\n');
}

export const PROJECT_TYPE_KEYS: Record<ProjectType, string> = {
  residential: 'quote.projectTypes.residential',
  commercial: 'quote.projectTypes.commercial',
  renovation: 'quote.projectTypes.renovation',
  exterior: 'quote.projectTypes.exterior',
};

