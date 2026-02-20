'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { AlertTriangle, Loader2, PhoneCall } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../../components/ui';
import { useBrandColors } from '../../../create/shared';
import { SpeedDialForm } from '../../_components/SpeedDialForm';
import { SpeedDialPreview } from '../../_components/SpeedDialPreview';
import { getSpeedDialValidationResult, normalizeSpeedDialHarmony } from '../../_lib/colors';
import {
  DEFAULT_SPEED_DIAL_CONFIG,
  DEFAULT_SPEED_DIAL_HARMONY,
  normalizeSpeedDialStyle,
} from '../../_lib/constants';
import type {
  SpeedDialAction,
  SpeedDialConfig,
  SpeedDialHarmony,
  SpeedDialPosition,
  SpeedDialStyle,
} from '../../_types';

const normalizePosition = (value: unknown): SpeedDialPosition => (
  value === 'bottom-left' ? 'bottom-left' : 'bottom-right'
);

const normalizeString = (value: unknown, fallback = '') => (
  typeof value === 'string' ? value : fallback
);

const normalizeActions = (value: unknown): SpeedDialAction[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_SPEED_DIAL_CONFIG.actions.map((action, idx) => ({ ...action, id: `default-${idx}` }));
  }

  return value.map((raw, idx) => {
    const action = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
    const actionId = action.id;

    return {
      id: typeof actionId === 'string' || typeof actionId === 'number' ? actionId : `legacy-${idx}`,
      icon: normalizeString(action.icon, 'phone'),
      label: normalizeString(action.label),
      url: normalizeString(action.url),
      bgColor: normalizeString(action.bgColor, '#3b82f6'),
    };
  });
};

const toSnapshot = (payload: {
  title: string;
  active: boolean;
  style: SpeedDialStyle;
  position: SpeedDialPosition;
  harmony: SpeedDialHarmony;
  actions: SpeedDialAction[];
}) => JSON.stringify({
  ...payload,
  actions: payload.actions.map((action, idx) => ({
    id: action.id ?? `action-${idx}`,
    icon: action.icon,
    label: action.label,
    url: action.url,
    bgColor: action.bgColor,
  })),
});

export default function SpeedDialEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { primary, secondary, mode } = useBrandColors();
  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [actions, setActions] = useState<SpeedDialAction[]>([]);
  const [style, setStyle] = useState<SpeedDialStyle>(normalizeSpeedDialStyle(DEFAULT_SPEED_DIAL_CONFIG.style));
  const [position, setPosition] = useState<SpeedDialPosition>(DEFAULT_SPEED_DIAL_CONFIG.position);
  const [harmony, setHarmony] = useState<SpeedDialHarmony>(DEFAULT_SPEED_DIAL_HARMONY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState<string | null>(null);

  useEffect(() => {
    if (!component) {return;}

    if (component.type !== 'SpeedDial') {
      router.replace(`/admin/home-components/${id}/edit`);
      return;
    }

    const rawConfig = component.config ?? {};
    const normalizedActions = normalizeActions((rawConfig as Record<string, unknown>).actions);
    const normalizedStyle = normalizeSpeedDialStyle((rawConfig as Record<string, unknown>).style as string | undefined);
    const normalizedPosition = normalizePosition((rawConfig as Record<string, unknown>).position);
    const normalizedHarmony = normalizeSpeedDialHarmony(
      ((rawConfig as Record<string, unknown>).harmony as string | undefined) ?? DEFAULT_SPEED_DIAL_HARMONY,
    );

    setTitle(component.title);
    setActive(component.active);
    setActions(normalizedActions);
    setStyle(normalizedStyle);
    setPosition(normalizedPosition);
    setHarmony(normalizedHarmony);

    setInitialSnapshot(toSnapshot({
      title: component.title,
      active: component.active,
      style: normalizedStyle,
      position: normalizedPosition,
      harmony: normalizedHarmony,
      actions: normalizedActions,
    }));
  }, [component, id, router]);

  const currentSnapshot = toSnapshot({
    title,
    active,
    style,
    position,
    harmony,
    actions,
  });

  const hasChanges = initialSnapshot !== null && currentSnapshot !== initialSnapshot;

  const validation = useMemo(() => getSpeedDialValidationResult({
    primary,
    secondary,
    mode,
    harmony,
    actions,
  }), [primary, secondary, mode, harmony, actions]);

  const warningMessages = useMemo(() => {
    const warnings: string[] = [];

    if (mode === 'dual' && validation.harmonyStatus.isTooSimilar) {
      warnings.push(`Màu chính và màu phụ đang khá gần nhau (deltaE=${validation.harmonyStatus.deltaE}).`);
    }

    if (validation.accessibility.failing.length > 0) {
      warnings.push(`Có ${validation.accessibility.failing.length} cặp màu chưa đạt APCA (minLc=${validation.accessibility.minLc.toFixed(1)}).`);
    }

    return warnings;
  }, [mode, validation]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) {return;}

    setIsSubmitting(true);
    try {
      const nextConfig: SpeedDialConfig = {
        actions: actions.map((action) => ({
          id: action.id,
          icon: action.icon,
          label: action.label,
          url: action.url,
          bgColor: action.bgColor,
        })),
        style,
        position,
        harmony,
      };

      await updateMutation({
        active,
        config: nextConfig,
        id: id as Id<'homeComponents'>,
        title,
      });

      setInitialSnapshot(toSnapshot({
        title,
        active,
        style,
        position,
        harmony,
        actions,
      }));

      toast.success('Đã cập nhật Speed Dial');
    } catch (error) {
      toast.error('Lỗi khi cập nhật');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (component === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (component === null) {
    return <div className="text-center py-8 text-slate-500">Không tìm thấy component</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Speed Dial</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PhoneCall size={20} />
              Speed Dial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề hiển thị <span className="text-red-500">*</span></Label>
              <Input
                value={title}
                onChange={(e) => { setTitle(e.target.value); }}
                required
                placeholder="Nhập tiêu đề component..."
              />
            </div>

            <div className="flex items-center gap-3">
              <Label>Trạng thái:</Label>
              <div
                className={cn(
                  'cursor-pointer inline-flex items-center justify-center rounded-full w-12 h-6 transition-colors',
                  active ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600',
                )}
                onClick={() => { setActive(!active); }}
              >
                <div
                  className={cn(
                    'w-5 h-5 bg-white rounded-full transition-transform shadow',
                    active ? 'translate-x-2.5' : '-translate-x-2.5',
                  )}
                />
              </div>
              <span className="text-sm text-slate-500">{active ? 'Bật' : 'Tắt'}</span>
            </div>
          </CardContent>
        </Card>

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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div />
          <div className="lg:sticky lg:top-6 lg:self-start">
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
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={() => { router.push('/admin/home-components'); }} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="accent" disabled={!hasChanges || isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </div>
  );
}
