## Audit Summary
- Observation: `app/system/experiences/menu/page.tsx` hiện đang clamp `logoSizeLevel` về `1..8`, UI dùng `input[type=range]` và label lưới 8 nấc. Điều này làm phần chọn size không còn phù hợp nếu tăng nhiều nấc.
- Observation: `components/experiences/previews/HeaderMenuPreview.tsx` và `components/site/Header.tsx` đang cùng dùng map 8 nấc cứng cho `classic/topbar/allbirds`, nên parity preview/site hiện tốt nhưng bị giới hạn ở mức 8.
- Observation: Bạn muốn “thêm 12 nấc trên 8”, đã chốt thành tổng 20 nấc, và muốn UI đổi sang `select dropdown` thay vì slider vì số mức quá nhiều.
- Observation: Bạn cũng đã chốt curve tăng `tuyến tính`, nên không cần giữ map cứng nhỏ như hiện tại; có thể dùng helper sinh 20 mức đều nhau từ min hiện tại đến max mới.

## Root Cause Confidence
- High — vì giới hạn hiện tại đến từ type + clamp + map + UI slider, tất cả đều nằm ở 3 file rõ ràng:
  - `app/system/experiences/menu/page.tsx`
  - `components/experiences/previews/HeaderMenuPreview.tsx`
  - `components/site/Header.tsx`
- Counter-hypothesis đã loại trừ:
  - Không phải do dữ liệu DB hay settings schema, vì `logoSizeLevel` đã tồn tại và có thể mở rộng domain.
  - Không phải do layout editor chung, vì vấn đề UI hiện tại chỉ nằm ở control riêng của Header Menu page.

## Proposal
### 1) Mở rộng Header Menu từ 8 lên 20 nấc
- File: `components/experiences/previews/HeaderMenuPreview.tsx`
- File: `components/site/Header.tsx`
- File: `app/system/experiences/menu/page.tsx`

Chi tiết:
- Đổi type `logoSizeLevel` từ `1..8` sang `1..20` ở preview và site.
- Đổi clamp runtime ở editor/site sang `1..20`.
- Giữ `DEFAULT_CONFIG.logoSizeLevel = 2` để không làm thay đổi default hiện tại quá mạnh.

### 2) Remap scale 20 nấc theo tuyến tính
- Không giữ map 8 phần tử cứng nữa.
- Thay bằng helper tạo 20 mức tuyến tính cho từng layout style, dùng chung ở preview và site.

Đề xuất min/max theo từng layout:
- `classic`: min giữ nguyên `24`, max mới đề xuất `96`
- `topbar`: min giữ nguyên `28`, max mới đề xuất `108`
- `allbirds`: min giữ nguyên `16`, max mới đề xuất `80`

Lý do:
- Nhóm max này lớn hơn rõ rệt so với mốc 8 hiện tại (`48/52/40`) nhưng chưa quá cực đoan như các bản thử trước gây “to khủng khiếp”.
- Tăng đều 20 nấc giúp mỗi bước nhỏ, mượt, dễ kiểm soát hơn.

Helper đề xuất:
- `buildLinearSteps(min, max, count = 20)` trả về mảng 20 số nguyên tăng đều.
- Preview và site import/chia sẻ cùng logic để tránh lệch nhau.

### 3) Đổi UI chọn nấc từ slider sang select dropdown
- File: `app/system/experiences/menu/page.tsx`

Chi tiết:
- Bỏ `input[type=range]` và hàng label nấc hiện tại.
- Thay bằng `select` dropdown hoặc pattern select đang có sẵn trong repo nếu có component tương tự.
- Option text rõ ràng theo format:
  - `Nấc 1`
  - `Nấc 2`
  - ...
  - `Nấc 20`
- Giữ dòng summary `Đang chọn: Nấc X` để người dùng nhìn nhanh.
- Nếu cần tốt hơn về UX, option label có thể kèm size thực tế theo layout active, ví dụ `Nấc 12 · 67px`, nhưng đây là optional; mặc định spec chỉ cần `Nấc X` để scope gọn.

### 4) Tương thích dữ liệu cũ
- Giá trị đã lưu 1..8 vẫn hợp lệ hoàn toàn khi mở rộng sang 20.
- Không cần migrate dữ liệu.
- Chỉ cần clamp mềm về `1..20` để an toàn nếu có dữ liệu bất thường.

## File dự kiến sửa
- `app/system/experiences/menu/page.tsx`
- `components/experiences/previews/HeaderMenuPreview.tsx`
- `components/site/Header.tsx`
- Có thể thêm 1 helper nhỏ dùng chung trong file preview/site nếu cần, nhưng ưu tiên sửa nhỏ trong file hiện có để tránh mở rộng scope.

## Pass/Fail criteria
- Pass:
  - `/system/experiences/menu` có tổng 20 nấc.
  - UI chọn size đổi sang dropdown, không còn slider cũ.
  - Kích thước logo tăng rõ hơn từ nấc 9 trở lên.
  - Preview trong experience và site thật dùng cùng scale logic.
  - Dữ liệu cũ 1..8 vẫn render đúng.
- Fail:
  - UI vẫn là slider cũ.
  - Preview/site lệch size với nhau.
  - Mức lớn nhất vẫn quá nhỏ như hiện tại hoặc vỡ layout ngay ở nhiều nấc giữa.

## Verification Plan
- Static review:
  - Soát type `logoSizeLevel` đồng bộ `1..20` ở editor/preview/site.
  - Soát helper linear steps được dùng giống nhau ở preview và site.
  - Soát dropdown update đúng `config.logoSizeLevel` và label hiển thị đúng.
- Typecheck:
  - Sau khi implement chạy `bunx tsc --noEmit`.
- Repro/check tay sau implement:
  - Vào `/system/experiences/menu`, xác nhận dropdown có 20 mức.
  - Chọn một số mốc đại diện: 1, 8, 12, 16, 20 để xác nhận logo lớn dần tuyến tính.
  - So sánh preview và site thật sau lưu để đảm bảo parity.

Nếu bạn duyệt spec này, mình sẽ triển khai đúng phạm vi trên, không đụng sang Footer hay phần khác.