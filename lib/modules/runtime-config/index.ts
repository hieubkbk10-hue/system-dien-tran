import type { FieldType } from '../../../types/module-config';

export type RuntimeModuleFeatureDefinition = {
  description?: string;
  enabled?: boolean;
  featureKey: string;
  linkedFieldKey?: string;
  name: string;
};

export type RuntimeModuleFieldDefinition = {
  enabled?: boolean;
  fieldKey: string;
  group?: string;
  isSystem?: boolean;
  linkedFeature?: string;
  name: string;
  order: number;
  required?: boolean;
  type: FieldType;
};

export type RuntimeModuleSettingDefinition = {
  settingKey: string;
  value: string | number | boolean;
};

export type RuntimeModuleDefinition = {
  moduleKey: string;
  features?: RuntimeModuleFeatureDefinition[];
  fields?: RuntimeModuleFieldDefinition[];
  settings?: RuntimeModuleSettingDefinition[];
};

export const settingsRuntimeDefinition: RuntimeModuleDefinition = {
  moduleKey: 'settings',
  features: [
    { description: 'Quản lý email, phone, địa chỉ', enabled: true, featureKey: 'enableContact', name: 'Thông tin liên hệ' },
    { description: 'Meta title, description, keywords', enabled: true, featureKey: 'enableSEO', name: 'SEO cơ bản' },
    { description: 'Links Facebook, Instagram, Youtube...', enabled: true, featureKey: 'enableSocial', name: 'Mạng xã hội' },
  ],
  fields: [
    { enabled: true, fieldKey: 'site_name', group: 'site', isSystem: true, name: 'Tên website', order: 0, required: true, type: 'text' },
    { enabled: true, fieldKey: 'site_tagline', group: 'site', isSystem: false, name: 'Slogan', order: 1, required: false, type: 'text' },
    { enabled: true, fieldKey: 'site_url', group: 'site', isSystem: true, name: 'URL Website', order: 2, required: false, type: 'text' },
    { enabled: true, fieldKey: 'site_logo', group: 'site', isSystem: true, name: 'Logo', order: 3, required: false, type: 'image' },
    { enabled: true, fieldKey: 'site_favicon', group: 'site', isSystem: true, name: 'Favicon', order: 4, required: false, type: 'image' },
    { enabled: true, fieldKey: 'site_timezone', group: 'site', isSystem: false, name: 'Múi giờ', order: 5, required: false, type: 'select' },
    { enabled: true, fieldKey: 'site_language', group: 'site', isSystem: false, name: 'Ngôn ngữ', order: 6, required: false, type: 'select' },
    { enabled: true, fieldKey: 'site_brand_primary', group: 'site', isSystem: false, name: 'Màu thương hiệu (chính)', order: 7, required: false, type: 'color' },
    { enabled: true, fieldKey: 'site_brand_secondary', group: 'site', isSystem: false, name: 'Màu thương hiệu (phụ)', order: 8, required: false, type: 'color' },
    { enabled: true, fieldKey: 'contact_email', group: 'contact', linkedFeature: 'enableContact', isSystem: false, name: 'Email', order: 6, required: false, type: 'email' },
    { enabled: true, fieldKey: 'contact_phone', group: 'contact', linkedFeature: 'enableContact', isSystem: false, name: 'Số điện thoại', order: 7, required: false, type: 'phone' },
    { enabled: true, fieldKey: 'contact_address', group: 'contact', linkedFeature: 'enableContact', isSystem: false, name: 'Địa chỉ', order: 8, required: false, type: 'textarea' },
    { enabled: true, fieldKey: 'contact_tax_id', group: 'contact', linkedFeature: 'enableContact', isSystem: false, name: 'Mã số thuế', order: 9, required: false, type: 'text' },
    { enabled: true, fieldKey: 'contact_zalo', group: 'contact', linkedFeature: 'enableContact', isSystem: false, name: 'Zalo', order: 10, required: false, type: 'text' },
    { enabled: true, fieldKey: 'contact_messenger', group: 'contact', linkedFeature: 'enableContact', isSystem: false, name: 'Facebook Messenger', order: 11, required: false, type: 'text' },
    { enabled: true, fieldKey: 'seo_title', group: 'seo', linkedFeature: 'enableSEO', isSystem: false, name: 'Meta Title', order: 10, required: false, type: 'text' },
    { enabled: true, fieldKey: 'seo_description', group: 'seo', linkedFeature: 'enableSEO', isSystem: false, name: 'Meta Description', order: 11, required: false, type: 'textarea' },
    { enabled: true, fieldKey: 'seo_keywords', group: 'seo', linkedFeature: 'enableSEO', isSystem: false, name: 'Keywords', order: 12, required: false, type: 'tags' },
    { enabled: true, fieldKey: 'seo_og_image', group: 'seo', linkedFeature: 'enableSEO', isSystem: false, name: 'OG Image', order: 13, required: false, type: 'image' },
    { enabled: true, fieldKey: 'social_facebook', group: 'social', linkedFeature: 'enableSocial', isSystem: false, name: 'Facebook', order: 14, required: false, type: 'text' },
    { enabled: true, fieldKey: 'social_instagram', group: 'social', linkedFeature: 'enableSocial', isSystem: false, name: 'Instagram', order: 15, required: false, type: 'text' },
    { enabled: true, fieldKey: 'social_youtube', group: 'social', linkedFeature: 'enableSocial', isSystem: false, name: 'Youtube', order: 16, required: false, type: 'text' },
    { enabled: false, fieldKey: 'social_tiktok', group: 'social', linkedFeature: 'enableSocial', isSystem: false, name: 'TikTok', order: 17, required: false, type: 'text' },
  ],
  settings: [
    { settingKey: 'site_brand_mode', value: 'dual' },
    { settingKey: 'cacheDuration', value: 3600 },
  ],
};

const MODULE_RUNTIME_DEFINITIONS: Record<string, RuntimeModuleDefinition> = {
  settings: settingsRuntimeDefinition,
};

export const getModuleRuntimeDefinition = (moduleKey: string): RuntimeModuleDefinition | null =>
  MODULE_RUNTIME_DEFINITIONS[moduleKey] ?? null;

export const hasModuleRuntimeDefinition = (moduleKey: string): boolean => Boolean(MODULE_RUNTIME_DEFINITIONS[moduleKey]);
