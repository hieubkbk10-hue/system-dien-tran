'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const DEFAULT_BRAND_COLOR = '#3b82f6';

const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {return { h: 0, l: 0, s: 0 };}
  const r = Number.parseInt(result[1], 16) / 255;
  const g = Number.parseInt(result[2], 16) / 255;
  const b = Number.parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: { h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      }
      case g: { h = ((b - r) / d + 2) / 6; break;
      }
      case b: { h = ((r - g) / d + 4) / 6; break;
      }
    }
  }
  return { h: Math.round(h * 360), l: Math.round(l * 100), s: Math.round(s * 100) };
};

const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const resolveColorSetting = (value: unknown): string | null => {
  if (typeof value !== 'string') {return null;}
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const generateComplementary = (hex: string): string => {
  const { h, s, l } = hexToHSL(hex);
  return hslToHex((h + 180) % 360, s, l);
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
