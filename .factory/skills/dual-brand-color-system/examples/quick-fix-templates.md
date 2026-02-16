# Quick Fix Templates

## 1) Fix primary underuse

**Triệu chứng**
- Heading dùng secondary hoặc neutral
- Primary chỉ xuất hiện ở icon nhỏ/CTA hiếm khi hiển thị

**Fix nhanh**
1. Heading (h2) → `brandColor`
2. Thêm accent line dưới heading (`primary.solid`)
3. Đổi `cardBorderHover` → `primary.solid`
4. Category name / item title → `primary.textInteractive`

**Snippet gợi ý**

```tsx
<h2 style={{ color: colors.primary.solid }}>{title}</h2>
<div className="h-1 w-12 rounded-full" style={{ backgroundColor: colors.sectionAccent }} />
```

## 2) Fix secondary invisible

**Triệu chứng**
- Secondary chỉ nằm ở border/shadow quá nhạt
- Pagination dots gần như invisible

**Fix nhanh**
1. Tăng opacity secondary cho shadow/border (12% → 20-30%)
2. Text phụ (label, count, link) dùng `secondary.textInteractive`
3. Pagination inactive = `secondary 40%`

**Snippet gợi ý**

```ts
cardShadow: `0 2px 8px ${toOklchString(secondary.solid, 0.2)}`,
linkText: secondary.textInteractive,
paginationDotInactive: toOklchString(secondary.solid, 0.4),
```

## 3) Fix heading colors

**Triệu chứng**
- Heading = secondary hoặc neutral trong dual mode

**Fix nhanh**
1. Heading (h2) = `primary.solid`
2. Subtitle/label = `secondary.textInteractive`

**Snippet gợi ý**

```tsx
<h2 style={{ color: colors.primary.solid }}>{title}</h2>
<p style={{ color: colors.secondary.textInteractive }}>{subtitle}</p>
```

## 4) Fix accent balance

**Triệu chứng**
- Primary < 25% hoặc secondary < 5%

**Fix nhanh**
1. Thêm accent bar (primary) ở card/list
2. Đưa secondary vào labels hoặc counts
3. Tăng secondary trong hover/border

**Snippet gợi ý**

```tsx
<div className="w-1.5 self-stretch" style={{ backgroundColor: colors.cardAccentBar }} />
```
