'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Label } from '../../../components/ui';
import { ComponentFormWrapper, useBrandColors, useComponentForm } from '../shared';
import { VoucherPromotionsPreview } from '../../previews';
import { DEFAULT_VOUCHER_STYLE, normalizeVoucherLimit, type VoucherPromotionsStyle } from '@/lib/home-components/voucher-promotions';

export default function VoucherPromotionsCreatePage() {
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Voucher khuyến mãi', 'VoucherPromotions');
  const { primary, secondary } = useBrandColors();
  const [style, setStyle] = useState<VoucherPromotionsStyle>(DEFAULT_VOUCHER_STYLE);
  const [limit, setLimit] = useState(4);
  const [voucherConfig, setVoucherConfig] = useState({
    ctaLabel: 'Xem tất cả ưu đãi',
    ctaUrl: '/promotions',
    description: 'Áp dụng mã để nhận ưu đãi tốt nhất hôm nay.',
    heading: 'Voucher khuyến mãi'
  });

  const onSubmit = (e: React.FormEvent) => {
    void handleSubmit(e, { ...voucherConfig, limit: normalizeVoucherLimit(limit), style });
  };

  return (
    <ComponentFormWrapper
      type="VoucherPromotions"
      title={title}
      setTitle={setTitle}
      active={active}
      setActive={setActive}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Nội dung voucher khuyến mãi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tiêu đề</Label>
            <Input 
              value={voucherConfig.heading} 
              onChange={(e) =>{  setVoucherConfig({...voucherConfig, heading: e.target.value}); }} 
              placeholder="Voucher khuyến mãi" 
            />
          </div>
          <div className="space-y-2">
            <Label>Mô tả</Label>
            <textarea 
              value={voucherConfig.description} 
              onChange={(e) =>{  setVoucherConfig({...voucherConfig, description: e.target.value}); }} 
              placeholder="Áp dụng mã để nhận ưu đãi tốt nhất hôm nay."
              className="w-full min-h-[60px] rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CTA label</Label>
              <Input 
                value={voucherConfig.ctaLabel} 
                onChange={(e) =>{  setVoucherConfig({...voucherConfig, ctaLabel: e.target.value}); }} 
                placeholder="Xem tất cả ưu đãi" 
              />
            </div>
            <div className="space-y-2">
              <Label>CTA link</Label>
              <Input 
                value={voucherConfig.ctaUrl} 
                onChange={(e) =>{  setVoucherConfig({...voucherConfig, ctaUrl: e.target.value}); }} 
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
                value={limit}
                onChange={(e) =>{  setLimit(Number(e.target.value)); }}
                placeholder="4"
              />
              <p className="text-xs text-slate-500">Dữ liệu tự động từ Promotions (chỉ voucher có mã).</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <VoucherPromotionsPreview
        config={voucherConfig}
        limit={normalizeVoucherLimit(limit)}
        brandColor={primary} secondary={secondary}
        selectedStyle={style}
        onStyleChange={setStyle}
      />
    </ComponentFormWrapper>
  );
}
