import type { FakerTemplate, IndustrySummary, IndustryTemplate } from './types';

export type Randomizer = () => number;

const DEFAULT_FIELDS: Record<string, string[]> = {
  variant: ['Cao cấp', 'Tiêu chuẩn', 'Phổ thông', 'Limited'],
  feature: ['Thiết kế hiện đại', 'Chất lượng cao', 'Giá tốt', 'Bền bỉ', 'Tiện dụng', 'Thân thiện'],
  usage: ['hàng ngày', 'gia đình', 'doanh nghiệp', 'du lịch', 'tặng quà'],
  description: [
    'Sản phẩm được chọn lọc kỹ',
    'Đáp ứng nhu cầu đa dạng',
    'Phù hợp xu hướng 2026',
    'Mang lại trải nghiệm tốt',
  ],
  number: ['5', '7', '10', '12'],
  year: [new Date().getFullYear().toString()],
};

export function pickRandom<T>(values: T[], randomFn: Randomizer = Math.random): T {
  if (values.length === 0) {
    throw new Error('Empty values');
  }
  return values[Math.floor(randomFn() * values.length)];
}

export function mergeTemplateFields(template?: FakerTemplate): Record<string, string[]> {
  if (!template) {
    return { ...DEFAULT_FIELDS };
  }
  return { ...DEFAULT_FIELDS, ...template.customFields };
}

export function renderPattern(pattern: string, fields: Record<string, string[]>, randomFn: Randomizer = Math.random): string {
  return pattern.replace(/\{\{(.*?)\}\}/g, (_match, key) => {
    const values = fields[key] || [key];
    return pickRandom(values, randomFn);
  });
}

export function buildFromPatterns(patterns: string[], fields: Record<string, string[]>, randomFn: Randomizer = Math.random): string {
  const pattern = pickRandom(patterns, randomFn);
  return renderPattern(pattern, fields, randomFn);
}

export function buildIndustrySummary(template: IndustryTemplate): IndustrySummary {
  const {
    key,
    name,
    icon,
    description,
    category,
    websiteTypes,
    saleMode,
    productType,
    businessType,
    brandColor,
    tags,
    experiencePresetKey,
  } = template;
  return {
    key,
    name,
    icon,
    description,
    category,
    websiteTypes,
    saleMode,
    productType,
    businessType,
    brandColor,
    tags,
    experiencePresetKey,
  };
}
