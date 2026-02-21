'use client';

import React, { useMemo, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '../../../components/ui';
import { ComponentFormWrapper, useBrandColors, useComponentForm } from '../shared';
import { ContactPreview } from '../../contact/_components/ContactPreview';
import { DEFAULT_CONTACT_CONFIG, DEFAULT_CONTACT_HARMONY, DEFAULT_CONTACT_TEXTS, TEXT_FIELDS } from '../../contact/_lib/constants';
import { getContactValidationResult } from '../../contact/_lib/colors';
import { normalizeContactConfig, toContactConfigPayload } from '../../contact/_lib/normalize';
import type { ContactConfigState, ContactStyle } from '../../contact/_types';
import { Facebook, Globe, Instagram, Linkedin, MessageCircle, Plus, Twitter, X, Youtube } from 'lucide-react';

const SOCIAL_PLATFORMS = [
  { icon: Facebook, label: 'Facebook', value: 'facebook' },
  { icon: MessageCircle, label: 'Zalo', value: 'zalo' },
  { icon: Instagram, label: 'Instagram', value: 'instagram' },
  { icon: Twitter, label: 'Twitter/X', value: 'twitter' },
  { icon: Linkedin, label: 'LinkedIn', value: 'linkedin' },
  { icon: Youtube, label: 'YouTube', value: 'youtube' },
  { icon: Globe, label: 'Khác', value: 'other' },
];

export default function ContactCreatePage() {
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Liên hệ', 'Contact');
  const { primary, secondary, mode } = useBrandColors();

  const [config, setConfig] = useState<ContactConfigState>({
    ...DEFAULT_CONTACT_CONFIG,
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    email: 'contact@example.com',
    phone: '1900 1234',
    responseTimeText: 'Phản hồi trong 24h',
    workingHours: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
    socialLinks: [
      { id: 1, platform: 'facebook', url: '' },
      { id: 2, platform: 'zalo', url: '' },
    ],
  });

  const normalizedConfig = useMemo(() => normalizeContactConfig(config), [config]);
  const style = normalizedConfig.style;

  const validation = useMemo(() => getContactValidationResult({
    primary,
    secondary,
    mode,
    harmony: normalizedConfig.harmony ?? DEFAULT_CONTACT_HARMONY,
  }), [primary, secondary, mode, normalizedConfig.harmony]);

  const warningMessages = useMemo(() => {
    if (mode === 'single') {return [];}

    const warnings: string[] = [];

    if (validation.harmonyStatus.isTooSimilar) {
      warnings.push(`Màu chính và màu phụ đang khá gần nhau (deltaE=${validation.harmonyStatus.deltaE}).`);
    }

    if (validation.accessibility.failing.length > 0) {
      warnings.push(`Có ${validation.accessibility.failing.length} cặp màu chưa đạt APCA (minLc=${validation.accessibility.minLc.toFixed(1)}).`);
    }

    return warnings;
  }, [mode, validation]);

  const addSocialLink = () => {
    const nextId = Math.max(0, ...normalizedConfig.socialLinks.map((social) => social.id)) + 1;
    setConfig({
      ...normalizedConfig,
      socialLinks: [...normalizedConfig.socialLinks, { id: nextId, platform: 'facebook', url: '' }],
    });
  };

  const removeSocialLink = (id: number) => {
    setConfig({
      ...normalizedConfig,
      socialLinks: normalizedConfig.socialLinks.filter((social) => social.id !== id),
    });
  };

  const updateSocialLink = (id: number, field: 'platform' | 'url', value: string) => {
    setConfig({
      ...normalizedConfig,
      socialLinks: normalizedConfig.socialLinks.map((social) => (
        social.id === id ? { ...social, [field]: value } : social
      )),
    });
  };

  const onSubmit = (event: React.FormEvent) => {
    const nextConfig = normalizeContactConfig(config);
    void handleSubmit(event, {
      ...toContactConfigPayload(nextConfig),
      style: nextConfig.style,
    });
  };

  const showFormConfig = style === 'minimal' || style === 'centered';
  const textFields = TEXT_FIELDS[style] || [];

  return (
    <ComponentFormWrapper
      type="Contact"
      title={title}
      setTitle={setTitle}
      active={active}
      setActive={setActive}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Thông tin liên hệ cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Địa chỉ</Label>
              <Input
                value={normalizedConfig.address}
                onChange={(event) => { setConfig({ ...normalizedConfig, address: event.target.value }); }}
                placeholder="123 Nguyễn Huệ, Q1, TP.HCM"
              />
            </div>
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input
                value={normalizedConfig.phone}
                onChange={(event) => { setConfig({ ...normalizedConfig, phone: event.target.value }); }}
                placeholder="1900 1234"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={normalizedConfig.email}
                onChange={(event) => { setConfig({ ...normalizedConfig, email: event.target.value }); }}
                placeholder="contact@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Giờ làm việc</Label>
              <Input
                value={normalizedConfig.workingHours}
                onChange={(event) => { setConfig({ ...normalizedConfig, workingHours: event.target.value }); }}
                placeholder="T2-T6: 8:00-17:00"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={normalizedConfig.showMap}
              onChange={(event) => { setConfig({ ...normalizedConfig, showMap: event.target.checked }); }}
              className="w-4 h-4 rounded"
            />
            <Label>Hiển thị bản đồ</Label>
          </div>
          {normalizedConfig.showMap && (
            <div className="space-y-2">
              <Label>Google Maps Embed URL</Label>
              <Input
                value={normalizedConfig.mapEmbed}
                onChange={(event) => { setConfig({ ...normalizedConfig, mapEmbed: event.target.value }); }}
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <p className="text-xs text-muted-foreground">Lấy từ Google Maps: Chia sẻ → Nhúng bản đồ → Copy URL trong src của iframe</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Mạng xã hội</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {normalizedConfig.socialLinks.map((social) => {
            const platform = SOCIAL_PLATFORMS.find((item) => item.value === social.platform);
            const Icon = platform?.icon ?? Globe;
            return (
              <div key={social.id} className="flex items-center gap-3">
                <select
                  value={social.platform}
                  onChange={(event) => { updateSocialLink(social.id, 'platform', event.target.value); }}
                  className="w-36 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                >
                  {SOCIAL_PLATFORMS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
                <div className="flex-1 flex items-center gap-2">
                  <Icon size={18} className="text-slate-400 shrink-0" />
                  <Input
                    value={social.url}
                    onChange={(event) => { updateSocialLink(social.id, 'url', event.target.value); }}
                    placeholder={`URL ${platform?.label ?? 'trang'}`}
                    className="flex-1"
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => { removeSocialLink(social.id); }} className="text-slate-400 hover:text-red-500">
                  <X size={16} />
                </Button>
              </div>
            );
          })}
          <Button type="button" variant="outline" size="sm" onClick={addSocialLink} className="w-full">
            <Plus size={16} className="mr-2" />Thêm mạng xã hội
          </Button>
        </CardContent>
      </Card>

      {showFormConfig && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Cấu hình Form liên hệ</CardTitle>
            <p className="text-xs text-muted-foreground">Áp dụng cho style Minimal Form và Centered</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tiêu đề form</Label>
                <Input
                  value={normalizedConfig.formTitle ?? ''}
                  onChange={(event) => { setConfig({ ...normalizedConfig, formTitle: event.target.value }); }}
                  placeholder="Gửi tin nhắn cho chúng tôi"
                />
              </div>
              <div className="space-y-2">
                <Label>Nút gửi</Label>
                <Input
                  value={normalizedConfig.submitButtonText ?? ''}
                  onChange={(event) => { setConfig({ ...normalizedConfig, submitButtonText: event.target.value }); }}
                  placeholder="Gửi tin nhắn"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mô tả form</Label>
                <Input
                  value={normalizedConfig.formDescription ?? ''}
                  onChange={(event) => { setConfig({ ...normalizedConfig, formDescription: event.target.value }); }}
                  placeholder="Điền thông tin bên dưới..."
                />
              </div>
              <div className="space-y-2">
                <Label>Thời gian phản hồi</Label>
                <Input
                  value={normalizedConfig.responseTimeText ?? ''}
                  onChange={(event) => { setConfig({ ...normalizedConfig, responseTimeText: event.target.value }); }}
                  placeholder="Phản hồi trong 24h"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {textFields.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Tùy chỉnh Text (Style: {style})</CardTitle>
            <p className="text-xs text-muted-foreground">Tùy chỉnh các text hiển thị cho style này</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {textFields.map((field) => {
              const currentTexts = normalizedConfig.texts ?? {};
              const defaultTexts = DEFAULT_CONTACT_TEXTS[style] ?? {};
              const value = currentTexts[field.key] ?? defaultTexts[field.key] ?? '';
              
              return (
                <div key={field.key} className="space-y-2">
                  <Label>{field.label}</Label>
                  <Input
                    value={value}
                    onChange={(event) => {
                      setConfig({
                        ...normalizedConfig,
                        texts: {
                          ...currentTexts,
                          [field.key]: event.target.value,
                        },
                      });
                    }}
                    placeholder={field.placeholder}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {mode === 'dual' && warningMessages.length > 0 && (
        <Card className="mb-6 border-amber-200 bg-amber-50/70">
          <CardContent className="pt-6">
            <div className="space-y-2 text-xs text-amber-800">
              {warningMessages.map((warning) => (
                <p key={warning}>• {warning}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <ContactPreview
        config={{ ...normalizedConfig, style }}
        brandColor={primary}
        secondary={secondary}
        mode={mode}
        selectedStyle={style}
        onStyleChange={(nextStyle) => { setConfig({ ...normalizedConfig, style: nextStyle as ContactStyle }); }}
        title={title}
      />
    </ComponentFormWrapper>
  );
}
