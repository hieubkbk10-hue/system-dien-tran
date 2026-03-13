## Audit Summary
- Observation: Footer home-component hiện chưa có field cấu hình kích thước logo. `FooterConfig` chỉ có `logo`, không có `logoSizeLevel` hay tương đương tại `app/admin/home-components/footer/_types/index.ts`.
- Observation: Preview Footer đang hard-code logo rất nhỏ theo từng style, ví dụ `h-5 w-5`, `h-6 w-6`, `h-4 w-4` trong `app/admin/home-components/footer/_components/FooterPreview.tsx`.
- Observation: Site thật Footer cũng hard-code các size nhỏ tương tự trong `components/site/DynamicFooter.tsx`, nên edit/create và site hiện không có parity về khả năng chỉnh size.
- Observation: Header Menu experience đã có `logoSizeLevel`, nhưng chỉ hỗ trợ 5 nấc (`1 | 2 | 3 | 4 | 5`) ở `components/experiences/previews/HeaderMenuPreview.tsx`, `app/system/experiences/menu/page.tsx`, và site thật `components/site/Header.tsx`.
- Observation: Header site thật và preview cùng dùng bảng map size theo style, nên có điểm hook rõ ràng để mở rộng lên 10 nấc mà vẫn giữ parity.
- Inference: Root issue của Footer là thiếu dữ liệu config + thiếu UI control + thiếu runtime mapping. Root issue của Header Menu là domain type và label UI đang khóa ở 5 nấc.
- Decision: Mở rộng cả 2 khu vực theo cùng pattern “10 nấc”, với nấc 1 = giữ nguyên size hiện tại, nấc 10 = 8x nấc 1, phân bố tuyến tính như bạn đã chọn.

## Root Cause Confidence
- High — vì cả Footer và Header đều có evidence trực tiếp trong code:
  - Footer: chưa có thuộc tính cấu hình kích thước, toàn bộ size logo đang hard-code trong preview/site.
  - Header: type union + slider UI + size map đều đang giới hạn 5 nấc.
- Counter-hypothesis đã loại trừ:
  - Không phải do CSS ngoài component, vì giá trị width/height được gán trực tiếp ngay trong JSX.
  - Không phải do dữ liệu DB cũ sai, vì Footer hiện còn chưa lưu field size; Header mặc định fallback `logoSizeLevel ?? 2`.

## Proposal
1. Thêm cấu hình kích thước logo cho Footer home-component
- File: `app/admin/home-components/footer/_types/index.ts`
  - Thêm `logoSizeLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10`.
- File: `app/admin/home-components/footer/_lib/constants.ts`
  - Bổ sung default `logoSizeLevel: 1` để nấc nhỏ nhất đúng bằng hiện trạng.
  - Cập nhật `normalizeFooterConfig()` để fallback an toàn về `1` nếu dữ liệu cũ không có field này.

2. Thêm UI 10 nấc cho create/edit Footer
- File: `app/admin/home-components/footer/_components/FooterForm.tsx`
  - Thêm slider/range “Kích thước logo” với `min=1`, `max=10`, `step=1`.
  - Hiển thị label đang chọn, ví dụ `Nấc 1/10 ... Nấc 10/10`.
  - Không đổi hành vi khác của form.
- Vì create/edit đều dùng chung `FooterForm`, một lần sửa sẽ phủ cả:
  - `app/admin/home-components/create/footer/page.tsx`
  - `app/admin/home-components/footer/[id]/edit/page.tsx`

3. Chuẩn hóa công thức scale 10 nấc cho Footer preview/site
- Tạo helper dùng chung, ví dụ trong `app/admin/home-components/footer/_lib/constants.ts` hoặc helper nhỏ cùng module:
  - input: `baseSize`, `logoSizeLevel`
  - output: `scaledSize`
  - công thức tuyến tính: `multiplier = 1 + ((level - 1) / 9) * 7`
  - nghĩa là level 1 = `1x`, level 10 = `8x`.
- File: `app/admin/home-components/footer/_components/FooterPreview.tsx`
  - Thay các `h-4/h-5/h-6/w-*` hard-code của logo bằng style tính từ helper.
  - Giữ nguyên bố cục từng style, chỉ scale logo theo nấc; nơi cần giữ khung/padding hợp lý sẽ tăng outer wrapper tối thiểu để tránh vỡ layout.
- File: `components/site/DynamicFooter.tsx`
  - Áp cùng helper/mapping để site thật giống preview/admin.
  - Dùng chính `config.logoSizeLevel` từ component config.

4. Mở rộng Header Menu từ 5 nấc lên 10 nấc
- File: `components/experiences/previews/HeaderMenuPreview.tsx`
  - Đổi type `logoSizeLevel` từ `1..5` sang `1..10`.
  - Thay `logoSizeMap` 5 phần tử bằng 10 phần tử cho từng style (`classic`, `topbar`, `allbirds`).
  - Vì user yêu cầu “các nấc thêm này là để logo lớn hơn ở header”, dãy mới sẽ giữ nấc nhỏ cũ làm đáy và thêm nấc lớn hơn về phía cuối.
- File: `app/system/experiences/menu/page.tsx`
  - Đổi slider `max={10}`.
  - Cập nhật label từ 5 nấc sang 10 nấc.
  - Giữ default hiện tại ở mức tương thích (đề xuất vẫn để `2` để không làm đổi giao diện site đang dùng nếu config cũ đang vậy).
- File: `components/site/Header.tsx`
  - Mở rộng type `logoSizeLevel?: 1..10`.
  - Dùng cùng bảng map 10 nấc như preview để site thật parity với experience editor.

5. Nguyên tắc tương thích dữ liệu cũ
- Footer config cũ không có `logoSizeLevel` sẽ tự về `1`, tức size nhỏ nhất = đúng hiện trạng như bạn yêu cầu.
- Header config cũ vẫn giữ nguyên level đang lưu (thường là 1..5) và tiếp tục hoạt động; chỉ thêm 6..10 cho các case muốn logo lớn hơn.

## Mapping đề xuất
### Footer
- Dùng công thức tuyến tính từ 1x đến 8x trên từng base size hiện có của từng footer style.
- Nghĩa là nếu style hiện tại đang dùng logo 20px ở nấc 1, thì nấc 10 sẽ thành 160px.
- Vì một số style có khung bao logo, mình sẽ scale cả logo wrapper tối thiểu theo cùng size để tránh logo bị bó hoặc crop.

### Header Menu
- Giữ triết lý hiện có theo từng layout style, nhưng mở rộng thành 10 điểm.
- Đề xuất map cụ thể để dễ kiểm soát nav overflow:
  - `classic`: `[24, 32, 40, 48, 56, 72, 88, 104, 120, 136]`
  - `topbar`: `[28, 36, 44, 52, 60, 76, 92, 108, 124, 140]`
  - `allbirds`: `[16, 24, 32, 40, 48, 64, 80, 96, 112, 128]`
- Lý do không ép đúng 8x tuyệt đối cho Header: Header đang phụ thuộc không gian nav/actions; dùng mảng thủ công có kiểm soát giúp tránh vỡ header quá mạnh, nhưng vẫn tạo thêm các nấc logo lớn hơn rõ rệt đúng yêu cầu.
- Nếu bạn muốn strict 8x cả Header, mình có thể chuyển Header sang công thức tuyến tính giống Footer ở bước implement.

## File dự kiến sửa
- `app/admin/home-components/footer/_types/index.ts`
- `app/admin/home-components/footer/_lib/constants.ts`
- `app/admin/home-components/footer/_components/FooterForm.tsx`
- `app/admin/home-components/footer/_components/FooterPreview.tsx`
- `components/site/DynamicFooter.tsx`
- `components/experiences/previews/HeaderMenuPreview.tsx`
- `app/system/experiences/menu/page.tsx`
- `components/site/Header.tsx`

## Pass/Fail criteria
- Pass:
  - Footer create/edit có slider 10 nấc.
  - Footer nấc 1 đúng bằng size hiện tại.
  - Footer nấc 10 hiển thị lớn hơn rõ rệt và được áp dụng lên site thật.
  - Header Menu experience có 10 nấc thay vì 5.
  - Header site thật render đúng cùng nấc đã lưu từ experience.
  - Dữ liệu cũ không lỗi, không cần migrate DB.
- Fail:
  - Preview khác site thật.
  - Dữ liệu config cũ bị vỡ hoặc mất mặc định.
  - Header/footer bị crop logo hoặc layout gãy ở các nấc lớn.

## Verification Plan
- Static review bắt buộc:
  - Soát type union `1..10` ở tất cả nơi dùng `logoSizeLevel`.
  - Soát fallback normalize cho dữ liệu cũ.
  - Soát parity preview/site cho cùng helper hoặc cùng map.
  - Soát các style footer để tránh wrapper nhỏ hơn logo.
- Typecheck:
  - Sau khi implement, chạy `bunx tsc --noEmit` theo rule repo.
- Repro/check tay (không tự chạy runtime trong spec mode):
  - Footer create/edit: kéo từ nấc 1 đến 10, xác nhận preview thay đổi.
  - Header Menu experience: kéo từ nấc 1 đến 10, xác nhận preview thay đổi và nấc cao hơn làm logo lớn hơn ở header.
  - Site thật: kiểm tra footer/header phản ánh đúng config đã lưu.

Nếu bạn duyệt spec này, bước implement mình sẽ bám đúng phạm vi trên và không mở rộng thêm.