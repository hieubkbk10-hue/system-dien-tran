import { formatHex, oklch } from 'culori';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const safeParseOklch = (value: string, fallback: string) => {
  const parsed = oklch(value);
  if (parsed) {return parsed;}
  const fallbackParsed = oklch(fallback);
  return fallbackParsed ?? { l: 0.7, c: 0.1, h: 0 };
};

export type ServicesListColorMode = 'single' | 'dual';

export const resolveSecondaryColor = (primary: string, secondary?: string) => {
  if (typeof secondary !== 'string') {return primary;}
  const trimmed = secondary.trim();
  return trimmed ? trimmed : primary;
};

export const resolveSecondaryForMode = (
  primary: string,
  secondary: string | undefined,
  mode: ServicesListColorMode
) => {
  if (mode === 'single') {return primary;}
  return resolveSecondaryColor(primary, secondary);
};

export const getSolidTint = (value: string, fallback: string, lDelta = 0.42) => {
  const base = safeParseOklch(value, fallback);
  return formatHex(oklch({ ...base, l: clamp(base.l + lDelta, 0, 0.98) }));
};

export type ServicesListColors = {
  primary: string;
  secondary: string;
  headingColor: string;
  sectionHeadingColor: string;
  primaryActionBg: string;
  primaryActionText: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  priceColor: string;
  filterRing: string;
  filterIcon: string;
  filterActiveBg: string;
  filterActiveText: string;
  filterTagBg: string;
  filterTagText: string;
  paginationActiveBg: string;
  paginationActiveText: string;
  paginationButtonBorder: string;
  paginationButtonText: string;
  paginationButtonHoverBg: string;
  loadingDotStrong: string;
  loadingDotMedium: string;
  loadingDotSoft: string;
  highlightNumber: string;
  accentBorder: string;
};

export const getServicesListColors = (
  primary: string,
  secondary: string | undefined,
  mode: ServicesListColorMode = 'single'
): ServicesListColors => {
  const resolvedSecondary = resolveSecondaryForMode(primary, secondary, mode);
  const primarySoft = getSolidTint(primary, primary, 0.42);
  const primarySoftStrong = getSolidTint(primary, primary, 0.32);
  const secondarySoft = getSolidTint(resolvedSecondary, primary, 0.42);

  return {
    primary,
    secondary: resolvedSecondary,
    headingColor: primary,
    sectionHeadingColor: primary,
    primaryActionBg: primary,
    primaryActionText: '#ffffff',
    badgeBg: secondarySoft,
    badgeText: resolvedSecondary,
    badgeBorder: secondarySoft,
    priceColor: resolvedSecondary,
    filterRing: primary,
    filterIcon: primary,
    filterActiveBg: primarySoft,
    filterActiveText: primary,
    filterTagBg: primarySoft,
    filterTagText: primary,
    paginationActiveBg: primary,
    paginationActiveText: '#ffffff',
    paginationButtonBorder: primary,
    paginationButtonText: primary,
    paginationButtonHoverBg: primarySoft,
    loadingDotStrong: primary,
    loadingDotMedium: primarySoftStrong,
    loadingDotSoft: primarySoft,
    highlightNumber: primary,
    accentBorder: primary,
  };
};
