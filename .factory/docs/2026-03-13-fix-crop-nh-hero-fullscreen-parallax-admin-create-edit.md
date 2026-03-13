## Audit Summary
- **Observation:** Ở preview Hero trong admin (`app/admin/home-components/hero/_components/HeroPreview.tsx`), 2 layout bị cắt ảnh:
  - `renderFullscreenStyle` dùng `PreviewImage` với `className="w-full h-full object-cover"` (line ~326).
  - `renderParallaxStyle` dùng layer background `backgroundSize: 'cover'` (line ~488).
- **Observation:** 4 layout còn lại đang có cơ chế giữ ảnh đầy đủ bằng `object-contain + blurred background` (`renderSlideWithBlur`, line ~70, 77, 85), nên không bị cắt.
- **Observation:** create và edit đều dùng chung `HeroPreview` (create: `app/admin/home-components/create/hero/page.tsx`; edit: `app/admin/home-components/hero/[id]/edit/page.tsx`), nên fix 1 file sẽ áp dụng cho cả 2 route user báo lỗi.
- **Inference:** Root cause nằm ở mismatch render strategy giữa Fullscreen/Parallax và 4 layout còn lại (cover vs contain).

## Root Cause Confidence
- **High**
- Lý do: Có evidence trực tiếp tại đúng nhánh layout gây lỗi, và đối chiếu rõ với 4 layout đang hoạt động đúng trong cùng file.

## Proposal (patch nhỏ nhất, không mở rộng scope)
1. **File sửa duy nhất:**
   - `app/admin/home-components/hero/_components/HeroPreview.tsx`
2. **Thay đổi cụ thể:**
   - Tạo helper dùng lại cho background blur (giống pattern hiện có):
     - nền: `absolute inset-0 scale-110` + `backgroundImage` + `backgroundSize: 'cover'` + lớp overlay mờ.
     - ảnh chính: `PreviewImage` với `object-contain` để bảo toàn toàn bộ khung hình.
   - Áp dụng helper này cho:
     - `renderFullscreenStyle` (thay `object-cover` hiện tại).
     - `renderParallaxStyle` (thay background-only parallax `cover` bằng cấu trúc blur + contain).
3. **Giữ nguyên behavior ngoài scope:**
   - Không đổi chiều cao container theo device, không đổi CTA/card/dots/navigation, không đổi logic style switch.
   - Chỉ đổi cách fit ảnh để không crop.

## Counter-hypothesis đã loại trừ
- Không phải do `PreviewImage` component tự ép crop (component chỉ bọc `next/image`; crop do class tại nơi gọi).
- Không phải do create/edit page riêng lẻ (cả hai route render chung `HeroPreview`).

## Verification Plan
- **Static verification (không chạy runtime theo guideline):**
  - Soát diff đảm bảo chỉ đổi `HeroPreview.tsx` và chỉ trong nhánh `fullscreen/parallax`.
  - Soát class/style sau sửa:
    - Fullscreen/Parallax không còn `object-cover` cho ảnh chính.
    - Có `object-contain` + background blur tương tự các layout khác.
- **Manual repro checklist cho tester:**
  1. Vào 2 route user cung cấp (`/admin/home-components/hero/.../edit` và `/admin/home-components/create/hero`).
  2. Chọn ảnh dọc + ảnh ngang tỷ lệ lệch mạnh.
  3. Chuyển qua `Fullscreen` và `Parallax`.
  4. **Pass:** ảnh không bị cắt chủ thể; toàn ảnh hiển thị trong khung, phần dư được bù bởi nền blur.
  5. **Fail:** còn crop ở mép trái/phải hoặc trên/dưới như hiện trạng.

Nếu bạn duyệt spec này, tôi sẽ implement đúng 1 file theo patch tối thiểu ở trên.