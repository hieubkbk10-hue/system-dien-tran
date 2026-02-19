'use client';

import React from 'react';
import { SpeedDialSectionShared } from '@/app/admin/home-components/speed-dial/_components/SpeedDialSectionShared';
import { normalizeSpeedDialActions, normalizeSpeedDialHarmony } from '@/app/admin/home-components/speed-dial/_lib/colors';
import {
  DEFAULT_SPEED_DIAL_HARMONY,
  normalizeSpeedDialStyle,
} from '@/app/admin/home-components/speed-dial/_lib/constants';
import type {
  SpeedDialAction,
  SpeedDialBrandMode,
  SpeedDialPosition,
} from '@/app/admin/home-components/speed-dial/_types';

interface SpeedDialSectionProps {
  config: Record<string, unknown>;
  brandColor: string;
  secondary: string;
  mode: SpeedDialBrandMode;
  title: string;
}

const normalizePosition = (value: unknown): SpeedDialPosition => {
  if (value === 'bottom-left') {return 'bottom-left';}
  return 'bottom-right';
};

const normalizeSiteActions = (input: unknown): SpeedDialAction[] => (
  normalizeSpeedDialActions(input).map((item, idx) => ({
    id: item.key || idx + 1,
    icon: item.icon,
    label: item.label,
    url: item.url,
    bgColor: item.bgColor,
  }))
);

export function SpeedDialSection({ config, brandColor, secondary, mode, title }: SpeedDialSectionProps) {
  const actions = React.useMemo(() => normalizeSiteActions(config.actions), [config.actions]);

  const style = normalizeSpeedDialStyle(typeof config.style === 'string' ? config.style : undefined);
  const position = normalizePosition(config.position);
  const harmony = normalizeSpeedDialHarmony(typeof config.harmony === 'string' ? config.harmony : DEFAULT_SPEED_DIAL_HARMONY);

  return (
    <SpeedDialSectionShared
      actions={actions}
      style={style}
      position={position}
      brandColor={brandColor}
      secondary={secondary}
      mode={mode}
      harmony={harmony}
      sectionTitle={title}
      context="site"
    />
  );
}
