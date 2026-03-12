## Audit Summary
- Runtime error xuất hiện tại `api.services.listAdminWithOffset` vì return object có field mới `htmlRender` nhưng validator `serviceDoc` chưa khai báo field này.
- Evidence: `convex/services.ts` đang dùng `serviceDoc` cho hầu hết query returns (`listAdminWithOffset`, `getById`, `getBySlug`, `searchPublished`...), nhưng `serviceDoc` hiện chỉ có `content/excerpt/...` chưa có `renderType`, `markdownRender`, `htmlRender`.
- Trong khi đó schema/model đã có field mới (và DB record đã chứa `htmlRender`), nên mismatch xảy ra lúc Convex validate response.

## Root Cause Confidence
**High** — lỗi chỉ ra rõ “extra field `htmlRender` not in validator”, và `serviceDoc` là validator dùng chung cho các query trả về services nên thiếu field mới sẽ fail ngay khi record có dữ liệu mới.

## Proposal
1. Cập nhật `serviceDoc` trong `convex/services.ts` để thêm:
   - `renderType: v.optional(v.union(v.literal('content'), v.literal('markdown'), v.literal('html')))`
   - `markdownRender: v.optional(v.string())`
   - `htmlRender: v.optional(v.string())`
2. Giữ nguyên các `returns: v.array(serviceDoc)` / `returns: v.union(serviceDoc, v.null())` hiện có để đồng bộ tự động toàn bộ query services.
3. Rà nhanh file `convex/services.ts` để đảm bảo không còn validator object nào hardcode thiếu 3 field mới.

## Verification Plan
- Chạy `bunx tsc --noEmit` sau khi sửa.
- Repro lại trang `/admin/services` (query `listAdminWithOffset`) để xác nhận không còn `ReturnsValidationError`.
- Spot check thêm `/admin/services/[id]/edit` và `/services/[slug]` để đảm bảo query `getById/getBySlug` không lỗi validator.