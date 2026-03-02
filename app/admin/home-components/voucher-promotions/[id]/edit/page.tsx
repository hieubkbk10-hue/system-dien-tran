'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { TicketPercent, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../../components/ui';
import { TypeColorOverrideCard } from '../../../_shared/components/TypeColorOverrideCard';
import { useTypeColorOverrideState } from '../../../_shared/hooks/useTypeColorOverride';
import { resolveSecondaryByMode } from '../../../_shared/lib/typeColorOverride';
import { VoucherPromotionsPreview } from '../../_components/VoucherPromotionsPreview';
import {
  DEFAULT_VOUCHER_PROMOTIONS_CONFIG,
  normalizeVoucherPromotionsHarmony,
  normalizeVoucherPromotionsTexts,
} from '../../_lib/constants';
import { getVoucherPromotionsValidationResult, calculateVoucherPromotionsAccentBalance } from '../../_lib/colors';
import type { VoucherPromotionsConfigState } from '../../_types';
import { normalizeVoucherLimit, normalizeVoucherStyle } from '@/lib/home-components/voucher-promotions';

const COMPONENT_TYPE = 'VoucherPromotions';

export default function VoucherPromotionsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { customState, effectiveColors, initialCustom, setCustomState, setInitialCustom, showCustomBlock } = useTypeColorOverrideState(COMPONENT_TYPE);
  const setTypeColorOverride = useMutation(api.homeComponentSystemConfig.setTypeColorOverride);
  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [config, setConfig] = useState<VoucherPromotionsConfigState>(DEFAULT_VOUCHER_PROMOTIONS_CONFIG);
  const [initialSnapshot, setInitialSnapshot] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (component) {
      if (component.type !== 'VoucherPromotions') {
        router.replace(`/admin/home-components/${id}/edit`);
        return;
      }

      const rawConfig = component.config ?? {};
      const normalizedConfig: VoucherPromotionsConfigState = {
        ctaUrl: (rawConfig.ctaUrl as string | undefined) ?? '/promotions',
        limit: normalizeVoucherLimit(rawConfig.limit as number | undefined),
        style: normalizeVoucherStyle(rawConfig.style as string | undefined),
        harmony: normalizeVoucherPromotionsHarmony(rawConfig.harmony as string | undefined),
        texts: normalizeVoucherPromotionsTexts({
          heading: (rawConfig.heading as string | undefined) ?? (rawConfig.texts as { heading?: string } | undefined)?.heading,
          description: (rawConfig.description as string | undefined) ?? (rawConfig.texts as { description?: string } | undefined)?.description,
          ctaLabel: (rawConfig.ctaLabel as string | undefined) ?? (rawConfig.texts as { ctaLabel?: string } | undefined)?.ctaLabel,
        }),
      };

      setTitle(component.title);
      setActive(component.active);
      setConfig(normalizedConfig);
      setInitialSnapshot(JSON.stringify({
        title: component.title,
        active: component.active,
        config: normalizedConfig,
      }));
    }
  }, [component, id, router]);

  const currentSnapshot = useMemo(() => JSON.stringify({ title, active, config }), [title, active, config]);
  const resolvedCustomSecondary = resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary);
  const customChanged = showCustomBlock
    ? customState.enabled !== initialCustom.enabled
      || customState.mode !== initialCustom.mode
      || customState.primary !== initialCustom.primary
      || resolvedCustomSecondary !== initialCustom.secondary
    : false;
  const hasChanges = initialSnapshot !== '' && (currentSnapshot !== initialSnapshot || customChanged);

  const validation = useMemo(() => getVoucherPromotionsValidationResult({
    primary: effectiveColors.primary,
    secondary: effectiveColors.secondary,
    mode: effectiveColors.mode,
    harmony: config.harmony,
  }), [effectiveColors, config.harmony]);

  const accentBalance = useMemo(() => calculateVoucherPromotionsAccentBalance(effectiveColors.mode, config.style), [effectiveColors.mode, config.style]);

  const warningMessages = useMemo(() => {
    const warnings: string[] = [];

    if (effectiveColors.mode === 'dual' && validation.harmonyStatus.isTooSimilar) {
      warnings.push(`Màu chính và màu phụ đang khá gần nhau (ΔE=${validation.harmonyStatus.deltaE}).`);
    }

    if (validation.accessibility.failing.length > 0) {
      warnings.push(`Có ${validation.accessibility.failing.length} cặp màu chưa đạt APCA (minLc=${validation.accessibility.minLc.toFixed(1)}).`);
    }

    return warnings;
  }, [effectiveColors.mode, validation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !hasChanges) {return;}

    setIsSubmitting(true);
    try {
      const payloadConfig: VoucherPromotionsConfigState = {
        ...config,
        limit: normalizeVoucherLimit(config.limit),
        harmony: normalizeVoucherPromotionsHarmony(config.harmony),
        texts: normalizeVoucherPromotionsTexts(config.texts),
      };

      await updateMutation({
        active,
        config: payloadConfig,
        id: id as Id<'homeComponents'>,
        title,
      });
      if (showCustomBlock) {
        const resolvedCustomSecondary = resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary);
        await setTypeColorOverride({
          enabled: customState.enabled,
          mode: customState.mode,
          primary: customState.primary,
          secondary: resolvedCustomSecondary,
          type: COMPONENT_TYPE,
        });
      }
      setInitialSnapshot(JSON.stringify({ title, active, config: payloadConfig }));
      if (showCustomBlock) {
        setInitialCustom({
          enabled: customState.enabled,
          mode: customState.mode,
          primary: customState.primary,
          secondary: resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary),
        });
      }
      toast.success('Đã cập nhật Voucher Promotions');
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Voucher Promotions</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TicketPercent size={20} />
              Voucher Promotions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề hiển thị <span className="text-red-500">*</span></Label>
              <Input
                value={title}
                onChange={(e) =>{  setTitle(e.target.value); }}
                required
                placeholder="Nhập tiêu đề component..."
              />
            </div>

            <div className="flex items-center gap-3">
              <Label>Trạng thái:</Label>
              <div
                className={cn(
                  "cursor-pointer inline-flex items-center justify-center rounded-full w-12 h-6 transition-colors",
                  active ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"
                )}
                onClick={() =>{  setActive(!active); }}
              >
                <div className={cn(
                  "w-5 h-5 bg-white rounded-full transition-transform shadow",
                  active ? "translate-x-2.5" : "-translate-x-2.5"
                )}></div>
              </div>
              <span className="text-sm text-slate-500">{active ? 'Bật' : 'Tắt'}</span>
            </div>

            {effectiveColors.mode === 'dual' && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                <div className="font-medium mb-1">Accent Balance</div>
                <div>Primary: {accentBalance.primary}% • Secondary: {accentBalance.secondary}% • Neutral: {accentBalance.neutral}%</div>
              </div>
            )}

            {warningMessages.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <div className="font-medium mb-1">Cảnh báo màu sắc</div>
                <ul className="list-disc pl-4 space-y-1">
                  {warningMessages.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Nội dung voucher khuyến mãi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề</Label>
              <Input 
                value={config.texts.heading} 
                onChange={(e) => setConfig({
                  ...config,
                  texts: { ...config.texts, heading: e.target.value }
                })} 
                placeholder="Voucher khuyến mãi" 
              />
            </div>
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <textarea 
                value={config.texts.description} 
                onChange={(e) => setConfig({
                  ...config,
                  texts: { ...config.texts, description: e.target.value }
                })} 
                placeholder="Áp dụng mã để nhận ưu đãi tốt nhất hôm nay."
                className="w-full min-h-[60px] rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA label</Label>
                <Input 
                  value={config.texts.ctaLabel} 
                  onChange={(e) => setConfig({
                    ...config,
                    texts: { ...config.texts, ctaLabel: e.target.value }
                  })} 
                  placeholder="Xem tất cả ưu đãi" 
                />
              </div>
              <div className="space-y-2">
                <Label>CTA link</Label>
                <Input 
                  value={config.ctaUrl} 
                  onChange={(e) => setConfig({ ...config, ctaUrl: e.target.value })} 
                  placeholder="/promotions" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Giới hạn voucher (1-8)</Label>
                <Input
                  type="number"
                  min={1}
                  max={8}
                  value={config.limit}
                  onChange={(e) => setConfig({ ...config, limit: Number(e.target.value) })}
                  placeholder="4"
                />
                <p className="text-xs text-slate-500">Dữ liệu tự động từ Promotions (chỉ voucher có mã).</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div></div>
          <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
            {showCustomBlock && (
              <TypeColorOverrideCard
                title="Màu custom cho Voucher Promotions"
                enabled={customState.enabled}
                mode={customState.mode}
                primary={customState.primary}
                secondary={customState.secondary}
                onEnabledChange={(next) => setCustomState((prev) => ({ ...prev, enabled: next }))}
                onModeChange={(next) => setCustomState((prev) => ({ ...prev, mode: next }))}
                onPrimaryChange={(value) => setCustomState((prev) => ({ ...prev, primary: value }))}
                onSecondaryChange={(value) => setCustomState((prev) => ({ ...prev, secondary: value }))}
              />
            )}
            <VoucherPromotionsPreview
              config={config}
              brandColor={effectiveColors.primary}
              secondary={effectiveColors.secondary}
              mode={effectiveColors.mode}
              selectedStyle={config.style}
              limit={config.limit}
              harmony={config.harmony}
              onStyleChange={(style) => {
                setConfig({ ...config, style });
              }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={() =>{  router.push('/admin/home-components'); }} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="accent" disabled={isSubmitting || !hasChanges}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </div>
  );
}
