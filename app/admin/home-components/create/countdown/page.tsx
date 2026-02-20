'use client';

import React from 'react';
import { ComponentFormWrapper, useBrandColors, useComponentForm } from '../shared';
import { CountdownForm } from '../../countdown/_components/CountdownForm';
import { CountdownPreview } from '../../countdown/_components/CountdownPreview';
import { DEFAULT_COUNTDOWN_CONFIG } from '../../countdown/_lib/constants';
import { normalizeCountdownConfig, toCountdownPersistConfig } from '../../countdown/_lib/normalize';
import type { CountdownConfigState } from '../../countdown/_types';

export default function CountdownCreatePage() {
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Khuyến mãi đặc biệt', 'Countdown');
  const { primary, secondary, mode } = useBrandColors();

  const [config, setConfig] = React.useState<CountdownConfigState>(() => normalizeCountdownConfig(DEFAULT_COUNTDOWN_CONFIG));

  const onSubmit = (event: React.FormEvent) => {
    void handleSubmit(event, toCountdownPersistConfig(config));
  };

  return (
    <ComponentFormWrapper
      type="Countdown"
      title={title}
      setTitle={setTitle}
      active={active}
      setActive={setActive}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <CountdownForm
        value={config}
        onChange={setConfig}
        brandColor={primary}
        secondary={secondary}
        mode={mode}
      />

      <CountdownPreview
        config={config}
        brandColor={primary}
        secondary={secondary}
        mode={mode}
        selectedStyle={config.style}
        onStyleChange={(style) => {
          setConfig((prev) => ({
            ...prev,
            style,
          }));
        }}
      />
    </ComponentFormWrapper>
  );
}
