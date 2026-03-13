## Audit Summary
- Observation: Sau commit trước, `app/(site)/layout.tsx` mới ép light ở **wrapper div** (`data-theme="light"`, `style={{ colorScheme: 'light' }}`), chưa can thiệp mức document/root (`<html>/<body>`.
- Observation: `app/(site)/products` hiện **không còn** `dark:*` (grep no matches), `components/site/**` cũng không còn `dark:*` (grep no matches) ⇒ hiện tượng còn bị dark nhiều khả năng không phải do class dark nội bộ của route này.
- Observation: `components/experiences/editor/BrowserFrame.tsx` vẫn hardcode dark variant (`bg-white dark:bg-slate-900`, `dark:bg-slate-800`, `dark:bg-slate-700`) nên preview trong `/system/experiences/*` bị tối theo dark mode system.
- Observation: `components/experiences/previews/DetailPreview.tsx` vẫn có `dark:prose-invert` (2 chỗ), làm preview content lệch với public đã khóa light.
- User decision đã chốt:
  - Public: khóa light ở **document/root**.
  - System: giữ dark mode cho shell/chrome.
  - Experiences: ép **preview canvas luôn light** để parity với public.
  - Priority: parity với public là ưu tiên cao nhất.

## Root Cause Confidence
- High
  1) Public vẫn bị “dính dark” vì khóa light đang ở tầng wrapper, chưa đủ mạnh để chặn toàn bộ tác động browser-level auto dark / UA-level rendering trong mọi tình huống.
  2) Experiences preview bị dark là do chính code preview còn `dark:*` (đã có evidence file cụ thể), không phải lỗi browser đơn thuần.
- Counter-hypothesis đã xét:
  - “Do route /products còn class dark”: đã loại trừ phần lớn vì grep không còn `dark:*` trong `app/(site)/products` và `components/site/**`.
  - “Do system dark mode gây ra hết”: đúng một phần cho experiences preview, nhưng không giải thích toàn bộ public runtime.

## Proposal (fix kỹ, tối thiểu, dễ rollback)
1. Nâng khóa light public lên mức document/root
   - File: `app/layout.tsx` + `app/(site)/layout.tsx`
   - Cách làm:
     - Gắn marker route-aware ở root cho nhánh public (ví dụ class/attr riêng cho `(site)`) theo pattern Next layout lồng nhau.
     - Đảm bảo public root set `color-scheme: light` ở mức bao phủ cao hơn wrapper hiện tại.
   - Mục tiêu: browser dark preference không còn lật nền/chữ ở `/`, `/products`, ...

2. Cứng hóa CSS chống auto-dark cho public scope
   - File: `app/globals.css`
   - Cách làm:
     - Giữ token dark chỉ kích hoạt explicit `.dark` cho admin/system như hiện tại.
     - Bổ sung rule cứng cho public scope (theo marker ở bước 1) để luôn light cho UA controls và nền/chữ gốc.
   - Mục tiêu: public không bị ảnh hưởng bởi `prefers-color-scheme`/auto dark từ browser khi ở scope public.

3. Tách scope preview trong system/experiences để luôn light
   - File chính: `components/experiences/editor/BrowserFrame.tsx`
   - Cách làm:
     - Bỏ `dark:*` trong BrowserFrame hoặc thêm prop `forceLight` (default true cho experiences pages), áp trên frame + address bar + canvas.
     - Mỗi trang `/system/experiences/*` dùng BrowserFrame theo mode light canvas, còn shell system vẫn dark bình thường.
   - Mục tiêu: preview nhìn đúng như public runtime (parity contract).

4. Loại bỏ điểm lệch còn lại trong preview content
   - File: `components/experiences/previews/DetailPreview.tsx`
   - Bỏ `dark:prose-invert` để prose preview không tự đảo màu trong system dark.

5. Rà soát mục tiêu (không mở rộng ngoài scope)
   - Chỉ rà `dark:*` trong các component phục vụ trực tiếp public runtime và experiences preview canvas.
   - Không thay đổi hành vi dark mode của admin/system shell.

## File-level change sketch
- `app/layout.tsx`: bổ sung cơ chế root marker cho nhánh public (không đổi behavior admin/system).
- `app/(site)/layout.tsx`: giữ/chuẩn hóa marker light public; phối hợp với root marker.
- `app/globals.css`: rule cứng cho public root scope (`color-scheme: light` + token base light), dark token chỉ theo `.dark`.
- `components/experiences/editor/BrowserFrame.tsx`: frame/canvas light-only cho preview parity.
- `components/experiences/previews/DetailPreview.tsx`: bỏ `dark:prose-invert`.

## Verification Plan
- Typecheck: `bunx tsc --noEmit` (vì có đổi TS/TSX).
- Repro pass/fail:
  1. Set browser appearance = Dark.
  2. Check public routes: `/`, `/products`, `/products/[slug]`.
  3. Expected: vẫn light ổn định (nền/chữ/prose/form controls không bị đảo).
  4. Check `/system/experiences/products-list` (và 1-2 experience khác).
  5. Expected: shell system vẫn dark theo toggle; **preview frame + canvas luôn light**.
  6. Check `/system` và `/admin`.
  7. Expected: dark mode nội bộ không đổi hành vi.

## Minimal-risk notes
- Thay đổi tập trung vào 5 file trọng tâm, rollback đơn giản.
- Không đụng business logic dữ liệu; chỉ chỉnh theme scope và preview rendering scope.