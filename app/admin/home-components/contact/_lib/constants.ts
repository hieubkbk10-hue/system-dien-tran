import type { ContactConfigState } from '../_types';

export const DEFAULT_CONTACT_CONFIG: ContactConfigState = {
  address: '',
  email: '',
  formDescription: '',
  formFields: ['name', 'email', 'phone', 'message'],
  formTitle: '',
  mapEmbed: '',
  phone: '',
  responseTimeText: '',
  showMap: true,
  socialLinks: [],
  submitButtonText: '',
  workingHours: '',
  style: 'modern',
};
