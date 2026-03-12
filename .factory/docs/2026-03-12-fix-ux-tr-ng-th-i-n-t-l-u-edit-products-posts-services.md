## Audit Summary
### Observation
- Ở cả 3 trang edit, nút submit đang render theo `isSubmitting ? 'Đang lưu...' : (hasChanges ? ... : 'Đã lưu')`:
  - `app/admin/products/[id]/edit/page.tsx` (khu vực button cuối form).
  - `app/admin/posts/[id]/edit/page.tsx` (khu vực button cuối form).
  - `app/admin/services/[id]/edit/page.tsx` (khu vực button cuối form).
- Sau submit success, code gán `initialSnapshotRef.current = currentSnapshot`, nên về logic `hasChanges` phải về `false` ngay.
- Nhưng ở Posts/Services có `LexicalEditor` dùng `initialContent={postData.content|serviceData.content}` + state `content`; component cha có `useEffect` set lại toàn bộ field khi `postData/serviceData` đổi. Khi query cập nhật lại từ server sau mutation, effect này có thể ghi đè state local không đồng bộ thời điểm, làm `hasChanges` chưa ổn định tức thì.

### Inference
- Nguyên nhân UX “đã lưu nhưng nút chưa đổi ngay” là phụ thuộc hoàn toàn vào `hasChanges` (snapshot diff) trong khi dữ liệu giàu state (đặc biệt editor) có thể cập nhật lệch nhịp 1 vòng render sau mutation/query refresh.
- Đây là vấn đề state machine của UI nút save, không phải lỗi lưu dữ liệu backend (vì mutation thành công + có toast success).

### Decision
- Tách trạng thái hiển thị nút khỏi diff thuần bằng một state UI rõ ràng: `saveStatus: 'idle' | 'saving' | 'saved'`.
- Theo yêu cầu của anh: giữ `"Đã lưu"` cho tới khi có chỉnh sửa mới.
- Chuẩn hóa text giữa 3 trang: `"Lưu thay đổi" / "Đang lưu..." / "Đã lưu"`.

## Root Cause Confidence
**High**

Lý do:
1. Triệu chứng khớp mô tả: mutation lưu thành công nhưng nhãn nút không cập nhật ngay.
2. Cả 3 file đang dùng chung pattern phụ thuộc `hasChanges` để quyết định label.
3. Có giả thuyết thay thế đã xét: backend không lưu -> bị loại trừ vì có toast success và dữ liệu thực tế đã lưu.
4. Tiêu chí pass/fail rõ: ngay sau success phải thấy `Đã lưu` không cần F5.

(Đáp ứng protocol 5/8 câu: #1 triệu chứng, #2 phạm vi, #3 tái hiện ổn định trên 3 trang edit, #6 giả thuyết thay thế, #8 tiêu chí pass/fail.)

## Proposal (actionable)
1. **Products edit** (`app/admin/products/[id]/edit/page.tsx`)
   - Thêm `saveStatus` state.
   - Submit flow:
     - trước mutation: `saveStatus='saving'`
     - success: cập nhật `initialSnapshotRef.current = currentSnapshot`, rồi `saveStatus='saved'`
     - error: `saveStatus='idle'`
   - Thêm effect: khi người dùng chỉnh bất kỳ field nào làm `hasChanges=true` thì reset `saveStatus='idle'`.
   - Update button label theo priority: `saving -> 'Đang lưu...'`, `saved && !hasChanges -> 'Đã lưu'`, còn lại `Lưu thay đổi`.

2. **Posts edit** (`app/admin/posts/[id]/edit/page.tsx`)
   - Áp dụng cùng state machine như Products.
   - Đồng thời chuẩn hóa text hiện đang là `Cập nhật` thành `Lưu thay đổi`.

3. **Services edit** (`app/admin/services/[id]/edit/page.tsx`)
   - Áp dụng cùng state machine như Products.
   - Chuẩn hóa text hiện đang là `Cập nhật` thành `Lưu thay đổi`.

4. **Guard logic disable button (giữ nguyên hành vi hiện tại)**
   - Vẫn `disabled={isSubmitting || !hasChanges}` để ngăn save thừa.
   - Khi `saved` và chưa có thay đổi mới: disabled + label `Đã lưu`.

## Verification Plan
- Vì repo guideline cấm chạy lint/unit test/build, em sẽ **không chạy** các lệnh đó.
- Thực hiện static self-review sau sửa:
  1. Type safety: kiểm tra union type `saveStatus` và nhánh render không thiếu case.
  2. Null-safety: không đụng dữ liệu query null/undefined ngoài flow hiện hữu.
  3. UX repro checklist thủ công (để tester chạy):
     - Mở 3 route edit (products/posts/services) -> sửa 1 field -> nút phải là `Lưu thay đổi`.
     - Bấm lưu -> ngay khi success, nút thành `Đã lưu` không cần F5.
     - Sửa tiếp 1 ký tự -> nút quay lại `Lưu thay đổi`.
     - Khi đang submit -> `Đang lưu...` + spinner.

Nếu anh duyệt spec này, em sẽ implement đúng 3 file trên, scope nhỏ, dễ rollback.