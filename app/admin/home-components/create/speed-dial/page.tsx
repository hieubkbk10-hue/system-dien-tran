'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ComponentFormWrapper, useBrandColors, useComponentForm } from '../shared';
import { SpeedDialForm } from '../../speed-dial/_components/SpeedDialForm';
import { SpeedDialPreview } from '../../speed-dial/_components/SpeedDialPreview';
import { normalizeSpeedDialHarmony } from '../../speed-dial/_lib/colors';
import { useSpeedDialValidation } from '../../speed-dial/_hooks/useSpeedDialValidation';
import { DEFAULT_SPEED_DIAL_CONFIG, DEFAULT_SPEED_DIAL_HARMONY, normalizeSpeedDialStyle } from '../../speed-dial/_lib/constants';
import type {
  SpeedDialAction,
  SpeedDialConfig,
  SpeedDialHarmony,
  SpeedDialPosition,
  SpeedDialStyle,
} from '../../speed-dial/_types';

const createDefaultActions = (secondary: string): SpeedDialAction[] => {
  const fallbackColor = secondary.trim().length > 0 ? secondary : '#3b82f6';

  return [
    { id: 'action-phone', bgColor: '#22c55e', icon: 'phone', label: 'Gọi ngay', url: 'tel:0123456789' },
    { id: 'action-zalo', bgColor: fallbackColor, icon: 'message-circle', label: 'Chat Zalo', url: 'https://zalo.me/yourpage' },
    { id: 'action-mail', bgColor: '#ef4444', icon: 'mail', label: 'Email', url: 'mailto:contact@example.com' },
  ];
};

export default function SpeedDialCreatePage() {
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Speed Dial', 'SpeedDial');
  const { primary, secondary, mode } = useBrandColors();

  const [actions, setActions] = React.useState<SpeedDialAction[]>(createDefaultActions(secondary));
  const [style, setStyle] = React.useState<SpeedDialStyle>(normalizeSpeedDialStyle(DEFAULT_SPEED_DIAL_CONFIG.style));
  const [position, setPosition] = React.useState<SpeedDialPosition>(DEFAULT_SPEED_DIAL_CONFIG.position);
  const [harmony] = React.useState<SpeedDialHarmony>(DEFAULT_SPEED_DIAL_HARMONY);

  const { validation, warningMessages } = useSpeedDialValidation({
    primary,
    secondary,
    mode,
    harmony,
    actions,
  });

  const onSubmit = (event: React.FormEvent) => {
    const payload: SpeedDialConfig = {
      actions: actions.map((action) => ({
        id: action.id,
        icon: action.icon,
        label: action.label,
        url: action.url,
        bgColor: action.bgColor,
      })),
      style,
      position,
      harmony: normalizeSpeedDialHarmony(harmony),
    };

    void handleSubmit(event, payload as unknown as Record<string, unknown>);
  };

  return (
    <ComponentFormWrapper
      type="SpeedDial"
      title={title}
      setTitle={setTitle}
      active={active}
      setActive={setActive}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <SpeedDialForm
        actions={actions}
        onActionsChange={setActions}
        position={position}
        onPositionChange={setPosition}
        defaultActionColor={secondary || primary}
      />

      {warningMessages.length > 0 && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-900">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle size={16} />
            Cảnh báo màu sắc
          </div>
          <ul className="mt-2 list-disc pl-5 text-xs space-y-1">
            {warningMessages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <SpeedDialPreview
        actions={actions}
        position={position}
        style={style}
        brandColor={primary}
        secondary={secondary}
        mode={mode}
        harmony={harmony}
        title={title}
        selectedStyle={style}
        onStyleChange={setStyle}
      />
    </ComponentFormWrapper>
  );
}
