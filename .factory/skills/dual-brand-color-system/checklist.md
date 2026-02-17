# Universal Checklist (Create/Review)

## A. Core

- [ ] OKLCH only (không HSL/getTint/getShade)
- [ ] APCA cho text/UI, không hard-code #fff/#000
- [ ] Palette đủ: solid/surface/hover/active/border/disabled
- [ ] Single mode auto-suggest secondary (harmony)
- [ ] Dual mode có similarity check (ΔE >= 20)
- [ ] Harmony validator (getHarmonyStatus) không báo too-similar
- [ ] Accessibility score (getAccessibilityScore) không fail

## B. Distribution (content state)

- [ ] 60-30-10 đo tại data-đầy-đủ, placeholder không tính
- [ ] Neutral chiếm nền + body text
- [ ] Primary cho CTA/heading/icon/active
- [ ] Secondary cho subtitle/label/badge/hover/accents
- [ ] Heading (h2) dùng brandColor, KHÔNG dùng secondary
- [ ] Primary chiếm >= 25% visual weight (heading + CTA + icon)
- [ ] Accent balance calculator: primary >= 25%, secondary >= 5%
- [ ] Placeholder bg luôn neutral (grid/bento cũng neutral)

## C. Accent Prominence

- [ ] Secondary có element đủ lớn (không chỉ icon < 20px)
- [ ] Áp rule Lone/Dual/Triple/Standard theo accent count
- [ ] Tier S có APCA >= 60

## D. Single Source of Truth

- [ ] Site + Preview dùng cùng helper trong `_lib/colors.ts`
- [ ] Không hardcode màu ở site nếu preview dùng helper

---

## E. Anti AI-Styling

- [ ] Không gradient decorative (chỉ gradient style mới dùng)
- [ ] Không hover effects phức tạp (mobile-first)
- [ ] Không blur/shadow nhiều lớp
- [ ] Không animate decorative (pulse, scale)
- [ ] Không opacity cho decorative elements (badge bg, borders)
- [ ] Không box-shadow cho card depth (chỉ border 1px)
- [ ] Badge bg phải solid color (không opacity)
- [ ] Card depth dùng border 1px solid (slate-200 hoặc brand tint)
- [ ] Flat design + border + whitespace
- [ ] Touch targets >= 44px

## F. State & Runtime Safety

- [ ] Single mode với `secondary=''` không crash.
- [ ] Helper màu có fallback parse hợp lệ (không đọc `.l` từ `undefined`).
- [ ] Có `resolveSecondaryForMode(...)` trước mọi build palette/tint/gradient.
- [ ] Edit form: Save button disabled khi pristine.
- [ ] Sau save thành công: reset về pristine (`hasChanges=false`).

## F2. Single Mode Monochromatic (CRITICAL)

- [ ] `resolveSecondary(primary, secondary, 'single', harmony)` PHẢI return `primary`
- [ ] KHÔNG tạo harmony color (analogous/complementary/triadic) trong single mode
- [ ] Preview info trong single mode: "SINGLE" (không hiển thị harmony)
- [ ] Color box label trong single mode: "Primary (mono)" (không "Accent (analogous)")
- [ ] Accent balance trong single mode: P=S (cùng màu)

**Pattern chuẩn (Stats, Hero):**
```typescript
if (mode === 'single') {
  return primary;  // ✅
}
```

**Anti-pattern (FAQ bug):**
```typescript
if (mode === 'single') {
  return getAnalogous(primary)[0];  // ❌
}
```

---

# Accent Analysis Template

| # | Element | Tier | Area Est. | Interactive? | Assigned Color | Reason |
|---|---------|------|-----------|-------------|----------------|--------|
| 1 | | | | | | |
| 2 | | | | | | |
| Total accent points: X | | | | | | Apply Rule: Lone/Dual/Triple/Standard |

## Ví dụ (Hero Fade)

| # | Element | Tier | Area Est. | Interactive? | Assigned Color | Reason |
|---|---------|------|-----------|-------------|----------------|--------|
| 1 | thumbnail border active | M | ~3% | yes | primary | Lone accent |
| Total accent points: 1 | | | | | | Apply Rule: Lone |
