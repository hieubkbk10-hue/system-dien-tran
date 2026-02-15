# OKLCH Reference

## Vì sao OKLCH

- OKLCH là color space **perceptual uniform**
- L (Lightness) thay đổi tuyến tính theo cảm nhận
- C (Chroma) kiểm soát độ rực
- H (Hue) giữ nguyên góc màu

## Giá trị gợi ý

- L: 0.0 – 1.0 (thường 0.35–0.85)
- C: 0.02 – 0.20 (UI thường 0.08–0.16)
- H: 0 – 360

## OKLCH trong code

```ts
import { oklch, formatHex } from 'culori';

const color = oklch('#3b82f6');
const surface = formatHex(oklch({ ...color, l: Math.min(color.l + 0.4, 0.98) }));
const hover = formatHex(oklch({ ...color, l: Math.max(color.l - 0.1, 0.1) }));
```

## OKLCH trong CSS

```css
:root {
  --primary: oklch(0.6 0.15 250);
  --secondary: oklch(0.6 0.15 290);
}

.hero {
  background: linear-gradient(in oklch to right, var(--primary), var(--secondary));
}
```

## Best Practices

- Tạo **surface** bằng cách tăng L +0.35 đến +0.45
- Tạo **hover** bằng cách giảm L -0.08 đến -0.12
- Giữ C ổn định để tránh màu bị xám
- Khi L vượt 0.98 thì clamp để tránh wash-out
