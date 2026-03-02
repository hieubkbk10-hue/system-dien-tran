'use client';

import React from 'react';
import { ComponentFormWrapper, useComponentForm } from '../shared';
import { useTypeColorOverrideState } from '../../_shared/hooks/useTypeColorOverride';
import { CountdownForm } from '../../countdown/_components/CountdownForm';
import { CountdownPreview } from '../../countdown/_components/CountdownPreview';
import { DEFAULT_COUNTDOWN_CONFIG } from '../../countdown/_lib/constants';
import { normalizeCountdownConfig, toCountdownPersistConfig } from '../../countdown/_lib/normalize';
import type { CountdownConfigState } from '../../countdown/_types';

export default function CountdownCreatePage() {
  const COMPONENT_TYPE = 'Countdown';
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Khuyến mãi đặc biệt', COMPONENT_TYPE);
  const { customState, effectiveColors, showCustomBlock, setCustomState, systemColors } = useTypeColorOverrideState(COMPONENT_TYPE);
  const { primary, secondary, mode } = effectiveColors;

  const [config, setConfig] = React.useState<CountdownConfigState>(() => normalizeCountdownConfig(DEFAULT_COUNTDOWN_CONFIG));

  const onSubmit = (event: React.FormEvent) => {
    void handleSubmit(event, toCountdownPersistConfig(config));
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
