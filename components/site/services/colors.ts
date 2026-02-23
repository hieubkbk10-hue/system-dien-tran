import { formatHex, oklch } from 'culori';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const safeParseOklch = (value: string, fallback: string) => {
  const parsed = oklch(value);
  if (parsed) {return parsed;}
  const fallbackParsed = oklch(fallback);
  return fallbackParsed ?? { l: 0.7, c: 0.1, h: 0 };
};

export const resolveSecondaryColor = (primary: string, secondary?: string) => {
  if (typeof secondary !== 'string') {return primary;}
  const trimmed = secondary.trim();
  return trimmed ? trimmed : primary;
};

export const getSolidTint = (value: string, fallback: string, lDelta = 0.42) => {
  const base = safeParseOklch(value, fallback);
  return formatHex(oklch({ ...base, l: clamp(base.l + lDelta, 0, 0.98) }));
};
