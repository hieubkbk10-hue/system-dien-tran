## Audit Summary
**Observation (evidence):**
- Lỗi hiện tại vẫn phát nổ ở `ExtendedTextNode` với thông báo mismatch type `text`, dù đã thêm `ExtendedTextNode` vào `nodes`. Evidence: stack trace mới dừng tại `LexicalEditor.useMemo[initialConfig]` và file `app/admin/components/nodes/ExtendedTextNode.ts` vẫn khai báo `getType() = 'text'`.
- `LexicalEditor.tsx` hiện đã bị mở rộng thành editor 3 mode (`richtext`, `markdown`, `html-raw`) + preview + marker `<!--format:...-->`, khác hẳn baseline cũ tại commit `76240ab4`, nơi Lexical chỉ nhận/emit HTML thuần.
- User xác nhận không cần giữ flow WYSIWYG/multi-mode mới; muốn hành vi Lexical quay về như trước khi bắt đầu sửa, còn markdown/html chỉ cần hoạt động ổn định.

**Root-cause Q&A (rút gọn theo protocol):**
1) Expected vs Actual: expected editor behave như commit cũ, không crash, mô tả có sẵn hiển thị lại bình thường; actual crash do custom text node override và state 3-mode chen vào flow khởi tạo.  
2) Phạm vi: toàn bộ admin screens dùng `LexicalEditor`.  
3) Repro: ổn định khi editor khởi tạo `initialConfig` có `ExtendedTextNode` type `text`.  
4) Mốc thay đổi gần nhất: commit `39cab4cc` thêm `ExtendedTextNode`; sau đó commit `038ce104` thêm đăng ký node; cùng lúc file editor đã bị refactor sang 3 mode từ commit này.  
6) Giả thuyết thay thế: lỗi do content HTML bẩn — chưa phải root cause chính vì crash xảy ra ngay ở phase đăng ký/tạo node custom.  
8) Pass/fail: editor không còn lỗi console; nội dung cũ load lại như trước; markdown/html vẫn render/lưu đúng mà không ép qua custom text node lỗi.

## Root Cause Confidence
**High** — vì có hai thay đổi lớn cùng lúc: (1) custom `ExtendedTextNode` ghi đè type core `text`, (2) editor bị refactor sang kiến trúc 3 mode/state mới. Cả hai đều lệch khỏi baseline commit `76240ab4`, còn user lại muốn quay về hành vi cũ của Lexical.

## Proposal
Em sẽ đi theo hướng rollback có chọn lọc, ít rủi ro:

1. **Khôi phục `LexicalEditor.tsx` về hành vi Lexical cũ làm baseline**
   - Bỏ flow 3 mode trong chính `LexicalEditor` (`mode`, `markdownContent`, `htmlContent`, preview button, marker emit).
   - Giữ editor Lexical HTML-only như commit `76240ab4` để load/save mô tả đúng hành vi cũ.
2. **Loại bỏ integration `ExtendedTextNode` khỏi `LexicalEditor`**
   - Không đăng ký `ExtendedTextNode`, không replace `TextNode` nữa.
   - Nếu file `ExtendedTextNode.ts` không còn ai dùng, có thể xoá luôn trong bước implement; nếu còn cần giữ tạm, sẽ ngắt import và usage trước.
3. **Fix markdown/html ở lớp ngoài Lexical, không trộn vào editor core**
   - `LexicalEditor` chỉ xử lý HTML/rich text như cũ.
   - Phần markdown/html (nếu đang cần cho public render hoặc admin input khác) sẽ để `RichContent`/renderer ngoài xử lý bằng marker hiện có, không ép Lexical phải hiểu nhiều mode.
4. **Giữ compatibility dữ liệu cũ**
   - `InitialContentPlugin` tiếp tục parse `initialContent` như HTML thuần.
   - Với plain text/raw text, giữ đúng hành vi cũ: DOMParser/Lexical tự wrap vào paragraph khi cần, không auto-convert sang markdown mode.

## Verification Plan
- Static verify:
  - `LexicalEditor.tsx` không còn import/use `ExtendedTextNode`, `detectFormat`, `withFormatMarker`, state 3 mode.
  - `initialConfig.nodes` chỉ còn các node chuẩn như baseline cũ.
  - `onChange` của editor chỉ emit HTML như trước.
- Command verify theo rule repo:
  - Chỉ chạy `bunx tsc --noEmit` nếu có thay đổi TS/code.
- Manual repro checklist:
  1) Mở form admin có mô tả cũ.
  2) Xác nhận editor load được text cũ, không console error.
  3) Sửa mô tả, lưu, reload lại.
  4) Xác nhận markdown/html renderer ngoài editor vẫn hiển thị đúng ở nơi đang dùng `RichContent`.

## Decision
Em recommend hướng này vì khớp đúng yêu cầu mới của anh/chị: bỏ WYSIWYG/multi-mode custom, quay về behavior Lexical cũ để giảm rủi ro, còn markdown/html được giữ ở lớp renderer riêng — đơn giản hơn và ít đụng core editor hơn.