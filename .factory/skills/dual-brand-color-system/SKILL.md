---
name: dual-brand-color-system
description: Chuẩn hóa hệ thống phân phối màu cho home-components theo OKLCH + APCA + Color Harmony. Dùng khi review/refactor màu component hiện tại, hoặc tạo home-component mới cần 1 màu (tint/shade đẹp) hay 2 màu (dual brand). Có hướng dẫn auto-refactor HSL -> OKLCH, WCAG 2.0 -> APCA, và Theme Engine UI.
version: 6.0.0
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

### 4) 60-30-10 (đo tại Content State)

- 60% Neutral: background/surface/text body
- 30% Primary: CTA, accent heading, price, gradient, active state
- 10% Secondary: badge, tag, secondary action, decorative accent
- **QUAN TRỌNG**: Tỷ lệ trên đo khi component có **DATA ĐẦY ĐỦ**
- Placeholder state **KHÔNG** tính vào tỷ lệ này

### 5) Placeholder dùng Neutral, không phải Primary/Secondary

- Background placeholder: neutral (slate-100/200), **KHÔNG** dùng primary hoặc secondary tint
- Icon placeholder: primary solid (chỉ icon, không phải background)
- Text placeholder: neutral (slate-400/500)
- Lý do: nếu dùng primary/secondary tint cho placeholder background, khi có data thật phần brand "biến mất" → tỷ lệ bị lệch

### 6) Secondary phải “nhìn thấy được” khi có data

- Không chỉ dùng secondary cho icon < 20px
- Secondary phải xuất hiện ở ít nhất 1 element có diện tích >= 5% component
- Ví dụ tốt: badge background, gradient accent, card ring, overlay tint
- Ví dụ xấu: chỉ dùng cho nav arrow icon 16px

### 7) Pagination dots ưu tiên Secondary (dual mode)

- Dual mode: dot active = secondary solid (tăng visibility cho secondary)
- Single mode: dot active = primary solid
- Dot inactive: luôn neutral (rgba white hoặc slate-300)
- Lý do: dot phân trang có diện tích đủ lớn để “nhìn thấy” secondary, giúp pass minimum visibility rule

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

## Dual-Brand Visibility Checklist (khi mode=dual)

### Primary phải hiện ở ít nhất 3 element types

- CTA button (fill hoặc border)
- Heading accent (underline, highlight, hoặc text color)
- Active indicator (dot, progress bar, tab underline)
- Price/important number styling
- Gradient contribution (ít nhất 1 gradient có primary)
- Section border/line accent

### Secondary phải hiện ở ít nhất 2 element types CÓ DIỆN TÍCH ĐỦ LỚN

- Badge/tag (background tint đủ rộng, không chỉ text)
- Overlay/gradient accent (ít nhất 20% diện tích gradient)
- Card border/ring khi selected/active
- Secondary button (outline hoặc tonal)
- Image overlay tint
- Decorative element (divider, pattern, border strip)

### Minimum visibility rule

- Primary: chiếm >= 15% diện tích element có màu (không tính neutral)
- Secondary: chiếm >= 5% diện tích element có màu (không tính neutral)
- Nếu secondary chỉ dùng cho icon < 20px → FAIL → cần thêm element lớn hơn

## Color Role Matrix (template)

| Element | Trạng thái | Primary | Secondary | Neutral | Ghi chú |
|---------|-----------|---------|-----------|---------|---------|
| CTA button | content | fill | - | - | Always visible |
| Badge | content | dot | bg+text | - | Secondary phải tint đủ rộng |
| Heading | content | accent line | - | text | - |
| Card bg | content | - | - | fill | 60% rule |
| Nav icon | content | - | solid | - | Quá nhỏ, không đủ |
| Placeholder bg | empty | - | - | fill | KHÔNG dùng primary/secondary tint |
| Placeholder icon | empty | solid | - | - | Hint only |
| Pagination dot | content | single: solid | dual: solid | - | Dual mode ưu tiên secondary |
| Overlay gradient | content | from-color | to-color | - | Dual-brand gradient |

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
- `checklists/dual-visibility-checklist.md`
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