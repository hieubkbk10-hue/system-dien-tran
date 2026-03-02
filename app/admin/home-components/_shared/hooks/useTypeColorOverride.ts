'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useSystemBrandColors } from '../../create/shared';
import { HOME_COMPONENT_TYPE_VALUES } from '@/lib/home-components/componentTypes';
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

type TypeColorOverrideOptions = {
  lockCustomUntilTypeHasData?: boolean;
};

export const useTypeColorOverride = (type: string, options?: TypeColorOverrideOptions) => {
  const systemColors = useSystemBrandColors();
  const systemConfig = useQuery(api.homeComponentSystemConfig.getConfig);
  const overrides = systemConfig?.typeColorOverrides ?? null;
  const shouldLockCustom = Boolean(options?.lockCustomUntilTypeHasData);
  const typeItems = useQuery(
    api.homeComponents.listByType,
    shouldLockCustom ? { type } : 'skip',
  );
  const hasTypeData = (typeItems?.length ?? 0) > 0;
  const isCreateCustomLocked = shouldLockCustom && !hasTypeData;

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
  const isSupportedType = HOME_COMPONENT_TYPE_VALUES.includes(type);
  const systemEnabled = Boolean(overrides?.[type]?.systemEnabled);

  return {
    overrideState,
    resolvedColors,
    isCreateCustomLocked,
    showCustomBlock: isSupportedType && systemEnabled,
    systemColors,
    typeOverrides: overrides as Record<string, ColorOverrideState & { systemEnabled?: boolean }> | null,
  };
};

export const useTypeColorOverrideState = (type: string, options?: TypeColorOverrideOptions) => {
  const { overrideState, showCustomBlock, systemColors, isCreateCustomLocked } = useTypeColorOverride(type, options);
  const [customState, setCustomState] = useState<ColorOverrideState>(overrideState);
  const [initialCustom, setInitialCustom] = useState<ColorOverrideState>(overrideState);

  useEffect(() => {
    setCustomState((current) => (isSameColorOverrideState(current, overrideState) ? current : overrideState));
    setInitialCustom((current) => (isSameColorOverrideState(current, overrideState) ? current : overrideState));
  }, [overrideState]);

  useEffect(() => {
    if (customState.enabled) {
      return;
    }
    const systemSecondary = resolveSecondaryByMode(
      systemColors.mode,
      systemColors.primary,
      systemColors.secondary,
    );
    const nextState: ColorOverrideState = {
      enabled: false,
      mode: systemColors.mode,
      primary: systemColors.primary,
      secondary: systemSecondary,
    };
    if (!isSameColorOverrideState(customState, nextState)) {
      setCustomState(nextState);
    }
  }, [customState, systemColors.mode, systemColors.primary, systemColors.secondary]);

  const resolvedCustomSecondary = resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary);
  const effectiveColors: ResolvedTypeColors = showCustomBlock && customState.enabled && !isCreateCustomLocked
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
    isCreateCustomLocked,
    showCustomBlock,
    systemColors,
  };
};
