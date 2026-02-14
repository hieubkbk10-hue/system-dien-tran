---
name: dual-brand-color-system
description: Best practices cho dual brand color systems trong UI/UX dựa trên Material Design 3, 60-30-10 rule, WCAG 2.2/3.0 và semantic tokens. Dùng khi thiết kế/review hệ thống màu thương hiệu (primary + secondary), validate accessibility, hoặc chuẩn hóa design tokens.
version: 2.0.0
---

# Dual Brand Color System Best Practices v2.0

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

## Khi nào dùng skill này?

- Thiết kế hệ thống màu thương hiệu mới (brand colors)
- Review/refactor hệ thống màu hiện tại (cảm giác không hợp lý, không đẹp)
- Chọn màu phụ (secondary) từ màu chính (primary)
- Validate accessibility (contrast ratios, color blindness)
- Tạo design tokens cho design system
- Áp dụng màu vào UI components (buttons, badges, CTAs, backgrounds)

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
