## Audit Summary

### 1) Observation (evidence)
- `convex/products.ts` đang tính giá min variant qua `resolveVariantPrice(variant)` và **ưu tiên `variant.salePrice` trước `variant.price`**.
  - Hệ quả: mọi nơi dùng aggregate variant sẽ coi giá so sánh là giá bán.
- Các query public/admin đều đi qua `resolveVariantOverrides(...)` nên bị ảnh hưởng dây chuyền:
  - `listPublicResolved`, `listPublishedWithOffset`, `listPublishedPaginated`, `searchPublished`, `getBySlug`, và `listAdminWithOffset`.
- `admin/home-components/product-grid/[id]/edit` + `create/product-grid` dùng `resolvedProductsData = api.products.listPublicResolved` rồi render `Giá từ` qua `getHomeComponentPriceLabel(...)`.
  - Nên bug xuất hiện đúng như anh report ở URL edit product-grid.
- Bề mặt khác đang dùng cùng data/helper:
  - Home-components có sản phẩm: product-list, product-grid, category-products, component renderer site.
  - Trang site có sản phẩm: products list, product detail, related products, wishlist, quick add.
  - Experiences liên quan sản phẩm: products-list, product-detail (đọc dữ liệu qua products queries chung / slug example), nên chịu cùng contract giá.

### 2) Root-cause Q&A (theo protocol)
1. Triệu chứng: “Giá từ” hiển thị giá trước giảm thay vì giá bán.
2. Phạm vi ảnh hưởng: admin home-components + site pages + experiences dùng products queries aggregate variant.
3. Tái hiện: ổn định khi sản phẩm có variants và có cả `price` + `salePrice`.
4. Mốc thay đổi: bug nằm tại logic aggregate trong `resolveVariantPrice` (ưu tiên sai field).
5. Dữ liệu thiếu: không thiếu để kết luận nguyên nhân chính.
6. Giả thuyết thay thế: lỗi helper UI (`getPublicPriceLabel`) — đã loại trừ vì helper nhận đúng `price`, nhưng `price` đầu vào đã sai từ aggregate.
7. Rủi ro fix sai: chỉ vá riêng product-grid edit thì bug còn ở list/detail/related/experiences.
8. Tiêu chí pass/fail: mọi “Giá từ” phải dựa trên `variant.price` (giá bán), không dựa `variant.salePrice`.

## Root Cause Confidence
**High** — vì có bằng chứng trực tiếp ở `resolveVariantPrice` và chuỗi phụ thuộc query dùng lại logic này trên toàn hệ thống.

## Plan fix đồng bộ

### A) Sửa nguồn gốc aggregate variant (fix trung tâm)
- File: `convex/products.ts`
- Đổi `resolveVariantPrice(variant)`:
  - Ưu tiên `variant.price` (giá bán hiện tại).
  - `variant.salePrice` không dùng để tính “giá từ”.
  - Nếu `price` không hợp lệ thì bỏ qua variant đó khi tính min.
- Giữ nguyên rule compare hiển thị ở UI helper (`salePrice > price` mới hiện giá gạch).

### B) Audit & harden nhánh admin list aggregate
- File: `convex/products.ts` (`getVariantAdminAggregates`, `listAdminWithOffset`)
- Đảm bảo `variantMinPrice` luôn là min của `variant.price` hợp lệ.
- Không đổi contract helper text invalid compare đã làm trước đó.

### C) Verify các bề mặt hiển thị bị ảnh hưởng (không cần đổi logic UI nếu input đã đúng)
1. Home-components có sản phẩm:
- `app/admin/home-components/create/product-grid/page.tsx`
- `app/admin/home-components/product-grid/[id]/edit/page.tsx`
- `app/admin/home-components/create/product-list/_shared.tsx`
- `app/admin/home-components/product-list/[id]/edit/page.tsx`
- `app/admin/home-components/create/category-products/page.tsx`
- `app/admin/home-components/category-products/[id]/edit/page.tsx`
- `components/site/ComponentRenderer.tsx`, `components/site/ProductListSection.tsx`

2. Site pages có sản phẩm:
- `app/(site)/products/page.tsx`
- `app/(site)/products/[slug]/page.tsx`
- `app/(site)/products/[slug]/layout.tsx`
- `app/(site)/wishlist/page.tsx`
- `components/products/QuickAddVariantModal.tsx`

3. Experiences liên quan sản phẩm:
- `app/system/experiences/products-list/page.tsx`
- `app/system/experiences/product-detail/page.tsx`
- (các preview/route ví dụ dùng chung products queries nên hưởng fix trung tâm)

### D) Nếu phát hiện điểm đọc sai trực tiếp `salePrice ?? price` cho “Giá từ”
- Sửa cục bộ điểm đó về `price`-first theo đúng contract.
- Mục tiêu: không còn nơi nào dùng `salePrice` làm giá hiện hành cho nhãn “Giá từ”.

## Verification Plan
- Chạy typecheck: `bunx tsc --noEmit`.
- Checklist manual sau fix:
  1. URL anh đưa (`/admin/home-components/product-grid/.../edit`): “Giá từ” lấy từ giá bán variant thấp nhất.
  2. Create/edit product-grid preview đồng nhất với URL trên.
  3. Product-list/category-products/home renderer: “Giá từ” đúng semantics.
  4. Site products list + detail + related + wishlist + quick add: không còn lấy nhầm giá so sánh làm giá chính.
  5. Experiences products-list/product-detail: hiển thị giá đúng theo query đã sửa.

Nếu anh duyệt plan này, em sẽ fix theo hướng **root-cause trung tâm ở convex/products.ts trước**, rồi rà và chốt toàn bộ bề mặt hiển thị liên quan.