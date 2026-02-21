import type { ContactConfigState } from '../_types';

export interface ValidationResult {
  isValid: boolean;
  errors: {
    mapEmbed?: string;
    email?: string;
    phone?: string;
    socialLinks?: Record<number, { url?: string }>;
  };
}

export const isValidUrl = (url: string): boolean => {
  if (!url.trim()) return true; // Empty is valid (optional field)
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isValidEmail = (email: string): boolean => {
  if (!email.trim()) return true; // Empty is valid (optional field)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  if (!phone.trim()) return true; // Empty is valid (optional field)
  // Allow: digits, spaces, +, -, (, )
  const phoneRegex = /^[\d\s+\-()]+$/;
  return phoneRegex.test(phone);
};

export const validateContactConfig = (config: ContactConfigState): ValidationResult => {
  const errors: ValidationResult['errors'] = {};

  if (config.showMap && config.mapEmbed && !isValidUrl(config.mapEmbed)) {
    errors.mapEmbed = 'URL không hợp lệ';
  }

  if (config.email && !isValidEmail(config.email)) {
    errors.email = 'Email không đúng định dạng';
  }

  if (config.phone && !isValidPhone(config.phone)) {
    errors.phone = 'Số điện thoại chứa ký tự không hợp lệ';
  }

  const socialErrors: Record<number, { url?: string }> = {};
  config.socialLinks.forEach((link) => {
    if (link.url && !isValidUrl(link.url)) {
      socialErrors[link.id] = { url: 'URL không hợp lệ' };
    }
  });

  if (Object.keys(socialErrors).length > 0) {
    errors.socialLinks = socialErrors;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
