'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useBrandColors } from '../../create/shared';
import {
  getTypeOverrideState,
  resolveSecondaryByMode,
  resolveTypeOverrideColors,
  type ColorOverrideState,
  type ResolvedTypeColors,
} from '../lib/typeColorOverride';

const isSameColorOverrideState = (a: ColorOverrideState, b: ColorOverrideState) => {
  return a.enabled === b.enabled
    && a.mode === b.mode
    && a.primary === b.primary
    && a.secondary === b.secondary;
};

export const useTypeColorOverride = (type: string) => {
  const systemColors = useBrandColors();
  const systemConfig = useQuery(api.homeComponentSystemConfig.getConfig);
  const overrides = systemConfig?.typeColorOverrides ?? null;

  const overrideState = useMemo(() => (
    getTypeOverrideState({ type, systemColors, overrides })
  ), [
    type,
    systemColors.mode,
    systemColors.primary,
    systemColors.secondary,
    overrides,
  ]);

  const resolvedColors = useMemo(() => (
    resolveTypeOverrideColors({ type, systemColors, overrides })
  ), [
    type,
    systemColors.mode,
    systemColors.primary,
    systemColors.secondary,
    overrides,
  ]);

  return {
    overrideState,
    resolvedColors,
    showCustomBlock: Boolean(overrides?.[type]?.enabled),
    systemColors,
    typeOverrides: overrides as Record<string, ColorOverrideState> | null,
  };
};

export const useTypeColorOverrideState = (type: string) => {
  const { overrideState, showCustomBlock, systemColors } = useTypeColorOverride(type);
  const [customState, setCustomState] = useState<ColorOverrideState>(overrideState);
  const [initialCustom, setInitialCustom] = useState<ColorOverrideState>(overrideState);

  useEffect(() => {
    setCustomState((current) => (isSameColorOverrideState(current, overrideState) ? current : overrideState));
    setInitialCustom((current) => (isSameColorOverrideState(current, overrideState) ? current : overrideState));
  }, [overrideState]);

  const resolvedCustomSecondary = resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary);
  const effectiveColors: ResolvedTypeColors = showCustomBlock && customState.enabled
    ? {
      mode: customState.mode,
      primary: customState.primary,
      secondary: resolvedCustomSecondary,
      usingCustom: true,
    }
    : {
      mode: systemColors.mode,
      primary: systemColors.primary,
      secondary: resolveSecondaryByMode(systemColors.mode, systemColors.primary, systemColors.secondary),
      usingCustom: false,
    };

  return {
    customState,
    effectiveColors,
    initialCustom,
    setCustomState,
    setInitialCustom,
    showCustomBlock,
    systemColors,
  };
};
