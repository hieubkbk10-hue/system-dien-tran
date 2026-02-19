import { DEFAULT_CONTACT_CONFIG, normalizeContactHarmony } from './constants';
import type {
  ContactConfig,
  ContactConfigState,
  ContactSocialLink,
  ContactStyle,
} from '../_types';

const CONTACT_STYLE_SET = new Set<ContactStyle>([
  'modern',
  'floating',
  'grid',
  'elegant',
  'minimal',
  'centered',
]);

const coerceText = (value: unknown) => {
  if (typeof value === 'string') {return value;}
  if (typeof value === 'number') {return String(value);}
  return '';
};

const toSocialRecord = (raw: unknown): Record<string, unknown> => {
  if (typeof raw === 'object' && raw !== null) {
    return raw as Record<string, unknown>;
  }
  return {};
};

const normalizeStyle = (value: unknown): ContactStyle => {
  if (typeof value === 'string' && CONTACT_STYLE_SET.has(value as ContactStyle)) {
    return value as ContactStyle;
  }
  return 'modern';
};

const normalizeSocialLinks = (input: unknown): ContactSocialLink[] => {
  if (!Array.isArray(input)) {return [];}

  return input.map((raw, index) => {
    const record = toSocialRecord(raw);
    const rawId = record.id;
    const id = typeof rawId === 'number'
      ? rawId
      : Number.parseInt(coerceText(rawId), 10);

    return {
      id: Number.isFinite(id) ? id : index + 1,
      platform: coerceText(record.platform),
      url: coerceText(record.url),
    };
  });
};

export const normalizeContactConfig = (rawConfig: unknown): ContactConfigState => {
  const config = (typeof rawConfig === 'object' && rawConfig !== null)
    ? rawConfig as Record<string, unknown>
    : {};

  const defaultConfig = DEFAULT_CONTACT_CONFIG;

  return {
    address: coerceText(config.address) || defaultConfig.address,
    email: coerceText(config.email) || defaultConfig.email,
    formDescription: coerceText(config.formDescription) || defaultConfig.formDescription,
    formFields: Array.isArray(config.formFields)
      ? config.formFields.map((field) => coerceText(field)).filter((field) => field.trim().length > 0)
      : [...defaultConfig.formFields],
    formTitle: coerceText(config.formTitle) || defaultConfig.formTitle,
    mapEmbed: coerceText(config.mapEmbed) || defaultConfig.mapEmbed,
    phone: coerceText(config.phone) || defaultConfig.phone,
    responseTimeText: coerceText(config.responseTimeText) || defaultConfig.responseTimeText,
    showMap: typeof config.showMap === 'boolean' ? config.showMap : defaultConfig.showMap,
    socialLinks: normalizeSocialLinks(config.socialLinks),
    submitButtonText: coerceText(config.submitButtonText) || defaultConfig.submitButtonText,
    workingHours: coerceText(config.workingHours) || defaultConfig.workingHours,
    style: normalizeStyle(config.style),
    harmony: normalizeContactHarmony(config.harmony),
    showForm: typeof config.showForm === 'boolean' ? config.showForm : undefined,
  };
};

export const toContactConfigPayload = (config: ContactConfigState): ContactConfig => {
  const normalized = normalizeContactConfig(config);
  return {
    address: normalized.address,
    email: normalized.email,
    formDescription: normalized.formDescription,
    formFields: [...normalized.formFields],
    formTitle: normalized.formTitle,
    mapEmbed: normalized.mapEmbed,
    phone: normalized.phone,
    responseTimeText: normalized.responseTimeText,
    showMap: normalized.showMap,
    socialLinks: normalized.socialLinks.map((item) => ({ ...item })),
    submitButtonText: normalized.submitButtonText,
    workingHours: normalized.workingHours,
    harmony: normalized.harmony,
    showForm: normalized.showForm,
  };
};

export const toContactSnapshot = (payload: {
  title: string;
  active: boolean;
  config: ContactConfigState;
}) => {
  const normalized = normalizeContactConfig(payload.config);

  return JSON.stringify({
    title: payload.title,
    active: payload.active,
    config: {
      address: normalized.address,
      email: normalized.email,
      formDescription: normalized.formDescription,
      formFields: [...normalized.formFields],
      formTitle: normalized.formTitle,
      mapEmbed: normalized.mapEmbed,
      phone: normalized.phone,
      responseTimeText: normalized.responseTimeText,
      showMap: normalized.showMap,
      socialLinks: normalized.socialLinks.map((link) => ({
        id: link.id,
        platform: link.platform,
        url: link.url,
      })),
      submitButtonText: normalized.submitButtonText,
      workingHours: normalized.workingHours,
      style: normalized.style,
      harmony: normalized.harmony,
      showForm: normalized.showForm,
    },
  });
};
