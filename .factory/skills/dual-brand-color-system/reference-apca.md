# APCA Reference

## APCA là gì

- Advanced Perceptual Contrast Algorithm (WCAG 3.0 draft)
- Đo contrast theo cảm nhận, xét font-size và font-weight

## Threshold gợi ý

- Body text 14–16px, weight 400–500: **Lc >= 60**
- Heading ≥ 18px hoặc weight ≥ 700: **Lc >= 45**
- UI controls: **Lc >= 45**

## Sử dụng

```ts
import { apcaContrast } from 'apca-w3';

export const getAPCATextColor = (bg: string, fontSize = 16, fontWeight = 500) => {
  const whiteLc = Math.abs(apcaContrast('#ffffff', bg));
  const blackLc = Math.abs(apcaContrast('#000000', bg));
  const threshold = (fontSize >= 18 || fontWeight >= 700) ? 45 : 60;

  if (whiteLc >= threshold) {return '#ffffff';}
  if (blackLc >= threshold) {return '#0f172a';}
  return whiteLc > blackLc ? '#ffffff' : '#0f172a';
};
```

## Lưu ý

- APCA có giá trị âm/dương theo polarity → luôn dùng `Math.abs()`
- Dùng fallback nếu APCA chưa đạt: chọn màu có Lc cao hơn
