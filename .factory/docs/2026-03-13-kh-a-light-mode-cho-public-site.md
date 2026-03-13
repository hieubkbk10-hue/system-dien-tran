## Audit Summary
- Observation: `app/globals.css` đang tự đổi `--background`/`--foreground` theo `@media (prefers-color-scheme: dark)` (evidence: `app/globals.css:19`). Điều này khiến browser/system dark preference tác động toàn app ngay cả khi không có theme toggle ở public.
- Observation: public routes nằm dưới `app/(site)` và dùng `SiteLayout -> SiteShell` (evidence: `app/(site)/layout.tsx`, `components/site/SiteShell.tsx`). Đây là điểm chặn phù hợp để khóa light mode cho toàn bộ public-facing surface.
- Observation: nhiều page public đang có `dark:*` utility classes và `dark:prose-invert` (evidence: `app/(site)/**/page.tsx`, `components/common/RichContent.tsx`). Nếu chỉ khóa root mà vẫn giữ dark variant trên public thì browser/DOM dark state vẫn có thể làm UI lệch ở một số tình huống.
- Observation: admin/system có dark mode riêng bằng localStorage + `document.documentElement.classList.toggle('dark', ...)` (evidence: `app/admin/layout.tsx`, `app/system/layout.tsx`). User đã xác nhận cần giữ nguyên khu vực nội bộ.
- User decision đã chốt:
  - Phạm vi: toàn bộ `app/(site)`
  - Mức khóa: khóa root public về light và vô hiệu dark CSS của public
  - Nội bộ: giữ nguyên admin/system

## Root Cause Confidence
- High — Nguyên nhân gốc có 2 lớp cùng lúc:
  1. CSS global đang bind theo `prefers-color-scheme: dark`, nên browser dark preference tự đổi màu nền/chữ toàn app dù public không có toggle.
  2. Nhiều public components/pages có `dark:*`, nên chỉ cần `.dark` xuất hiện hoặc biến màu tối bị kích hoạt là giao diện dễ “nát”.
- Counter-hypothesis đã xét:
  - Chỉ do extension/browser auto-dark: có thể góp phần, nhưng evidence nội bộ cho thấy app đang tự hỗ trợ dark ở CSS level nên đây không phải yếu tố duy nhất.
  - Chỉ sửa vài page lỗi nặng: không đủ vì nguồn gây lỗi nằm ở layout/global CSS và pattern `dark:*` xuất hiện trên nhiều route public.

## Proposal
1. Khóa public site về light ở layout public
   - File: `app/(site)/layout.tsx`
   - Thêm signal rõ ràng cho public shell, ưu tiên ở wrapper/layout level để scope chỉ áp dụng cho `(site)`.
   - Dự kiến dùng một trong hai cách tương đương, nhưng em recommend cách ít xâm lấn nhất:
     - bọc public tree bằng container marker như `data-theme="light"` / class `theme-light`, và
     - set `style={{ colorScheme: 'light' }}` hoặc equivalent ở public root để browser dùng form controls/light UA rendering.
   - Mục tiêu: public pages luôn render light, không phụ thuộc browser appearance.

2. Tách cơ chế color tokens để public không bị `prefers-color-scheme: dark` chi phối
   - File: `app/globals.css`
   - Giữ token mặc định light ở `:root`.
   - Chuyển phần dark token hiện đang nằm trong `@media (prefers-color-scheme: dark)` sang scope explicit cho khu vực nội bộ, ví dụ `.dark`/admin/system wrapper, thay vì auto theo browser preference toàn app.
   - Kết quả mong muốn:
     - public `(site)` luôn lấy token light
     - admin/system vẫn dark bình thường khi toggle `.dark`

3. Vô hiệu dark styling trên public route theo cách tối thiểu và có kiểm soát
   - Phạm vi ưu tiên: file trong `app/(site)/**` và shared component thực sự render ra public.
   - Các điểm đã thấy chắc chắn cần xử lý:
     - `components/common/RichContent.tsx`: bỏ `dark:prose-invert` hoặc cho phép opt-in thay vì mặc định.
     - `components/site/ComponentRenderer.tsx`: các gradient `dark:from-slate-900` ở phần site cần đổi về light-only.
     - các page SEO/public đang dùng `dark:text-*`, `dark:border-*`, `dark:bg-*` trong `app/(site)/**/page.tsx` sẽ được bỏ dark variant để giữ thiết kế light cố định.
   - Cách làm: chỉ sửa những component/page thật sự nằm trên public surface, không đụng admin/system/shared internal preview.

4. Giữ nguyên dark mode nội bộ
   - Không đổi logic ở `app/admin/layout.tsx` và `app/system/layout.tsx`.
   - Chỉ đảm bảo dark tokens vẫn hoạt động khi `.dark` được set từ hai layout này.

5. Tự review tĩnh trước khi commit
   - Soát lại các shared components dùng ở cả public và internal để tránh side effect. Nếu component dùng chung cho cả hai phía, ưu tiên thêm prop/variant nhỏ kiểu `allowDark` mặc định `false` cho public-safe behavior, thay vì hardcode phá admin/system.
   - Vì repo rule cấm lint/test/build, verification sẽ là static review + typecheck only nếu có thay đổi TS theo guideline repo.

## File-level implementation sketch
- `app/globals.css`
  - bỏ auto dark theo `prefers-color-scheme`
  - chuyển dark tokens sang explicit scope kích hoạt bởi `.dark`
  - thêm rule hỗ trợ public light root nếu cần (`[data-theme='light'] { color-scheme: light; }`)
- `app/(site)/layout.tsx`
  - thêm public wrapper để ép light mode cho toàn bộ `(site)`
- `components/common/RichContent.tsx`
  - bỏ mặc định `dark:prose-invert`, hoặc thêm prop để chỉ internal mới bật dark prose
- `components/site/ComponentRenderer.tsx`
  - thay các `dark:*` ảnh hưởng visual public bằng light-only equivalent
- `app/(site)/**/page.tsx` (các file grep đã chỉ ra)
  - remove `dark:*` classes ở text/background/border/prose cho các trang public content

## Verification Plan
- Static audit pass/fail:
  1. Pass nếu public tree `app/(site)` không còn phụ thuộc `prefers-color-scheme` để đổi nền/chữ.
  2. Pass nếu các class `dark:*` còn lại không xuất hiện trên public-rendered components/pages, trừ khi là intentional exception đã nêu rõ.
  3. Pass nếu admin/system vẫn giữ logic toggle dark riêng, không bị đổi behavior.
- Typecheck:
  - Nếu có thay đổi TS/TSX, chạy `bunx tsc --noEmit` trước commit theo guideline repo.
- Repro checklist cho tester:
  1. Mở Edge/Chrome với browser appearance = dark.
  2. Vào các route public trong `(site)` như home, features, guides, compare, auth, checkout.
  3. Expected: nền/chữ/gradient/prose vẫn light, không invert, không dark card/text.
  4. Vào `/admin` và `/system`.
  5. Expected: dark toggle vẫn hoạt động như cũ.

## Minimal-risk notes
- Đây là thay đổi nhỏ, rollback dễ vì tập trung ở 1 global CSS + 1 public layout + một số public/shared components có `dark:*`.
- Em sẽ ưu tiên sửa theo batch nhỏ nhất để không lan sang internal UI.