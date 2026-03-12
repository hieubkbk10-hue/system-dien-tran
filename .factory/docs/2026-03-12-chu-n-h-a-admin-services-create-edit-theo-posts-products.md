## Audit Summary
- **Observation:** `app/admin/services/create/page.tsx` đã có auto-slug khi nhập title, nhưng `app/admin/services/[id]/edit/page.tsx` chưa auto-generate slug khi đổi title; chỉ set thủ công (`setSlug(e.target.value)`).
- **Observation:** Trang service create/edit đang dùng `useFormShortcuts` + UI hint `Ctrl+S để lưu` + `title="Lưu (Ctrl+S)"`, trong khi posts/products không hiển thị pattern này.
- **Observation:** Service edit có dirty-state (`hasChanges`) nhưng cách triển khai khác posts (so sánh `JSON.stringify`), đồng thời footer action và microcopy chưa clean/parity với posts/products.
- **Inference:** UX service hiện lệch chuẩn module blog/products nên gây cảm giác “không đồng bộ” và khó dùng.
- **Decision:** Chuẩn hóa service create/edit bám sát posts/products: auto-slug nhất quán, bỏ Ctrl+S UX, giữ dirty-state rõ ràng ở edit và CTA gọn.

## Root Cause Confidence
**High** — Vì đã đối chiếu trực tiếp 6 file:
- Service: `app/admin/services/create/page.tsx`, `app/admin/services/[id]/edit/page.tsx`
- Posts: `app/admin/posts/create/page.tsx`, `app/admin/posts/[id]/edit/page.tsx`
- Products: `app/admin/products/create/page.tsx`, `app/admin/products/[id]/edit/page.tsx`
Và thấy lệch pattern cụ thể ở auto-slug + keyboard shortcut/UI action bar.

## Implementation Plan
1. **Chuẩn hóa auto-slug cho service edit** (`app/admin/services/[id]/edit/page.tsx`)
   - Tạo handler đổi title giống posts/products (`normalize NFD`, bỏ dấu, `đ -> d`, chỉ giữ `[a-z0-9\s]`, space -> `-`).
   - Áp dụng handler cho input tiêu đề để slug tự cập nhật khi đổi title.
   - Giữ khả năng người dùng sửa slug thủ công ở ô slug.

2. **Bỏ UX Ctrl+S ở service create/edit**
   - Xóa import + gọi `useFormShortcuts` khỏi 2 file service create/edit.
   - Xóa text `Ctrl+S để lưu` và các `title="Lưu (Ctrl+S)"`/`title="Hủy (Esc)"` không cần thiết.
   - Giữ submit qua button chính như posts/products.

3. **Làm clean action bar cho service edit theo posts/products**
   - Giữ nút `Hủy bỏ` + nút submit duy nhất với trạng thái `Đang lưu... / Cập nhật / Đã lưu` dựa trên dirty state.
   - Bỏ nút phụ `Lưu nháp` ở footer edit để tránh rối (status đã có dropdown trong card Xuất bản).
   - Chuẩn lại style disabled cho nút submit theo pattern module tương đồng.

4. **Làm clean action bar cho service create theo posts/products**
   - Giữ layout footer gọn: `Hủy bỏ` + submit chính (`Tạo dịch vụ` hoặc tương đương).
   - Bỏ text shortcut và nút phụ gây nhiễu nếu không cần.

5. **Tự review tĩnh trước bàn giao**
   - Soát type-safety, import thừa, logic null/undefined, đảm bảo không đổi API payload Convex ngoài phạm vi yêu cầu.

## Verification Plan
- Không chạy lint/test/build theo guideline repo.
- Verify tĩnh bằng code review:
  1. Ở **service create/edit**, nhập tiêu đề có dấu tiếng Việt → slug tự đổi đúng format không dấu.
  2. Vẫn cho phép sửa tay slug sau khi auto-generate.
  3. Không còn hiển thị `Ctrl+S để lưu` và không còn phụ thuộc `useFormShortcuts`.
  4. Edit có dirty-state rõ: chưa đổi gì thì nút ở trạng thái “Đã lưu”, đổi dữ liệu thì thành “Cập nhật”.
  5. Footer create/edit của service nhìn gọn và hành vi gần với posts/products.