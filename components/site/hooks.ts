'use client';

import { useQuery } from 'convex/react';
import { formatHex, oklch } from 'culori';
import { api } from '@/convex/_generated/api';

const DEFAULT_BRAND_COLOR = '#3b82f6';

const safeOklch = (value: string) => oklch(value) ?? oklch(DEFAULT_BRAND_COLOR);

const resolveColorSetting = (value: unknown): string | null => {
  if (typeof value !== 'string') {return null;}
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const generateComplementary = (hex: string): string => {
  const parsed = safeOklch(hex);
  if (!parsed) {return DEFAULT_BRAND_COLOR;}

  return formatHex(oklch({
    ...parsed,
    h: ((parsed.h ?? 0) + 180) % 360,
  }));
};

export function useBrandColors() {
  const primarySetting = useQuery(api.settings.getByKey, { key: 'site_brand_primary' });
  const legacySetting = useQuery(api.settings.getByKey, { key: 'site_brand_color' });
  const secondarySetting = useQuery(api.settings.getByKey, { key: 'site_brand_secondary' });
  const modeSetting = useQuery(api.settings.getByKey, { key: 'site_brand_mode' });
  const primary = resolveColorSetting(primarySetting?.value)
    ?? resolveColorSetting(legacySetting?.value)
    ?? DEFAULT_BRAND_COLOR;
  const mode: 'single' | 'dual' = modeSetting?.value === 'single' ? 'single' : 'dual';
  const secondary = mode === 'single'
    ? ''
    : resolveColorSetting(secondarySetting?.value)
      ?? generateComplementary(primary);

  return { primary, secondary, mode };
}

// Hook lấy brandColor từ settings
export function useBrandColor() {
  return useBrandColors().primary;
}

// Hook lấy site settings
export function useSiteSettings() {
  const settings = useQuery(api.settings.listByGroup, { group: 'site' });
  
  if (settings === undefined) {
    return { isLoading: true, settings: {} };
  }
  
  const settingsMap: Record<string, string> = {};
  settings.forEach(s => {
    settingsMap[s.key] = s.value as string;
  });
  
  const brandPrimary = settingsMap.site_brand_primary || settingsMap.site_brand_color || DEFAULT_BRAND_COLOR;
  const brandMode = settingsMap.site_brand_mode === 'single' ? 'single' : 'dual';
  const brandSecondary = brandMode === 'single'
    ? ''
    : settingsMap.site_brand_secondary || generateComplementary(brandPrimary);

  return {
    brandColor: brandPrimary,
    brandPrimary,
    brandSecondary,
    favicon: settingsMap.site_favicon || '',
    isLoading: false,
    logo: settingsMap.site_logo || '',
    settings: settingsMap,
    siteDescription: settingsMap.site_description || '',
    siteName: settingsMap.site_name || 'VietAdmin',
  };
}

// Hook lấy contact settings
export function useContactSettings() {
  const settings = useQuery(api.settings.listByGroup, { group: 'contact' });
  
  if (settings === undefined) {
    return { isLoading: true };
  }
  
  const settingsMap: Record<string, string> = {};
  settings.forEach(s => {
    settingsMap[s.key] = s.value as string;
  });
  
  return {
    address: settingsMap.contact_address || '',
    email: settingsMap.contact_email || '',
    hotline: settingsMap.contact_hotline || '',
    isLoading: false,
    phone: settingsMap.contact_phone || '',
  };
}

// Hook lấy social links settings
export function useSocialLinks() {
  const settings = useQuery(api.settings.listByGroup, { group: 'social' });
  
  if (settings === undefined) {
    return { isLoading: true };
  }
  
  const settingsMap: Record<string, string> = {};
  settings.forEach(s => {
    settingsMap[s.key] = s.value as string;
  });
  
  return {
    facebook: settingsMap.social_facebook || '',
    instagram: settingsMap.social_instagram || '',
    isLoading: false,
    linkedin: settingsMap.social_linkedin || '',
    tiktok: settingsMap.social_tiktok || '',
    twitter: settingsMap.social_twitter || '',
    youtube: settingsMap.social_youtube || '',
    zalo: settingsMap.social_zalo || '',
  };
}
