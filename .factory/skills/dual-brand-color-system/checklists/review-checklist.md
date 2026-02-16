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
- [ ] Pagination dots: dual dùng secondary, single dùng primary
- [ ] Nav arrows: dual dùng secondary icon, two-color indicator (W3C C40)

## 6. Content-Aware Distribution
- [ ] Tỷ lệ 60-30-10 đo tại trạng thái DATA ĐẦY ĐỦ
- [ ] Placeholder dùng neutral background (không primary/secondary tint)
- [ ] Primary hiện ở >= 3 element types khi có data
- [ ] Secondary hiện ở >= 2 element types có diện tích đủ lớn
- [ ] Color Role Matrix đã điền đầy đủ
