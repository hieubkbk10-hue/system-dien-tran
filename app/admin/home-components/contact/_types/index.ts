export interface ContactSocialLink {
  id: number;
  platform: string;
  url: string;
}

export interface ContactConfig {
  showMap: boolean;
  mapEmbed: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  formFields: string[];
  socialLinks: ContactSocialLink[];
  showForm?: boolean;
  formTitle?: string;
  formDescription?: string;
  submitButtonText?: string;
  responseTimeText?: string;
}

export type ContactStyle = 'modern' | 'floating' | 'grid' | 'elegant' | 'minimal' | 'centered';

export interface ContactConfigState extends ContactConfig {
  style: ContactStyle;
}
