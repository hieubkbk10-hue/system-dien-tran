## Audit Summary
**Observation (evidence):**
- Lỗi runtime: `Create node: Type text in node ExtendedTextNode does not match registered node TextNode with the same type` tại `app/admin/components/nodes/ExtendedTextNode.ts:44`.
- `ExtendedTextNode.getType()` trả về `'text'` nhưng `initialConfig.nodes` trong `app/admin/components/LexicalEditor.tsx:578-583` chỉ khai báo replacement object (`replace: TextNode`, `withKlass: ExtendedTextNode`), chưa đăng ký class node theo cách Lexical 0.39 kỳ vọng khi tạo/import node type `text`.
- Dự án đang dùng `lexical` và toàn bộ `@lexical/*` version `0.39.0` (package.json + package-lock).

**Root-cause Q&A (rút gọn theo protocol):**
1) Expected vs Actual: expected editor load bình thường; actual crash khi parse/khởi tạo content có text node.  
2) Phạm vi: mọi màn admin dùng `LexicalEditor` (user đã chọn fix global).  
3) Repro: tái hiện ổn định khi mở editor richtext có initial content.  
6) Giả thuyết thay thế: lỗi do dữ liệu HTML bẩn/DOM parser — bị loại trừ vì stack trace dừng ở node registration/type check trước khi render xong.  
8) Pass/fail: không còn console error mismatch; editor mở/sửa/lưu content bình thường.

## Root Cause Confidence
**High** — vì thông báo lỗi chỉ rõ mismatch giữa cùng `type: 'text'` nhưng khác registered class (`TextNode` vs `ExtendedTextNode`), và code hiện tại đúng là đang override chưa đầy đủ contract đăng ký node cho Lexical 0.39.

## Proposal (SaaS-practice, ít rủi ro)
Em sẽ dùng hướng “chuẩn production”: **đăng ký `ExtendedTextNode` đầy đủ trong `nodes` rồi giữ replace pipeline** để vừa tránh crash vừa giữ behavior import/format hiện có.

### Thay đổi dự kiến
1. **`app/admin/components/LexicalEditor.tsx`**
   - Cập nhật `initialConfig.nodes` để include `ExtendedTextNode` class registration đúng chuẩn, sau đó mới apply `replace: TextNode -> ExtendedTextNode`.
   - Giữ nguyên các node khác (`HeadingNode`, `ListNode`, `ImageNode`...).
2. **`app/admin/components/nodes/ExtendedTextNode.ts`**
   - Giữ `getType(): 'text'`, `importDOM/importJSON/exportJSON` và hàm chuyển đổi hiện tại.
   - Chỉ tinh chỉnh tối thiểu nếu cần để tương thích registration mới (không đổi schema dữ liệu).
3. **Không mở rộng scope**
   - Không thay đổi data model/content marker.
   - Không động vào module ngoài editor.

### Counter-hypothesis handling
- Nếu sau khi đăng ký đầy đủ vẫn còn mismatch, fallback an toàn là tạm rút replacement về `TextNode` thuần (feature-preserving mức vừa) để chặn crash ngay; sau đó bóc tách riêng enhancement.

## Verification Plan
- Static verify tại code review:
  - Đảm bảo `nodes` registry không còn xung đột type `text`.
  - Kiểm tra flow `InitialContentPlugin` + `$generateNodesFromDOM` không tạo node ngoài registry.
- Command verify theo rule repo khi implement:
  - Chỉ chạy `bunx tsc --noEmit` (không chạy lint/unit test).
- Manual repro checklist:
  1) Mở `admin/products/[id]/edit` với content cũ.
  2) Switch WYSIWYG/Markdown/HTML qua lại.
  3) Sửa text + lưu, reload lại trang.
  4) Xác nhận không còn console error mismatch.