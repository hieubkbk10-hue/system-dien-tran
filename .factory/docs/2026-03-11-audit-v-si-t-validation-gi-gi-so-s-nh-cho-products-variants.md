## Audit Summary

### Observation
1. **Variants admin list đang hiển thị sai semantics khi data invalid hoặc logic render bị đảo**
   - File: `app/admin/products/[id]/variants/page.tsx`
   - Hiện code render coi `price` là giá chính và `salePrice` là giá gạch nếu `salePrice > price`.
   - Nhưng ở một số case thực tế anh gặp, data đã bị nhập/lưu ở trạng thái không hợp lệ nên cột “Giá bán” nhìn sai hẳn.

2. **Product detail `/products/[slug]` đang phụ thuộc hoàn toàn vào helper public price**
   - File: `lib/products/public-price.ts`
   - Rule hiện tại đang cho `comparePrice = salePrice` khi `salePrice > price`.
   - Về semantics thì rule này đúng với naming hiện tại (`price = giá bán`, `salePrice = giá so sánh`), nhưng nếu dữ liệu bẩn lọt vào hoặc validation không đồng nhất giữa create/edit/variant thì UI sẽ hiển thị rất dễ “bậy”.

3. **Validation hiện tại chưa được siết đồng đều ở mọi entry point**
   - Đã có validation ở một số nơi:
     - `app/admin/products/[id]/variants/page.tsx`: `hasInvalidPrices` + toast “Giá so sánh phải lớn hơn hoặc bằng giá bán”
     - `app/admin/products/page.tsx`: import validation `salePrice >= price`
     - `convex/products.ts`: import/generate variants validation `row.salePrice >= row.price`
   - Nhưng còn thiếu/không rõ ràng ở các luồng quan trọng:
     - `app/admin/products/create/page.tsx`
     - `app/admin/products/[id]/edit/page.tsx`
     - `app/admin/products/[id]/variants/components/VariantForm.tsx`
     - backend create/update product và create/update variant cần chặn cứng, không chỉ dựa UI.

4. **Thông điệp validation hiện tại còn lệch wording**
   - Có nơi dùng “Giá khuyến mãi phải nhỏ hơn giá bán”, trong khi UI hiện đang gọi field là:
     - `Giá bán`
     - `Giá so sánh (trước giảm)`
   - Cần thống nhất microcopy theo đúng semantics user đang thấy.

### Root cause
- Root cause không chỉ là render sai, mà là **contract validation chưa được khóa chặt end-to-end**.
- Khi data invalid (`giá bán > giá so sánh trước giảm`) vẫn lọt qua một số luồng, UI sẽ không còn cách hiển thị nào đúng nghĩa.
- Nếu chỉ vá riêng màn list/detail mà không khóa validation ở create/edit/variant/backend, bug sẽ tái diễn.

## Root Cause Confidence
**High** — vì đã có evidence trực tiếp cho thấy validation đang rải rác, không đồng nhất giữa UI và backend; đồng thời user đã repro case invalid price làm hỏng cả admin list lẫn public detail.

## Proposal

### A) Chốt invariant giá dùng toàn hệ thống
Áp một rule duy nhất:
- `price` = **Giá bán hiện tại**
- `salePrice` = **Giá so sánh (trước giảm)**
- Dữ liệu hợp lệ chỉ khi:
  - `price > 0` với saleMode cart và nơi bắt buộc có giá
  - `salePrice` chỉ được tồn tại khi `salePrice > price`
- Nếu `salePrice <= price` thì **không được lưu**.

### B) Siết validation ở tất cả entry points admin
1. `app/admin/products/create/page.tsx`
   - Trước `createProduct`, validate:
     - nếu có `salePrice` và `salePrice <= price` => chặn submit
   - Hiện lỗi ngay tại client với wording thống nhất.

2. `app/admin/products/[id]/edit/page.tsx`
   - Trước `updateProduct`, validate rule tương tự.

3. `app/admin/products/[id]/variants/components/VariantForm.tsx`
   - Trước `onSubmit`, validate:
     - nếu có cả `price` và `salePrice`, mà `salePrice <= price` => chặn lưu
   - Đây là chỗ currently còn thiếu validation trực tiếp.

4. `app/admin/products/[id]/variants/page.tsx`
   - Giữ validation bulk/generator, nhưng đổi wording cho đúng semantics:
     - ví dụ: `Giá so sánh phải lớn hơn giá bán`
   - Đồng thời audit `hasInvalidPrices` để bảo đảm đang check đúng field sau khi chuẩn hóa order input.

### C) Chặn cứng ở backend để không thể lưu data bẩn
1. `convex/products.ts`
   - Với `create` / `update` product:
     - nếu `salePrice` tồn tại và `salePrice <= price` => throw error rõ ràng.
2. `convex/productVariants.ts` hoặc file mutation variants tương ứng
   - Với `create` / `update` variant:
     - nếu `salePrice` tồn tại và `salePrice <= price` => throw error.
3. Mục tiêu:
   - Dù UI có bỏ sót, backend vẫn chặn tuyệt đối.

### D) Sửa render admin list + public detail sau khi invariant đã chắc
1. `app/admin/products/[id]/variants/page.tsx`
   - Cột “Giá bán” hiển thị:
     - `price` là giá chính
     - `salePrice` gạch nếu hợp lệ
   - Nếu data invalid cũ tồn tại trong DB, render fallback an toàn và không giả vờ khuyến mãi.

2. `lib/products/public-price.ts`
   - Chỉ trả `comparePrice` khi `salePrice > price > 0`
   - Ngược lại trả `comparePrice = undefined`

3. `app/(site)/products/[slug]/page.tsx`
   - Giá detail luôn lấy `price` làm giá chính
   - Chỉ hiện giá gạch nếu `salePrice > price`
   - Case invalid cũ trong DB => chỉ hiện giá chính, không hiện compare.

### E) Audit mở rộng các chỗ tương tự để tránh tái phát
Rà lại toàn bộ chỗ nhập/lưu/hiển thị có liên quan:
- `app/admin/products/create/page.tsx`
- `app/admin/products/[id]/edit/page.tsx`
- `app/admin/products/[id]/variants/components/VariantForm.tsx`
- `app/admin/products/[id]/variants/page.tsx`
- `app/admin/products/page.tsx` (import)
- `convex/products.ts`
- `convex/productVariants.ts` hoặc file tương ứng
- `lib/products/public-price.ts`
- `app/(site)/products/[slug]/page.tsx`
- các list/home-components/wishlist/quick add dùng helper chung

Nguyên tắc anti-regression:
- invalid sale không được lưu
- nếu data legacy invalid còn tồn tại, UI degrade an toàn: chỉ hiện giá bán, không hiện giá gạch

## Verification Plan
- Typecheck: `bunx tsc --noEmit`
- Checklist audit sau fix:
  1. Product create/edit: nhập `giá so sánh <= giá bán` => không lưu được.
  2. Variant create/edit: nhập `giá so sánh <= giá bán` => không lưu được.
  3. Variant generator: vẫn chặn đúng với message chuẩn.
  4. Admin variants list: cột “Giá bán” hiển thị đúng giá bán hiện tại, giá so sánh bị gạch nếu hợp lệ.
  5. Product detail: hiện giá bán là giá chính; chỉ có giá gạch khi có compare hợp lệ.
  6. List/home-components variant vẫn giữ policy đã chốt: `Giá từ X`, không compare/%.
  7. Nếu gặp data legacy invalid trong DB: không show compare sai, không làm vỡ UI.

Nếu anh duyệt spec này, em sẽ làm theo hướng **validation-first + render-safe**, để xử lý tận gốc cả bug hiện tại lẫn tái phát về sau.