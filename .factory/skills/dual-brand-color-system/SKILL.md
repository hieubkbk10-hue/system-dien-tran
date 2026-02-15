---
name: dual-brand-color-system
description: Playbook thực chiến cho dual brand color systems trong UI/UX dựa trên Material Design 3, 60-30-10 rule, WCAG 2.2/3.0, semantic tokens và executable workflow. Dùng khi thiết kế/review hệ thống màu thương hiệu (primary + secondary), validate accessibility, chuẩn hóa design tokens, và tạo spec thực thi.
version: 4.0.0
---

# Dual Brand Color System Best Practices v4.0

## Quick Start Template

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        action: {
          primary: '#2563eb',
          secondary: '#7c3aed',
        },
        text: {
          primary: '#0f172a',
          secondary: '#64748b',
        },
      },
    },
  },
};

// 60-30-10: bg-white (60%) + text-primary-600 (30%) + bg-secondary-500 (10%)
```

## Overview

Skill này cung cấp hướng dẫn toàn diện về thiết kế hệ thống màu thương hiệu kép (primary + secondary) dựa trên:
- Material Design 3: dynamic color, tonal palettes, accessibility-first
- 60-30-10 Color Rule: phân bổ màu trong web UI
- WCAG 2.2 + APCA (WCAG 3.0): contrast và perceptual contrast
- Semantic Tokens: tách primitive/semantic/component
- Color Harmony Theory: analogous, split-complementary, triadic schemes

---

## Actionable Workflow (Step-by-step + Checklist)

### Step 1: Chọn Primary Brand Color

**Checklist:**
- [ ] Contrast vs trắng ≥ 4.5:1 (WCAG 2.2 AA)
- [ ] Contrast vs đen ≥ 4.5:1
- [ ] Saturation ≤ 80 (tránh quá chói)
- [ ] Phù hợp ngành & cảm xúc thương hiệu

```typescript
const validatePrimaryColor = (hex: string) => {
  const checks = {
    contrastVsWhite: getContrast(hex, '#ffffff') >= 4.5,
    contrastVsBlack: getContrast(hex, '#000000') >= 4.5,
    notTooSaturated: getSaturation(hex) <= 80,
  };
  return Object.values(checks).every(Boolean);
};

const brandColors = {
  primary: '#2563eb',
  secondary: '#8b5cf6',
};
```

**Decision Tree (ngành):**
```
Start → Industry?
  ├─ Tech/SaaS → Blue/Indigo
  ├─ Creative → Orange/Purple
  ├─ Finance → Blue/Green
  └─ Health → Green/Teal
```

### Step 2: Chọn Secondary Brand Color

**Ưu tiên:** Analogous (30–60°) → Split-Complementary → Monochromatic.

**Checklist:**
- [ ] Góc lệch màu 30–60° (analogous) hoặc 150° (split-complementary)
- [ ] Không clash với primary
- [ ] Dùng được cho CTA và highlight

```typescript
const brandSecondaryOptions = {
  analogous: '#8b5cf6',
  splitComplementary: '#f59e0b',
  monochromatic: '#60a5fa',
};
```

### Step 3: Tạo Tonal Palettes (50–950)

**Checklist:**
- [ ] Có đủ 10 shade
- [ ] Đảm bảo contrast trong light/dark
- [ ] 50–100 dùng làm surface, 600–700 dùng cho text/CTA

```typescript
const primary = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
  950: '#172554',
};
```

### Step 4: Map Semantic Tokens

**Checklist:**
- [ ] Không dùng hex trực tiếp trong component
- [ ] Có semantic tokens cho action/text/surface/border

```typescript
const primitive = { blue: { 600: '#2563eb' }, violet: { 600: '#7c3aed' } };
const semantic = {
  color: {
    action: { primary: primitive.blue[600], secondary: primitive.violet[600] },
    text: { heading: primitive.blue[600] },
  },
};
```

### Step 5: Áp dụng 60-30-10 & Validate

**Checklist:**
- [ ] Neutral 60% (background/surface)
- [ ] Primary 30% (text/headings/sections)
- [ ] Accent 10% (CTA/badges)
- [ ] Validate contrast cho CTA

```tsx
<section className="bg-slate-50">
  <h1 className="text-primary-600">Heading</h1>
  <p className="text-slate-600">Description</p>
  <button className="bg-secondary-500 text-white">CTA</button>
</section>
```

## Khi nào dùng skill này?

- Thiết kế hệ thống màu thương hiệu mới (brand colors)
- Review/refactor hệ thống màu hiện tại (cảm giác không hợp lý, không đẹp)
- Chọn màu phụ (secondary) từ màu chính (primary)
- Validate accessibility (contrast ratios, color blindness)
- Tạo design tokens cho design system
- Áp dụng màu vào UI components (buttons, badges, CTAs, backgrounds)

---

## Spec Writing Template

### Template Structure (copy-paste ready)

```markdown
# Spec: [Action] Dual-Brand Colors cho [Component/Feature]

## 📋 Tổng quan
[Mô tả ngắn gọn: refactor gì, bao nhiêu layouts, tuân thủ 60-30-10 rule]

**Files ảnh hưởng**:
- [file path] (line X-Y)
- [file path] (line A-B)

**Estimate**: ~X hours (Y layouts × Z mins/layout)

---

## 🎯 Mục tiêu
1. Tăng Primary visual weight từ ~X% lên **30%**
2. Giảm Secondary từ ~Y% xuống **10%**
3. [Mục tiêu cụ thể khác]

---

## 📊 Summary Table: Before vs After

| Element | Before | After | Rationale |
|---------|--------|-------|-----------|
| **Price** | Secondary ❌ | **Primary** ✅ | Commerce context - quan trọng nhất |
| **CTA Buttons** | Secondary ❌ | **Primary** ✅ | Action quan trọng |
| **Hover Border** | Secondary ✅ | Secondary ✅ | Subtle accent - giữ nguyên |

---

## 🛠️ Chi tiết thay đổi từng Layout

### **Layout 1: [Name]** (`render[Name]Style`)

#### **File**: `[path]`
#### **Lines**: [start-end]

#### **Changes**:

**1. [Element name]**:
```typescript
// BEFORE:
<button style={{ color: secondary }}>CTA</button>

// AFTER (PRIMARY for CTA):
<button style={{ color: brandColor }}>CTA</button>
```

**2. [Next element]**: ...

---

## ✅ Validation Checklist

Sau khi implement, verify:

- [ ] [Layout 1]: Price + CTA = primary, hover = secondary
- [ ] [Layout 2]: ...
- [ ] **Visual weight**: Primary ~30%, Secondary ~10%, Neutral 60%
- [ ] **TypeScript compile**: `bunx oxlint --type-check` passes

---

## 🔧 Implementation Steps

1. **Tìm và thay thế**: [pattern cụ thể]
   - Search: `[regex]`
   - Replace: `[code]`

2. **Fix [element]**: [hướng dẫn cụ thể]

3. **Verify visually**: Mở preview, check tất cả layouts
```

### When to use this template?

- Khi cần refactor colors cho 1 component có nhiều layouts (3-10 layouts)
- Khi cần document changes chi tiết để review sau
- Khi có nhiều patterns lặp lại (badges, prices, CTAs)

### Example từ codebase:

Xem: `.factory/docs/2026-02-15-fix-dual-brand-colors-cho-6-productlist-layouts.md`

---

## Commit Message Standards

### Format: Conventional Commits

```
<type>(<scope>): <subject>

[optional body - multi-line]

[optional stats]
```

### Types

| Type | Khi nào dùng | Example |
|------|-------------|---------|
| **fix** | Sửa bugs, rebalance colors | `fix(product-list): rebalance primary and secondary colors` |
| **feat** | Thêm features mới | `feat(home-components): add shared BrandColorHelpers` |
| **refactor** | Refactor code không đổi behavior | `refactor(stats): extract inline components to shared helpers` |
| **docs** | Chỉ update docs/specs | `docs(skills): upgrade dual brand color system v4.0` |

### Scopes (cho dual-brand color work)

- Component name: `product-list`, `stats`, `hero`, `product-categories`
- Feature area: `home-components`, `skills`, `admin`

### Subject Guidelines

- ✅ Imperative mood: "rebalance colors" (không phải "rebalanced")
- ✅ Lowercase, không dấu chấm cuối
- ✅ Max 50 chars
- ✅ Mô tả "what changed", không "why" (why để body)

### Multi-line Body (optional)

Dùng khi:
- Refactor nhiều layouts (≥6)
- Cần list components đã fix
- Có stats (lines changed, layouts count)

Format:
```
fix(product-list): rebalance primary and secondary colors

- Price: secondary → primary (commerce context)
- CTA buttons: secondary → primary (action importance)
- NEW badge: primary → secondary (alternate for variety)
- Navigation controls: secondary → primary (carousel)
- Apply 60-30-10 rule: Primary ~30%, Secondary ~10%

Changed: 6 layouts × ~8-10 changes/layout = 52 lines
```

### Real Examples từ codebase
Recent commits:

- `fix(product-list): rebalance primary and secondary colors`
- `fix(product-list): align preview colors and data`
- `fix(product-categories): use secondary for preview count`
- `fix(product-categories): align grid preview hover accent`
- `fix(product-categories): rebalance grid colors`

### Example commit messages

```bash
# Example 1: Simple fix (1 component)
git commit -m "fix(product-list): rebalance primary and secondary colors"

# Example 2: Large refactor (multi-component)
git commit -m "feat(home-components): apply dual brand color system to 23 components (138 layouts)

- Refactor Services, Benefits, FAQ, CTA, Testimonials, Contact, Gallery, Pricing, ProductList, ServiceList, Career, CaseStudy, SpeedDial, ProductCategories, CategoryProducts, Team, Features, Process, Clients, Video, Countdown, VoucherPromotions, Footer
- Replace all inline badge/stat/icon components with shared BrandColorHelpers
- Apply 60-30-10 color rule: primary (30% icons/CTA), secondary (10% accents/badges)
- Fix gradients to use primary+secondary combination
- Total: 23 components × 6 layouts = 138 layouts standardized"
```

### Checklist trước khi commit

- [ ] Subject ≤ 50 chars
- [ ] Type + scope đúng
- [ ] Imperative mood
- [ ] Body giải thích "what" nếu > 1 file changed
- [ ] Không có secrets/API keys trong diff (run `git diff --cached`)

---

## 2026 Trends & Best Practices

### 1) Adaptive Color Systems

- Palettes thay đổi theo context: `prefers-color-scheme`, `prefers-contrast`
- Dùng brand identity linh hoạt thay vì 1 “hero color” cố định
- Thích hợp cho sản phẩm dài giờ sử dụng (SaaS, admin)

```css
@media (prefers-contrast: more) {
  :root {
    --color-action-primary: #1d4ed8;
  }
}
```

### 2) Elevated Neutrals

- Tránh white thuần (#ffffff)
- Ưu tiên neutral mềm: `#fafafa`, `#f8fafc`, `#f1f5f9`

### 3) Semantic Token Architecture (3-tier)

1. **Primitive tokens**: raw color values
2. **Semantic tokens**: role-based
3. **Component tokens**: component-specific

```typescript
const primitive = { blue: { 600: '#2563eb' }, violet: { 600: '#7c3aed' } };
const semantic = { action: { primary: primitive.blue[600] } };
const component = { button: { bg: semantic.action.primary } };
```

## Core Principles

### 1) 60-30-10 Rule (quan trọng nhất)

Định nghĩa: quy tắc phân bổ màu sắc trong thiết kế.

```
60% - Dominant Color (Neutral/Base)
30% - Secondary Color (Supporting)
10% - Accent Color (High-contrast highlights)
```

Áp dụng vào web UI:

| Tỷ lệ | Màu | Dùng cho | Ví dụ |
|-------|-----|----------|-------|
| 60% | Neutral (white, gray, slate) | Backgrounds, white space, content areas | bg-white, bg-slate-50 |
| 30% | Primary brand color | Headings, primary sections, borders | text-blue-600, border-blue-200 |
| 10% | Accent/Secondary | CTAs, important actions, badges | bg-teal-500, text-violet-600 |

Sai lầm phổ biến:
- Dùng brand color cho 60% UI -> overwhelming.
- Dùng secondary cho 30% nhưng vẫn dùng primary cho CTA -> thiếu nhấn.

Lưu ý **visual weight**:
- Accent 10% nhưng nếu high-contrast thì “cảm giác” có thể ~30%.
- Đo bằng **độ nổi bật thị giác**, không chỉ diện tích.

Ví dụ đúng:
```tsx
// ❌ Sai: brand color chiếm 60%
<div className="bg-blue-600 min-h-screen" />

// ✅ Đúng: neutral 60%, primary 30%, accent 10%
<section className="bg-slate-50">
  <h1 className="text-primary-600">Title</h1>
  <p className="text-slate-600">Description</p>
  <button className="bg-secondary-500 text-white">CTA</button>
</section>
```

#### Visual Weight Formula (cân bằng thị giác)

```typescript
// Visual Weight = Area × Saturation × Brightness
function calculateVisualWeight(
  areaPercent: number,
  saturation: number,
  brightness: number
): number {
  return (areaPercent / 100) * (saturation / 100) * (brightness / 100);
}

const weights = {
  neutral: calculateVisualWeight(60, 0, 95),
  primary: calculateVisualWeight(30, 70, 60),
  accent: calculateVisualWeight(10, 90, 70),
};
```

Real-world breakdown:
- Facebook: white 60% + blue 30% + blue-dark 10%
- Coca-Cola: white 60% + red 30% + black 10%

---

### 2) Color Harmony Schemes

#### Analogous (khuyến nghị cho brand colors)

Định nghĩa: 2-3 màu kề nhau trên color wheel (30-60 độ).

Ưu điểm:
- Hài hòa, dễ nhìn, không jarring
- Phù hợp brand identity chuyên nghiệp
- Dễ tạo tonal palettes
- Accessibility dễ kiểm soát

Ví dụ:
```
Primary: #3b82f6 (Blue 500)
Secondary: #8b5cf6 (Violet 500) hoặc #0ea5e9 (Sky 500)
```

#### Split-Complementary (cân bằng contrast + harmony)

Định nghĩa: base color + 2 màu kề bên complement.

Ưu điểm:
- Contrast cao hơn analogous nhưng ít jarring hơn complementary
- Phù hợp creative industries

#### Complementary (không khuyến nghị cho brand colors)

Định nghĩa: 2 màu đối diện trên color wheel (180 độ).

Nhược điểm:
- Quá vibrant, clashing
- Gây eye strain khi xem lâu
- Khó maintain accessibility

Chỉ dùng cho small accents (duy nhất 5-10% UI).

---

### Conflict Resolution Patterns (khi 2 màu clash)

**Pattern 1: Neutral Buffer**
```tsx
// ❌ Clash
<div className="bg-blue-500">
  <button className="bg-orange-500">CTA</button>
</div>

// ✅ Neutral buffer
<div className="bg-blue-50">
  <button className="bg-orange-500">CTA</button>
</div>
```

**Pattern 2: Tint/Shadow Adjustment**
```tsx
<div className="bg-blue-500">
  <button className="bg-orange-600 border-2 border-white">CTA</button>
</div>
```

**Decision Matrix:**
| Context | Primary Use | Secondary Use |
|---------|-------------|---------------|
| Headings | 70% primary | 30% secondary |
| CTAs | 30% primary | 70% secondary |
| Badges | 50/50 split | Contextual |
| Backgrounds | Tints only | Avoid saturated |

#### Monochromatic (tối giản)

Định nghĩa: tints/shades của 1 màu.

Ưu điểm:
- Elegant, minimalist
- Dễ maintain consistency

Nhược điểm:
- Thiếu visual interest nếu cần 2 màu rõ rệt

---

### 3) Material Design 3 Color System

Tonal palettes (50-950 scale) từ 1 seed color:

```typescript
const primary = {
  50:  '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
  950: '#172554',
};
```

Color roles (semantic tokens):
- primary / on-primary
- primary-container / on-primary-container
- secondary / on-secondary
- surface / on-surface

Khuyến nghị: dùng semantic tokens, không hard-code hex.

---

### 4) Semantic Tokens Implementation

```typescript
// Tier 1: Primitive
const primitive = {
  blue: { 500: '#3b82f6', 600: '#2563eb' },
  violet: { 500: '#8b5cf6', 600: '#7c3aed' },
};

// Tier 2: Semantic
const semantic = {
  color: {
    action: { primary: primitive.blue[600] },
    text: { heading: primitive.blue[600] },
  },
};

// Tier 3: Component
const component = {
  button: { bg: semantic.color.action.primary },
};
```

Naming conventions:
- ✅ `text-primary`, `action-primary`, `border-subtle`
- ❌ `blue-500`, `color-1`, `main-color`

#### Naming conventions (3-tier chi tiết)
```typescript
const primitive = {
  'primitive-color-blue-50': '#eff6ff',
  'primitive-color-blue-500': '#3b82f6',
  'primitive-spacing-2': '0.5rem',
};

const semantic = {
  'semantic-color-action-primary': primitive['primitive-color-blue-500'],
  'semantic-color-text-heading': primitive['primitive-color-slate-900'],
  'semantic-spacing-component-gap': primitive['primitive-spacing-2'],
};

const component = {
  'component-button-bg': semantic['semantic-color-action-primary'],
  'component-button-padding': semantic['semantic-spacing-component-gap'],
};
```

#### Tailwind Integration
```typescript
// tailwind.config.ts
import { semantic } from './tokens';

export default {
  theme: {
    extend: {
      colors: {
        action: {
          primary: semantic['semantic-color-action-primary'],
          secondary: semantic['semantic-color-action-secondary'],
        },
      },
    },
  },
};
```

#### Migration Checklist
- [ ] Audit codebase: tìm hard-coded colors (`#[0-9a-f]{6}`)
- [ ] Tạo primitive tokens từ unique colors
- [ ] Map semantic meanings (action, text, border, surface)
- [ ] Replace hard-coded → semantic tokens
- [ ] Setup ESLint rule để prevent future hard-coding

---

### 5) WCAG Accessibility Standards

Contrast ratios:

| Level | Normal Text | Large Text | UI Components |
|-------|-------------|------------|---------------|
| AA | 4.5:1 | 3:1 | 3:1 |
| AAA | 7:1 | 4.5:1 | - |

So sánh WCAG 2.2 vs 3.0 (APCA):

| Standard | Method | Pros | Cons |
|----------|--------|------|------|
| WCAG 2.2 | Contrast ratio | Widely adopted | Không perceptually uniform |
| WCAG 3.0 | APCA (Lc 60/75) | Chính xác hơn | Still evolving |

#### APCA Quick Reference (thực chiến)
| Font Size | Font Weight | Min Lc (APCA) | WCAG 2.2 Equiv |
|-----------|-------------|---------------|----------------|
| 12–14px | 400–500 | Lc 90 | ~7:1 |
| 14–16px | 400–500 | Lc 75 | ~4.5:1 |
| 16–18px | 400–500 | Lc 60 | ~3:1 |
| 18px+ | 400–500 | Lc 60 | ~3:1 |
| Any size | 700+ | Lc 60 | ~3:1 |

#### APCA Calculator (JS snippet)
```typescript
function calculateAPCA(fgColor: string, bgColor: string): number {
  const fgY = sRGBtoY(hexToRgb(fgColor));
  const bgY = sRGBtoY(hexToRgb(bgColor));
  const Lc = bgY > fgY
    ? (bgY ** 0.56 - fgY ** 0.57) * 1.14
    : (bgY ** 0.65 - fgY ** 0.62) * 1.14;
  return Math.abs(Lc * 100);
}

const score = calculateAPCA('#2563eb', '#ffffff');
const pass = score >= 75;
```

Tools:
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- APCA Calculator: https://www.myndex.com/APCA/
- Accessibility.build: https://accessibility.build/tools/contrast-checker
- Chrome DevTools (Lighthouse)
- Figma Stark plugin

Color blindness testing:
- Không dùng chỉ màu để convey information
- Thêm icons/text labels
- Test bằng Chrome DevTools Rendering > Emulate vision deficiencies

---

## Implementation Workflow

### Step 1: Chọn Primary Brand Color

Tiêu chí:
1. Brand identity (industry, emotion)
2. Accessibility (tránh màu sáng quá dễ fail contrast)
3. Competitor analysis

Tool:
- Adobe Color (extract từ logo): https://color.adobe.com

Ví dụ màu dễ pass WCAG:
- Blue 600: #2563eb
- Green 600: #16a34a
- Orange 600: #ea580c
- Violet 600: #7c3aed

### Step 2: Generate Secondary Color

Tool:
- Realtime Colors (preview UI): https://realtimecolors.com

Decision tree:
```
Nếu cần harmonious -> Analogous (30-60 độ)
Nếu cần dynamic -> Split-Complementary (150 độ)
Nếu cần minimal -> Monochromatic (lighten/darken)
Tránh Complementary (180 độ) cho brand colors
```

### Step 3: Create Tonal Palettes

Generate 10 shades (50-950) cho primary và secondary.

Tool:
- Material Theme Builder: https://m3.material.io/theme-builder

### Step 4: Define Semantic Tokens

```typescript
colors: {
  primary: {
    DEFAULT: '#3b82f6',
    50: '#eff6ff',
    // ...
  },
  secondary: {
    DEFAULT: '#8b5cf6',
    // ...
  },
  accent: {
    DEFAULT: '#0ea5e9',
  },
  neutral: {
    DEFAULT: '#f8fafc',
  },
}
```

Tool:
- Figma Design Token Generator (plugin)

### Step 5: Apply 60-30-10 Rule

```tsx
<section className="bg-white">
  <h1 className="text-primary-600">Title</h1>
  <button className="bg-secondary-500 text-white">CTA</button>
  <span className="text-secondary-600">Badge</span>
</section>
```

### Step 6: Validate Accessibility

Checklist:
- Primary vs white >= 4.5:1
- Secondary vs white >= 4.5:1
- Button text vs button bg >= 4.5:1
- Test color blindness simulators

Tools:
- Color Palette Checker: https://color-contrast-checker.deque.com/
- AccessibleColor: https://accessiblecolor.design/

---

## Code Refactoring Patterns

### Pattern 1: Price color (Secondary → Primary)

**Context**: E-commerce components (ProductList, Services, Pricing)
**Rationale**: Price là primary action trong commerce → dùng primary color (30% visual weight)

**Search (regex)**:
```bash
# Tìm tất cả price elements dùng secondary
grep -n "price.*secondary" app/admin/home-components/previews.tsx
grep -n "style={{ color: secondary }}.*price" components/site/ComponentRenderer.tsx
```

**Before**:
```typescript
<span className="font-bold" style={{ color: secondary }}>{item.price}</span>
```

**After**:
```typescript
<span className="font-bold" style={{ color: brandColor }}>{item.price}</span>
```

**Files thường gặp**:
- `app/admin/home-components/previews.tsx` (ProductList, ServiceList)
- `components/site/ComponentRenderer.tsx` (Pricing, ProductCategories)

---

### Pattern 2: CTA Buttons (Secondary → Primary)

**Context**: All components với action buttons
**Rationale**: CTA = primary action → primary color (30%)

**Search**:
```bash
grep -n "Xem chi tiết.*secondary" **/*.tsx
grep -n "button.*backgroundColor: secondary" **/*.tsx
```

**Before**:
```typescript
<button 
  style={{ borderColor: `${secondary}20`, color: secondary }}
  onMouseEnter={(e) => { 
    e.currentTarget.style.borderColor = secondary; 
    e.currentTarget.style.backgroundColor = `${secondary}08`; 
  }}
>
  Xem chi tiết
</button>
```

**After**:
```typescript
<button 
  style={{ borderColor: `${brandColor}20`, color: brandColor }}
  onMouseEnter={(e) => { 
    e.currentTarget.style.borderColor = brandColor; 
    e.currentTarget.style.backgroundColor = `${brandColor}08`; 
  }}
  onMouseLeave={(e) => { 
    e.currentTarget.style.borderColor = `${brandColor}20`; 
    e.currentTarget.style.backgroundColor = 'transparent'; 
  }}
>
  Xem chi tiết
</button>
```

**Note**: Phải update CẢ onMouseEnter VÀ onMouseLeave handlers.

---

### Pattern 3: Badges Alternating (Primary/Secondary mix)

**Context**: Components có nhiều badge types (NEW, HOT, SALE, discount)
**Rationale**: Variety + 10% secondary rule

**Search**:
```bash
grep -n "BrandBadge.*tag.*new" **/*.tsx
grep -n "BrandBadge.*tag.*hot" **/*.tsx
```

**Before** (tất cả dùng primary):
```typescript
{discount && <BrandBadge text={discount} variant="solid" brandColor={brandColor} />}
{item.tag === 'new' && <BrandBadge text="NEW" variant="outline" brandColor={brandColor} />}
{item.tag === 'hot' && <BrandBadge text="HOT" variant="solid" brandColor={brandColor} />}
```

**After** (alternate colors):
```typescript
{discount && <BrandBadge text={discount} variant="solid" brandColor={brandColor} secondary={secondary} />}
{item.tag === 'new' && <BrandBadge text="NEW" variant="outline" brandColor={secondary} secondary={secondary} />}
{item.tag === 'hot' && <BrandBadge text="HOT" variant="solid" brandColor={brandColor} secondary={secondary} />}
```

**Rule**:
- **Discount/SALE/HOT**: Primary (urgent, important)
- **NEW**: Secondary (subtle, informational)

---

### Pattern 4: Navigation Controls (Secondary → Primary)

**Context**: Carousel, pagination controls
**Rationale**: Navigation = important UI controls → primary (30%)

**Search**:
```bash
grep -n "ChevronLeft.*secondary" **/*.tsx
grep -n "ChevronRight.*secondary" **/*.tsx
```

**Before**:
```typescript
<ChevronLeft size={16} style={{ color: secondary }} />
<button style={{ backgroundColor: secondary }}>
  <ChevronRight size={18} />
</button>

// Dots
<button style={i === 0 ? { backgroundColor: secondary } : {}} />
```

**After**:
```typescript
<ChevronLeft size={16} style={{ color: brandColor }} />
<button style={{ backgroundColor: brandColor }}>
  <ChevronRight size={18} />
</button>

// Dots
<button style={i === 0 ? { backgroundColor: brandColor } : {}} />
```

---

### Pattern 5: Hover States (giữ Secondary - subtle accent)

**Context**: Border hover, background hover
**Rationale**: Hover = subtle feedback → secondary (10% accent)

**KHÔNG ĐỔI** - These are correct:
```typescript
// ✅ Border hover - giữ secondary
onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${secondary}20`; }}

// ✅ Background tint - giữ secondary
style={{ backgroundColor: `${secondary}08` }}

// ✅ Hover shadow - giữ secondary
style={{ '--hover-border': `${secondary}20` }}
```

**Rationale**: Hover effects là decorative (10%), không phải primary actions (30%).

---

### Pattern 6: Hero Card CTAs (context-aware)

**Context**: Bento/Showcase layouts với featured cards
**Rationale**: Hero CTA = primary action → primary color

**Before**:
```typescript
// Featured card CTA
<button style={{ backgroundColor: secondary }}>
  Xem chi tiết
</button>
```

**After**:
```typescript
// Hero featured CTA = PRIMARY
<button style={{ backgroundColor: brandColor }}>
  Xem chi tiết
</button>

// Small cards hover = SECONDARY (subtle)
<div style={{ backgroundColor: `${secondary}08` }}>
  // hover state
</div>
```

---

### Quick Reference: What uses Primary vs Secondary?

| Element | Color | Visual Weight | Rationale |
|---------|-------|---------------|-----------|
| Prices | **Primary** | 30% | Commerce - most important |
| CTA Buttons | **Primary** | 30% | Primary actions |
| Headings | **Primary** | 30% | Structure |
| Navigation | **Primary** | 30% | Controls |
| Discount/HOT badges | **Primary** | 30% | Urgent |
| NEW badges | **Secondary** | 10% | Informational |
| Hover borders | **Secondary** | 10% | Subtle feedback |
| Hover backgrounds | **Secondary** | 10% | Decorative |
| Small accents | **Secondary** | 10% | Visual variety |

---

### Validation Commands

**After refactoring, run**:

```bash
# 1. TypeScript compile check
bunx oxlint --type-aware --type-check --fix

# 2. Find remaining hard-coded colors (should be zero)
grep -n "color: ['\"]#" app/admin/home-components/previews.tsx
grep -n "backgroundColor: ['\"]#" components/site/ComponentRenderer.tsx

# 3. Count usage of shared components
grep -c "BrandBadge" app/admin/home-components/previews.tsx
grep -c "brandColor" app/admin/home-components/previews.tsx
grep -c "secondary" app/admin/home-components/previews.tsx

# 4. Verify no stray secondary on prices/CTAs
grep -n "price.*secondary" **/*.tsx  # Should be zero

```

## Batch Prioritization Strategy

### When to use batching?

- Refactor ≥ 10 components cùng lúc
- Time estimate > 3 hours
- Need to track progress systematically

### Classification Matrix

| Priority | Criteria | Examples | Estimate/component |
|----------|----------|----------|-------------------|
| **High** | User-facing, commerce-critical, high traffic | ProductList, Pricing, Hero, CTA | 15-20 mins |
| **Medium** | User-facing, moderate traffic | Services, Benefits, FAQ, Testimonials, Contact | 10-15 mins |
| **Low** | Admin-only, utility, low traffic | Gallery, Video, Countdown, Footer | 5-10 mins |

### Decision Tree

```
Start → Component có e-commerce elements (price, cart, checkout)?
  ├─ YES → HIGH priority
  └─ NO → Component user-facing trên homepage?
      ├─ YES → MEDIUM priority
      └─ NO → LOW priority
```

### Batch Template

```markdown
### BATCH 1: HIGH PRIORITY (X components, Y layouts)

#### **Component 1: [Name]** (Z layouts)
**Line**: [start-end] trong [file]  
**Preview**: Line [start-end] trong previews.tsx

**Patterns cần fix**:
1. **[Layout 1]**: [Issue] → [Solution]
2. **[Layout 2]**: [Issue] → [Solution]

**Actions**:
- Import `{ ... }` từ shared
- Replace [pattern X]
- Verify [specific checks]

---

#### **Component 2: [Name]** ...
```

### Example từ codebase

Xem: `.factory/docs/2026-02-14-full-refactor-dual-brand-color-system-23-components-138-layouts.md`

**Batch breakdown**:
- Batch 1 (High): 6 components, 36 layouts, 1.5-2 hours
- Batch 2 (Medium): 9 components, 54 layouts, 2-2.5 hours
- Batch 3 (Low): 8 components, 48 layouts, 1.5-2 hours

**Estimation formula**:
```
Time (hours) = (Layouts × 2 mins) / 60
Components in batch = Time budget / Avg time per component
```

### Progress Tracking

Create checklist:
```markdown
## Progress

### Batch 1: High Priority
- [x] Component 4: Services (6 layouts) - 18 mins
- [x] Component 5: Benefits (6 layouts) - 15 mins
- [ ] Component 7: CTA (6 layouts)
- [ ] Component 9: Contact (6 layouts)
- [ ] Component 12: Pricing (6 layouts)
- [ ] Component 19: ProductCategories (6 layouts)

**Status**: 2/6 done (33%)
```

---

## Validation & QA Workflow

### Pre-commit Validation (MUST RUN)

#### Step 1: TypeScript Compile

```bash
bunx oxlint --type-aware --type-check --fix
```

**Expected output**:
```
✔ Linting completed in XXXms.
Found 0 warnings and 0 errors.
```

**If errors**: Fix trước khi tiếp tục. Common issues:
- Missing imports
- Type mismatches (`brandColor` vs `secondary` props)
- Undefined variables

---

#### Step 2: Hard-coded Color Audit

```bash
# Check for stray hex colors (should be ZERO)
grep -n "backgroundColor: ['\"]#" app/admin/home-components/previews.tsx
grep -n "color: ['\"]#" components/site/ComponentRenderer.tsx

# Check for hard-coded Tailwind colors (should minimize)
grep -n "bg-blue-" **/*.tsx | grep -v "bg-slate" | grep -v "bg-white"
```

**Expected**: Zero results. If found, replace với `brandColor` hoặc `secondary`.

---

#### Step 3: Pattern Compliance Check

```bash
# Prices should use PRIMARY (brandColor)
grep -n "price.*secondary" **/*.tsx
# Expected: ZERO (except old code not yet refactored)

# CTAs should use PRIMARY
grep -n "Xem chi tiết.*style={{ color: secondary" **/*.tsx
# Expected: ZERO (except hover states with onMouseEnter)

# NEW badges should use SECONDARY
grep -n "tag === 'new'.*brandColor={brandColor}" **/*.tsx
# Expected: ZERO (should be brandColor={secondary})
```

---

#### Step 4: Visual Weight Estimation

Manual check (sample 3-5 layouts):

**Checklist**:
- [ ] Neutral backgrounds (white/slate) ≈ 60% screen area
- [ ] Primary elements (headings/prices/CTAs) ≈ 30% visual weight
- [ ] Secondary accents (badges/hover/borders) ≈ 10% visual weight

**Tool**: Screenshot + color picker in DevTools
**Method**: Count pixels hoặc visual estimation

---

### Post-commit Validation (OPTIONAL)

#### Visual Regression Testing

**Manual**:
1. Open preview: `http://localhost:3000/admin/home-components/[id]/edit`
2. Switch between styles (minimal, commerce, bento, etc.)
3. Verify:
   - [ ] Prices are primary color (not secondary)
   - [ ] CTAs are primary color
   - [ ] Hover states are subtle (secondary)
   - [ ] NEW badges are secondary
   - [ ] No jarring color clashes

**Automated** (if available):
```bash
npm run test:visual  # Playwright/Chromatic screenshots
```

---

#### Contrast Validation

**Tools**:
- Chrome DevTools > Lighthouse > Accessibility audit
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

**Checklist**:
- [ ] Primary color vs white ≥ 4.5:1 (WCAG AA)
- [ ] Secondary color vs white ≥ 4.5:1
- [ ] Button text vs button bg ≥ 4.5:1

---

### Rollback Procedure (if validation fails)
```bash
# 1. Check current changes
git status
git diff

# 2. If TypeScript errors unfixable, rollback
git restore [file]

# 3. If partial commit needed, stage selectively
git add -p [file]  # Interactive staging

# 4. Commit working changes only
git commit -m "partial: [scope]: [what works]"
```

---

### Success Criteria Checklist

Before marking task "DONE":

- [ ] **Zero TypeScript errors** - `bunx oxlint --type-check` passes
- [ ] **Zero hard-coded hex colors** - grep returns empty
- [ ] **Pattern compliance** - prices/CTAs use primary, NEW badges use secondary
- [ ] **60-30-10 visual weight** - manual check on 3 layouts
- [ ] **Contrast WCAG AA** - primary/secondary ≥ 4.5:1 vs white
- [ ] **Commit message** - follows conventional commits format
- [ ] **Spec documented** - nếu refactor ≥3 layouts, có spec file

---

### Common Validation Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Property 'secondary' does not exist` | Missing prop in component | Add `secondary?: string` to type |
| `grep finds "price.*secondary"` | Chưa refactor hết | Replace với `brandColor` |
| Visual: Price không nổi bật | Dùng secondary thay vì primary | Check rationale: commerce → primary |
| Contrast fail (<4.5:1) | Màu quá nhạt | Darken primary/secondary hoặc dùng tint |

---

## Quick Reference

Decision matrix:

| Goal | Scheme | Primary -> Secondary | Best for |
|------|--------|----------------------|----------|
| Professional, cohesive | Analogous | Blue -> Violet/Sky | Tech, SaaS, Corporate |
| Creative, dynamic | Split-Complementary | Blue -> Yellow-Orange | Creative, Marketing |
| Elegant, minimal | Monochromatic | Blue 500 -> Blue 300 | Luxury, Portfolio |

Common mistakes:
- Complementary colors cho brand identity
- Brand color cho 60% UI
- Không tạo tonal palette
- Contrast ratio thấp
- Dựa vào màu duy nhất để convey states

Tools:
- Realtime Colors: https://realtimecolors.com
- Coolors: https://coolors.co
- Adobe Color: https://color.adobe.com
- Material Theme Builder: https://m3.material.io/theme-builder
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

---

## Real-World Examples

### Facebook

- Primary: #1877F2
- Neutral: #FFFFFF
- Scheme: Monochromatic + neutral

```tsx
<header className="bg-white">
  <h1 className="text-[#1877F2]">Brand</h1>
  <button className="bg-[#1877F2] text-white">Action</button>
</header>
```

### Coca-Cola

- Primary: #F40009
- Neutral: #FFFFFF
- Scheme: Complementary avoided, focus on bold primary

```tsx
<section className="bg-white">
  <h2 className="text-[#F40009]">Headline</h2>
  <button className="bg-[#F40009] text-white">CTA</button>
</section>
```

### Spotify

- Primary: #1DB954
- Neutral: #000000
- Scheme: Analogous + strong neutral

```tsx
<section className="bg-black text-white">
  <button className="bg-[#1DB954] text-black">Play</button>
</section>
```

### Stripe

- Primary: #635BFF
- Neutral: #F6F9FC
- Scheme: Analogous (purple → indigo)

```tsx
<section className="bg-[#F6F9FC]">
  <h2 className="text-[#635BFF]">Payments</h2>
  <button className="bg-[#635BFF] text-white">Start</button>
</section>
```

---

## Common Mistakes & Solutions

| Mistake | Problem | Solution |
|---------|---------|----------|
| Brand color chiếm 60% | Eye strain, overwhelming | Neutral 60%, brand 30% |
| Complementary colors | Clashing | Analogous (30-60°) |
| Hard-code hex | Không scalable | Semantic tokens |
| Không validate contrast | Accessibility fail | Dùng checker sớm |
| Palette chỉ 3 shades | Thiếu flexibility | Generate 10 shades |

---

## Anti-patterns Gallery

```tsx
// ❌ Brand color chiếm 60% UI
<section className="bg-primary-600 min-h-screen" />

// ✅ Neutral 60%, brand 30%, accent 10%
<section className="bg-slate-50">
  <h1 className="text-primary-600">Heading</h1>
  <button className="bg-secondary-500 text-white">CTA</button>
</section>

// ❌ Hard-coded colors
<button style={{ backgroundColor: '#3b82f6' }}>Click</button>

// ✅ Semantic tokens
<button className="bg-action-primary">Click</button>

// ❌ Không có tonal palette
const colors = { primary: '#3b82f6' };

// ✅ Có đủ 10 shades
const colors = { primary: { 50: '#eff6ff', /* ... */, 900: '#1e3a8a' } };
```

---

## Tools Reference

### Color Palette Generators
- Realtime Colors: https://realtimecolors.com
- Coolors: https://coolors.co
- Adobe Color: https://color.adobe.com
- UX Palette Generator: https://palettegenerator.com

### Semantic Token Tools
- Material Theme Builder: https://m3.material.io/theme-builder
- Figma Design Token Generator (plugin)

### Accessibility Validators
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- APCA Calculator: https://www.myndex.com/APCA/
- Accessibility.build: https://accessibility.build/tools/contrast-checker
- Deque Color Contrast Checker: https://color-contrast-checker.deque.com/
- AccessibleColor: https://accessiblecolor.design/

### Color Space Tools
- OKLCH Picker: https://oklch.com

---

## Tools Integration Pipeline

```bash
# Export từ Figma (Tokens Studio)
figma-tokens export --format json

# Transform sang CSS variables
tokens-transformer tokens.json --output styles/tokens.css

# Generate TypeScript types
tokens-types tokens.json --output types/tokens.ts

# Validate contrast
npm run validate:contrast
```

```yaml
name: Validate Design Tokens
on: [pull_request]
jobs:
  contrast-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run validate:contrast
      - run: npm run lint:no-hardcoded-colors
```

---

## Troubleshooting Guide

### Problem 1: TypeScript error "Property 'secondary' does not exist"

**Symptom**:
```
Type '{ brandColor: string; }' is missing property 'secondary'
```

**Root Cause**: Component expects both `brandColor` AND `secondary` props nhưng chỉ pass 1.

**Solutions**:

**Option A: Update component call**
```typescript
// BEFORE
<BrandBadge text="NEW" brandColor={secondary} />

// AFTER
<BrandBadge text="NEW" brandColor={secondary} secondary={secondary} />
```

**Option B: Make secondary optional in type**
```typescript
type Props = {
  brandColor: string;
  secondary?: string;
};
```

---

### Problem 2: Colors không thay đổi sau refactor

**Symptom**: Đã đổi code từ `secondary` → `brandColor` nhưng UI vẫn hiển thị màu cũ.

**Root Causes**:

1. **Cache không clear**: Next.js dev server cache  
   **Fix**: Restart dev server `npm run dev`

2. **Inline styles override**: CSS specificity  
   **Fix**: Check DevTools > Computed styles, tìm override

3. **Đổi nhầm file**: Preview vs Frontend  
   **Fix**: Verify file path, có thể cần đổi CẢ 2 files:
   - `app/admin/home-components/previews.tsx` (admin preview)
   - `components/site/ComponentRenderer.tsx` (frontend render)

4. **Variable shadowing**: Local `secondary` variable override prop  
   **Fix**: Rename local variable

---

### Problem 3: Visual weight vẫn không đúng 60-30-10

**Symptom**: Primary color vẫn chiếm quá ít hoặc quá nhiều.

**Diagnostic Steps**:

1. **Count elements**:
   ```bash
   grep -c "brandColor" [file]  # Should be ~30% of total color usage
   grep -c "secondary" [file]   # Should be ~10%
   ```

2. **Check saturation**: Primary quá nhạt → tăng visual weight bằng darker shade  
   ```typescript
   // Nếu primary-500 quá nhạt
   // BEFORE: bg-primary-500
   // AFTER: bg-primary-600 (darker = more weight)
   ```

3. **Check area coverage**: CTA button nhỏ → tăng size hoặc số lượng  
   ```typescript
   // Tăng size button
   className="px-8 py-4"  // Instead of px-4 py-2
   ```

**Root Cause Decision Tree**:
```
Visual weight sai?
├─ Primary quá ít?
│  ├─ Elements đủ nhưng màu nhạt? → Darken shade
│  └─ Elements quá ít? → Add more primary elements (icons, borders)
└─ Primary quá nhiều?
   ├─ Background dùng primary? → Replace với neutral
   └─ Quá nhiều CTAs? → Merge hoặc prioritize
```

---

### Problem 4: Hover states không work

**Symptom**: `onMouseEnter` set color nhưng hover không đổi màu.

**Root Cause**: Missing `onMouseLeave` handler → state stuck.

**Fix**:
```typescript
// BEFORE (incomplete)
<button
  onMouseEnter={(e) => { e.currentTarget.style.borderColor = brandColor; }}
>

// AFTER (complete)
<button
  onMouseEnter={(e) => { 
    e.currentTarget.style.borderColor = brandColor;
    e.currentTarget.style.backgroundColor = `${brandColor}08`;
  }}
  onMouseLeave={(e) => { 
    e.currentTarget.style.borderColor = `${brandColor}20`;
    e.currentTarget.style.backgroundColor = 'transparent';
  }}
>
```

**Pro tip**: Use CSS `:hover` thay vì inline handlers nếu có thể:
```typescript
<button 
  className="border-2 hover:border-primary-600 transition-colors"
  style={{ borderColor: `${brandColor}20` }}
>
```

---

### Problem 5: Badges tất cả cùng màu → nhàm chán

**Symptom**: 10 badges cùng primary color → monotonous.

**Solution**: Alternate primary/secondary theo badge type.

**Pattern**:
```typescript
// Urgent/action badges → PRIMARY
{discount && <BrandBadge brandColor={brandColor} />}
{item.tag === 'hot' && <BrandBadge brandColor={brandColor} />}
{item.tag === 'sale' && <BrandBadge brandColor={brandColor} />}

// Informational badges → SECONDARY
{item.tag === 'new' && <BrandBadge brandColor={secondary} />}
{item.featured && <BrandBadge text="Featured" brandColor={secondary} />}
```

**Rationale**: Mix creates visual variety while respecting 60-30-10 (primary dominant, secondary accent).

---

### Problem 6: Contrast fail WCAG

**Symptom**: Lighthouse report "Background and foreground colors do not have sufficient contrast ratio"

**Diagnostic**:
```bash
# Test contrast with WebAIM
# Primary: #[hex] on white #ffffff
# Expected: ≥ 4.5:1 for AA
```

**Solutions**:

**Option A: Darken color**
```typescript
// BEFORE: primary-400 (#60a5fa) - contrast 3.2:1 ❌
// AFTER: primary-600 (#2563eb) - contrast 4.8:1 ✅
```

**Option B: Change background**
```typescript
// BEFORE: text-primary-500 on bg-white
// AFTER: text-white on bg-primary-600 (inverse)
```

**Option C: Add border/shadow**
```typescript
<button className="border-2 border-slate-200">
  {/* Border tăng contrast perceived */}
</button>
```

---

### Problem 7: "Màu đẹp trong Figma nhưng xấu khi code"
**Root Cause**: Figma dùng color profile khác browser, hoặc không test dark mode.

**Solutions**:

1. **Export hex chính xác**: Figma > Copy CSS > Verify hex matches
2. **Test trong browser**: Không tin Figma 100%, luôn verify localhost
3. **Test dark mode**: `prefers-color-scheme: dark`
4. **Test màn hình khác nhau**: Laptop vs external monitor (color accuracy varies)

---
### Emergency Rollback Checklist
Nếu sau khi refactor, UI break hoàn toàn:

1. **Check git diff**:
   ```bash
   git diff HEAD
   ```

2. **Identify breaking change** (usually missing prop hoặc wrong variable)

3. **Partial rollback**:
   ```bash
   git restore --patch [file]  # Chọn hunks để restore
   ```

4. **Or full rollback**:
   ```bash
   git restore [file]
   git clean -fd  # Remove untracked files
   ```

5. **Restart dev server**: `npm run dev`

---

### Debugging Commands Reference

```bash
# Find all color usages
grep -rn "brandColor\|secondary" app/ components/

# Find hard-coded colors
grep -rn "color: ['\"]#" app/ components/

# Find hover handlers
grep -rn "onMouseEnter\|onMouseLeave" app/

# Count pattern usage
grep -c "BrandBadge" [file]

# Find missing types
bunx oxlint --type-check 2>&1 | grep "Property.*does not exist"
```

## Advanced Topics

### Dark mode

```typescript
const colors = {
  light: { primary: '#2563eb', background: '#ffffff', text: '#0f172a' },
  dark: { primary: '#60a5fa', background: '#0f172a', text: '#f8fafc' },
};
```

### OKLCH vs HSL

- HSL: dễ dùng nhưng không perceptually uniform
- OKLCH: chuẩn hơn cho palette generation

```css
:root {
  --primary: oklch(60% 0.15 250);
  --secondary: oklch(60% 0.15 290);
}
```

### Multi-brand systems

```typescript
const brands = {
  corporate: { primary: '#2563eb', secondary: '#8b5cf6' },
  creative: { primary: '#f59e0b', secondary: '#ec4899' },
  tech: { primary: '#10b981', secondary: '#06b6d4' },
};
```

---

## Testing Checklist (Pre-launch)

### Contrast Validation
- [ ] All text vs backgrounds ≥ 4.5:1 (WCAG 2.2 AA)
- [ ] Large text ≥ 3:1
- [ ] APCA: body text ≥ Lc 75, headings ≥ Lc 60
- [ ] UI components ≥ 3:1

### Color Blindness
- [ ] Test Deuteranopia
- [ ] Test Protanopia
- [ ] Test Tritanopia
- [ ] Không rely solely on color (có icon/text)

### Visual Weight
- [ ] Neutral ~60%, primary ~30%, accent ~10%
- [ ] Visual weight formula validated
- [ ] Không có overwhelming brand color

### Token Architecture
- [ ] Không có hard-coded colors trong components
- [ ] 3-tier structure implemented
- [ ] Tailwind config references semantic tokens
- [ ] Dark mode variants defined
