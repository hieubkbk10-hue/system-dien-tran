# Spec: Fix trạng thái nút lưu không cập nhật ngay sau khi save (Product/Post/Service Edit)

## Pre-Audit

### Bối cảnh
- User report: tại các route edit Product/Post/Service, sau khi lưu thành công thì nút vẫn hiện **"Lưu thay đổi"**, chỉ sau khi F5 mới thành **"Đã lưu"**.
- Scope yêu cầu: **chỉ tạo spec trong `.factory/docs`, không sửa code**.

### Scope bị ảnh hưởng
- `app/admin/products/[id]/edit/page.tsx`
- `app/admin/posts/[id]/edit/page.tsx`
- `app/admin/services/[id]/edit/page.tsx`
- Liên quan shared editor: `app/admin/components/LexicalEditor.tsx`

---

## Audit Summary

### Observation (Evidence)
1. Nút chỉ hiển thị `Đã lưu` khi thỏa `saveStatus === 'saved' && !hasChanges`:
   - `app/admin/products/[id]/edit/page.tsx:793-795`
   - `app/admin/posts/[id]/edit/page.tsx:354-356`
   - `app/admin/services/[id]/edit/page.tsx:409-411`

2. `hasChanges` phụ thuộc so sánh snapshot (`initialSnapshotRef.current`) và `currentSnapshot`:
   - Product: `app/admin/products/[id]/edit/page.tsx:187-190`
   - Post: `app/admin/posts/[id]/edit/page.tsx:75-80`
   - Service: `app/admin/services/[id]/edit/page.tsx:93-96`

3. Sau save thành công, code set `initialSnapshotRef.current = currentSnapshot` và `setSaveStatus('saved')`, tức về lý thuyết nút phải về `Đã lưu` ngay:
   - Product: `app/admin/products/[id]/edit/page.tsx:373-374`
   - Post: `app/admin/posts/[id]/edit/page.tsx:149-150`
   - Service: `app/admin/services/[id]/edit/page.tsx:171-172`

4. `LexicalEditor` chỉ nạp `initialContent` **một lần** vì guard `isInitializedRef.current`:
   - `app/admin/components/LexicalEditor.tsx:403-439`

5. `OnChangePlugin` vẫn tiếp tục đẩy HTML mới lên parent state (`setContent`/`setDescription`) trong suốt vòng đời editor:
   - `app/admin/components/LexicalEditor.tsx:519-523`

6. Product edit chỉ hydrate từ `productData` ở lần đầu (`!isDataLoaded`), không đồng bộ lại sau save/query refresh:
   - `app/admin/products/[id]/edit/page.tsx:203-247`

7. Khu vực này vừa được chỉnh liên tiếp qua 3 commit gần nhất:
   - `c1385c5c` (update save button status)
   - `87d67e37` (align saved button visuals)
   - `377d51d7` (normalize rich text snapshots)

### Inference
- Vấn đề không nằm ở mutation save thất bại (user xác nhận dữ liệu đã lưu).
- Vấn đề nằm ở **state synchronization sau save**: `hasChanges` bị giữ `true` do snapshot và state editor/form có thể lệch nhau sau submit.
- Cơ chế init one-shot của `LexicalEditor` + onChange liên tục là điểm nghi ngờ mạnh nhất tạo drift.

### Decision
- Chọn hướng fix ở tầng state-sync và snapshot consistency, không đụng business logic backend.

---

## Root Cause Analysis (8 câu bắt buộc)

1. **Triệu chứng (expected vs actual)**
   - Expected: save thành công thì nút chuyển ngay sang `Đã lưu`, disabled.
   - Actual: vẫn `Lưu thay đổi`, chỉ F5 mới về `Đã lưu`.

2. **Phạm vi ảnh hưởng**
   - User: Admin thao tác edit Product/Post/Service.
   - Module: UI trạng thái lưu (dirty-state) + rich text sync.

3. **Có tái hiện ổn định không? điều kiện tối thiểu?**
   - Theo report: tái hiện trên 3 màn edit chính.
   - Điều kiện tối thiểu: vào trang edit có rich text, chỉnh sửa, bấm lưu, quan sát label nút.

4. **Mốc thay đổi gần nhất**
   - 3 commit liên tiếp cùng vùng logic save-state trong ngày 2026-03-12 (`c1385c5c`, `87d67e37`, `377d51d7`).

5. **Dữ liệu còn thiếu để chốt 100%**
   - Chưa có runtime trace value của `currentSnapshot` vs `initialSnapshotRef.current` ngay sau submit (theo từng field).
   - Chưa có trace event order của `OnChangePlugin` quanh thời điểm save-success.

6. **Giả thuyết thay thế chưa loại trừ hoàn toàn**
   - Giả thuyết B: backend normalize dữ liệu khác với snapshot local (đặc biệt field SEO fallback hoặc rich text).
   - Giả thuyết C: một số effect hậu save đổi state làm dirty lại (ví dụ mode/field phụ thuộc settings).

7. **Rủi ro nếu fix sai nguyên nhân**
   - Nút hiển thị sai trạng thái dẫn đến admin tưởng chưa lưu và thao tác lặp.
   - Có thể phát sinh mất đồng bộ giữa nội dung editor hiển thị và dữ liệu đã persist.

8. **Tiêu chí pass/fail sau khi sửa**
   - Pass: sau save thành công, nút đổi `Đã lưu` trong cùng phiên, không cần F5, ở cả Product/Post/Service.
   - Fail: còn trường hợp save thành công nhưng nút vẫn `Lưu thay đổi` cho đến khi reload.

---

## Counter-Hypothesis

1. **Không phải lỗi visual-only của button**
   - Vì text label phụ thuộc trực tiếp `hasChanges`, không chỉ CSS class.

2. **Không phải save thất bại**
   - User xác nhận dữ liệu đã lưu; code success path có toast + set `saveStatus('saved')`.

3. **Không phải một file đơn lẻ**
   - Cùng pattern xuất hiện ở cả Product/Post/Service, nên là lỗi pattern/state management chung.

---

## Proposal (không sửa code trong task này)

### Option A (Recommend) — Confidence 85%
Đồng bộ snapshot theo **payload thực tế đã persist** + thêm cơ chế reset editor có chủ đích sau save.

#### Step-by-step implementation plan
1. Tạo helper snapshot thống nhất cho từng trang edit (Product/Post/Service):
   - Input: current form state.
   - Output: snapshot đã normalize giống logic submit (bao gồm rich text, trim, fallback metadata nếu có).

2. Trong `handleSubmit` success:
   - Tạo `persistedSnapshot` từ đúng dữ liệu đã gửi mutation (không dùng trực tiếp object UI chưa normalize đầy đủ).
   - Gán `initialSnapshotRef.current = persistedSnapshot`.

3. Bổ sung cơ chế đồng bộ lại LexicalEditor sau save (controlled reset token):
   - Cho `LexicalEditor` nhận `resetKey`/`version` để rehydrate nội dung khi cần.
   - Chỉ trigger sau save thành công hoặc khi reload record, tránh reset trong lúc đang gõ.

4. Với Product edit, cân nhắc bỏ điều kiện one-shot `!isDataLoaded` cho nhánh đồng bộ hậu-save hoặc thêm nhánh sync riêng hậu-save để tránh drift state server/local.

5. Giữ nguyên UX hiện tại của nút (`Đang lưu...` / `Lưu thay đổi` / `Đã lưu`), chỉ sửa điều kiện dirty-state để phản ánh đúng trạng thái thực.

#### Files dự kiến cần thay đổi
- `app/admin/products/[id]/edit/page.tsx`
- `app/admin/posts/[id]/edit/page.tsx`
- `app/admin/services/[id]/edit/page.tsx`
- `app/admin/components/LexicalEditor.tsx`

### Option B — Confidence 60%
Chỉ tăng cường normalize khi so sánh `hasChanges` (không chỉnh sync editor).
- Ưu: thay đổi nhỏ hơn.
- Nhược: có thể vẫn còn race condition/state drift do editor lifecycle, nên không triệt để.

---

## Root Cause Confidence
**Medium-High**
- Lý do: evidence code mạnh ở lifecycle editor one-shot + onChange liên tục + snapshot compare logic; phù hợp triệu chứng “F5 thì hết”.
- Chưa đạt High tuyệt đối vì chưa có runtime field-level trace để chốt điểm lệch cụ thể theo từng lần save.

---

## Post-Audit
- Kết luận tạm thời đủ mạnh để triển khai fix theo Option A.
- Cần thêm instrumentation ngắn hạn (chỉ trong quá trình debug) nếu muốn nâng confidence lên High trước khi merge.

---

## Verification Plan

### 1) Typecheck
- Nếu triển khai code theo spec: chạy `bunx tsc --noEmit` trước commit.

### 2) Test
- Theo project rule hiện tại: không tự chạy lint/unit test trong task này.
- QA/tester thực hiện runtime verification.

### 3) Repro checklist (manual)
1. Mở:
   - `/admin/products/:id/edit`
   - `/admin/posts/:id/edit`
   - `/admin/services/:id/edit`
2. Thay đổi 1 field text thường, lưu.
3. Thay đổi 1 field rich text, lưu.
4. Với Product, test thêm các case có/không variants và digital/physical.
5. Kỳ vọng mỗi lần save thành công:
   - Nút chuyển `Đã lưu` ngay (không F5).
   - Nút disabled khi không còn thay đổi.
   - Sửa tiếp dữ liệu thì nút quay lại `Lưu thay đổi`.
