## Audit Summary
- Observation: `master...origin/master [ahead 1331, behind 97]` từ `git status -sb`.
- Observation: `master` đang track `origin/master` từ `.git/config` (`branch.master.remote origin`, `branch.master.merge refs/heads/master`).
- Observation: Repo có 2 remote: `origin` = GitHub của anh, `core` = repo local khác.
- Observation: VS Code hiện Sync Changes theo upstream của nhánh đang track, nên nó báo cả `97↓` và `1331↑` khi local/remote diverged.
- Inference: Không phải Git tự “muốn pull”; nó chỉ đang báo local thiếu 97 commit trên `origin/master` và dư 1331 commit so với remote đó.
- Decision: Vì anh xác nhận muốn giữ local làm chuẩn và chấp nhận ghi đè 97 commit trên remote, hướng đúng là force push `master` lên `origin/master`, không pull/merge/rebase.

## Root Cause Confidence
- High.
- Lý do: evidence trực tiếp từ `git status -sb`, `git branch -vv`, `git for-each-ref`, và `git remote -v` đều nhất quán: local `master` đang track `origin/master` nhưng lịch sử hai bên đã tách nhánh mạnh (diverged), nên VS Code hiển thị mũi tên lên/xuống theo upstream.
- Counter-hypothesis đã loại trừ: không phải do `pull.rebase`, vì config hiện chỉ là `pull.rebase=false`; nguyên nhân chính là divergence, không phải setting pull.

## Proposal
1. Kiểm tra lại lần cuối rằng working tree sạch và upstream vẫn là `origin/master`.
2. Force push an toàn hơn bằng `--force-with-lease` từ local `master` lên `origin/master`.
   - Mục tiêu: đưa remote GitHub về đúng trạng thái local hiện tại.
   - Ưu tiên `--force-with-lease` thay vì `--force` để tránh ghi đè ngoài ý muốn nếu remote vừa đổi thêm sau lúc mình audit.
3. Sau khi push xong, xác nhận divergence trở về 0 hoặc chỉ còn trạng thái đồng bộ.
4. Nếu anh muốn VS Code bớt gây hiểu nhầm về “Sync Changes”, có thể tiếp tục dùng `Push` thay vì `Sync`, hoặc tách workflow rõ hơn; không cần đổi config nếu sau force push hai bên đã thẳng hàng.

## File/State Impact
- Không sửa code dự án.
- Chỉ thay đổi lịch sử remote `origin/master` trên GitHub của anh.
- 97 commit hiện đang có trên remote nhưng không có ở local sẽ bị thay thế khỏi tip của `origin/master`.

## Risks
- Rủi ro chính: mất khả năng truy cập trực tiếp các commit remote hiện tại từ nhánh `origin/master` sau khi bị ghi đè.
- Giảm rủi ro bằng `--force-with-lease` thay vì `--force`.
- Nếu cần, có thể tạo backup ref/tag trước khi force push, nhưng vì anh nói cứ để remote của anh bình thường và mục tiêu là push đè, bước đó là tùy chọn chứ không bắt buộc.

## Verification Plan
- Read-only verify trước khi làm: `git status -sb`, `git branch -vv`.
- Thực thi dự kiến: force push local `master` -> `origin/master` bằng `--force-with-lease`.
- Verify sau khi làm: `git status -sb` phải không còn `ahead/behind 1331/97`; `git branch -vv` phải cho thấy `master` thẳng hàng với `origin/master`.
- Không chạy lint/test/build/typecheck vì task này không sửa code và repo guideline cấm tự chạy lint/test/build trong flow này.

Nếu anh duyệt spec này, tôi sẽ thực hiện force push lên `origin/master` theo hướng trên.