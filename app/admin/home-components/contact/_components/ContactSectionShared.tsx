'use client';

import React from 'react';
import {
  Building2,
  Clock,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
  Youtube,
} from 'lucide-react';
import { cn } from '../../../components/ui';
import type { PreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import type {
  ContactBrandMode,
  ContactConfigState,
  ContactSocialLink,
  ContactStyle,
} from '../_types';
import type { ContactColorTokens } from '../_lib/colors';

type ContactSectionContext = 'preview' | 'site';

interface ContactSectionSharedProps {
  config: ContactConfigState;
  style: ContactStyle;
  tokens: ContactColorTokens;
  mode: ContactBrandMode;
  context: ContactSectionContext;
  device?: PreviewDevice;
  title?: string;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  zalo: MessageCircle,
};

const getSocialIconComponent = (platform: string) => iconMap[platform.toLowerCase()] ?? Globe;

const getDisplayDevice = (context: ContactSectionContext, device?: PreviewDevice): PreviewDevice => {
  if (context === 'site') {return 'desktop';}
  return device ?? 'desktop';
};

const getSectionPadding = (context: ContactSectionContext, currentDevice: PreviewDevice) => {
  if (context === 'site') {return 'py-12 md:py-16 px-4';}
  return currentDevice === 'mobile' ? 'py-6 px-3' : 'py-8 px-4';
};

const getRootContainerClass = (context: ContactSectionContext, currentDevice: PreviewDevice) => {
  if (context === 'site') {return 'max-w-6xl mx-auto';}
  if (currentDevice === 'mobile') {return 'w-full';}
  if (currentDevice === 'tablet') {return 'max-w-3xl mx-auto';}
  return 'max-w-5xl mx-auto';
};

const getInfo = (config: ContactConfigState, title?: string) => {
  const heading = (config.formTitle ?? title)?.trim() || 'Liên hệ với chúng tôi';
  const description = config.formDescription?.trim() || 'Chúng tôi luôn sẵn sàng hỗ trợ bạn';
  const submitLabel = config.submitButtonText?.trim() || 'Gửi yêu cầu';
  const responseText = config.responseTimeText?.trim() || 'Phản hồi trong 24h';

  return {
    heading,
    description,
    submitLabel,
    responseText,
    address: config.address?.trim() || '123 Nguyễn Huệ, Q1, TP.HCM',
    phone: config.phone?.trim() || '1900 1234',
    email: config.email?.trim() || 'contact@example.com',
    workingHours: config.workingHours?.trim() || 'Thứ 2 - Thứ 6: 8:00 - 17:00',
  };
};

const renderMapOrPlaceholder = ({
  mapEmbed,
  tokens,
  className = 'w-full h-full',
}: {
  mapEmbed: string;
  tokens: ContactColorTokens;
  className?: string;
}) => {
  if (mapEmbed) {
    return <iframe src={mapEmbed} className={`${className} border-0`} loading="lazy" title="Google Map" />;
  }

  return (
    <div className={cn(className, 'flex flex-col items-center justify-center')} style={{ backgroundColor: tokens.mapPlaceholderBg, color: tokens.mapPlaceholderIcon }}>
      <MapPin size={32} />
      <span className="text-xs mt-2">Chưa có URL bản đồ</span>
    </div>
  );
};

const IconBadge = ({
  icon,
  tokens,
  size = 18,
  className,
}: {
  icon: React.ReactNode;
  tokens: ContactColorTokens;
  size?: number;
  className?: string;
}) => (
  <div
    className={cn(
      'rounded-full flex items-center justify-center shrink-0',
      size >= 24 ? 'w-12 h-12' : size >= 20 ? 'w-10 h-10' : 'w-9 h-9',
      className,
    )}
    style={{ backgroundColor: tokens.iconTintBackground, color: tokens.iconTintColor }}
  >
    {icon}
  </div>
);

const ContactSocialLinks = ({
  socials,
  tokens,
  size = 18,
  centered = false,
}: {
  socials: ContactSocialLink[];
  tokens: ContactColorTokens;
  size?: number;
  centered?: boolean;
}) => {
  if (socials.length === 0) {return null;}

  return (
    <div className={cn('flex items-center gap-2', centered && 'justify-center')}>
      {socials.map((social, idx) => {
        const Icon = getSocialIconComponent(social.platform);
        return (
          <a
            key={`${social.id}-${social.platform}-${idx}`}
            href={social.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors"
            style={{
              backgroundColor: tokens.socialBackground,
              borderColor: tokens.socialBorder,
              color: tokens.socialIcon,
            }}
            aria-label={social.platform || 'social'}
          >
            <Icon size={size} />
          </a>
        );
      })}
    </div>
  );
};

const renderModern = ({
  info,
  config,
  tokens,
  currentDevice,
  activeSocials,
}: {
  info: ReturnType<typeof getInfo>;
  config: ContactConfigState;
  tokens: ContactColorTokens;
  currentDevice: PreviewDevice;
  activeSocials: ContactSocialLink[];
}) => (
  <div
    className="rounded-xl overflow-hidden border shadow-sm"
    style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}
  >
    <div className={cn('flex min-h-[380px]', currentDevice === 'mobile' ? 'flex-col' : 'flex-col lg:flex-row')}>
      <div className={cn('p-6 lg:p-10 flex flex-col justify-center', currentDevice === 'mobile' ? 'w-full' : 'lg:w-1/2')}>
        <div className="max-w-md mx-auto w-full">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border mb-4"
            style={{
              backgroundColor: tokens.sectionBadgeBg,
              color: tokens.sectionBadgeText,
              borderColor: tokens.sectionBadgeBorder,
            }}
          >
            Thông tin liên hệ
          </div>
          <h2 className={cn('font-bold tracking-tight mb-6', currentDevice === 'mobile' ? 'text-xl' : 'text-2xl')} style={{ color: tokens.heading }}>
            Kết nối với chúng tôi
          </h2>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <IconBadge icon={<MapPin size={16} />} tokens={tokens} className="mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-0.5" style={{ color: tokens.labelText }}>Địa chỉ văn phòng</h4>
                <p className="text-sm leading-relaxed" style={{ color: tokens.valueText }}>{info.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IconBadge icon={<Mail size={16} />} tokens={tokens} className="mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-0.5" style={{ color: tokens.labelText }}>Email & Điện thoại</h4>
                <p className="text-sm" style={{ color: tokens.valueText }}>{info.email}</p>
                <p className="text-sm mt-0.5" style={{ color: tokens.valueText }}>{info.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IconBadge icon={<Clock size={16} />} tokens={tokens} className="mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-0.5" style={{ color: tokens.labelText }}>Giờ làm việc</h4>
                <p className="text-sm" style={{ color: tokens.valueText }}>{info.workingHours}</p>
              </div>
            </div>
          </div>

          {activeSocials.length > 0 && (
            <div className="mt-5 pt-4 border-t" style={{ borderColor: tokens.neutralBorder }}>
              <ContactSocialLinks socials={activeSocials} tokens={tokens} />
            </div>
          )}
        </div>
      </div>

      {config.showMap && (
        <div
          className={cn('relative border-t lg:border-t-0 lg:border-l', currentDevice === 'mobile' ? 'w-full min-h-[220px]' : 'lg:w-1/2 min-h-[300px]')}
          style={{ borderColor: tokens.neutralBorder, backgroundColor: tokens.mapPlaceholderBg }}
        >
          {renderMapOrPlaceholder({ mapEmbed: config.mapEmbed, tokens, className: 'absolute inset-0' })}
        </div>
      )}
    </div>
  </div>
);

const renderFloating = ({
  info,
  config,
  tokens,
  currentDevice,
}: {
  info: ReturnType<typeof getInfo>;
  config: ContactConfigState;
  tokens: ContactColorTokens;
  currentDevice: PreviewDevice;
}) => (
  <div
    className={cn('w-full relative rounded-xl overflow-hidden border shadow-sm group', currentDevice === 'mobile' ? 'h-[500px]' : 'h-[450px]')}
    style={{ borderColor: tokens.cardBorder }}
  >
    <div className="absolute inset-0">
      {config.mapEmbed ? (
        <iframe src={config.mapEmbed} className="w-full h-full border-0 filter grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000" loading="lazy" title="Google Map" />
      ) : (
        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: tokens.mapPlaceholderBg, color: tokens.mapPlaceholderIcon }}>
          <MapPin size={64} />
        </div>
      )}
    </div>

    <div className={cn('absolute inset-0 pointer-events-none flex items-center p-4', currentDevice === 'mobile' ? 'justify-center' : 'justify-start lg:pl-12')}>
      <div
        className="pointer-events-auto p-6 rounded-xl shadow-lg max-w-sm w-full border"
        style={{ backgroundColor: tokens.floatingCardBg, borderColor: tokens.floatingCardBorder }}
      >
        <h2 className="text-lg font-bold mb-5" style={{ color: tokens.heading }}>Thông tin liên hệ</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: tokens.secondary }} />
            <div>
              <p className="text-[10px] font-medium uppercase mb-0.5" style={{ color: tokens.labelText }}>Địa chỉ</p>
              <p className="text-sm font-medium leading-relaxed" style={{ color: tokens.valueText }}>{info.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone size={16} className="mt-0.5 shrink-0" style={{ color: tokens.secondary }} />
            <div>
              <p className="text-[10px] font-medium uppercase mb-0.5" style={{ color: tokens.labelText }}>Hotline</p>
              <p className="text-sm font-medium" style={{ color: tokens.valueText }}>{info.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail size={16} className="mt-0.5 shrink-0" style={{ color: tokens.secondary }} />
            <div>
              <p className="text-[10px] font-medium uppercase mb-0.5" style={{ color: tokens.labelText }}>Email</p>
              <p className="text-sm font-medium" style={{ color: tokens.valueText }}>{info.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock size={16} className="mt-0.5 shrink-0" style={{ color: tokens.secondary }} />
            <div>
              <p className="text-[10px] font-medium uppercase mb-0.5" style={{ color: tokens.labelText }}>Giờ làm việc</p>
              <p className="text-sm font-medium" style={{ color: tokens.valueText }}>{info.workingHours}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const renderGrid = ({
  info,
  config,
  tokens,
  currentDevice,
}: {
  info: ReturnType<typeof getInfo>;
  config: ContactConfigState;
  tokens: ContactColorTokens;
  currentDevice: PreviewDevice;
}) => (
  <div className="w-full p-6 rounded-xl border" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.neutralBackground }}>
    <div className={cn('grid gap-3 mb-6', currentDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-3')}>
      <div className="p-5 rounded-lg border flex flex-col items-center text-center" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
        <IconBadge icon={<Phone size={18} />} tokens={tokens} className="mb-3" />
        <h3 className="font-medium text-sm mb-1" style={{ color: tokens.labelText }}>Điện thoại</h3>
        <p className="font-semibold" style={{ color: tokens.valueText }}>{info.phone}</p>
      </div>

      <div className="p-5 rounded-lg border flex flex-col items-center text-center" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
        <IconBadge icon={<Mail size={18} />} tokens={tokens} className="mb-3" />
        <h3 className="font-medium text-sm mb-1" style={{ color: tokens.labelText }}>Email</h3>
        <p className="font-semibold text-sm" style={{ color: tokens.valueText }}>{info.email}</p>
      </div>

      <div className="p-5 rounded-lg border flex flex-col items-center text-center" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
        <IconBadge icon={<Clock size={18} />} tokens={tokens} className="mb-3" />
        <h3 className="font-medium text-sm mb-1" style={{ color: tokens.labelText }}>Giờ làm việc</h3>
        <p className="font-semibold text-sm" style={{ color: tokens.valueText }}>{info.workingHours}</p>
      </div>
    </div>

    <div className={cn('p-5 rounded-lg border', currentDevice === 'mobile' ? 'flex flex-col gap-4' : 'flex flex-row gap-6')} style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
      <div className={cn('flex flex-col justify-center', currentDevice === 'mobile' ? 'w-full' : 'w-1/3')}>
        <div className="flex items-start gap-3">
          <MapPin size={20} className="shrink-0 mt-0.5" style={{ color: tokens.secondary }} />
          <div>
            <h3 className="font-bold text-base mb-1.5" style={{ color: tokens.heading }}>Trụ sở chính</h3>
            <p className="text-sm leading-relaxed" style={{ color: tokens.valueText }}>{info.address}</p>
          </div>
        </div>
      </div>
      {config.showMap && (
        <div className={cn('rounded-md overflow-hidden', currentDevice === 'mobile' ? 'w-full h-48' : 'w-2/3 h-52')}>
          {renderMapOrPlaceholder({ mapEmbed: config.mapEmbed, tokens })}
        </div>
      )}
    </div>
  </div>
);

const renderElegant = ({
  info,
  config,
  tokens,
  currentDevice,
}: {
  info: ReturnType<typeof getInfo>;
  config: ContactConfigState;
  tokens: ContactColorTokens;
  currentDevice: PreviewDevice;
}) => (
  <div className="w-full border rounded-xl shadow-sm overflow-hidden" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
    <div className="p-6 border-b text-center" style={{ borderColor: tokens.neutralBorder, backgroundColor: tokens.neutralBackground }}>
      <div className="flex justify-center mb-3">
        <IconBadge icon={<Building2 size={22} />} tokens={tokens} size={24} />
      </div>
      <h2 className={cn('font-bold tracking-tight', currentDevice === 'mobile' ? 'text-lg' : 'text-xl')} style={{ color: tokens.heading }}>
        Văn phòng của chúng tôi
      </h2>
      <p className="mt-1.5 max-w-lg mx-auto text-sm" style={{ color: tokens.helperText }}>
        Thông tin liên hệ và vị trí bản đồ chính xác.
      </p>
    </div>

    <div className={cn('flex', currentDevice === 'mobile' ? 'flex-col' : 'flex-row')}>
      <div className={cn('p-6 space-y-0 divide-y', currentDevice === 'mobile' ? 'w-full' : 'w-5/12')} style={{ borderColor: tokens.neutralBorder }}>
        <div className="py-4 first:pt-0">
          <p className="text-[10px] font-semibold uppercase mb-1.5" style={{ color: tokens.labelText }}>Địa chỉ</p>
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="shrink-0 mt-0.5" style={{ color: tokens.secondary }} />
            <span className="text-sm font-medium" style={{ color: tokens.valueText }}>{info.address}</span>
          </div>
        </div>

        <div className="py-4">
          <p className="text-[10px] font-semibold uppercase mb-1.5" style={{ color: tokens.labelText }}>Liên lạc</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Phone size={16} className="shrink-0" style={{ color: tokens.secondary }} />
              <span className="text-sm font-medium" style={{ color: tokens.valueText }}>{info.phone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="shrink-0" style={{ color: tokens.secondary }} />
              <span className="text-sm font-medium" style={{ color: tokens.valueText }}>{info.email}</span>
            </div>
          </div>
        </div>

        <div className="py-4 last:pb-0">
          <p className="text-[10px] font-semibold uppercase mb-1.5" style={{ color: tokens.labelText }}>Thời gian</p>
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="shrink-0" style={{ color: tokens.secondary }} />
            <span className="text-sm font-medium" style={{ color: tokens.valueText }}>{info.workingHours}</span>
          </div>
        </div>
      </div>

      {config.showMap && (
        <div
          className={cn('relative border-t md:border-t-0 md:border-l', currentDevice === 'mobile' ? 'w-full min-h-[250px]' : 'w-7/12 min-h-[320px]')}
          style={{ borderColor: tokens.neutralBorder, backgroundColor: tokens.mapPlaceholderBg }}
        >
          {renderMapOrPlaceholder({ mapEmbed: config.mapEmbed, tokens, className: 'absolute inset-0' })}
        </div>
      )}
    </div>
  </div>
);

const renderMinimal = ({
  info,
  config,
  tokens,
  currentDevice,
  activeSocials,
}: {
  info: ReturnType<typeof getInfo>;
  config: ContactConfigState;
  tokens: ContactColorTokens;
  currentDevice: PreviewDevice;
  activeSocials: ContactSocialLink[];
}) => (
  <div className="w-full border rounded-xl overflow-hidden shadow-sm" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
    <div className="p-6 lg:p-10">
      <div className="text-center mb-8">
        <h2 className={cn('font-bold tracking-tight', currentDevice === 'mobile' ? 'text-xl' : 'text-2xl')} style={{ color: tokens.heading }}>{info.heading}</h2>
        <p className="text-sm mt-2" style={{ color: tokens.helperText }}>{info.description}</p>
      </div>
      <div className={cn('grid gap-4', currentDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4')}>
        <a href={`tel:${info.phone}`} className="flex flex-col items-center p-5 rounded-xl border transition-colors text-center" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
          <IconBadge icon={<Phone size={20} />} tokens={tokens} size={20} className="mb-3" />
          <span className="text-xs mb-1" style={{ color: tokens.labelText }}>Điện thoại</span>
          <span className="text-sm font-semibold" style={{ color: tokens.valueText }}>{info.phone}</span>
        </a>
        <a href={`mailto:${info.email}`} className="flex flex-col items-center p-5 rounded-xl border transition-colors text-center" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
          <IconBadge icon={<Mail size={20} />} tokens={tokens} size={20} className="mb-3" />
          <span className="text-xs mb-1" style={{ color: tokens.labelText }}>Email</span>
          <span className="text-sm font-semibold truncate max-w-full" style={{ color: tokens.valueText }}>{info.email}</span>
        </a>
        <div className="flex flex-col items-center p-5 rounded-xl border text-center" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
          <IconBadge icon={<MapPin size={20} />} tokens={tokens} size={20} className="mb-3" />
          <span className="text-xs mb-1" style={{ color: tokens.labelText }}>Địa chỉ</span>
          <span className="text-sm font-semibold line-clamp-2" style={{ color: tokens.valueText }}>{info.address}</span>
        </div>
        <div className="flex flex-col items-center p-5 rounded-xl border text-center" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
          <IconBadge icon={<Clock size={20} />} tokens={tokens} size={20} className="mb-3" />
          <span className="text-xs mb-1" style={{ color: tokens.labelText }}>Giờ làm việc</span>
          <span className="text-sm font-semibold" style={{ color: tokens.valueText }}>{info.workingHours}</span>
        </div>
      </div>
      {(activeSocials.length > 0 || config.showMap) && (
        <div className={cn('mt-8 pt-6 border-t', currentDevice === 'mobile' ? 'flex flex-col gap-4' : 'flex items-center justify-between')} style={{ borderColor: tokens.neutralBorder }}>
          <ContactSocialLinks socials={activeSocials} tokens={tokens} />
          {config.showMap && (
            <div className={cn('rounded-lg overflow-hidden', currentDevice === 'mobile' ? 'w-full h-48' : 'w-80 h-32')}>
              {renderMapOrPlaceholder({ mapEmbed: config.mapEmbed, tokens })}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

const renderCentered = ({
  info,
  config,
  tokens,
  currentDevice,
  activeSocials,
}: {
  info: ReturnType<typeof getInfo>;
  config: ContactConfigState;
  tokens: ContactColorTokens;
  currentDevice: PreviewDevice;
  activeSocials: ContactSocialLink[];
}) => (
  <div className="w-full border rounded-xl overflow-hidden shadow-sm" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
    <div className="text-center p-6 lg:p-10" style={{ backgroundColor: tokens.centeredHeaderBg }}>
      <div className="flex justify-center mb-5">
        <IconBadge icon={<Phone size={28} />} tokens={tokens} size={24} />
      </div>
      <h2 className={cn('font-bold tracking-tight mb-2', currentDevice === 'mobile' ? 'text-xl' : 'text-2xl')} style={{ color: tokens.heading }}>{info.heading}</h2>
      <p className="text-sm max-w-md mx-auto" style={{ color: tokens.helperText }}>{info.description}</p>
      <p className="text-xs mt-2" style={{ color: tokens.labelText }}>{info.responseText}</p>
      <a
        href={`mailto:${info.email}`}
        className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold"
        style={{ backgroundColor: tokens.secondary, color: tokens.sectionBadgeText }}
      >
        {info.submitLabel}
      </a>
    </div>
    <div className="p-6 lg:p-8">
      <div className={cn('grid gap-6', currentDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-3')}>
        <a href={`tel:${info.phone}`} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: tokens.centeredSurface }}>
          <IconBadge icon={<Phone size={18} />} tokens={tokens} size={18} />
          <div><p className="text-xs mb-0.5" style={{ color: tokens.labelText }}>Hotline</p><p className="text-sm font-bold" style={{ color: tokens.valueText }}>{info.phone}</p></div>
        </a>
        <a href={`mailto:${info.email}`} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: tokens.centeredSurface }}>
          <IconBadge icon={<Mail size={18} />} tokens={tokens} size={18} />
          <div><p className="text-xs mb-0.5" style={{ color: tokens.labelText }}>Email</p><p className="text-sm font-bold truncate" style={{ color: tokens.valueText }}>{info.email}</p></div>
        </a>
        <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: tokens.centeredSurface }}>
          <IconBadge icon={<Clock size={18} />} tokens={tokens} size={18} />
          <div><p className="text-xs mb-0.5" style={{ color: tokens.labelText }}>Giờ làm việc</p><p className="text-sm font-bold" style={{ color: tokens.valueText }}>{info.workingHours}</p></div>
        </div>
      </div>
      <div className={cn('mt-6 p-5 rounded-xl', currentDevice === 'mobile' ? '' : 'flex items-start gap-6')} style={{ backgroundColor: tokens.centeredSurface }}>
        <div className="flex items-start gap-3 flex-1">
          <IconBadge icon={<MapPin size={18} />} tokens={tokens} size={18} />
          <div><p className="text-xs mb-0.5" style={{ color: tokens.labelText }}>Địa chỉ văn phòng</p><p className="text-sm font-medium" style={{ color: tokens.valueText }}>{info.address}</p></div>
        </div>
        {config.showMap && (
          <div className={cn('rounded-lg overflow-hidden shrink-0', currentDevice === 'mobile' ? 'w-full h-40 mt-4' : 'w-64 h-28')}>
            {renderMapOrPlaceholder({ mapEmbed: config.mapEmbed, tokens })}
          </div>
        )}
      </div>
      {activeSocials.length > 0 && (
        <div className="mt-6 text-center">
          <ContactSocialLinks socials={activeSocials} tokens={tokens} size={20} centered />
        </div>
      )}
    </div>
  </div>
);

export function ContactSectionShared({
  config,
  style,
  tokens,
  mode,
  context,
  device,
  title,
}: ContactSectionSharedProps) {
  const currentDevice = getDisplayDevice(context, device);
  const info = getInfo(config, title);
  const activeSocials = (config.socialLinks ?? []).filter((social) => social.url && social.url.trim().length > 0);
  const containerClass = getRootContainerClass(context, currentDevice);

  const content = (() => {
    if (style === 'modern') {
      return renderModern({ info, config, tokens, currentDevice, activeSocials });
    }

    if (style === 'floating') {
      return renderFloating({ info, config, tokens, currentDevice });
    }

    if (style === 'grid') {
      return renderGrid({ info, config, tokens, currentDevice });
    }

    if (style === 'minimal') {
      return renderMinimal({ info, config, tokens, currentDevice, activeSocials });
    }

    if (style === 'centered') {
      return renderCentered({ info, config, tokens, currentDevice, activeSocials });
    }

    return renderElegant({ info, config, tokens, currentDevice });
  })();

  return (
    <section className={getSectionPadding(context, currentDevice)}>
      <div className={containerClass}>
        {content}
        {mode === 'dual' && (
          <div className="mt-4 text-[11px]" style={{ color: tokens.labelText }}>
            Accent màu phụ đang áp dụng cho icon tint, badge, CTA phụ và social controls.
          </div>
        )}
      </div>
    </section>
  );
}
