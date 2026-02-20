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
import { useBrandColors } from '../../../create/shared';
import { ConfigJsonForm } from '../../../_shared/components/ConfigJsonForm';
import { VoucherPromotionsPreview } from '../../_components/VoucherPromotionsPreview';
import {
  DEFAULT_VOUCHER_PROMOTIONS_CONFIG,
  normalizeVoucherPromotionsHarmony,
} from '../../_lib/constants';
import type { VoucherPromotionsConfigState } from '../../_types';
import { normalizeVoucherLimit, normalizeVoucherStyle } from '@/lib/home-components/voucher-promotions';

export default function VoucherPromotionsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { primary, secondary, mode } = useBrandColors();
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
        ctaLabel: (rawConfig.ctaLabel as string | undefined) ?? '',
        ctaUrl: (rawConfig.ctaUrl as string | undefined) ?? '',
        description: (rawConfig.description as string | undefined) ?? '',
        heading: (rawConfig.heading as string | undefined) ?? '',
        limit: normalizeVoucherLimit(rawConfig.limit as number | undefined),
        style: normalizeVoucherStyle(rawConfig.style as string | undefined),
        harmony: normalizeVoucherPromotionsHarmony(rawConfig.harmony as string | undefined),
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
  const hasChanges = initialSnapshot !== '' && currentSnapshot !== initialSnapshot;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !hasChanges) {return;}

    setIsSubmitting(true);
    try {
      const payloadConfig: VoucherPromotionsConfigState = {
        ...config,
        limit: normalizeVoucherLimit(config.limit),
        harmony: normalizeVoucherPromotionsHarmony(config.harmony),
      };

      await updateMutation({
        active,
        config: payloadConfig,
        id: id as Id<'homeComponents'>,
        title,
      });
      setConfig(payloadConfig);
      setInitialSnapshot(JSON.stringify({ title, active, config: payloadConfig }));
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
          </CardContent>
        </Card>

        <ConfigJsonForm value={config} onChange={(next) =>{  setConfig(next as VoucherPromotionsConfigState); }} title="Cấu hình Voucher Promotions" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div></div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            <VoucherPromotionsPreview
              config={config}
              brandColor={primary}
              secondary={secondary}
              mode={mode}
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
