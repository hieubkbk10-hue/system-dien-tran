---
name: dual-brand-color-system
description: Chuẩn hóa hệ thống phân phối màu cho home-components theo OKLCH + APCA + Color Harmony. Dùng khi review/refactor màu component hiện tại, hoặc tạo home-component mới cần 1 màu (tint/shade đẹp) hay 2 màu (dual brand). Có hướng dẫn auto-refactor HSL -> OKLCH, WCAG 2.0 -> APCA, Theme Engine UI, Component Color Map, và Element-Level Color Rules.
version: 11.5.0
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
4. Dùng APCA để kiểm tra contrast (không auto-fix text về neutral)
5. Kiểm tra dual-mode + similarity (getHarmonyStatus)
6. Tính accent balance (calculateAccentBalance)
7. Tính accessibility score (getAccessibilityScore)
8. Ghi report theo format ở dưới

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

- Text/UI nên pass APCA thresholds
- Luôn dùng `Math.abs(apcaContrast(...))`
- **Không auto-fix text về neutral** khi fail APCA; giữ màu brand theo cấu hình

### 3) 60-30-10 Distribution (đo tại content state)

- 60% Neutral: background/surface/body text
- 30% Primary: section heading (h2), CTA, icon containers, active state
- 10% Secondary: subtitle/label, badge, tag, secondary action, decorative accent
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

### 5) Single Mode = Monochromatic (STRICT)

**BẮT BUỘC:**
- Single mode: `resolveSecondary()` PHẢI return `primary` (monochromatic)
- Dual mode: `resolveSecondary()` return `secondary` nếu hợp lệ, fallback harmony color

**Harmony chỉ cho UI suggestion:**
- UI form có thể hiển thị harmony preview (analogous/complementary/triadic)
- Nhưng màu thực tế dùng render PHẢI là primary trong single mode

**UI Display Rules:**
- KHÔNG hiển thị secondary color info khi mode = 'single'
- KHÔNG hiển thị accent balance (P%/S%/N%) khi mode = 'single'
- Chỉ hiển thị Primary color swatch + hex
- KHÔNG hiển thị Harmony/Accessibility warning khi mode = 'single'

**ColorInfoPanel (dual mode):**
- Panel chuẩn: hiển thị “Màu chính/Màu phụ” + mô tả áp dụng màu phụ.
- Chỉ render khi `mode === 'dual'` và `secondary` hợp lệ.
- Vị trí khuyến nghị: ngay dưới `PreviewWrapper` (giống Hero).

**Ví dụ code (chuẩn hoá):**
```tsx
<PreviewWrapper
  title="Preview ..."
  device={device}
  setDevice={setDevice}
  previewStyle={previewStyle}
  setPreviewStyle={setPreviewStyle}
  styles={styles}
  deviceWidthClass={deviceWidths[device]}
>
  <BrowserFrame>
    {renderContent()}
  </BrowserFrame>
</PreviewWrapper>
<ColorInfoPanel brandColor={brandColor} secondary={secondary} />
```

**Harmony Validation Rules (v11.4 - NEW):**
- PHẢI skip harmony validation (deltaE check) khi mode = 'single'
- CHỈ validate harmony khi mode = 'dual'
- Single mode với deltaE = 0 là expected → KHÔNG chặn lưu
- Dual mode với deltaE < 20 → VẪN chặn lưu (too similar)

**Pattern chuẩn (edit/create page validation):**
```typescript
if (mode === 'dual' && harmonyStatus.isTooSimilar) {
  toast.error(`deltaE=${harmonyStatus.deltaE} < 20...`);
  return;
}

if (accessibility.failing.length > 0) {
  toast.error(...);
  return;
}
```

**Ví dụ đúng:**
- Single mode: "Primary #00b315" (không có secondary row)
- Dual mode: "Primary #00b315" + "Secondary #ff6b35" + "Accent: P 26% / S 14% / N 60%"

**Ví dụ đúng (Stats pattern):**
```typescript
const resolveSecondary = (primary, secondary, mode, harmony) => {
  if (mode === 'single') {
    return primary;  // ✅ Monochromatic
  }

  if (secondary.trim() && isValidHexColor(secondary)) {
    return secondary;
  }

  return getHarmonyColor(primary, harmony);
};
```

**Anti-pattern (FAQ bug):**
```typescript
// ❌ CẤM: Tạo harmony color trong single mode
if (mode === 'single') {
  return getAnalogous(primary)[0];
}
```

### 6) Single Source of Truth

- Render ≡ Preview, dùng chung helper trong `_lib/colors.ts`
- Không hardcode màu ở site nếu preview đã dùng helper

### 7) Color Adjacency Rule (NEW v11.5)

**Quy tắc:** Khi dùng `primary` hoặc `secondary` ở dạng **solid**, nền hoặc border tiếp giáp phải là **neutral** (`#ffffff`, `#0f172a`, `#f8fafc`, `#e2e8f0`...), KHÔNG dùng tint/shade cùng family.

**Hợp lệ**
- `primary` icon/text trên `neutralSurface`
- `secondary` text trên `neutralSurface`
- `white` text/icon trên `primary` solid bg

**Vi phạm (cấm)**
- `primary` solid trên `primaryTint`
- `secondary` border trên `secondaryTint` background

**Ghi chú**
- Tint/shade vẫn dùng được như **surface độc lập** nếu không chứa solid cùng family.
- Rule này không thay thế APCA; chỉ bổ sung tính tinh tế và rõ ràng thị giác.

**Snippet chuẩn hóa**
```ts
// ❌ Anti-pattern
iconBg: getSolidTint(primary, 0.42),
iconColor: primary,

// ✅ Canonical
iconBg: neutralSurface,
iconColor: primary,
```

## Critical Safety Rules (v11.1)

### S1) Guard parse màu trước khi dùng OKLCH/APCA

- Không gọi trực tiếp `oklch(value).l` khi `value` có thể rỗng/invalid.
- Bắt buộc có `safeParseOklch(value, fallback)` hoặc guard tương đương.
- Rule áp dụng đặc biệt cho `site_brand_secondary` vì single mode có thể trả `''`.
- Anti-pattern mới (cấm): `oklch(x).l` khi chưa null-check/sanitize.

### S2) Resolve secondary theo mode trước khi build palette

- Bắt buộc gọi `resolveSecondaryForMode(primary, secondary, mode)` trước mọi `getTint/getGradient/getContrast`.
- `mode='single'`: dùng primary làm secondaryResolved.
- `mode='dual'`: dùng secondary nếu hợp lệ, fallback primary.

### S3) Edit page phải có dirty-state parity cho Save button

- Save button phải `disabled` khi pristine (không thay đổi dữ liệu).
- Pattern chuẩn: `initialData + hasChanges + reset sau save thành công`.
- Label chuẩn: `Đang lưu...` / `Lưu thay đổi` / `Đã lưu`.

---

## Tooling Add-ons (v11)

### Accent Prominence Calculator

- File: `examples/color-utils.ts`
- Dùng `calculateAccentBalance()` để tính % primary/secondary/neutral
- Warning nếu primary < 25% hoặc secondary < 5%

### Component Color Analyzer

- File: `examples/component-analyzer.ts`
- Dùng `analyzeComponentColors()` để tạo report nhanh (tỷ lệ + tier count)

### Color Harmony Validator

- Dùng `getHarmonyStatus()` để check ΔE
- ΔE < 20 → quá giống, cần đổi harmony
- `getTriadic()` để tạo option triadic

### Accessibility Score

- Dùng `getAccessibilityScore()` để kiểm tra tất cả text pairs
- Trả về minLc + danh sách fail

### Quick Fix Templates

- File: `examples/quick-fix-templates.md`
- Dùng khi cần fix nhanh primary/secondary/heading

---

## Anti AI-Styling Design Rules (STRICT)

### Tech Stack bắt buộc
- Shadcn/ui components + Tailwind CSS + Lucide React icons
- CSS Variables cho brand colors

### Mobile-First
- Design mobile first, scale up desktop
- Touch targets >= 44px
- `max-md:` cho mobile-specific overrides

### CẤM (AI Styling)
- NO gradient backgrounds loang màu (trừ gradient style có chủ đích)
- NO hover effects phức tạp (mobile không có hover)
- NO blur/backdrop-blur decorative
- NO drop-shadow-lg, shadow phức tạp nhiều lớp
- NO animate-pulse/scale decorative
- NO opacity layers chồng chéo
- NO opacity decorative (chỉ disabled state)
- NO box-shadow decorative (chỉ focus-ring nếu cần)
- NO rainbow/flashy accent colors
- NO group-hover:scale-105 trên text/numbers

### PHẢI (Enterprise UI)
- Flat design + subtle depth: `shadow-sm`, `border` nhẹ
- Whitespace > decoration (spacing 4/8/12/16/24/32px)
- 1 font family, 3-4 weights max
- Border-radius nhất quán: `rounded-lg` hoặc `rounded-xl`
- Contrast: Text >= 4.5:1, UI >= 3:1 (APCA)
- Skeleton loading thay spinner
- Transitions chỉ 150-300ms, chỉ cho state changes thật sự

### Scrollbar
- Width: 6px, track: transparent
- Thumb: muted 30% opacity, radius 3px

### Accessibility
- `aria-label` on icon-only buttons
- `focus-visible:ring-2` states
- Keyboard navigation
- Heading hierarchy (h1->h2->h3)

### Anti Opacity/Shadow Rules (STRICT - v11.2)

**CẤM tuyệt đối**:
- `${color}XX` opacity cho decorative elements (badge bg, borders, overlays)
- `box-shadow` nhiều lớp hoặc decorative depth
- `backdrop-blur`, `filter: blur()` decorative
- `opacity: 0.X` layers chồng chéo
- Gradient overlay với opacity

**CHỈ cho phép (functional only)**:
- `opacity` cho disabled state (0.4-0.5, rõ ràng)
- `shadow-sm` (0 1px 2px) cho focus ring nếu cần thiết
- Border opacity CHỈ khi background KHÔNG thể dùng solid

**Thay thế chuẩn**:
- Badge bg: Solid tint với `l+0.42` (OKLCH)
- Card border: Solid `#e2e8f0` (slate-200) hoặc tint với `l+0.45`
- Card depth: Border 1px solid, không shadow
- Gradient badge: White/slate-100 solid + border 1px rõ ràng

---

## Content-Aware Color Distribution

### Nguyên tắc: Đo màu ở trạng thái DATA ĐẦY ĐỦ

Tỷ lệ 60-30-10 phải đo tại trạng thái có data thật (ảnh, text, link đầy đủ),
KHÔNG tính placeholder vào tỷ lệ này.

### 2 Layer phân phối

**Layer 1: Content State (data đầy đủ) - ĐO TẠI ĐÂY**
- 60% Neutral: background page, card surface, text body
- 30% Primary: section headings (h2), CTA buttons, icon containers,
  active states, section accent border/line
- 10% Secondary: subtitles/labels, badges, tag labels,
  secondary buttons/links, decorative accents, hover accent

**Layer 2: Placeholder State (data trống) - KHÔNG tính vào tỷ lệ**
- Background: neutral tint (slate-100/200), KHÔNG dùng primary/secondary tint
- Icon: primary solid (hint cho user biết component thuộc brand nào)
- Text: neutral (slate-500)

---

## Component Color Map (Hiện trạng)

### Home Components - 4 nhóm

**Nhóm A: Primary-only** (secondary bị ignore `_secondary`)
| Component | P% | S% | Pattern | Last Updated | Status |
|---|---|---|---|---|---|
| Blog | 100 | 0 | brandColor cho borders, hover, badges, category tags | N/A | Needs Review |
| CaseStudy | 100 | 0 | brandColor cho borders, hover, badges, links | N/A | Needs Review |
| Benefits | 95 | 5 | brandColor dominant, secondary minimal | N/A | Needs Review |
| Team | 95 | 5 | brandColor dominant | N/A | Needs Review |

**Nhóm B: Secondary-dominant** (brandColor ít hoặc chỉ cho BrandBadge)
| Component | P% | S% | Pattern | Last Updated | Status |
|---|---|---|---|---|---|
| CategoryProducts | 5 | 95 | `_brandColor`, secondary cho tất cả UI | N/A | Needs Review |
| Features | 10 | 90 | `_brandColor`, secondary dominant | N/A | Needs Review |
| TrustBadges | 10 | 90 | brandColor chỉ trong BrandBadge | N/A | Needs Review |
| ServiceList | 10 | 90 | brandColor chỉ trong BrandBadge | N/A | Needs Review |
| Gallery | 5 | 95 | secondary cho borders, text, icons | N/A | Needs Review |
| Partners | 5 | 95 | secondary cho borders, animations | N/A | Needs Review |
| FAQ | 40 | 60 | secondary: expanded border/icon | 2026-02-17 | Fixed v11.3 (single mode) |
| Testimonials | 40 | 60 | secondary: quotes, rating stars | N/A | Needs Review |
| Services | 40 | 60 | secondary: numbers, accent bar, timeline | N/A | Needs Review |
| Footer | 30 | 70 | secondary: logo/dividers; brandColor: bg shade | N/A | Needs Review |
| Career | 40 | 60 | secondary cho borders, tags | N/A | Needs Review |
| Contact | 40 | 60 | secondary cho form elements | N/A | Needs Review |
| Process | 40 | 60 | secondary cho timeline, dots | N/A | Needs Review |

**Nhóm C: Balanced dual-brand** (~50/50)
| Component | P% | S% | Pattern | Last Updated | Status |
|---|---|---|---|---|---|
| Hero | 50 | 50 | Hệ thống color riêng (`_lib/colors.ts`) | N/A | Needs Review |
| Stats | 50 | 50 | Custom implementation | N/A | Needs Review |
| ProductList | 55 | 45 | P: titles/prices/buttons; S: labels/borders | N/A | Needs Review |
| ProductGrid | 50 | 50 | Pass-through | N/A | Needs Review |
| CTA | 60 | 40 | P: bg/buttons; S: title text/button text | 2026-02-17 | Fixed v11.4 (harmony validation) |
| About | 50 | 50 | Cả 2 cho accent bar, icons | N/A | Needs Review |
| Pricing | 45 | 55 | S: prices/ring; P: popular bg | N/A | Needs Review |
| SpeedDial | 50 | 50 | Cân bằng | N/A | Needs Review |
| Clients | 50 | 50 | Cân bằng | N/A | Needs Review |
| Video | 50 | 50 | Cân bằng | N/A | Needs Review |
| Countdown | 50 | 50 | Cân bằng | N/A | Needs Review |
| VoucherPromotions | 50 | 50 | Cân bằng | N/A | Needs Review |

### Status tracking

- Khi component đổi code màu: cập nhật `Last Updated` = `git log -1 --format=%cs <file>`
- Nếu pass checklist + balance + APCA: đặt `Status = OK`, ngược lại `Needs Review`

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
| Section title/heading | `brandColor` | Element lớn nhất, nhận diện thương hiệu |
| CTA button (primary action) | `brandColor` | Dominant action = primary brand |
| CTA button (secondary action) | `secondary` | Phân biệt rõ primary/secondary action |
| Icon container background | `brandColor` (10% opacity) | Brand hint |
| Active/selected state | `brandColor` | Primary feedback |
| Navigation arrows | `brandColor` border + icon | Interactive control |
| Interactive link (primary) | `brandColor` | Nhận diện action chính |
| Interactive link (secondary) | `secondary` | Action phụ, ít nổi bật |
| Section label/subtitle | `secondary` | Phân biệt với heading |
| Prices, số liệu nổi bật | `secondary` | Data highlight, contrast với heading |
| Data count/badge | `secondary` | Tăng focus cho dữ liệu |
| Badge outline (NEW, tag) | `secondary` border + text | Qua BrandBadge component |
| Badge solid (HOT, discount) | `brandColor` bg | Qua BrandBadge component |
| Card borders, hover glow | `secondary` (10-40% opacity) | Subtle accent |
| Divider/section line | `secondary` (10-30% opacity) | Structural separator |
| Timeline/process dots | `secondary` | Decorative, không dominant |
| Form focus ring | `secondary` | Subtle feedback |
| Pagination active dot | `secondary` | Tăng visibility (nhỏ) |
| Gradient accent line/bar | `brandColor → secondary` | Dual brand harmony |
| Footer background | Shade of `brandColor` (65%) | Dark brand tone |

**Rule bắt buộc**
- Heading (h2 section title) LUÔN dùng `brandColor`.
- Nếu heading dùng neutral (slate-900), KHÔNG dùng `secondary` cho heading.

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

### Pattern 4: Unsafe oklch parse -> safe parse

```ts
// BEFORE
const c = oklch(secondary);
const border = formatHex(oklch({ ...c, l: c.l + 0.35 }));

// AFTER
const c = safeParseOklch(secondary, primary);
const border = formatHex(oklch({ ...c, l: Math.min(c.l + 0.35, 0.98) }));
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
- `examples/component-analyzer.ts`
- `examples/quick-fix-templates.md`
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
