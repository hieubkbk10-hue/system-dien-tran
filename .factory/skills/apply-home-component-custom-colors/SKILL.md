---
name: apply-home-component-custom-colors
description: Playbook rollout custom color cho toàn bộ home-components (system/admin/preview/site) với parity contract, guardrails và template đầy đủ để tránh lệch single/dual hoặc preview ≠ site.
---

# Apply Home Component Custom Colors

## Mục tiêu
- Rollout custom color theo **type** cho **toàn bộ home-components**.
- Bảo đảm **parity create/edit/preview/site** và đúng **single/dual**.
- Chống regression bằng guardrails + verification matrix.

## Khi nào dùng
- User yêu cầu “áp dụng custom color cho các home-component còn lại”.
- Mở rộng từ pilot Hero sang all types.

## Không dùng khi
- Chỉ chỉnh UI admin chung.
- Chỉ đổi text/spacing, không chạm brand colors.

## Nguồn chân lý (bắt buộc đọc trước khi làm)
- `dual-brand-color-system` skill.
- Lessons learned:
  - `f99ecc5`: control center + settings storage + filter create + reset seed/module.
  - `7641f05`: table 1 khối + per-row action + bulk action.
  - `bec3060`: site render phải đọc override (tránh preview ≠ site), UI compact.
  - `dc764b4`: toggle cần sonner feedback.

## Input contract (bắt buộc trước khi code)
- Danh sách type cần rollout (thường là **tất cả HOME_COMPONENT_TYPE_VALUES**).
- Xác nhận tồn tại:
  - `lib/home-components/componentTypes.ts`
  - `app/system/home-components/page.tsx`
  - `convex/homeComponentSystemConfig.ts`
  - `components/site/ComponentRenderer.tsx`
  - Các edit/create page tương ứng.

## Parity Contract (must-pass)
1) `/system/home-components` là **control center duy nhất** cho override state.
2) Edit page đọc + cập nhật override bằng `useTypeColorOverrideState` + `setTypeColorOverride`.
3) Preview dùng `effectiveColors` cùng logic mode.
4) Site renderer luôn resolve qua `resolveTypeOverrideColors(...)`, **không dùng raw system color**.
5) Single mode luôn ép `secondary = primary` ở UI state + payload + runtime.

## Execution Flow (bắt buộc theo thứ tự)
1) **System → Convex**
   - Đảm bảo supported types lấy từ `HOME_COMPONENT_TYPE_VALUES`.
   - Validation hex + normalize mode/secondary.
2) **Admin Create**
   - Lấy state override theo type, commit trước khi `handleSubmit`.
   - Không hiện secondary input khi single.
3) **Admin Edit**
   - Custom block đặt cạnh preview.
   - `hasChanges` bao gồm `customChanged`.
4) **Preview**
   - Dùng `effectiveColors` (đã resolve override + mode).
5) **Site**
   - Luôn resolve bằng `resolveTypeOverrideColors` ở renderer.
6) **Verification**
   - Chạy matrix cho **tất cả type**.

## Template thao tác (copy/paste)

### Template A — Edit Page Integration
```tsx
import { TypeColorOverrideCard } from '../../../_shared/components/TypeColorOverrideCard';
import { useTypeColorOverrideState } from '../../../_shared/hooks/useTypeColorOverride';
import { resolveSecondaryByMode } from '../../../_shared/lib/typeColorOverride';

const COMPONENT_TYPE = 'YourType';

const { customState, effectiveColors, initialCustom, setCustomState, setInitialCustom, showCustomBlock } =
  useTypeColorOverrideState(COMPONENT_TYPE);
const setTypeColorOverride = useMutation(api.homeComponentSystemConfig.setTypeColorOverride);

const resolvedCustomSecondary = resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary);
const customChanged = showCustomBlock
  ? customState.enabled !== initialCustom.enabled
    || customState.mode !== initialCustom.mode
    || customState.primary !== initialCustom.primary
    || resolvedCustomSecondary !== initialCustom.secondary
  : false;

const hasChanges = initialSnapshot !== null && (currentSnapshot !== initialSnapshot || customChanged);

if (showCustomBlock) {
  await setTypeColorOverride({
    enabled: customState.enabled,
    mode: customState.mode,
    primary: customState.primary,
    secondary: resolvedCustomSecondary,
    type: COMPONENT_TYPE,
  });
  setInitialCustom({
    enabled: customState.enabled,
    mode: customState.mode,
    primary: customState.primary,
    secondary: resolvedCustomSecondary,
  });
}
```

### Template B — Create Page Integration
```tsx
const { customState, effectiveColors, showCustomBlock, setCustomState } = useTypeColorOverrideState('YourType');
const setTypeColorOverride = useMutation(api.homeComponentSystemConfig.setTypeColorOverride);

const onSubmit = (e: React.FormEvent) => {
  void (async () => {
    e.preventDefault();
    if (showCustomBlock) {
      await setTypeColorOverride({
        type: 'YourType',
        enabled: customState.enabled,
        mode: customState.mode,
        primary: customState.primary,
        secondary: resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary),
      });
    }
    await handleSubmit(e, payloadConfig);
  })();
};
```

### Template C — System Page Actions
```tsx
const CUSTOM_SUPPORTED_TYPES = new Set(HOME_COMPONENT_TYPE_VALUES);

const toggleCustomType = async (type: string) => {
  if (!CUSTOM_SUPPORTED_TYPES.has(type)) {return;}
  try {
    await setTypeColorOverride({ enabled, mode, primary, secondary, type });
    toast.success(enabled ? 'Đã bật custom màu cho component.' : 'Đã chuyển về màu hệ thống.');
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Không thể cập nhật custom màu.');
  }
};
```

### Template D — Renderer Integration
```tsx
const systemColors = useBrandColors();
const systemConfig = useQuery(api.homeComponentSystemConfig.getConfig);
const resolvedColors = resolveTypeOverrideColors({
  type,
  systemColors,
  overrides: systemConfig?.typeColorOverrides ?? null,
});

return <YourSection brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} />;
```

### Template E — Convex Contract
```ts
const SUPPORTED_CUSTOM_TYPES = new Set(HOME_COMPONENT_TYPE_VALUES);
const isValidHexColor = (value: string) => /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value.trim());

const normalizeColorOverride = (value: unknown) => {
  if (!value || typeof value !== 'object') {return null;}
  const record = value as Record<string, unknown>;
  const enabled = Boolean(record.enabled);
  const mode: 'single' | 'dual' = record.mode === 'single' ? 'single' : 'dual';
  const primary = typeof record.primary === 'string' && isValidHexColor(record.primary) ? record.primary : DEFAULT;
  let secondary = typeof record.secondary === 'string' && isValidHexColor(record.secondary) ? record.secondary : primary;
  if (mode === 'single') {secondary = primary;}
  return { enabled, mode, primary, secondary };
};
```

## Guardrails bắt buộc
- Luôn lấy danh sách type từ `lib/home-components/componentTypes.ts`.
- Mọi toggle/bulk action **bắt buộc** có toast success/error.
- Single mode không hiển thị input secondary; payload luôn `secondary = primary`.
- Không sync state gây loop; chỉ update khi giá trị thật sự đổi.
- Renderer không tự hardcode màu nếu đã có `resolvedColors`.
- Hidden types chỉ ảnh hưởng create list, không ảnh hưởng runtime.

## Verification Matrix (All Types)
Mỗi type phải pass đủ 8 check:
1) System toggle per-row hoạt động + toast.
2) Bulk toggle hoạt động + toast.
3) Ẩn/hiện ở create page theo `hiddenTypes`.
4) Edit page có custom block + hide khi system OFF.
5) Preview đổi màu đúng khi bật custom.
6) Site render đổi màu đúng khi bật custom.
7) Single mode = secondary = primary, không hiển thị secondary input.
8) Reload lại trang vẫn giữ state custom.

## Failure Catalog & Fix Recipe
1) **Preview đổi màu, site không đổi** → kiểm tra `ComponentRenderer` có dùng `resolveTypeOverrideColors`.
2) **Single mode vẫn cần secondary** → kiểm tra `resolveSecondaryByMode` + UI hide logic.
3) **Toggle không có feedback** → thêm `toast.success/error` ngay tại action.
4) **Reset/seed làm lệch state** → kiểm tra path reset (settings key + mutation).
5) **Type không nhận custom** → kiểm tra `HOME_COMPONENT_TYPE_VALUES` + SUPPORTED set ở Convex.

## Output format bắt buộc khi báo cáo
- Danh sách type đã áp dụng.
- File đã sửa (System/Create/Edit/Renderer/Convex).
- Kết quả verification matrix (pass/fail theo type).
- Lỗi nếu có + recipe đã áp dụng.

## Done criteria
- Thay đổi ở `/system/home-components` phản ánh đúng trong edit/preview/site.
- Single/dual mode nhất quán ở tất cả nơi.
- Mọi toggle có toast, không có preview-site mismatch.
