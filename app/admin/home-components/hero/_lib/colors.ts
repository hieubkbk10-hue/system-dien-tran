'use client';

import { getShade, getTint } from '@/lib/utils/colors';

export interface HeroColorScheme {
  primarySolid: string;
  primaryHover: string;
  primaryTintSubtle: string;
  primaryTintLight: string;
  primaryTintMedium: string;
  secondarySolid: string;
  secondaryTintVeryLight: string;
  secondaryTintLight: string;
  secondaryTintMedium: string;
  secondaryTintStrong: string;
  secondaryTintRing: string;
  overlayGradient: string;
  brandGradient: string;
}

export function getHeroColors(
  primary: string,
  secondary: string,
  useDualBrand: boolean,
): HeroColorScheme {
  const secondaryBase = useDualBrand ? secondary : primary;
  const overlayGradient = 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)';
  const brandGradient = useDualBrand
    ? `linear-gradient(135deg, ${getTint(primary, 0.8)} 0%, ${getTint(secondary, 0.6)} 100%)`
    : `linear-gradient(135deg, ${getTint(primary, 0.8)} 0%, ${getTint(primary, 0.5)} 100%)`;

  return {
    primarySolid: primary,
    primaryHover: getShade(primary, 10),
    primaryTintSubtle: getTint(primary, 0.1),
    primaryTintLight: getTint(primary, 0.15),
    primaryTintMedium: getTint(primary, 0.25),
    secondarySolid: secondaryBase,
    secondaryTintVeryLight: getTint(secondaryBase, useDualBrand ? 0.1 : 0.08),
    secondaryTintLight: getTint(secondaryBase, useDualBrand ? 0.15 : 0.12),
    secondaryTintMedium: getTint(secondaryBase, useDualBrand ? 0.3 : 0.2),
    secondaryTintStrong: getTint(secondaryBase, useDualBrand ? 0.4 : 0.25),
    secondaryTintRing: getTint(secondaryBase, useDualBrand ? 0.6 : 0.35),
    overlayGradient,
    brandGradient,
  };
}
