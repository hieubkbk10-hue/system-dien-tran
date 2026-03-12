## Audit Summary
- Observation 1: `WebSearch` đã repro lỗi 503 (service unavailable).
- Observation 2: `WebFetch` (FetchUrl) chỉ fetch được URL cụ thể do user cung cấp, không tự tìm nguồn như search engine.
- Inference: `WebFetch` **không thay thế hoàn toàn** `WebSearch`; chỉ thay được bước “đọc nội dung” sau khi đã có URL.
- Decision (theo lựa chọn của bạn):
  1) Mặc định: dùng `WebSearch` trước.
  2) Nếu `WebSearch` lỗi: fallback sang `Execute` với lệnh Claude websearch.
  3) Auto mention fallback command **chỉ khi WebSearch lỗi**.

## Root Cause Confidence
- High — có evidence lỗi thật từ tool call 503 và khác biệt chức năng giữa `WebSearch` vs `WebFetch` là rõ theo cơ chế tool.
- Counter-hypothesis: “WebFetch thay hẳn WebSearch” bị loại vì WebFetch không có khả năng discovery/query index.

## Proposal
Sửa đúng 2 file guideline (mirror theo Sync Rule):
1. `E:\NextJS\persional_project\system-dien-tran\AGENTS.md`
2. `E:\NextJS\persional_project\system-dien-tran\CLAUDE.md`

Thêm 2 dòng ngắn ở section quy tắc dùng tools:
- `WebSearch là mặc định cho nhu cầu tra cứu; WebFetch chỉ dùng để đọc URL đã biết, không thay thế chức năng search.`
- `Nếu WebSearch lỗi (vd 503), auto mention fallback: Execute (claude --dangerously-skip-permissions "websearch <query>", impact: medium).`

Ghi chú an toàn (ngắn, không mở rộng scope):
- Vì bạn chọn “cho phép mặc định cho mọi lệnh”, spec sẽ giữ nguyên câu lệnh có `--dangerously-skip-permissions` như fallback được mention tự động khi WebSearch lỗi.

## Verification Plan
- Re-read 2 file để xác nhận có đúng 2 dòng mới và nội dung mirror 1:1.
- Không chạy lint/test/build (theo guideline repo).
- Sau khi bạn duyệt spec, mới tiến hành edit + commit (không push).