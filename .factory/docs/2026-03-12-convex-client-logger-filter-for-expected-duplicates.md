## Audit Summary
- Observation: Sonner đã hiển thị đúng, nghĩa là `try/catch` ở UI đang hoạt động đúng; đây không còn là lỗi UX/blocking flow.
- Observation: dòng `Console Error [CONVEX M(...)] Server Error Uncaught ConvexError ...` đến từ logger mặc định của Convex client, không phải do page tự `console.error`.
- Evidence:
  - `components/providers/convex-provider.tsx` đang khởi tạo `new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)` mà chưa truyền `logger` custom.
  - `node_modules/convex/src/browser/logging.ts` cho thấy `instantiateDefaultLogger()` gọi thẳng `console.error(...args)` cho level `error`.
  - Cùng file đó, `logForFunction()` format function error thành `[CONVEX M(...)] ... ConvexError {...}`.
- Inference: với Convex, dù app đã `catch` promise và bắn Sonner, logger mặc định vẫn tiếp tục in function error ra console. Đây là hành vi logging mặc định của SDK, không đồng nghĩa là request chưa được catch.

## Root Cause Confidence
- High — root cause là Convex client default logger vẫn coi function failure là log level `error` và in ra console, kể cả khi UI layer đã xử lý promise rejection.
- Counter-hypothesis đã loại trừ:
  - Không phải do thiếu catch trong page `app/admin/product-categories/create/page.tsx`: đã có `try/catch`.
  - Không phải do page tự `console.error(error)`: grep trong scope create/edit hiện tại không thấy pattern này ở các page đã fix.
  - Không phải do `ConvexError` migration sai: chính vì đã dùng `ConvexError`, message mới hiện payload JSON có cấu trúc trong logger mặc định.

## Decision
- Recommend — gắn custom `logger` cho `ConvexReactClient` và chỉ filter các expected business errors có `code` nằm trong whitelist:
  - `DUPLICATE_SLUG`
  - `DUPLICATE_SKU`
  - `DUPLICATE_VOUCHER`
- Confidence 90% — đây là pattern gần với SaaS production nhất: giữ log cho lỗi bất thường, nhưng suppress noise từ expected business errors đã được UX handle riêng bằng toast/form message.
- Tradeoff: cần parse log line string của Convex để nhận diện payload `ConvexError {...}`. Đây là mức phụ thuộc nhẹ vào format log hiện tại của SDK, nhưng scope nhỏ và dễ rollback.

## Proposal
1. Tạo custom logger wrapper cho Convex client
- File target: `components/providers/convex-provider.tsx`
- Thay khởi tạo hiện tại bằng `new ConvexReactClient(url, { logger })`.
- Logger wrapper sẽ:
  - passthrough `log`, `warn`, `logVerbose` như cũ
  - với `error(...args)`, chỉ suppress khi xác định đây là expected duplicate error đã được UI xử lý
  - mọi lỗi khác vẫn `console.error` bình thường

2. Rule filter đề xuất
- Chỉ suppress khi thỏa đồng thời:
  - log line là string bắt đầu bằng `[CONVEX M(` hoặc `[CONVEX A(` / `[CONVEX Q(` nếu muốn future-proof tối thiểu
  - string có chứa `ConvexError`
  - parse ra payload JSON và `code` thuộc whitelist `DUPLICATE_SLUG | DUPLICATE_SKU | DUPLICATE_VOUCHER`
- Không suppress:
  - network/auth/reconnect errors của Convex
  - unexpected `Error`
  - các `ConvexError` khác ngoài whitelist

3. Cách parse an toàn
- Tạo helper nhỏ trong provider, ví dụ:
  - tìm phần sau `ConvexError `
  - `JSON.parse` trong `try/catch`
  - nếu parse fail thì không suppress
- Không nên suppress theo `message` text thuần vì dễ false positive; ưu tiên theo `code` là bền hơn.

4. Phạm vi áp dụng
- Áp dụng cả development và production theo yêu cầu của bạn.
- Lý do: đây là expected business errors đã có UX riêng; giữ console sạch ở cả 2 môi trường sẽ giảm noise cho QA/Sentry session replay/browser logs.

## File-level Implementation Plan
- `components/providers/convex-provider.tsx`
  - import type `Logger` từ Convex nếu cần
  - tạo `EXPECTED_CONVEX_ERROR_CODES = new Set(["DUPLICATE_SLUG", "DUPLICATE_SKU", "DUPLICATE_VOUCHER"])`
  - tạo helper `shouldSuppressConvexErrorLog(args: unknown[]): boolean`
  - tạo custom logger object truyền vào `ConvexReactClient`
- Không cần sửa các page admin hay Convex mutations nữa trong bước này.

## Verification Plan
- Không chạy lint/test/build theo rule repo; nếu có sửa TS thì chỉ chạy `bunx tsc --noEmit` sau khi implement.
- Verify tĩnh:
  1. đọc lại provider để chắc `ConvexReactClient` đã nhận `logger` custom
  2. confirm custom logger chỉ suppress theo `code`, không suppress toàn bộ `error`
  3. grep đảm bảo không vô tình thêm `logger: false` global (vì cách đó sẽ mất cả lỗi quan trọng)
- Repro/pass-fail kỳ vọng:
  - Pass: duplicate slug/SKU/voucher vẫn hiện Sonner nhưng không còn dòng `Console Error [CONVEX ...] Uncaught ConvexError ...`
  - Pass: lỗi unexpected khác vẫn còn log trong console
  - Fail: suppress quá rộng làm mất cả network/internal errors, hoặc filter không match nên console noise còn nguyên

Nếu bạn duyệt, mình sẽ implement đúng hướng “custom Convex logger chỉ filter expected duplicate errors”, đây là hướng cân bằng nhất giữa UX sạch và khả năng debug mà các SaaS thường dùng.