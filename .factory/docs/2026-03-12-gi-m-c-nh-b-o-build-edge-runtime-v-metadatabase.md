## Audit Summary
- Observation: Cảnh báo `Using edge runtime on a page currently disables static generation for that page` đến từ 2 route ảnh metadata:
  - `app/opengraph-image.tsx:4`
  - `app/twitter-image.tsx:4`
  Cả hai đều khai báo `export const runtime = 'edge'`.
- Observation: Cảnh báo `metadataBase property in metadata export is not set... using "http://localhost:3000"` xuất hiện vì nhiều route site đang dùng `buildSeoMetadata(...)` / `generateMetadata(...)`, nhưng `metadataBase` hiện phụ thuộc `site.site_url || process.env.NEXT_PUBLIC_SITE_URL` trong `lib/seo/metadata.ts`. Khi cả hai rỗng, hàm `buildMetadataBase()` trả `undefined`, nên Next fallback sang `http://localhost:3000`.
- Observation: `app/layout.tsx` hiện chưa export metadata gốc; phần metadata chủ yếu được sinh trong `app/(site)/*` qua `buildSeoMetadata`.
- Inference: Cảnh báo `metadataBase` là lỗi cấu hình SEO thực sự, nên nên xử lý dứt điểm ở 1 điểm trung tâm thay vì vá từng route.
- Inference: Cảnh báo edge runtime nhiều khả năng là expected behavior của Next cho `opengraph-image` / `twitter-image`; bỏ `edge` có thể giảm cảnh báo nhưng có rủi ro tương thích runtime của `ImageResponse` + luồng query settings hiện tại.

## Root Cause Confidence
- metadataBase missing: High
  - Reason: Có evidence trực tiếp trong `lib/seo/metadata.ts` rằng `metadataBase` chỉ được set khi có `site_url` hoặc `NEXT_PUBLIC_SITE_URL`; nếu thiếu thì Next tự fallback localhost.
- edge runtime warning: Medium
  - Reason: Evidence trực tiếp cho thấy warning map đúng tới `app/opengraph-image.tsx` và `app/twitter-image.tsx`; tuy nhiên cần thay đổi tối thiểu vì đây có thể là behavior chấp nhận được của route ảnh metadata trong Next, không hẳn bug logic ứng dụng.

## Proposal
1. Chuẩn hoá base URL ở một chỗ trung tâm trong `lib/seo/metadata.ts`.
   - Thay `buildMetadataBase()`/hoặc thêm helper nhỏ để:
     - ưu tiên `site.site_url`
     - fallback `process.env.NEXT_PUBLIC_SITE_URL`
     - nếu vẫn rỗng thì dùng giá trị an toàn cố định (ví dụ domain production mặc định nếu repo đã có convention), hoặc ít nhất trả về `undefined` kèm guard riêng cho OG/Twitter.
   - Mục tiêu là mọi `buildSeoMetadata()` đều luôn có `metadataBase` hợp lệ, tránh 7 cảnh báo lặp.
2. Giữ `runtime = 'edge'` cho:
   - `app/opengraph-image.tsx`
   - `app/twitter-image.tsx`
   Vì đây là hướng ít rủi ro nhất theo code hiện tại: thay đổi nhỏ, không động vào contract ảnh metadata, không ảnh hưởng query settings hiện có.
3. Nếu muốn triệt tiêu hoàn toàn warning edge runtime ở bước sau, sẽ audit riêng tính tương thích khi bỏ `edge` khỏi 2 file metadata image. Không gộp vào fix hiện tại để tránh đổi behavior không cần thiết.

## Counter-Hypothesis
- Giả thuyết thay thế 1: warning `metadataBase` do một số route tự export `metadata` riêng và quên set `metadataBase`.
  - Audit hiện tại không thấy pattern `export const metadata: Metadata = {...}` trong `app`, nên giả thuyết này yếu.
- Giả thuyết thay thế 2: warning edge runtime đến từ page/layout thường, không phải metadata image.
  - Bị loại trừ bởi grep: chỉ `app/opengraph-image.tsx` và `app/twitter-image.tsx` có `runtime = 'edge'`.

## Planned File Changes
- `E:\NextJS\persional_project\system-dien-tran\lib\seo\metadata.ts`
  - Củng cố logic resolve `baseUrl`/`metadataBase` để không còn rỗng khi build metadata.
  - Giữ thay đổi nhỏ, không đổi API public của `buildSeoMetadata` nếu không cần.
- Không đổi code ở `app/opengraph-image.tsx` và `app/twitter-image.tsx` trong vòng fix tối thiểu này.

## Verification Plan
- Static review:
  - kiểm tra toàn bộ callsite `buildSeoMetadata()` và `buildHubMetadata()` vẫn tương thích kiểu dữ liệu.
  - rà null-safety khi `site_url` rỗng hoặc không hợp lệ.
- Typecheck:
  - chạy `bunx tsc --noEmit` vì có thay đổi TS/code.
- Repro expectation:
  - sau khi build lại, cảnh báo `metadataBase property in metadata export is not set...` phải biến mất.
  - cảnh báo `Using edge runtime on a page currently disables static generation for that page` có thể vẫn còn; nếu user muốn xử lý tiếp thì sẽ làm phase 2 riêng.

## Decision
- Recommend: fix `metadataBase` trước, giữ nguyên `edge runtime` cho metadata image.
- Confidence: 85%
- Lý do: giải quyết warning cấu hình thật sự, thay đổi nhỏ nhất, ít rủi ro nhất, đúng nguyên nhân đã có evidence.