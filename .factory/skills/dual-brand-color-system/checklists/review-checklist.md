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

## 7. Accent Prominence
- [ ] Đã liệt kê tất cả accent points
- [ ] Đã phân loại tier (XL/L/M/S) cho từng accent
- [ ] Đã áp dụng đúng rule theo accent count (Lone/Dual/Triple/Standard)
- [ ] Lone accent dùng primary, không dùng secondary
- [ ] Accent tier S có APCA >= 60

## 8. Single Source of Truth
- [ ] Site và Preview dùng cùng helper trong _lib/colors.ts
- [ ] Không hardcode màu ở site nếu preview đã dùng helper

## 9. YAGNI Decorative
- [ ] Không thêm decorative accent không có functional purpose
- [ ] Secondary đã đủ 2 element types thì không thêm element mới
