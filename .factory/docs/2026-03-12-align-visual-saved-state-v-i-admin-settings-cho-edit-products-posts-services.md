## Audit Summary
### Observation
- `admin/settings` không đổi label nút sau khi lưu; UX “ổn” chủ yếu vì button dùng đúng style mặc định của `variant="accent"` trong `app/admin/components/ui.tsx`: nền xanh, nhưng khi `disabled` thì bị `disabled:opacity-50`, nhìn rõ là trạng thái không còn actionable.
- Ở 3 trang edit hiện tại:
  - `products`: khi `!hasChanges`, button bị ép `className='bg-slate-300 hover:bg-slate-300 text-slate-600'` nên visual saved state ổn hơn.
  - `services`: khi `!hasChanges`, button vẫn bị ép `bg-teal-600 hover:bg-teal-600 opacity-60`, nên dù text là `Đã lưu` nó vẫn giữ màu brand xanh/teal, tạo cảm giác vẫn còn bấm để lưu.
  - `posts`: button không có class override cho trạng thái saved/disabled, nên vẫn giữ nền xanh của `variant="accent"`, chỉ mờ đi theo `disabled:opacity-50` của component Button.
- Vì thế anh thấy “noti xong mà nút Lưu thay đổi vẫn xanh” là đúng ở level visual hierarchy: text có đổi nhưng màu nền vẫn là CTA color ở posts/services.

### Inference
- Root cause không còn nằm ở label state nữa; nằm ở **visual styling khi `!hasChanges`** chưa tách khỏi CTA state.
- Pattern hiện tại chưa nhất quán giữa 3 trang và chưa bám cảm nhận của `admin/settings` theo nghĩa “trạng thái saved phải nhìn non-actionable, không còn là primary CTA”.

### Decision
- Chuẩn hóa saved state cho cả 3 trang edit bằng cách **không giữ màu accent/teal khi `!hasChanges`**.
- Visual saved state sẽ chuyển sang neutral disabled style giống products hiện tại: nền xám/neutral, chữ muted, không hover CTA.
- Giữ logic label đã có: `Lưu thay đổi` / `Đang lưu...` / `Đã lưu`.

## Root Cause Confidence
**High**

Lý do:
1. Evidence trực tiếp từ code `Button` (`variant='accent' => bg-blue-600 text-white hover:bg-blue-700`) trong `app/admin/components/ui.tsx`.
2. Evidence trực tiếp từ `posts/services` là hai trang này không neutralize màu CTA khi `!hasChanges`.
3. Alternative hypothesis “saveStatus chưa đổi” đã bị loại trừ vì code hiện tại đã render `Đã lưu`; vấn đề user report là cảm giác nút vẫn xanh.
4. Pass/fail rõ: sau save success, nút phải vừa đổi text vừa đổi visual sang neutral/non-actionable ngay, không cần F5.

## Proposal (actionable)
1. **Posts edit** (`app/admin/posts/[id]/edit/page.tsx`)
   - Thêm `className` cho button submit khi `!hasChanges && !isSubmitting`:
     - `bg-slate-300 hover:bg-slate-300 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-800 dark:text-slate-400`
   - Mục tiêu: bỏ màu xanh CTA khi đã lưu.

2. **Services edit** (`app/admin/services/[id]/edit/page.tsx`)
   - Thay class hiện tại `bg-teal-600 ... opacity-60` bằng neutral saved style giống posts/products khi `!hasChanges && !isSubmitting`.
   - Khi còn thay đổi mới hoặc đang submit vẫn giữ teal CTA như hiện tại.

3. **Products edit** (`app/admin/products/[id]/edit/page.tsx`)
   - Chỉ bổ sung dark-mode neutral state cho đồng bộ (`dark:bg-slate-800 dark:hover:bg-slate-800 dark:text-slate-400`).
   - Không đổi logic saveStatus.

4. **Không đổi `admin/settings`**
   - Chỉ dùng làm reference để so visual intent và tránh lệch scope.

## Verification Plan
- Không chạy lint/test/build theo guideline repo; chỉ static review.
- Checklist tester:
  1. Sửa 1 field ở products/posts/services -> nút phải hiện màu CTA + text `Lưu thay đổi`.
  2. Bấm lưu thành công -> toast hiện, nút chuyển ngay sang `Đã lưu` và nền neutral/xám, không còn xanh/teal CTA.
  3. Sửa lại 1 field -> nút quay lại màu CTA.
  4. Dark mode: saved state vẫn neutral, không bị xanh đậm như CTA.

Nếu anh duyệt, em sẽ implement đúng 3 file edit để visual state bám intent của `admin/settings` nhưng rõ ràng hơn ở trạng thái đã lưu.