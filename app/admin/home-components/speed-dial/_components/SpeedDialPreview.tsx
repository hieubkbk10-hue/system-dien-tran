'use client';

import React from 'react';
import { SpeedDialSectionShared } from './SpeedDialSectionShared';
import { DEFAULT_SPEED_DIAL_HARMONY } from '../_lib/constants';
import { normalizeSpeedDialHarmony } from '../_lib/colors';
import { usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import type { SpeedDialAction, SpeedDialBrandMode, SpeedDialPosition, SpeedDialStyle } from '../_types';

interface SpeedDialPreviewProps {
  actions: SpeedDialAction[];
  position: SpeedDialPosition;
  style: SpeedDialStyle;
  brandColor: string;
  secondary: string;
  mode: SpeedDialBrandMode;
  harmony?: string;
  title?: string;
  selectedStyle: SpeedDialStyle;
  onStyleChange: (style: SpeedDialStyle) => void;
}

export function SpeedDialPreview({
  actions,
  position,
  style,
  brandColor,
  secondary,
  mode,
  harmony = DEFAULT_SPEED_DIAL_HARMONY,
  title = 'Speed Dial',
  selectedStyle,
  onStyleChange,
}: SpeedDialPreviewProps) {
  const { device, setDevice } = usePreviewDevice();
  const styleForRender = selectedStyle ?? style;

  return (
    <SpeedDialSectionShared
      actions={actions}
      style={styleForRender}
      position={position}
      brandColor={brandColor}
      secondary={secondary}
      mode={mode}
      harmony={normalizeSpeedDialHarmony(harmony)}
      sectionTitle={title}
      context="preview"
      includePreviewWrapper
      previewDevice={device}
      setPreviewDevice={setDevice}
      previewStyle={styleForRender}
      onPreviewStyleChange={onStyleChange}
    />
  );
}
