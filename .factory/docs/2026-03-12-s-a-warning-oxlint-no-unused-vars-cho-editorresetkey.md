## Audit Summary
- Observation: `bunx oxlint --type-aware --type-check --fix` báo 3 warning `eslint(no-unused-vars)` cho cùng pattern `setEditorResetKey` không được dùng ở:
  - `app/admin/posts/[id]/edit/page.tsx`
  - `app/admin/services/[id]/edit/page.tsx`
  - `app/admin/products/[id]/edit/page.tsx`
- Observation: Ở cả 3 file, state đang khai báo dạng `[editorResetKey, setEditorResetKey] = useState(0)` nhưng phần setter không còn được gọi ở đâu trong file.
- Observation: `editorResetKey` hiện vẫn được truyền xuống `LexicalEditor` ở edit pages, nên key này vẫn còn tác dụng; chỉ riêng setter là dư thừa.
- Inference: Warning đến từ refactor trước đó làm mất nhu cầu reset editor thủ công, nhưng chưa dọn state destructuring.
- Decision: Sửa tối thiểu bằng cách đổi destructuring để chỉ giữ giá trị đọc, bỏ setter không dùng.

## Root Cause Confidence
- High — vì warning chỉ ra chính xác symbol không dùng, và đọc 3 file đều cho thấy `setEditorResetKey` được khai báo nhưng không được tham chiếu.
- Counter-hypothesis đã loại trừ: không phải thiếu import hay config oxlint; warning lặp lại đúng cùng pattern ở 3 file.

## Proposal
1. Cập nhật 3 file edit page:
   - `app/admin/posts/[id]/edit/page.tsx`
   - `app/admin/services/[id]/edit/page.tsx`
   - `app/admin/products/[id]/edit/page.tsx`
2. Ở mỗi file, đổi:
   - từ `const [editorResetKey, setEditorResetKey] = useState(0);`
   - thành `const [editorResetKey] = useState(0);`
3. Không đụng logic khác, không đổi behavior của `LexicalEditor`, không mở rộng scope sang các warning/file khác.
4. Verify sau sửa bằng cách chạy lại đúng lệnh user đã dùng hoặc tối thiểu `bunx oxlint --type-aware --type-check --fix` để xác nhận 3 warning biến mất.

## Verification Plan
- Pass nếu không còn 3 warning `setEditorResetKey` trong oxlint output.
- Pass nếu không phát sinh type/lint warning mới ở 3 file vừa sửa.
- Không chạy lint/build/test khác ngoài phạm vi cần thiết cho warning này.