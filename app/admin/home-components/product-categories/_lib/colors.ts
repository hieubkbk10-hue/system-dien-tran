'use client';

import { APCAcontrast } from 'apca-w3';
import { formatHex, oklch } from 'culori';

export interface BrandPalette {
  solid: string;
  surface: string;
  hover: string;
  active: string;
  border: string;
  disabled: string;
  textOnSolid: string;
  textInteractive: string;
}

export interface ProductCategoriesColors {
  primary: BrandPalette;
  secondary: BrandPalette;
  neutral: {
    background: string;
    surface: string;
    border: string;
    text: string;
    muted: string;
  };
  cardShadow: string;
  cardShadowHover: string;
  cardBorder: string;
  cardBorderHover: string;
  sectionBg: string;
  linkText: string;
  productCountText: string;
  iconContainerBg: string;
  overlayText: string;
  pillBg: string;
  pillBorder: string;
  ctaMoreBg: string;
  ctaMoreBorder: string;
  ctaMoreText: string;
  circularBg: string;
  circularBorder: string;
  paginationDotActive: string;
  paginationDotInactive: string;
  arrowIcon: string;
  emptyState: {
    background: string;
    iconBg: string;
    icon: string;
    text: string;
  };
}

const getAPCATextColor = (bg: string, fontSize = 16, fontWeight = 500) => {
  const whiteLc = Math.abs(APCAcontrast('#ffffff', bg));
  const blackLc = Math.abs(APCAcontrast('#000000', bg));
  const threshold = (fontSize >= 18 || fontWeight >= 700) ? 45 : 60;

  if (whiteLc >= threshold) {return '#ffffff';}
  if (blackLc >= threshold) {return '#0f172a';}
  return whiteLc > blackLc ? '#ffffff' : '#0f172a';
};

const toOklchString = (hex: string, alpha = 1) => {
  const color = oklch(hex);
  const l = Math.max(0, Math.min(color.l ?? 0, 1));
  const c = Math.max(0, Math.min(color.c ?? 0, 0.4));
  const h = Number.isFinite(color.h) ? color.h : 0;
  return `oklch(${(l * 100).toFixed(2)}% ${c.toFixed(3)} ${h.toFixed(2)} / ${alpha})`;
};

const generatePalette = (hex: string): BrandPalette => {
  const color = oklch(hex);
  return {
    solid: hex,
    surface: formatHex(oklch({ ...color, l: Math.min(color.l + 0.4, 0.98) })),
    hover: formatHex(oklch({ ...color, l: Math.max(color.l - 0.1, 0.1) })),
    active: formatHex(oklch({ ...color, l: Math.max(color.l - 0.15, 0.08) })),
    border: formatHex(oklch({ ...color, l: Math.min(color.l + 0.3, 0.92) })),
    disabled: formatHex(oklch({ ...color, l: Math.min(color.l + 0.25, 0.9), c: color.c * 0.5 })),
    textOnSolid: getAPCATextColor(hex, 16, 500),
    textInteractive: formatHex(oklch({ ...color, l: Math.max(color.l - 0.25, 0.2) })),
  };
};

export const getProductCategoriesColors = (primary: string, secondary: string): ProductCategoriesColors => {
  const primaryPalette = generatePalette(primary);
  const secondaryPalette = generatePalette(secondary);
  const neutral = {
    background: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    text: '#0f172a',
    muted: '#64748b',
  };

  return {
    primary: primaryPalette,
    secondary: secondaryPalette,
    neutral,
    cardShadow: `0 2px 8px ${toOklchString(secondaryPalette.solid, 0.12)}`,
    cardShadowHover: `0 8px 24px ${toOklchString(secondaryPalette.solid, 0.2)}`,
    cardBorder: secondaryPalette.border,
    cardBorderHover: secondaryPalette.solid,
    sectionBg: neutral.background,
    linkText: secondaryPalette.solid,
    productCountText: secondaryPalette.solid,
    iconContainerBg: primaryPalette.solid,
    overlayText: getAPCATextColor('#0f172a', 16, 600),
    pillBg: toOklchString(secondaryPalette.solid, 0.08),
    pillBorder: toOklchString(secondaryPalette.solid, 0.2),
    ctaMoreBg: primaryPalette.surface,
    ctaMoreBorder: primaryPalette.border,
    ctaMoreText: primaryPalette.solid,
    circularBg: toOklchString(secondaryPalette.solid, 0.05),
    circularBorder: toOklchString(secondaryPalette.solid, 0.15),
    paginationDotActive: secondaryPalette.solid,
    paginationDotInactive: secondaryPalette.border,
    arrowIcon: primaryPalette.solid,
    emptyState: {
      background: neutral.background,
      iconBg: neutral.surface,
      icon: primaryPalette.solid,
      text: neutral.muted,
    },
  };
};
