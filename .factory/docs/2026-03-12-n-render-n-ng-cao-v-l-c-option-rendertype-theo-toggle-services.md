## Audit Summary
- Hiện tại card `Render nâng cao` ở cả `app/admin/services/create/page.tsx` và `app/admin/services/[id]/edit/page.tsx` đang luôn hiển thị, không phụ thuộc toggle module.
- Select `renderType` cũng đang luôn có đủ 3 option `content | markdown | html`, dù `markdownRender` hoặc `htmlRender` có thể đang bị tắt ở `/system/modules/services`.
- Evidence: cả 2 file đều render `<Card>Render nâng cao</Card>` vô điều kiện; còn `<select>` đang hardcode 3 `<option>`.
- Module config đã có feature toggle riêng cho `markdownRender` và `htmlRender` trong `lib/modules/configs/services.config.ts`, nên UI admin chỉ cần bám `enabledFields` hiện có, không cần thêm API/scope mới.

## Root Cause Confidence
**High** — vì UI hiện không dùng `enabledFields` để quyết định có hiện card hay lọc option `renderType`; logic toggle mới chỉ áp cho textarea markdown/html, chưa áp cho card và select options.

## Proposal
1. Tạo logic xác định khả năng render nâng cao từ `enabledFields`:
   - `hasMarkdownRender = enabledFields.has('markdownRender')`
   - `hasHtmlRender = enabledFields.has('htmlRender')`
   - `showAdvancedRenderCard = hasMarkdownRender || hasHtmlRender`
2. Chỉ render card `Render nâng cao` khi `showAdvancedRenderCard === true` ở cả create và edit.
3. Sinh danh sách option `renderType` động theo toggle:
   - luôn có `content`
   - thêm `markdown` khi `hasMarkdownRender`
   - thêm `html` khi `hasHtmlRender`
4. Ở trang edit, thêm guard để nếu dữ liệu cũ đang có `renderType` không còn hợp lệ sau khi toggle bị tắt, UI tự fallback an toàn về `content` để tránh select giữ giá trị không còn trong option list.
5. Audit markdown/html path để đảm bảo:
   - khi chỉ bật markdown: select chỉ có `content | markdown`
   - khi chỉ bật html: select chỉ có `content | html`
   - khi bật cả hai: select có đủ 3 option
   - khi tắt cả hai: card ẩn hoàn toàn.

## Verification Plan
- Chạy `bunx tsc --noEmit`.
- Repro tại `/system/modules/services` bằng 4 case:
  1) bật cả markdown/html → card hiện, select có 3 option.
  2) chỉ bật markdown → card hiện, select có `content | markdown`.
  3) chỉ bật html → card hiện, select có `content | html`.
  4) tắt cả hai → card ẩn.
- Spot check cả `/admin/services/create` và `/admin/services/[id]/edit` để đảm bảo hành vi đồng nhất.