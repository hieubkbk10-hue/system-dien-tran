# Color Harmony Reference

## Schemes

### Analogous (khuyến nghị)
- Hue: +30° / -30°
- Dịu mắt, brand-friendly

### Complementary
- Hue: +180°
- High contrast, chỉ nên dùng accent nhỏ

### Triadic
- Hue: +120°
- Cân bằng nhưng dễ rối nếu dùng nhiều

## Implement

```ts
import { oklch, formatHex } from 'culori';

export const getComplementary = (hex: string) => {
  const c = oklch(hex);
  return formatHex(oklch({ ...c, h: (c.h + 180) % 360 }));
};

export const getAnalogous = (hex: string): [string, string] => {
  const c = oklch(hex);
  return [
    formatHex(oklch({ ...c, h: (c.h + 30) % 360 })),
    formatHex(oklch({ ...c, h: (c.h - 30 + 360) % 360 }))
  ];
};
```

## Similarity Check (Delta E)

- Nếu ΔE < 10 → 2 màu quá giống nhau

```ts
import { differenceEuclidean } from 'culori';

export const getSimilarity = (a: string, b: string) => {
  const diff = differenceEuclidean('oklch')(a, b);
  return 1 - Math.min(diff, 1);
};
```
