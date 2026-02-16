# Universal Checklist (Create/Review)

## A. Core

- [ ] OKLCH only (không HSL/getTint/getShade)
- [ ] APCA cho text/UI, không hard-code #fff/#000
- [ ] Palette đủ: solid/surface/hover/active/border/disabled
- [ ] Single mode auto-suggest secondary (harmony)
- [ ] Dual mode có similarity check (ΔE)

## B. Distribution (content state)

- [ ] 60-30-10 đo tại data-đầy-đủ, placeholder không tính
- [ ] Neutral chiếm nền + body text
- [ ] Primary cho CTA/heading/icon/active
- [ ] Secondary cho subtitle/label/badge/hover/accents
- [ ] Heading (h2) dùng brandColor, KHÔNG dùng secondary
- [ ] Primary chiếm >= 25% visual weight (heading + CTA + icon)
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
- [ ] Flat design + border + whitespace
- [ ] Touch targets >= 44px

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
