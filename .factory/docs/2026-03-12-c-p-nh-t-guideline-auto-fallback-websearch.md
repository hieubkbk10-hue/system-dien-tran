## Audit Summary
- Observation: Khi `WebSearch` lỗi `503 Service Unavailable`, guideline hiện tại trong `AGENTS.md`/`CLAUDE.md` ghi: `auto mention fallback: Execute (claude --dangerously-skip-permissions "websearch <query>", impact: medium)`.
- Observation: Cách viết này khiến agent thông báo fallback rồi hỏi lại user, như đúng tình huống bạn vừa gặp.
- Inference: Root cause không nằm ở logic tool mà ở policy wording chưa đủ rõ về quyền tự động chạy fallback và không được xin phép lại.
- Decision: Sửa guideline trong cả `AGENTS.md` và `CLAUDE.md` để bắt buộc tự động chạy fallback khi `WebSearch` lỗi, không hỏi xác nhận, rồi trả kết quả trực tiếp.

## Root Cause Confidence
- High — vì evidence nằm ngay trong rule hiện tại: có nói đến fallback nhưng chỉ ở mức “mention”, không nói rõ “thực thi ngay” và “không hỏi lại”. Điều này giải thích trực tiếp hành vi vừa xảy ra.

## Proposal
1. Cập nhật mục `Execution & Verification Rules` trong `AGENTS.md`:
   - đổi rule từ `auto mention fallback` thành `tự động chạy fallback bằng Execute`.
   - thêm câu rõ ràng: `không hỏi user xin phép lại khi WebSearch lỗi tạm thời như 503/timeout/network`.
   - thêm hành vi sau fallback: `nếu fallback thành công thì trả kết quả luôn; nếu fallback cũng lỗi thì mới báo lỗi ngắn gọn và nêu nguyên nhân`.
2. Mirror cùng nội dung sang `CLAUDE.md` theo `Sync Rule`.
3. Giữ thay đổi nhỏ, chỉ chạm đúng đoạn guideline liên quan, không mở rộng sang các policy khác.

## Proposed wording
- Thay dòng hiện tại bằng ý sau:
  - `Nếu WebSearch lỗi tạm thời (ví dụ 503, timeout, network), tự động dùng Execute chạy fallback: claude --dangerously-skip-permissions "websearch <query>"; không hỏi lại user để xin phép. Nếu fallback thành công thì trả kết quả trực tiếp; nếu fallback cũng lỗi thì mới báo ngắn gọn kèm nguyên nhân.`

## Verification Plan
- Re-read `AGENTS.md` và `CLAUDE.md` để xác nhận 2 file đồng bộ.
- Kiểm tra wording mới không mâu thuẫn với các rule hiện có.
- Không chạy lint/test/build theo guideline repo; chỉ review tĩnh nội dung thay đổi vì đây là chỉnh policy text.

Nếu bạn duyệt spec này, mình sẽ sửa đúng 2 file `AGENTS.md` và `CLAUDE.md`, rồi commit thay đổi.