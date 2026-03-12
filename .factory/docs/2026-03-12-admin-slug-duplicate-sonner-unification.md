## Audit Summary
- Observation: lỗi đang văng raw Convex server error ở luồng tạo `productCategories`, nhưng thực tế page hiện tại đã có `toast.error(error.message)` ở `app/admin/product-categories/create/page.tsx` và `app/admin/product-categories/[id]/edit/page.tsx`; nghĩa là raw message đang lọt qua vì frontend chưa normalize message theo pattern chung, không phải vì thiếu Sonner hoàn toàn.
- Observation: duplicate slug/unique đang rải ở 7 nhóm admin user đã chọn fix all: `productCategories`, `postCategories`, `serviceCategories`, `products`, `posts`, `services`, `productOptions`.
- Observation: backend đang trả message không đồng nhất:
  - `productCategories.ts`: tiếng Việt chi tiết `Slug này đã được sử dụng...`
  - `productOptions.ts`: `Slug đã tồn tại`
  - `products.ts`, `convex/model/posts.ts`, `convex/model/services.ts`, `convex/model/postCategories.ts`, `convex/model/serviceCategories.ts`: `Slug already exists`
  - unique khác cũng đang lệch chuẩn: `SKU already exists` trong `products.ts`, `Mã voucher đã tồn tại` trong `promotions.ts`.
- Observation: chỉ `products/create` và `products/[id]/edit` đã có hàm mapper riêng `getProductMutationErrorMessage`; các màn còn lại bắn thẳng `error.message` nên UX không đồng bộ.
- Observation: quick-create modal cũng bị cùng vấn đề ở:
  - `app/admin/products/components/QuickCreateCategoryModal.tsx`
  - `app/admin/components/QuickCreateCategoryModal.tsx`
  - `app/admin/components/QuickCreateServiceCategoryModal.tsx`

## Root Cause Confidence
- High — nguyên nhân gốc là thiếu một lớp chuẩn hóa lỗi mutation ở frontend admin, trong khi backend trả nhiều biến thể message unique khác nhau. Evidence nằm ở các file admin đang `toast.error(error instanceof Error ? error.message : ...)` trực tiếp, còn chỉ riêng products có mapper cục bộ nên UX ở products tốt hơn phần còn lại.
- Counter-hypothesis đã loại trừ:
  - Không phải thiếu Sonner globally, vì Sonner đã được dùng rộng khắp trong `/app/admin/**`.
  - Không phải riêng `productCategories` lỗi backend, vì audit cho thấy nhiều module khác cũng có duplicate slug với message không đồng nhất.

## Proposal
1. Tạo utility dùng chung cho admin, ví dụ `app/admin/lib/mutation-error.ts`:
   - `getAdminMutationErrorMessage(error, fallback)`
   - map các unique error về tiếng Việt thống nhất theo quyết định của bạn: frontend mapping, không đổi backend.
   - trước mắt cover đầy đủ:
     - `Slug already exists`
     - `Slug đã tồn tại`
     - `Slug này đã được sử dụng, vui lòng chọn slug khác`
     - `SKU already exists`
     - `Mã voucher đã tồn tại`
   - output đề xuất:
     - slug -> `Slug đã tồn tại, vui lòng chọn slug khác`
     - sku -> `Mã SKU đã tồn tại, vui lòng chọn mã khác`
     - voucher -> `Mã voucher đã tồn tại, vui lòng chọn mã khác`
   - giữ fallback hiện có cho các lỗi khác để không mở rộng scope.

2. Refactor các page/modal admin đang gọi create/update của 7 nhóm để dùng chung utility thay vì bắn raw `error.message`:
   - `app/admin/product-categories/create/page.tsx`
   - `app/admin/product-categories/[id]/edit/page.tsx`
   - `app/admin/categories/create/page.tsx`
   - `app/admin/categories/[id]/edit/page.tsx`
   - `app/admin/post-categories/create/page.tsx`
   - `app/admin/post-categories/[id]/edit/page.tsx`
   - `app/admin/service-categories/create/page.tsx`
   - `app/admin/service-categories/[id]/edit/page.tsx`
   - `app/admin/product-options/create/page.tsx`
   - `app/admin/product-options/[id]/edit/page.tsx`
   - `app/admin/posts/create/page.tsx`
   - `app/admin/posts/[id]/edit/page.tsx`
   - `app/admin/services/create/page.tsx`
   - `app/admin/services/[id]/edit/page.tsx`
   - `app/admin/products/create/page.tsx`
   - `app/admin/products/[id]/edit/page.tsx`
   - quick-create modals liên quan.
- Với `products/*`, thay hàm `getProductMutationErrorMessage` cục bộ bằng utility chung để tránh duplicate logic.

3. Audit bổ sung cùng đợt cho unique-notification ngoài slug theo phạm vi bạn chọn:
   - products: SKU
   - promotions: voucher code
   - nếu UI admin của promotions đang toast raw message ở create/edit, đổi sang utility chung luôn để đồng bộ pattern.

4. Giữ backend Convex nguyên trạng:
   - không đổi message ở mutation/model
   - không đổi schema/API
   - giảm rủi ro regression và đúng với quyết định “map ở frontend”.

5. Static self-review sau sửa:
   - soát import utility mới
   - soát tất cả catch blocks trong scope đã chọn
   - đảm bảo không còn các màn trong scope dùng raw `error.message` cho slug/SKU/voucher duplicate.

## File-level Implementation Plan
- `app/admin/lib/mutation-error.ts`
  - thêm constants/pattern matcher cho duplicate slug, SKU, voucher.
- Các page/modal admin trong scope trên
  - import utility
  - thay `toast.error(error instanceof Error ? error.message : fallback)` bằng `toast.error(getAdminMutationErrorMessage(error, fallback))`
- `app/admin/products/create/page.tsx`, `app/admin/products/[id]/edit/page.tsx`
  - bỏ helper cục bộ, dùng helper chung.
- `app/admin/promotions/create/page.tsx`, `app/admin/promotions/[id]/edit/page.tsx` nếu đang thuộc luồng unique voucher raw toast
  - nối vào utility chung.

## Verification Plan
- Theo repo rule, không chạy lint/test/build.
- Verify tĩnh bằng evidence file-level:
  1. grep lại các page trong scope để chắc không còn raw `toast.error(error instanceof Error ? error.message : ...)` cho luồng create/update đã audit.
  2. review utility mapping cover đủ 3 nhóm unique: slug, SKU, voucher.
  3. kiểm tra products vẫn giữ fallback đúng sau khi bỏ helper riêng.
  4. kiểm tra quick-create modal cũng đi qua cùng utility để UX đồng bộ.
- Tiêu chí pass/fail:
  - Pass: khi backend trả bất kỳ biến thể duplicate slug/SKU/voucher đã audit, UI admin hiển thị Sonner tiếng Việt thống nhất, không lộ raw Convex server error string.
  - Fail: còn ít nhất một màn trong scope bắn thẳng `error.message` hoặc message duplicate không được normalize.

Nếu bạn duyệt spec này, mình sẽ triển khai đúng phạm vi trên và commit lại sau khi tự review tĩnh xong.