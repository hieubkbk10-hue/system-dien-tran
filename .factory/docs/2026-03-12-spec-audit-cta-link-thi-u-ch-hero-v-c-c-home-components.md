## Audit Summary
### Observation (evidence)
1. Hero create/edit hiện chỉ có text CTA, **không có field link riêng cho CTA**:
   - `app/admin/home-components/hero/_types/index.ts`: `HeroContent` có `primaryButtonText`, `secondaryButtonText` nhưng không có `...Link`.
   - `app/admin/home-components/hero/_components/HeroForm.tsx`: form chỉ render input text cho nút.
   - `app/admin/home-components/create/hero/page.tsx` và `hero/[id]/edit/page.tsx`: lưu `config.content` + `slides[].link`, không có CTA link field.
2. Hero site render đang dùng link không nhất quán:
   - `components/site/ComponentRenderer.tsx`:
     - fullscreen/split/parallax **nút chính** dùng `slides[currentSlide]?.link || '#'`.
     - fullscreen **nút phụ** hardcode `href="#"`.
   - => đúng triệu chứng user mô tả: có text nút nhưng click không đi đâu (đặc biệt nút phụ; và nút chính phụ thuộc link slide, không phải CTA link độc lập).
3. Audit các home-component khác:
   - Nhiều component đã có đủ cặp `buttonText + buttonLink`: `about`, `benefits`, `faq`, `cta`, `countdown`, `video`, `pricing`.
   - Riêng `services` có token `buttonText` nhưng là màu/token UI (không phải CTA field).
   - Không thấy component form mới nào khác (ngoài Hero) có pattern “button text field nhưng thiếu link field” ở create/edit hiện đại.

### Inference
- Root issue chính nằm ở **schema HeroContent thiếu CTA links** + render site dùng fallback `#`/slide link thay vì link CTA được cấu hình theo semantic action.
- Ảnh hưởng tập trung Hero layouts có content block (`fullscreen`, `split`, `parallax`), đặc biệt fullscreen secondary CTA.

### Decision
- Đề xuất chuẩn hóa Hero theo pattern đang dùng rộng rãi ở repo (About/CTA/Benefits/Countdown): mỗi CTA text đi kèm CTA link.

## Root Cause Confidence
**High** — vì evidence trực tiếp từ type/form/site renderer cho thấy thiếu trường dữ liệu link ở HeroContent và có hardcoded `#` ở nút phụ fullscreen.

## Proposal (implementation plan)
### 1) Mở rộng schema HeroContent (backward-compatible)
- File: `app/admin/home-components/hero/_types/index.ts`
- Thêm:
  - `primaryButtonLink?: string`
  - `secondaryButtonLink?: string`
- Giữ optional để không vỡ dữ liệu cũ.

### 2) Bổ sung default config cho create
- File: `app/admin/home-components/hero/_lib/constants.ts`
- `DEFAULT_HERO_CONTENT` thêm link mặc định:
  - `primaryButtonLink: ''`
  - `secondaryButtonLink: ''`

### 3) Cập nhật HeroForm (create/edit dùng chung)
- File: `app/admin/home-components/hero/_components/HeroForm.tsx`
- Với các style `fullscreen/split/parallax`:
  - thêm input “Liên kết nút chính” (placeholder `/contact` hoặc `https://...`)
  - fullscreen thêm input “Liên kết nút phụ”
- Theo yêu cầu user: nếu trống vẫn cho phép fallback `#`.

### 4) Cập nhật HeroPreview để phản ánh config mới
- File: `app/admin/home-components/hero/_components/HeroPreview.tsx`
- Đổi button trong preview từ `<button>` sang `<a>` (hoặc giữ button nhưng hiển thị meta link); khuyến nghị `<a>` để parity với site.
- Mapping:
  - `primary href = content.primaryButtonLink || slides[currentSlide]?.link || '#'` (ưu tiên CTA link explicit)
  - `secondary href = content.secondaryButtonLink || '#'

### 5) Cập nhật site renderer Hero
- File: `components/site/ComponentRenderer.tsx`
- Trong Hero `fullscreen/split/parallax`:
  - primary CTA: ưu tiên `content.primaryButtonLink`, fallback `slides[currentSlide]?.link || '#'`
  - secondary CTA (fullscreen): dùng `content.secondaryButtonLink || '#'` thay vì hardcode `#`
- Giữ behavior backward-compatible với dữ liệu cũ qua fallback.

### 6) Audit/fix các home-components khác (scope user yêu cầu sửa tất cả)
- Dựa trên audit hiện tại, không thấy component form hiện đại nào khác bị thiếu link-field khi đã có CTA text-field.
- Hành động trong phase code:
  - quét nhanh lần cuối các `*Form.tsx`, `*_types/index.ts`, `*SectionShared.tsx` để xác nhận 0 case thiếu link.
  - nếu phát hiện thêm case, áp cùng pattern `Text + Link` + fallback `#`.

### 7) Commit theo quy tắc repo
- Sau khi code xong: commit local (không push).
- Không chạy lint/unit test/build (theo guideline repo).

## Verification Plan
- **Static/type**: kiểm tra compile-level bằng `bunx tsc --noEmit` (vì có thay đổi TS/code).
- **Repro checklist** (manual cho tester):
  1. Vào `/admin/home-components/create/hero`, chọn fullscreen/split/parallax, nhập text + link CTA, lưu.
  2. Vào edit component tương ứng, xác nhận field link load đúng và persist sau save.
  3. Ra site: click primary/secondary CTA đi đúng link đã cấu hình; khi bỏ trống link thì fallback `#`.
  4. Kiểm tra dữ liệu Hero cũ (chưa có link field) vẫn render bình thường nhờ fallback.
- **Pass/Fail**:
  - Pass khi CTA Hero không còn “text có mà click vô nghĩa” nếu link đã cấu hình; secondary fullscreen không còn hardcode `#`.
  - Fail nếu save mất dữ liệu link hoặc route click không khớp config.

## Tham chiếu thực tiễn SaaS lớn (theo câu hỏi của user)
- Pattern phổ biến: CTA tách riêng `label + href`, không phụ thuộc media item link.
- Với Hero có nhiều slide, CTA-level link thường là action business ("/contact", "/pricing") còn slide link dùng cho click ảnh/banner.
- Vì vậy phương án recommend là **thêm CTA link riêng trong HeroContent** và chỉ fallback slide link để tương thích dữ liệu cũ.