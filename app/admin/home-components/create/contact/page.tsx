'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent } from '../../../components/ui';
import { ComponentFormWrapper, useComponentForm } from '../shared';
import { useTypeColorOverrideState } from '../../_shared/hooks/useTypeColorOverride';
import { ContactPreview } from '../../contact/_components/ContactPreview';
import { DEFAULT_CONTACT_CONFIG, DEFAULT_CONTACT_HARMONY } from '../../contact/_lib/constants';
import { getContactValidationResult } from '../../contact/_lib/colors';
import { normalizeContactConfig, toContactConfigPayload } from '../../contact/_lib/normalize';
import type { ContactConfigState, ContactStyle } from '../../contact/_types';
import { getContactMapDataFromSettings } from '@/lib/contact/getContactMapData';
import { ConfigEditor } from '../../contact/_components/ConfigEditor';

export default function ContactCreatePage() {
  const COMPONENT_TYPE = 'Contact';
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Liên hệ', COMPONENT_TYPE);
  const { customState, effectiveColors, showCustomBlock, setCustomState, systemColors } = useTypeColorOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { primary, secondary, mode } = effectiveColors;
  const contactSettings = useQuery(api.settings.listByGroup, { group: 'contact' });
  const mapData = useMemo(() => getContactMapDataFromSettings(contactSettings ?? []), [contactSettings]);
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

  const onSubmit = (event: React.FormEvent) => {
    const nextConfig = normalizeContactConfig(config);
    void handleSubmit(event, {
      ...toContactConfigPayload(nextConfig),
      style: nextConfig.style,
    });
  };

  return (
    <ComponentFormWrapper
      type={COMPONENT_TYPE}
      title={title}
      setTitle={setTitle}
      active={active}
      setActive={setActive}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      customState={customState}
      showCustomBlock={showCustomBlock}
      setCustomState={setCustomState}
      systemColors={systemColors}
    >
      <ConfigEditor
        value={normalizedConfig}
        onChange={(next) => { setConfig(normalizeContactConfig(next)); }}
        title="Cấu hình Contact"
      />

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
        mapData={mapData}
      />
    </ComponentFormWrapper>
  );
}
