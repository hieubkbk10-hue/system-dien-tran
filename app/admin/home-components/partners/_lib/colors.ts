'use client';

import { APCAcontrast } from 'apca-w3';
import { formatHex, oklch } from 'culori';

const DEFAULT_BRAND_COLOR = '#3b82f6';

const clampLightness = (value: number) => Math.min(Math.max(value, 0.08), 0.98);

const safeParseOklch = (input: string, fallback: string) => (
  oklch(input) ?? oklch(fallback) ?? oklch(DEFAULT_BRAND_COLOR)
);

const normalizeHex = (hex: string, fallback: string) => (
  formatHex(safeParseOklch(hex, fallback))
);

const shiftLightness = (hex: string, amount: number, fallback: string) => {
  const color = safeParseOklch(hex, fallback);
  return formatHex(oklch({ ...color, l: clampLightness((color.l ?? 0.6) + amount) }));
};

export const getAPCATextColor = (bg: string, fontSize = 16, fontWeight = 500) => {
  const whiteLc = Math.abs(APCAcontrast('#ffffff', bg));
  const blackLc = Math.abs(APCAcontrast('#000000', bg));
  const threshold = (fontSize >= 18 || fontWeight >= 700) ? 45 : 60;

  if (whiteLc >= threshold) {return '#ffffff';}
  if (blackLc >= threshold) {return '#0f172a';}
  return whiteLc > blackLc ? '#ffffff' : '#0f172a';
};

const getAnalogous = (hex: string): [string, string] => {
  const color = safeParseOklch(hex, DEFAULT_BRAND_COLOR);
  const first = formatHex(oklch({ ...color, h: ((color.h ?? 0) + 30) % 360 }));
  const second = formatHex(oklch({ ...color, h: ((color.h ?? 0) - 30 + 360) % 360 }));
  return [first, second];
};

const ensureAPCATextColor = (
  preferred: string,
  background: string,
  fontSize = 16,
  fontWeight = 500,
) => {
  const threshold = (fontSize >= 18 || fontWeight >= 700) ? 45 : 60;
  const lc = Math.abs(APCAcontrast(preferred, background));
  if (Number.isFinite(lc) && lc >= threshold) { return preferred; }
  return getAPCATextColor(background, fontSize, fontWeight);
};

export type PartnersBrandMode = 'single' | 'dual';

export const resolveSecondaryForMode = (
  primary: string,
  secondary: string,
  mode: PartnersBrandMode,
) => {
  const normalizedPrimary = normalizeHex(primary, DEFAULT_BRAND_COLOR);

  if (mode === 'single') {
    return normalizedPrimary;
  }

  if (secondary.trim()) {
    return normalizeHex(secondary, normalizedPrimary);
  }

  return getAnalogous(normalizedPrimary)[0];
};

export interface PartnersColorTokens {
  primary: string;
  secondary: string;
  headingText: string;
  headingAccent: string;
  iconBg: string;
  iconColor: string;
  neutralSurface: string;
  neutralMuted: string;
  neutralBorder: string;
  neutralSubtle: string;
  itemBorder: string;
  itemBg: string;
  itemBgMuted: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  remainingBg: string;
  remainingBorder: string;
  remainingText: string;
  navBorder: string;
  navText: string;
  navBg: string;
  dotActive: string;
  dotInactive: string;
  featuredBadgeBg: string;
  featuredBadgeText: string;
  featuredCardBg: string;
  featuredCardBorder: string;
}

export const getPartnersColors = (
  primary: string,
  secondary: string,
  mode: PartnersBrandMode = 'dual',
): PartnersColorTokens => {
  const primaryResolved = normalizeHex(primary, DEFAULT_BRAND_COLOR);
  const secondaryResolved = resolveSecondaryForMode(primaryResolved, secondary, mode);
  const neutralSurface = '#ffffff';
  const neutralMuted = '#64748b';
  const neutralBorder = '#e2e8f0';
  const neutralSubtle = '#f1f5f9';

  const primarySoft = shiftLightness(primaryResolved, 0.42, primaryResolved);
  const primarySubtle = shiftLightness(primaryResolved, 0.5, primaryResolved);
  const secondarySoft = shiftLightness(secondaryResolved, 0.42, primaryResolved);
  const secondarySubtle = shiftLightness(secondaryResolved, 0.5, primaryResolved);
  const secondaryStrong = shiftLightness(secondaryResolved, 0.3, primaryResolved);

  return {
    primary: primaryResolved,
    secondary: secondaryResolved,
    headingText: ensureAPCATextColor(primaryResolved, neutralSurface, 24, 700),
    headingAccent: ensureAPCATextColor(primaryResolved, neutralSurface, 24, 700),
    iconBg: primarySoft,
    iconColor: primaryResolved,
    neutralSurface,
    neutralMuted,
    neutralBorder,
    neutralSubtle,
    itemBorder: secondarySubtle,
    itemBg: neutralSurface,
    itemBgMuted: neutralSubtle,
    badgeBg: neutralSurface,
    badgeBorder: neutralBorder,
    badgeText: neutralMuted,
    remainingBg: secondarySubtle,
    remainingBorder: secondaryStrong,
    remainingText: getAPCATextColor(secondarySubtle, 12, 700),
    navBorder: shiftLightness(primaryResolved, 0.35, primaryResolved),
    navText: ensureAPCATextColor(primaryResolved, neutralSurface, 14, 500),
    navBg: neutralSurface,
    dotActive: secondaryResolved,
    dotInactive: neutralBorder,
    featuredBadgeBg: primaryResolved,
    featuredBadgeText: getAPCATextColor(primaryResolved, 10, 700),
    featuredCardBg: neutralSubtle,
    featuredCardBorder: neutralBorder,
  };
};
