## Audit Summary
- Observation: Nhu cầu hiện tại là giảm độ trễ do invoke tool tuần tự, đặc biệt với tác vụ nhiều bước hoặc nhiều nguồn tra cứu.
- Observation: Bạn yêu cầu cập nhật **trực tiếp guideline trong AGENTS.md** và muốn mức **playbook đầy đủ** (nguyên tắc + template prompt + anti-pattern).
- Observation: Repo có `Sync Rule`: nếu sửa guideline cốt lõi ở `AGENTS.md` thì mirror sang `CLAUDE.md` trong cùng task.
- Inference: Cần bổ sung 1 section mới mang tính vận hành chuẩn team, ưu tiên `Task` subagent song song, đồng thời quy định khi nào dùng `multi_tool_use.parallel`.
- Decision: Thực hiện chỉnh sửa guideline theo hướng **Task-first parallel execution playbook**, giữ tương thích các rule hiện có (KISS/YAGNI, không mở rộng ngoài scope).

## Root Cause Confidence
- High — giới hạn tốc độ chủ yếu đến từ workflow tuần tự; capability chạy song song đã có sẵn qua `Task` và `parallel`, nhưng chưa được chuẩn hóa thành quy trình bắt buộc trong guideline nội bộ.

## Proposal (những gì sẽ sửa)
### 1) Cập nhật `AGENTS.md` (thêm section mới dưới nhóm Execution)
Thêm section mới dự kiến tên: **Parallel Execution Playbook (Task-first)**, gồm:

1. **Nguyên tắc chọn cơ chế song song**
   - Ưu tiên `Task` khi workload lớn, tách được thành các nhánh độc lập.
   - Dùng `multi_tool_use.parallel` cho các tool call read-only độc lập (Read/Grep/Glob/LS/Execute read-only).
   - Chỉ chạy tuần tự cho các bước có dependency (edit cùng file, staging, commit).

2. **Quy trình chuẩn 5 bước (SOP)**
   - Decompose → Spawn Tasks song song → Parallel đọc trong từng nhánh → Barrier hợp nhất → Apply tuần tự tối thiểu.

3. **Template prompt chuẩn team (copy-paste)**
   - Mẫu Task A/B/C cho: discovery, proposal, risk-check.
   - Mẫu “expected output format” để tổng hợp nhanh (file paths, risks, recommendation).

4. **Anti-pattern cần tránh**
   - Song song khi phụ thuộc dữ liệu.
   - 2 nhánh sửa cùng 1 file.
   - Chuỗi WebSearch nối tiếp không gom batch.
   - Dùng Task cho việc quá nhỏ (overhead cao).

5. **Rule ưu tiên tốc độ nhưng an toàn**
   - “Một in_progress path chính, nhiều nhánh song song chỉ khi độc lập.”
   - “Không hy sinh tính đúng/scope để đổi lấy tốc độ.”

### 2) Mirror sang `CLAUDE.md`
- Sao chép nguyên section mới để đồng bộ theo Sync Rule.

### 3) Không đụng phần không liên quan
- Chỉ thêm guideline playbook và chỉnh wording tối thiểu nếu có câu mâu thuẫn trực tiếp với Task-first.

## Dự thảo nội dung sẽ chèn (rút gọn)
- **Task-first mặc định** cho bài toán lớn.
- **parallel tool calls** là lớp tối ưu cấp thao tác, không thay Task ở cấp chiến lược.
- **Barrier merge bắt buộc** trước khi edit/commit.
- **Template prompt** gồm: Goal, Context, Constraints, Questions, Expected output.
- **Anti-pattern**: shared-file edits, dependency race, song song giả tạo.

## Verification Plan
- Re-read `AGENTS.md` + `CLAUDE.md` xác nhận section mới đồng nhất nội dung.
- Kiểm tra section mới không mâu thuẫn với: KISS/YAGNI, Audit protocol, Sync Rule, commit rules hiện hữu.
- Kiểm tra độ rõ ràng: người mới có thể áp dụng theo template mà không cần suy diễn thêm.

Nếu bạn duyệt spec này, mình sẽ thực thi: cập nhật `AGENTS.md` + mirror `CLAUDE.md`, rồi commit theo đúng quy tắc repo.