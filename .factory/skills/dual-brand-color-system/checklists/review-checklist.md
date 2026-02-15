# Review Checklist

## 1. Color Space
- [ ] Không dùng HSL / getTint / getShade
- [ ] Dùng OKLCH (culori)

## 2. Contrast
- [ ] Text color dùng APCA
- [ ] Không hard-code #fff/#000

## 3. Palette Completeness
- [ ] solid, surface, hover, active, border, disabled
- [ ] textOnSolid + textInteractive

## 4. Dual Mode
- [ ] Similarity check (ΔE)
- [ ] Warning nếu similarity > 0.9

## 5. 60-30-10
- [ ] Primary dùng cho CTA/prices/headings
- [ ] Secondary dùng cho badges/hover
- [ ] Neutral chiếm background
