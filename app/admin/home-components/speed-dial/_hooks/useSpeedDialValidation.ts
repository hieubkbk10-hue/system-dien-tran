import { useMemo } from 'react';
import { getSpeedDialValidationResult } from '../_lib/colors';
import type { SpeedDialAction, SpeedDialBrandMode, SpeedDialHarmony } from '../_types';

export function useSpeedDialValidation({
  primary,
  secondary,
  mode,
  harmony,
  actions,
}: {
  primary: string;
  secondary: string;
  mode: SpeedDialBrandMode;
  harmony: SpeedDialHarmony;
  actions: SpeedDialAction[];
}) {
  const validation = useMemo(
    () => getSpeedDialValidationResult({ primary, secondary, mode, harmony, actions }),
    [primary, secondary, mode, harmony, actions],
  );

  const warningMessages = useMemo(() => {
    if (mode === 'single') {
      return []; // Skip validation warnings trong single mode
    }

    const warnings: string[] = [];

    if (validation.harmonyStatus.isTooSimilar) {
      warnings.push(`Màu chính và màu phụ đang khá gần nhau (deltaE=${validation.harmonyStatus.deltaE}).`);
    }

    if (validation.accessibility.failing.length > 0) {
      warnings.push(`Có ${validation.accessibility.failing.length} cặp màu chưa đạt APCA (minLc=${validation.accessibility.minLc.toFixed(1)}).`);
    }

    return warnings;
  }, [mode, validation]);

  return { validation, warningMessages };
}
