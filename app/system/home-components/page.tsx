'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { Eye, EyeOff, LayoutTemplate, Palette } from 'lucide-react';
import { differenceEuclidean } from 'culori';
import { api } from '@/convex/_generated/api';
import { COMPONENT_TYPES } from '@/app/admin/home-components/create/shared';
import { useBrandColors } from '@/components/site/hooks';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '@/app/admin/components/ui';

const isValidHexColor = (value: string) => /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value.trim());

export default function SystemHomeComponentsPage() {
  const systemColors = useBrandColors();
  const config = useQuery(api.homeComponentSystemConfig.getConfig);
  const setCreateVisibility = useMutation(api.homeComponentSystemConfig.setCreateVisibility);
  const setTypeColorOverride = useMutation(api.homeComponentSystemConfig.setTypeColorOverride);
  const bulkSetTypeColorOverride = useMutation(api.homeComponentSystemConfig.bulkSetTypeColorOverride);

  const [hiddenTypes, setHiddenTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const [heroCustomEnabled, setHeroCustomEnabled] = useState(false);
  const [heroMode, setHeroMode] = useState<'single' | 'dual'>('dual');
  const [heroPrimary, setHeroPrimary] = useState(systemColors.primary);
  const [heroSecondary, setHeroSecondary] = useState(systemColors.secondary || systemColors.primary);
  const [heroInitial, setHeroInitial] = useState<{
    enabled: boolean;
    mode: 'single' | 'dual';
    primary: string;
    secondary: string;
  }>({
    enabled: false,
    mode: 'dual',
    primary: systemColors.primary,
    secondary: systemColors.secondary || systemColors.primary,
  });

  useEffect(() => {
    if (!config) {return;}
    setHiddenTypes(config.hiddenTypes);
  }, [config]);

  useEffect(() => {
    const override = config?.typeColorOverrides?.Hero;
    const mode = override?.mode ?? systemColors.mode;
    const primary = override?.primary ?? systemColors.primary;
    const secondary = override?.secondary ?? (systemColors.secondary || primary);
    const resolvedSecondary = mode === 'single' ? primary : secondary;

    setHeroCustomEnabled(override?.enabled ?? false);
    setHeroMode(mode);
    setHeroPrimary(primary);
    setHeroSecondary(resolvedSecondary);
    setHeroInitial({
      enabled: override?.enabled ?? false,
      mode,
      primary,
      secondary: resolvedSecondary,
    });
  }, [config?.typeColorOverrides?.Hero, systemColors.mode, systemColors.primary, systemColors.secondary]);

  const componentTypes = useMemo(() => (
    [...COMPONENT_TYPES].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
  ), []);

  const hiddenTypeSet = useMemo(() => new Set(hiddenTypes), [hiddenTypes]);

  const toggleHiddenType = async (type: string) => {
    const nextHidden = hiddenTypeSet.has(type)
      ? hiddenTypes.filter(item => item !== type)
      : [...hiddenTypes, type];
    setHiddenTypes(nextHidden);
    await setCreateVisibility({ hiddenTypes: nextHidden });
  };

  const toggleSelectType = (type: string) => {
    setSelectedTypes(prev => prev.includes(type)
      ? prev.filter(item => item !== type)
      : [...prev, type]
    );
  };

  const handleShowAll = async () => {
    setHiddenTypes([]);
    await setCreateVisibility({ hiddenTypes: [] });
  };

  const handleHideSelected = async () => {
    const nextHidden = Array.from(new Set([...hiddenTypes, ...selectedTypes]));
    setHiddenTypes(nextHidden);
    await setCreateVisibility({ hiddenTypes: nextHidden });
  };

  const handleBulkCustom = async (enabled: boolean) => {
    if (selectedTypes.length === 0) {return;}
    await bulkSetTypeColorOverride({ enabled, types: selectedTypes });
  };

  const handleHeroModeChange = (mode: 'single' | 'dual') => {
    setHeroMode(mode);
    if (mode === 'single') {
      setHeroSecondary(heroPrimary);
    }
  };

  const handleHeroPrimaryChange = (value: string) => {
    setHeroPrimary(value);
    if (heroMode === 'single') {
      setHeroSecondary(value);
    }
  };

  const handleHeroSecondaryChange = (value: string) => {
    setHeroSecondary(value);
  };

  const heroDeltaE = useMemo(() => {
    if (heroMode !== 'dual') {return null;}
    if (!isValidHexColor(heroPrimary) || !isValidHexColor(heroSecondary)) {return null;}
    try {
      const delta = differenceEuclidean('oklch')(heroPrimary, heroSecondary);
      return Math.round(delta * 100);
    } catch {
      return null;
    }
  }, [heroMode, heroPrimary, heroSecondary]);

  const hasHeroChanges = heroCustomEnabled !== heroInitial.enabled
    || heroMode !== heroInitial.mode
    || heroPrimary !== heroInitial.primary
    || heroSecondary !== heroInitial.secondary;

  const handleHeroSave = async () => {
    const resolvedSecondary = heroMode === 'single' ? heroPrimary : heroSecondary;
    await setTypeColorOverride({
      enabled: heroCustomEnabled,
      mode: heroMode,
      primary: heroPrimary,
      secondary: resolvedSecondary,
      type: 'Hero',
    });
    setHeroInitial({
      enabled: heroCustomEnabled,
      mode: heroMode,
      primary: heroPrimary,
      secondary: resolvedSecondary,
    });
  };

  if (config === undefined) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">Đang tải...</div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2">
        <LayoutTemplate className="text-cyan-600 dark:text-cyan-400" size={20} />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Quản lý Home Components</h2>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">Ẩn/hiện loại component ở trang tạo và quản lý chế độ màu custom.</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hiển thị ở trang tạo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleShowAll}>Hiện tất cả</Button>
            <Button variant="outline" size="sm" onClick={handleHideSelected} disabled={selectedTypes.length === 0}>Ẩn mục đã chọn</Button>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-[44px_1fr_160px] gap-3 px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50 dark:bg-slate-900">
              <div></div>
              <div>Loại component</div>
              <div className="text-right">Hiện ở Create</div>
            </div>
            {componentTypes.map((type) => {
              const isHidden = hiddenTypeSet.has(type.value);
              const isSelected = selectedTypes.includes(type.value);
              return (
                <div key={type.value} className="grid grid-cols-[44px_1fr_160px] gap-3 px-4 py-3 border-t border-slate-100 dark:border-slate-800 items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectType(type.value)}
                    className="h-4 w-4 accent-cyan-600"
                  />
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <type.icon size={16} className="text-slate-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{type.label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{type.description}</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => toggleHiddenType(type.value)}
                      className={cn(
                        "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs border",
                        isHidden
                          ? "border-slate-200 text-slate-500 bg-slate-100"
                          : "border-emerald-200 text-emerald-600 bg-emerald-50"
                      )}
                    >
                      {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                      {isHidden ? 'Ẩn' : 'Hiện'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Palette size={16} />
            Chế độ màu custom (Pilot)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleBulkCustom(true)} disabled={selectedTypes.length === 0}>
              Bật custom cho mục đã chọn
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkCustom(false)} disabled={selectedTypes.length === 0}>
              Tắt custom cho mục đã chọn
            </Button>
            <span className="text-xs text-slate-500 self-center">Áp dụng cho type hỗ trợ (hiện chỉ Hero).</span>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">Hero Banner</div>
                <div className="text-xs text-slate-500">Bật chế độ custom để override màu riêng cho Hero.</div>
              </div>
              <div
                className={cn(
                  "cursor-pointer inline-flex items-center justify-center rounded-full w-10 h-5 transition-colors",
                  heroCustomEnabled ? "bg-emerald-500" : "bg-slate-300"
                )}
                onClick={() => setHeroCustomEnabled(!heroCustomEnabled)}
              >
                <div className={cn("w-4 h-4 bg-white rounded-full transition-transform", heroCustomEnabled ? "translate-x-2" : "-translate-x-2")}></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant={heroMode === 'single' ? 'accent' : 'outline'} onClick={() => handleHeroModeChange('single')} disabled={!heroCustomEnabled}>
                Single
              </Button>
              <Button size="sm" variant={heroMode === 'dual' ? 'accent' : 'outline'} onClick={() => handleHeroModeChange('dual')} disabled={!heroCustomEnabled}>
                Dual
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Màu chính</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={heroPrimary} onChange={(e) => handleHeroPrimaryChange(e.target.value)} disabled={!heroCustomEnabled} />
                  <Input value={heroPrimary} onChange={(e) => handleHeroPrimaryChange(e.target.value)} disabled={!heroCustomEnabled} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Màu phụ</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={heroSecondary}
                    onChange={(e) => handleHeroSecondaryChange(e.target.value)}
                    disabled={!heroCustomEnabled || heroMode === 'single'}
                  />
                  <Input
                    value={heroSecondary}
                    onChange={(e) => handleHeroSecondaryChange(e.target.value)}
                    disabled={!heroCustomEnabled || heroMode === 'single'}
                  />
                </div>
              </div>
            </div>

            {heroMode === 'dual' && heroDeltaE !== null && heroDeltaE < 20 && (
              <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Hai màu đang quá giống nhau (deltaE {heroDeltaE}). Nên chọn màu tương phản hơn.
              </div>
            )}

            <div className="flex justify-end">
              <Button variant="accent" onClick={handleHeroSave} disabled={!hasHeroChanges}>
                Lưu cấu hình Hero
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
