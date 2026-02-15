---
name: dual-brand-color-system
description: Chuẩn hóa hệ thống phân phối màu cho home-components theo OKLCH + APCA + Color Harmony. Dùng khi review/refactor màu component hiện tại, hoặc tạo home-component mới cần 1 màu (tint/shade đẹp) hay 2 màu (dual brand). Có hướng dẫn auto-refactor HSL -> OKLCH, WCAG 2.0 -> APCA, và Theme Engine UI.
version: 5.0.0
---

# Dual Brand Color System (Home Components)

## Mục tiêu

- 1 màu: tự sinh **tint/shade** đẹp, đồng đều (OKLCH)
- 2 màu: **dual brand** hài hòa (analogous/complementary/triadic)
- Text luôn **đủ contrast** (APCA)
- UI đảm bảo **60-30-10 rule**

## Khi nào dùng

- Tạo mới home-component (hero, cta, stats, partners, ...)
- Review/fix màu của component đã có
- Cần auto-suggest secondary color từ primary
- Muốn đảm bảo accessibility (APCA/WCAG 3.0)

## Không dùng khi

- Admin pages / dashboard (đi theo theme admin chung)
- Icon-only color (dùng currentColor)
- UI components chung (button/input) đã có design tokens

---

## Quick Start

### A. Review existing component

1. Mở file colors: `app/admin/home-components/<component>/_lib/colors.ts`
2. Kiểm tra HSL / getTint / getShade
3. Đổi sang OKLCH (culori)
4. Thay hard-coded text color bằng APCA
5. Kiểm tra dual-mode + similarity
6. Ghi report theo format ở dưới

### B. Create new component

1. Copy `examples/color-utils.ts` → đổi tên `get<Comp>Colors`
2. Dùng `getAPCATextColor` cho text on solid
3. Nếu single mode: chọn harmony (analogous mặc định)
4. Dùng `examples/theme-engine-ui.tsx` làm UI mẫu
5. Chạy checklist trong `checklists/create-checklist.md`

---

## Core Rules

### 1) OKLCH thay HSL

- Không dùng HSL để generate tint/shade
- Dùng OKLCH để giữ **perceptual uniformity**

### 2) APCA thay WCAG 2.0

- Text on background phải pass APCA (Lc >= 60 cho body)
- Luôn dùng `Math.abs(apcaContrast(...))`

### 3) Harmony (single -> dual)

- Single mode: secondary auto từ primary
- Default: Analogous (+30°)
- Options: Complementary (180°), Triadic (120°)

### 4) 60-30-10

- 60% Neutral: background/surface
- 30% Primary: headings/CTA/prices
- 10% Secondary: badges/accents/hover

---

## Auto-Refactor Patterns

### Pattern 1: getTint -> OKLCH

```ts
// BEFORE
const tint = getTint(primary, 0.15);

// AFTER
const color = oklch(primary);
const tint = formatHex(oklch({ ...color, l: color.l + 0.15 }));
```

### Pattern 2: getShade -> OKLCH

```ts
// BEFORE
const shade = getShade(primary, 10);

// AFTER
const shade = formatHex(oklch({ ...color, l: color.l - 0.1 }));
```

### Pattern 3: Hard-coded text -> APCA

```ts
// BEFORE
textOnSolid: '#ffffff'

// AFTER
textOnSolid: getAPCATextColor(primary, 16, 500)
```

---

## Output Report Format

```md
## Color Review: <Component>

### Issues
1. ❌ HSL detected in _lib/colors.ts (line XX)
2. ⚠️ Hard-coded text color (#fff)
3. ⚠️ Missing hover/active variants

### Fix Plan
1. Replace HSL -> OKLCH (culori)
2. Add APCA text color helper
3. Add hover/active/disabled variants

### Notes
- Primary used for CTA
- Secondary used for badges/hover
```

---

## Files tham chiếu

- `examples/color-utils.ts`
- `examples/theme-engine-ui.tsx`
- `examples/hero-before-after.md`
- `checklists/review-checklist.md`
- `checklists/create-checklist.md`
- `reference-oklch.md`
- `reference-apca.md`
- `reference-harmony.md`

---

## Dependencies

```json
{
  "dependencies": {
    "culori": "^4.0.1",
    "apca-w3": "^0.1.9"
  }
}
```

---

## Testing

- `bunx oxlint --type-aware --type-check --fix`
- Check preview styles trong admin edit page
- Test 3 màu primary khác nhau + 2 màu secondary khác nhau