## Audit Summary
- Observation: Header Menu hiện đang ở 10 nấc trong code gần nhất (`app/system/experiences/menu/page.tsx`, `components/experiences/previews/HeaderMenuPreview.tsx`), nhưng bạn muốn quay về 8 nấc tổng.
- Observation: Header đang dùng map cứng 10 giá trị mỗi layout: `classic [24..136]`, `topbar [28..140]`, `allbirds [16..128]`. Vì vậy chỉ cần đổi domain + remap mảng số, không cần thêm field mới.
- Observation: Footer hiện vẫn giữ 10 nấc trong config và helper `getFooterLogoScale()` đang scale tuyến tính từ 1x đến 8x trong `app/admin/home-components/footer/_lib/constants.ts`.
- Observation: Footer preview/site hiện còn wrapper bao logo ở nhiều layout như `p-1.5 rounded-lg border`, `rounded-xl border`, `rounded-2xl border`, khối màu nền ở stacked/classic/modern/centered. Điều này khác intent mới của bạn là “học theo minimal”, tức logo hiển thị trần, không viền, không khung, giảm khoảng cách cạnh logo.
- Observation: Footer minimal hiện là layout tham chiếu đúng nhất vì logo không có wrapper, chỉ render trực tiếp cạnh text.

## Root Cause Confidence
- High — vì yêu cầu mới chỉ là remap lại thang kích thước và thống nhất presentation logo Footer; tất cả điểm can thiệp đều nằm ngay trong các component đã xác định.
- Counter-hypothesis đã loại trừ:
  - Không phải vấn đề từ data Convex hay settings, vì size/wrapper đang được quyết định trực tiếp trong JSX/helper.
  - Không cần đổi schema backend riêng, vì Footer đã có `logoSizeLevel`, Header đã có `logoSizeLevel` và chỉ cần thu hẹp/remap domain hiển thị.

## Proposal
### 1) Header Menu: giữ 8 nấc tổng, lấy “nấc 4 hiện tại” làm mức tối đa mới
- File: `components/experiences/previews/HeaderMenuPreview.tsx`
- File: `app/system/experiences/menu/page.tsx`
- File: `components/site/Header.tsx`

Cách triển khai:
- Thu hẹp type `logoSizeLevel` của Header từ `1..10` về `1..8`.
- Đổi slider UI ở `/system/experiences/menu` từ `max=10` về `max=8`.
- Remap bảng size để mức lớn nhất mới bằng đúng “nấc 4 hiện tại” theo logic bạn yêu cầu.
- Vì hiện map cũ 10 nấc đang có các mốc:
  - classic: `[24, 32, 40, 48, 56, 72, 88, 104, 120, 136]`
  - topbar: `[28, 36, 44, 52, 60, 76, 92, 108, 124, 140]`
  - allbirds: `[16, 24, 32, 40, 48, 64, 80, 96, 112, 128]`
- Mình sẽ lấy trần mới bằng mốc level 4 hiện tại của từng layout:
  - classic max mới = `48`
  - topbar max mới = `52`
  - allbirds max mới = `40`
- Sau đó chia đều lại thành 8 nấc tuyến tính từ mức nhỏ nhất hiện tại đến mức max mới:
  - classic đề xuất: `[24, 27, 31, 34, 38, 41, 45, 48]`
  - topbar đề xuất: `[28, 31, 35, 38, 42, 45, 49, 52]`
  - allbirds đề xuất: `[16, 19, 23, 26, 30, 33, 37, 40]`
- Label UI sẽ đổi sang 8 nấc tương ứng, ví dụ: `Nhỏ 1` → `Nhỏ 8` hoặc giữ format dễ hiểu hơn như `Nấc 1` → `Nấc 8`.
- Dữ liệu cũ đã lưu nếu đang > 8 sẽ cần normalize mềm về `8` ở runtime/UI để không vỡ type.

### 2) Footer: giữ 10 nấc nhưng remap để cực đại mới bắt đầu từ mốc “nấc 6 cũ”
- File: `app/admin/home-components/footer/_lib/constants.ts`
- File: `app/admin/home-components/footer/_components/FooterForm.tsx`
- File: `app/admin/home-components/footer/_components/FooterPreview.tsx`
- File: `components/site/DynamicFooter.tsx`

Cách hiểu được chốt theo câu trả lời của bạn:
- Footer vẫn giữ editor 10 nấc.
- Nhưng scale mới phải mềm hơn rất nhiều so với bản 1x→8x hiện tại.
- “Mức cực đại hiện tại bắt đầu từ mốc 6 cũ” nghĩa là trần mới sẽ lấy bằng cảm nhận/kích thước của khoảng mốc level 6 trong hệ cũ, rồi nội suy đều lại thành 10 nấc.

Cách triển khai an toàn:
- Thay helper `getFooterLogoScale()` hiện tại (1x → 8x) bằng helper mới với trần mềm hơn.
- Vì level 6 cũ theo công thức hiện tại tương đương khoảng `4.89x`, mình sẽ dùng trần mới xấp xỉ mốc này thay vì `8x`.
- Tức 10 nấc mới sẽ chạy tuyến tính từ `1x` đến khoảng `4.89x`.
- Hệ quả:
  - nấc 10 mới ≈ nấc 6 cũ
  - các nấc 1..10 tăng đều, không bị nhảy khủng khiếp ở cuối.
- UI slider Footer vẫn giữ 10 nấc, nhưng label mô tả sẽ đổi rõ ràng hơn thành `Nấc 1/10` ... `Nấc 10/10`.
- Dữ liệu cũ không cần migrate; chỉ cần dùng helper mới để render.

### 3) Footer: bỏ toàn bộ wrapper/viền/spacing bao logo ở các layout, học theo minimal
- File: `app/admin/home-components/footer/_components/FooterPreview.tsx`
- File: `components/site/DynamicFooter.tsx`

Cách triển khai:
- Bỏ các khối bao logo như:
  - `p-1.5 rounded-lg border`
  - `rounded-xl border`
  - `rounded-2xl border`
  - khối nền màu ở stacked/classic/modern/centered
- Render logo trực tiếp giống minimal:
  - nếu có logo ảnh: render ảnh trực tiếp với `object-contain`
  - nếu không có logo ảnh: fallback chữ cái đầu nhưng không bọc trong card viền riêng
- Giảm gap cạnh logo theo hướng minimal:
  - classic/corporate có thể từ `gap-2/3` về `gap-2`
  - centered/modern giảm khoảng cách khối logo với brand text/description
  - stacked giảm khối logo từ card bao sang logo trần + gap gọn hơn
- Giữ bố cục tổng của từng layout, chỉ tối giản presentation vùng logo để không mở rộng scope sang toàn layout footer.

## File dự kiến sửa
- `app/system/experiences/menu/page.tsx`
- `components/experiences/previews/HeaderMenuPreview.tsx`
- `components/site/Header.tsx`
- `app/admin/home-components/footer/_lib/constants.ts`
- `app/admin/home-components/footer/_components/FooterForm.tsx`
- `app/admin/home-components/footer/_components/FooterPreview.tsx`
- `components/site/DynamicFooter.tsx`

## Pass/Fail criteria
- Pass:
  - `/system/experiences/menu` chỉ còn 8 nấc.
  - Nấc 8 của Header có kích thước đúng bằng mức “nấc 4 hiện tại” theo map cũ.
  - Footer vẫn 10 nấc nhưng nấc 10 mới chỉ tương đương khoảng nấc 6 cũ, tăng đều và không bị quá khủng.
  - Mọi layout Footer bỏ wrapper/viền bao logo và giảm spacing cạnh logo theo minimal.
  - Preview/Footer site thật và Header preview/site thật parity.
- Fail:
  - Header còn 10 nấc hoặc level cuối vẫn quá to như bản hiện tại.
  - Footer vẫn còn card/viền/khung riêng quanh logo ở các layout.
  - Preview và site render lệch nhau.

## Verification Plan
- Static review:
  - Soát type `logoSizeLevel` Header còn `1..8` nhất quán ở editor/preview/site.
  - Soát helper Footer mới để đảm bảo trần scale đúng intent “10 mới ≈ 6 cũ”.
  - Soát mọi layout Footer không còn wrapper logo.
  - Soát gap/logo block giữa preview và site đồng bộ.
- Typecheck:
  - Sau khi implement chạy `bunx tsc --noEmit`.
- Repro/check tay sau implement:
  - Header: kéo nấc 1→8, xác nhận nấc 8 là mức lớn nhất mới nhưng không vượt quá nấc 4 cũ.
  - Footer: kéo 1→10, xác nhận nấc 10 mềm hơn đáng kể so với bản hiện tại.
  - Footer các layout classic/modern/corporate/centered/stacked: không còn viền/khung bao logo, spacing gần giống minimal.

Nếu bạn duyệt spec này, mình sẽ implement đúng phạm vi trên.