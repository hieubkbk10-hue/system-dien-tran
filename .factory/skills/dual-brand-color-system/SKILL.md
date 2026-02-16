---
name: dual-brand-color-system
description: Chuẩn hóa hệ thống phân phối màu cho home-components theo OKLCH + APCA + Color Harmony. Dùng khi review/refactor màu component hiện tại, hoặc tạo home-component mới cần 1 màu (tint/shade đẹp) hay 2 màu (dual brand). Có hướng dẫn auto-refactor HSL -> OKLCH, WCAG 2.0 -> APCA, Theme Engine UI, Component Color Map, và Element-Level Color Rules.
version: 9.0.0
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

---

## Component Color Map (Hiện trạng)

### Home Components - 4 nhóm

**Nhóm A: Primary-only** (secondary bị ignore `_secondary`)
| Component | P% | S% | Pattern |
|---|---|---|---|
| Blog | 100 | 0 | brandColor cho borders, hover, badges, category tags |
| CaseStudy | 100 | 0 | brandColor cho borders, hover, badges, links |
| Benefits | 95 | 5 | brandColor dominant, secondary minimal |
| Team | 95 | 5 | brandColor dominant |

**Nhóm B: Secondary-dominant** (brandColor ít hoặc chỉ cho BrandBadge)
| Component | P% | S% | Pattern |
|---|---|---|---|
| CategoryProducts | 5 | 95 | `_brandColor`, secondary cho tất cả UI |
| Features | 10 | 90 | `_brandColor`, secondary dominant |
| TrustBadges | 10 | 90 | brandColor chỉ trong BrandBadge |
| ServiceList | 10 | 90 | brandColor chỉ trong BrandBadge |
| Gallery | 5 | 95 | secondary cho borders, text, icons |
| Partners | 5 | 95 | secondary cho borders, animations |
| FAQ | 40 | 60 | secondary: expanded border/icon |
| Testimonials | 40 | 60 | secondary: quotes, rating stars |
| Services | 40 | 60 | secondary: numbers, accent bar, timeline |
| Footer | 30 | 70 | secondary: logo/dividers; brandColor: bg shade |
| Career | 40 | 60 | secondary cho borders, tags |
| Contact | 40 | 60 | secondary cho form elements |
| Process | 40 | 60 | secondary cho timeline, dots |

**Nhóm C: Balanced dual-brand** (~50/50)
| Component | P% | S% | Pattern |
|---|---|---|---|
| Hero | 50 | 50 | Hệ thống color riêng (`_lib/colors.ts`) |
| Stats | 50 | 50 | Custom implementation |
| ProductList | 55 | 45 | P: titles/prices/buttons; S: labels/borders |
| ProductGrid | 50 | 50 | Pass-through |
| CTA | 60 | 40 | P: bg/buttons; S: title text/button text |
| About | 50 | 50 | Cả 2 cho accent bar, icons |
| Pricing | 45 | 55 | S: prices/ring; P: popular bg |
| SpeedDial | 50 | 50 | Cân bằng |
| Clients | 50 | 50 | Cân bằng |
| Video | 50 | 50 | Cân bằng |
| Countdown | 50 | 50 | Cân bằng |
| VoucherPromotions | 50 | 50 | Cân bằng |

### Experiences - Chỉ dùng primary (KHÔNG có secondary)

**Dynamic** (useBrandColor()):
posts-list, posts-detail, products-list, services-list, services-detail,
promotions-list, menu, account-profile, account-orders, search

**Hard-coded** (known issues):
| Experience | Màu | Cần refactor |
|---|---|---|
| wishlist | #ec4899 | → useBrandColor() |
| contact | #6366f1 | → useBrandColor() |
| comments-rating | #a855f7 | → useBrandColor() |
| checkout | #22c55e | → useBrandColor() |
| cart | #f97316 | → useBrandColor() |
| product-detail | #06b6d4 | → useBrandColor() |

---

## Element-Level Color Rules

| UI Element | Color | Lý do |
|---|---|---|
| CTA button (primary action) | `brandColor` | Dominant action = primary brand |
| Section title/heading accent | `brandColor` | Brand recognition |
| Prices, số liệu nổi bật | `secondary` | Data highlight, contrast với heading |
| Badge solid (HOT, discount) | `brandColor` bg | Qua BrandBadge component |
| Badge outline (NEW, tag) | `secondary` border + text | Qua BrandBadge component |
| Card borders, hover glow | `secondary` (10-40% opacity) | Subtle accent |
| Icon container background | `brandColor` (10% opacity) | Brand hint |
| Section label/subtitle | `secondary` | Phân biệt với heading |
| Gradient accent line/bar | `brandColor → secondary` | Dual brand harmony |
| Footer background | Shade of `brandColor` (65%) | Dark brand tone |
| Timeline/process dots | `secondary` | Decorative, không dominant |
| Active/selected state | `brandColor` | Primary feedback |
| Form focus ring | `secondary` | Subtle feedback |
| Pagination active dot | `secondary` | Tăng visibility (nhỏ) |
| Navigation arrows | `brandColor` border + icon | Interactive control |

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

## Known Issues

### Experiences thiếu dual-brand support

- 16 experiences chỉ nhận `brandColor`, không nhận `secondary`
- Khi tạo experience mới: chỉ cần `useBrandColor()`, chưa cần secondary
- 6 experiences hard-code màu: cần refactor sang `useBrandColor()`

### Inconsistency giữa home-components

- 4 components ignore secondary (`_secondary`): Blog, CaseStudy, Benefits, Team
- 2 components ignore brandColor (`_brandColor`): CategoryProducts, Features
- Chấp nhận hiện trạng; khi refactor thì follow Element-Level Color Rules


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
