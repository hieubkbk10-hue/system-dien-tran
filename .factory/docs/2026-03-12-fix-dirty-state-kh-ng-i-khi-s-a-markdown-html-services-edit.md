## Audit Summary
**Observation (expected vs actual):**
- Expected: ở `/admin/services/[id]/edit`, khi sửa `markdownRender` hoặc `htmlRender` thì nút phải đổi từ **"Đã lưu"** sang **"Lưu thay đổi"**.
- Actual: user sửa nội dung markdown/html nhưng trạng thái vẫn giữ **"Đã lưu"**.

**Evidence:**
- `app/admin/services/[id]/edit/page.tsx` có `currentSnapshot` chứa `renderType/markdownRender/htmlRender`.
- Nhưng dependency array của `useMemo(currentSnapshot)` đang thiếu 3 state này (chỉ có `categoryId, normalizedContent, duration, ...`). Khi thiếu dependency, snapshot không recompute khi sửa markdown/html/renderType, nên `hasChanges` không đổi.
- Logic nút save dựa trực tiếp vào `hasChanges` + `saveStatus` (`Đã lưu` vs `Lưu thay đổi`), nên lỗi biểu hiện đúng như user report.
- `app/admin/services/create/page.tsx` không có cơ chế `hasChanges/saveStatus` kiểu “Đã lưu/Lưu thay đổi”, nên không có bug cùng loại ở create (chỉ có luồng submit tạo mới).

## Root Cause Confidence
**High** — vì condition dirty-state phụ thuộc `currentSnapshot`, và snapshot đang không subscribe vào `renderType/markdownRender/htmlRender`; đây là nguyên nhân trực tiếp khiến chỉnh markdown/html không trigger trạng thái thay đổi.

## Proposal
1. Sửa dependency array của `useMemo(currentSnapshot)` trong `app/admin/services/[id]/edit/page.tsx` để thêm:
   - `renderType`
   - `markdownRender`
   - `htmlRender`
2. Giữ nguyên toàn bộ logic `hasChanges`, `saveStatus`, `persistedSnapshot` hiện tại (không mở rộng scope).
3. Audit nhanh luồng markdown/html:
   - Load từ `serviceData` vào state
   - So sánh snapshot
   - Submit `updateService`
   - Reset snapshot sau save
   để xác nhận không còn điểm lệch tương tự.

## Verification Plan
- Chạy `bunx tsc --noEmit`.
- Repro thủ công tại `/admin/services/[id]/edit`:
  1) mở bản ghi đã lưu,
  2) sửa `markdownRender` hoặc `htmlRender`,
  3) xác nhận nút chuyển sang **"Lưu thay đổi"**,
  4) bấm lưu xong quay lại **"Đã lưu"**.
- Spot check thêm thay đổi `renderType` cũng phải trigger dirty-state tương tự.