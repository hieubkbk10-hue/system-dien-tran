## Audit Summary
- Observation: lỗi vẫn hiện kiểu `Server Error / Uncaught Error` dù UI đã có Sonner, nên vấn đề không còn nằm ở layer toast nữa.
- Observation: audit code hiện tại cho thấy toàn bộ lỗi nghiệp vụ duplicate vẫn đang `throw new Error(...)` trong Convex, ví dụ:
  - `convex/productCategories.ts:200,254`
  - `convex/productOptions.ts:197,239`
  - `convex/products.ts:1250,1257,1385,1395`
  - `convex/promotions.ts:420,536`
  - `convex/model/posts.ts:163,210`
  - `convex/model/services.ts:126,174`
  - `convex/model/postCategories.ts:171,207`
  - `convex/model/serviceCategories.ts:104,137`
- Observation: repo chưa dùng `ConvexError` ở bất kỳ file nào trong `convex/**`.
- Observation: package `convex` đang cài trong repo có hỗ trợ `ConvexError` (`node_modules/convex/...`), tức là có thể migrate theo đúng pattern của Convex.
- Evidence bổ sung từ câu trả lời Convex AI bạn cung cấp:
  - expected business error nên dùng `ConvexError`, không dùng `Error` thường.
  - client nên đọc `error.data`, không dựa vào `error.message` cho business errors.
  - nếu mutation reject mà không được phân loại đúng là application error, runtime/dev overlay có thể tiếp tục log kiểu server error/unhandled rejection.

## Root Cause Confidence
- High — nguyên nhân gốc là backend đang ném expected business errors bằng `Error` thường, nên Convex/Next.js coi đó là server error thay vì application error có chủ đích. Vì vậy dù frontend đã bắt lỗi và bắn Sonner, dev console/overlay vẫn tiếp tục hiện lỗi thô.
- Counter-hypothesis đã loại trừ:
  - Không phải thiếu Sonner: Sonner đã có và catch block vẫn chạy.
  - Không phải chỉ riêng `productCategories`: pattern `throw new Error(...)` lặp lại ở nhiều module slug/SKU/voucher.
  - Không phải thiếu API trong Convex: package local xác nhận có `ConvexError`.

## Proposal
1. Chuẩn hóa backend expected errors sang `ConvexError`
- Đổi các lỗi nghiệp vụ dự kiến trong scope hiện tại từ `throw new Error(...)` sang:
  - `throw new ConvexError({ code: 'DUPLICATE_SLUG', message: 'Slug đã tồn tại, vui lòng chọn slug khác' })`
  - `throw new ConvexError({ code: 'DUPLICATE_SKU', message: 'Mã SKU đã tồn tại, vui lòng chọn mã khác' })`
  - `throw new ConvexError({ code: 'DUPLICATE_VOUCHER', message: 'Mã voucher đã tồn tại, vui lòng chọn mã khác' })`
- Chỉ migrate expected business errors trong scope slug/SKU/voucher; không đụng unexpected/internal errors kiểu `Product not found`, `Category not found`, validation kỹ thuật khác nếu chưa cần.

2. Chuẩn hóa frontend đọc `error.data` trước, fallback `error.message` sau
- Nâng cấp `app/admin/lib/mutation-error.ts` để:
  - nhận biết `ConvexError`
  - ưu tiên lấy message từ `error.data.message`
  - fallback về map cũ theo `error.message` để backward-compatible trong giai đoạn migrate dần.
- Như vậy các màn đã sửa Sonner sẽ tiếp tục chạy, nhưng hết phụ thuộc vào raw `error.message` cho business errors mới.

3. Scope backend nên sửa ngay trong đợt này
- `convex/productCategories.ts`
- `convex/productOptions.ts`
- `convex/products.ts`
- `convex/promotions.ts`
- `convex/model/posts.ts`
- `convex/model/services.ts`
- `convex/model/postCategories.ts`
- `convex/model/serviceCategories.ts`
- Nếu muốn đồng bộ hơn nữa có thể cân nhắc `convex/productVariants.ts` cho duplicate SKU, nhưng đây là scope mở rộng; hiện tại ưu tiên đúng phạm vi admin đã audit trước.

4. Payload contract đề xuất
- Tạo shape thống nhất:
  - `{ code: 'DUPLICATE_SLUG', message: 'Slug đã tồn tại, vui lòng chọn slug khác' }`
  - `{ code: 'DUPLICATE_SKU', message: 'Mã SKU đã tồn tại, vui lòng chọn mã khác' }`
  - `{ code: 'DUPLICATE_VOUCHER', message: 'Mã voucher đã tồn tại, vui lòng chọn mã khác' }`
- Lợi ích:
  - UI không cần đoán message string tiếng Anh/Việt
  - về sau có thể render theo `code` nếu cần analytics/i18n.

5. Tối ưu migration theo best practice của Convex
- Giai đoạn 1: backend đổi expected errors trong scope sang `ConvexError`, frontend helper hỗ trợ cả `error.data` lẫn `error.message`.
- Giai đoạn 2: khi đã ổn định, có thể tiếp tục migrate các business errors expected khác ngoài scope hiện tại.
- Không cần đổi toàn repo trong một lần nếu muốn giảm rủi ro.

## File-level Implementation Plan
- `app/admin/lib/mutation-error.ts`
  - mở rộng helper để đọc `error.data.message` từ `ConvexError`.
  - giữ fallback map `error.message` để tương thích ngược.
- `convex/productCategories.ts`
  - import `ConvexError` từ `convex/values`.
  - đổi 2 chỗ duplicate slug sang `new ConvexError({ code, message })`.
- `convex/productOptions.ts`
  - đổi 2 chỗ duplicate slug.
- `convex/products.ts`
  - đổi duplicate slug + duplicate SKU trong create/update.
- `convex/promotions.ts`
  - đổi duplicate voucher code trong create/update.
- `convex/model/posts.ts`
  - đổi duplicate slug create/update.
- `convex/model/services.ts`
  - đổi duplicate slug create/update.
- `convex/model/postCategories.ts`
  - đổi duplicate slug create/update.
- `convex/model/serviceCategories.ts`
  - đổi duplicate slug create/update.

## Verification Plan
- Theo repo rule: không chạy lint/test/build; chỉ chạy `bunx tsc --noEmit` nếu có thay đổi TS.
- Verify tĩnh:
  1. grep lại scope để chắc các duplicate slug/SKU/voucher đã chuyển từ `throw new Error(...)` sang `throw new ConvexError(...)`.
  2. đọc lại helper frontend để chắc ưu tiên `error.data.message`.
  3. grep các page admin trong scope để chắc vẫn đi qua helper chung, không bắn raw `error.message` trực tiếp cho create/update đã audit.
- Repro/pass-fail kỳ vọng:
  - Pass: duplicate slug/SKU/voucher vẫn hiện Sonner tiếng Việt, đồng thời không còn bị coi là server error thô theo pattern cũ.
  - Fail: backend vẫn ném `Error` thường cho expected business errors hoặc frontend chưa đọc được `error.data`.

Ghi chú: WebSearch đang lỗi 503 từ dịch vụ tìm kiếm, nên spec này dựa trên 3 nguồn evidence: audit code repo, package `convex` cài sẵn trong repo, và câu trả lời Convex AI bạn cung cấp. Nếu bạn duyệt, mình sẽ implement theo hướng `ConvexError + error.data` này.