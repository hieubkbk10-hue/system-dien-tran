## Audit Summary
### Observation
- User xác nhận lỗi thật sự là: sau toast save thành công, nút vẫn hiện `Lưu thay đổi` ở **cả 3 trang**; không phải chỉ còn màu xanh.
- User cũng xác nhận lỗi xảy ra ở **cả khi có chỉnh LexicalEditor lẫn khi chỉ sửa field thường**.
- `admin/settings` không gặp lỗi vì form của nó là object primitives (`string | boolean`) và dirty check chỉ là `form[key] !== initialForm[key]`, không có rich text editor và không có snapshot object phức tạp.
- Ở 3 trang edit hiện tại, dirty state phụ thuộc vào snapshot compare:
  - `products/services`: `JSON.stringify(initialSnapshotRef.current) !== JSON.stringify(currentSnapshot)`
  - `posts`: compare từng key giữa `initialSnapshotRef.current` và `currentSnapshot`
- Cả 3 trang đều dùng `LexicalEditor`, và `LexicalEditor` hiện:
  - chỉ hydrate `initialContent` **một lần** bằng `InitialContentPlugin` với `isInitializedRef`.
  - phát `onChange` bằng HTML generate từ Lexical (`$generateHtmlFromNodes(...)`).
- Điểm quan trọng: snapshot ban đầu ở page lấy từ dữ liệu server thô (`postData.content`, `serviceData.content`, `productData.description`), còn state runtime lấy từ HTML do Lexical generate. Hai chuỗi HTML này có thể **khác nhau về normalization** dù nội dung nhìn giống nhau.

### Inference
- Root cause khả dĩ nhất là dirty check đang so sánh **raw HTML từ server** với **normalized HTML từ Lexical runtime**. Kết quả là `hasChanges` có thể vẫn `true` sau save dù dữ liệu đã lưu thành công.
- Đây giải thích vì sao fix trước không hết: em mới chỉnh label/visual dựa trên `hasChanges`, nhưng chưa xử lý nguồn gốc khiến `hasChanges` bị kẹt `true`.
- `admin/settings` “ổn” vì không có editor HTML normalization problem, nên không phải do việc “vẫn ở trang edit sau save” tự thân gây lỗi.

### Counter-hypothesis đã xét
1. **Do ở lại trang edit sau save nên dirty state không reset** → Low confidence. `settings` vẫn ở cùng trang mà OK.
2. **Do chỉ màu nút chưa đổi** → đã bị loại trừ vì user xác nhận text vẫn là `Lưu thay đổi`.
3. **Do save mutation thất bại ngầm** → Low confidence, vì có toast success và dữ liệu thực tế đã lưu.
4. **Do snapshot baseline không dùng cùng chuẩn normalize với editor output** → High confidence, khớp nhất với evidence hiện có.

### Gap / external research
- Em đã thử WebSearch 2 lần để đối chiếu best practice dirty-state với editor HTML, nhưng tool đang trả `503 Service Unavailable`. Đây là gap về external evidence; spec dưới đây dựa trên evidence trực tiếp từ codebase.

## Root Cause Confidence
**High**

Lý do:
1. Triệu chứng thực tế khớp với dirty flag bị kẹt `true`, không phải lỗi màu.
2. `admin/settings` không dùng rich text HTML nên không gặp vấn đề tương tự.
3. `LexicalEditor` xuất HTML runtime, còn snapshot ban đầu lấy raw HTML server; string compare kiểu này rất dễ lệch dù semantic giống nhau.
4. Fix trước chỉ đổi label/style mà không đụng dirty-source, nên việc user nói “không thấy thay đổi gì” là phù hợp với giả thuyết này.

## Proposal (actionable)
### Hướng fix recommend
Tạo một lớp **normalize snapshot** dùng chung cho rich text HTML trước khi tính `initialSnapshot` và `currentSnapshot`, để dirty check chỉ so cùng một representation.

### Các bước cụ thể
1. **Tạo helper normalize rich text HTML**
   - File mới đề xuất: `app/admin/lib/normalize-rich-text.ts`
   - Logic nhỏ, an toàn, dễ rollback:
     - trim chuỗi
     - chuẩn hóa empty states kiểu `''`, `<p><br></p>`, `<p></p>` về `''`
     - parse HTML bằng `DOMParser` khi ở client-safe usage hoặc dùng strategy string-only tối giản nếu muốn tránh phụ thuộc DOM ở module shared
     - sort/normalize khác biệt trivial nếu có thể, nhưng giữ scope nhỏ: ưu tiên empty + whitespace + wrapper đơn giản

2. **Áp helper vào Products**
   - File: `app/admin/products/[id]/edit/page.tsx`
   - Normalize `description` ở cả:
     - `initialSnapshotRef.current.description`
     - `currentSnapshot.description`
   - Không đổi flow saveStatus hiện có.

3. **Áp helper vào Posts**
   - File: `app/admin/posts/[id]/edit/page.tsx`
   - Normalize `content` ở cả baseline và current snapshot.
   - Nếu cần, normalize luôn `excerpt` để giữ logic nhất quán nhưng chỉ khi evidence cho thấy field này cũng bị noise; mặc định chỉ `content` để tránh mở rộng scope.

4. **Áp helper vào Services**
   - File: `app/admin/services/[id]/edit/page.tsx`
   - Normalize `content` ở cả baseline và current snapshot.

5. **Bổ sung guard cho baseline sau save**
   - Sau mutation success, thay vì `initialSnapshotRef.current = currentSnapshot` raw object, dùng `initialSnapshotRef.current = normalizedCurrentSnapshot` để đảm bảo baseline luôn cùng chuẩn so sánh.

6. **Không đổi route flow sau save**
   - Giữ nguyên việc stay on edit page như anh muốn.
   - Không redirect, không refresh cưỡng bức, không hack `router.refresh()` trừ khi audit sau đó chứng minh thật sự cần; hiện tại chưa đủ evidence để thêm side effect đó.

## File-level Plan
- `app/admin/lib/normalize-rich-text.ts`
  - thêm helper normalize HTML rich text.
- `app/admin/products/[id]/edit/page.tsx`
  - dùng helper cho `description` trong snapshot baseline/current.
- `app/admin/posts/[id]/edit/page.tsx`
  - dùng helper cho `content` trong snapshot baseline/current.
- `app/admin/services/[id]/edit/page.tsx`
  - dùng helper cho `content` trong snapshot baseline/current.

## Verification Plan
- Theo guideline repo, không chạy lint/test/build ngoài `bunx tsc --noEmit` nếu có đổi TS/code.
- Static review cần pass:
  1. Dirty check ở 3 page dùng cùng normalization cho baseline/current.
  2. Không làm thay đổi payload save hiện tại.
  3. Không ảnh hưởng behavior stay-on-edit-page.
- Repro checklist cho tester:
  1. Mở edit products/posts/services.
  2. Chỉ sửa 1 field text thường rồi save → toast success → nút phải thành `Đã lưu`.
  3. Chỉ sửa nội dung editor rồi save → toast success → nút phải thành `Đã lưu`.
  4. Không F5, sửa tiếp 1 ký tự → nút quay lại `Lưu thay đổi`.
  5. Reload page sau save → vẫn clean state như cũ.

Nếu anh duyệt spec này, em sẽ implement theo hướng normalize snapshot trước, vì đây là hướng ít invasive nhất nhưng đánh đúng root cause hiện tại.