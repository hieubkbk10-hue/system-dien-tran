## Audit Summary
- **Observation:** Preview Hero admin đã không cắt ảnh ở `fullscreen/parallax` (đã dùng `object-contain + nền blur`) trong `app/admin/home-components/hero/_components/HeroPreview.tsx`.
- **Observation:** Site renderer tương ứng vẫn dùng cơ chế cắt ảnh:
  - `components/site/ComponentRenderer.tsx` nhánh `style === 'fullscreen'`: `SiteImage ... object-cover`.
  - `components/site/ComponentRenderer.tsx` nhánh `style === 'parallax'`: background layer `backgroundSize: 'cover'`.
- **Inference:** Preview và site đang lệch contract hiển thị cho cùng config Hero style fullscreen/parallax, nên user thấy preview ổn nhưng render site chưa tốt.

## Root Cause Confidence
- **High**
- Lý do: khác biệt nằm trực tiếp tại 2 nhánh render của cùng component site, đối chiếu rõ với preview đã sửa.

## Proposal (patch nhỏ nhất, đúng scope)
1. **File sửa duy nhất:**
   - `components/site/ComponentRenderer.tsx`
2. **Thay đổi cụ thể:**
   - Thêm helper local cho Hero site (tương tự pattern preview hiện tại):
     - render nền blur từ ảnh (`backgroundSize: cover` + blur).
     - render ảnh chính `SiteImage` với `object-contain`.
     - cho phép truyền overlay gradient hiện hữu.
   - Áp dụng helper cho 2 nhánh:
     - `style === 'fullscreen'`: thay `object-cover` hiện tại bằng helper để bảo toàn ảnh.
     - `style === 'parallax'`: thay background-only cover bằng helper (blur + contain) và giữ overlay/card/nav như cũ.
3. **Out-of-scope giữ nguyên:**
   - Không đổi height breakpoints, không đổi CTA/copy/dots/nav animation, không đổi style khác (slider/fade/bento/split).

## Counter-hypothesis
- Không phải do dữ liệu upload hay `slides` rỗng (preview cùng dữ liệu vẫn ổn).
- Không phải do route create/edit riêng lẻ (issue nằm tại renderer site dùng ở frontend).

## Verification Plan
- **Static check:**
  - Diff chỉ chạm `components/site/ComponentRenderer.tsx`.
  - `fullscreen/parallax` không còn nhánh ảnh chính `object-cover` gây crop chủ thể.
  - Có render `object-contain + blur background` đồng nhất với preview contract.
- **Manual repro cho tester:**
  1. Tạo/chỉnh Hero với ảnh dọc + ảnh ngang lệch tỷ lệ.
  2. Mở site thật ở style `fullscreen` và `parallax`.
  3. **Pass:** ảnh hiển thị đủ khung (không cắt chủ thể), phần dư được bù bằng nền blur, overlay/card/nav hoạt động như trước.
  4. **Fail:** còn crop tương tự trước fix hoặc vỡ overlay/card.

## Ghi chú quyết định
- Bạn trả lời “Yes” ở bước chọn option nên chưa map được option cụ thể. Mình đang chốt theo hướng khuyến nghị: **parity 100% với preview** để giải quyết đúng triệu chứng “preview ổn, site chưa tốt”. Nếu bạn muốn giữ cover cho Parallax, mình sẽ đổi plan ngay trước khi implement.