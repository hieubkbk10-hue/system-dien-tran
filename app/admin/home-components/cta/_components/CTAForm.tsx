'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Label } from '../../../components/ui';
import type { CTAConfig, CTAHarmony } from '../_types';

export const CTAForm = ({
  config,
  onChange,
  brandMode,
  harmony,
  setHarmony,
}: {
  config: CTAConfig;
  onChange: (config: CTAConfig) => void;
  brandMode: 'single' | 'dual';
  harmony: CTAHarmony;
  setHarmony: (value: CTAHarmony) => void;
}) => (
  <Card className="mb-6">
    <CardHeader><CardTitle className="text-base">Nội dung CTA</CardTitle></CardHeader>
    <CardContent className="space-y-4">
      {brandMode === 'single' && (
        <div className="space-y-2">
          <Label>Harmony màu phụ</Label>
          <select
            value={harmony}
            onChange={(e) => { setHarmony(e.target.value as CTAHarmony); }}
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="analogous">Analogous (+30°)</option>
            <option value="complementary">Complementary (180°)</option>
            <option value="triadic">Triadic (120°)</option>
          </select>
        </div>
      )}
      <div className="space-y-2">
        <Label>Badge (tùy chọn)</Label>
        <Input
          value={config.badge ?? ''}
          onChange={(e) =>{  onChange({ ...config, badge: e.target.value }); }}
          placeholder="VD: Ưu đãi có hạn, Hot deal, Mới..."
        />
        <p className="text-xs text-slate-500">Hiển thị nhãn nổi bật phía trên tiêu đề (urgency indicator)</p>
      </div>
      <div className="space-y-2">
        <Label>Tiêu đề CTA</Label>
        <Input value={config.title} onChange={(e) =>{  onChange({ ...config, title: e.target.value }); }} />
      </div>
      <div className="space-y-2">
        <Label>Mô tả</Label>
        <textarea
          value={config.description}
          onChange={(e) =>{  onChange({ ...config, description: e.target.value }); }}
          className="w-full min-h-[80px] rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Text nút chính</Label><Input value={config.buttonText} onChange={(e) =>{  onChange({ ...config, buttonText: e.target.value }); }} /></div>
        <div className="space-y-2"><Label>Liên kết</Label><Input value={config.buttonLink} onChange={(e) =>{  onChange({ ...config, buttonLink: e.target.value }); }} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Text nút phụ</Label><Input value={config.secondaryButtonText} onChange={(e) =>{  onChange({ ...config, secondaryButtonText: e.target.value }); }} /></div>
        <div className="space-y-2"><Label>Liên kết nút phụ</Label><Input value={config.secondaryButtonLink} onChange={(e) =>{  onChange({ ...config, secondaryButtonLink: e.target.value }); }} /></div>
      </div>
    </CardContent>
  </Card>
);
