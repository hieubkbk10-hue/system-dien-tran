---
name: dual-brand-color-system
description: Chuẩn hóa hệ thống phân phối màu cho home-components theo OKLCH + APCA + Color Harmony. Dùng khi review/refactor màu component hiện tại, hoặc tạo home-component mới cần 1 màu (tint/shade đẹp) hay 2 màu (dual brand). Có hướng dẫn auto-refactor HSL -> OKLCH, WCAG 2.0 -> APCA, và Theme Engine UI.
version: 8.0.0
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

## 6 Principles (gọn, tổng quát)

### 1) OKLCH Only

- Dùng OKLCH để generate tint/shade, không dùng HSL
- Ưu tiên chỉnh L/C/H có clamp để tránh wash-out

### 2) APCA Contrast

- Text/UI phải pass APCA thresholds
- Luôn dùng `Math.abs(apcaContrast(...))`

### 3) 60-30-10 Distribution (đo tại content state)

- 60% Neutral: background/surface/body text
- 30% Primary: CTA, heading accent, price, active state
- 10% Secondary: badge, tag, secondary action, decorative accent
- Placeholder **không tính vào tỷ lệ** và luôn dùng neutral cho background

**Ví dụ áp dụng**
- Pagination dot active (dual) = secondary để tăng visibility
- Placeholder grid/bento: neutral tint, không gridTint khi chưa có data

### 4) Accent Prominence

- Gán primary/secondary theo **accent count + tier**
- Lone accent luôn primary; 2 accents: lớn hơn = primary
- Tier S yêu cầu APCA cao hơn (>= 60)

**Ví dụ áp dụng**
- Secondary không chỉ dùng icon < 20px; phải có element đủ lớn
- Tránh decorative accent nếu không có chức năng

### 5) Harmony Auto-suggest

- Single mode: auto secondary từ primary
- Default: Analogous (+30°), options: Complementary/Triadic

### 6) Single Source of Truth

- Render ≡ Preview, dùng chung helper trong `_lib/colors.ts`
- Không hardcode màu ở site nếu preview đã dùng helper

---

## Content-Aware Color Distribution

### Nguyên tắc: Đo màu ở trạng thái DATA ĐẦY ĐỦ

Tỷ lệ 60-30-10 phải đo tại trạng thái có data thật (ảnh, text, link đầy đủ),
KHÔNG tính placeholder vào tỷ lệ này.

### 2 Layer phân phối

**Layer 1: Content State (data đầy đủ) - ĐO TẠI ĐÂY**
- 60% Neutral: background page, card surface, text body
- 30% Primary: CTA buttons, headings có accent, price tags,
  overlay gradient tint, section accent border/line, hover state
- 10% Secondary: badges, tag labels, secondary buttons/links,
  active state indicators, decorative accents, hover accent

**Layer 2: Placeholder State (data trống) - KHÔNG tính vào tỷ lệ**
- Background: neutral tint (slate-100/200), KHÔNG dùng primary/secondary tint
- Icon: primary solid (hint cho user biết component thuộc brand nào)
- Text: neutral (slate-500)

## Checklist & Template

- Dùng `checklist.md` cho review/create
- Dùng `reference.md` cho bảng tóm tắt OKLCH/APCA/Harmony/W3C C40

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
- `checklist.md`
- `reference.md`


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
