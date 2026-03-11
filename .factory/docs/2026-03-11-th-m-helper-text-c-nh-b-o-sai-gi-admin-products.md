## Audit Summary

### Observation
1. Trang `/admin/products` đang render cột giá theo 2 nhánh:
   - **Giá theo sản phẩm**: dùng `product.price` + `product.salePrice`.
   - **Giá theo phiên bản** (`variantPricing === 'variant'` và `product.hasVariants`): hiển thị giá min từ variant (`variantMinPrice`) và không hiển thị compare trực tiếp.
2. Hiện chưa có helper text để nhận biết nhanh sản phẩm đang có data sai rule compare-price.
3. Rule đã chốt toàn hệ thống: `salePrice` chỉ hợp lệ khi `salePrice > price`.

## Root Cause Confidence
**High** — vì thiếu marker/cảnh báo ở list admin nên dữ liệu sai (nếu còn legacy hoặc lọt qua import cũ) khó được phát hiện nhanh để sửa.

## Quyết định theo yêu cầu anh
- Vị trí cảnh báo: theo **best practice** sẽ làm cả 2 mức:
  1) helper text ngay trong từng dòng cột Giá bán,
  2) badge tổng hợp số dòng lỗi ở phần trên bảng để scan nhanh.
- Nội dung helper text: theo anh chọn **ngắn gọn** → `Giá so sánh không hợp lệ`.

## Implementation Plan

### 1) Thêm detector giá sai ngay trong `app/admin/products/page.tsx`
- Tạo helper cục bộ (ví dụ `getInvalidPriceContext(product)`), trả về:
  - `null` nếu hợp lệ,
  - hoặc context `{ scope: 'product' | 'variant' }` nếu sai.
- Logic:
  - **Scope product** (khi sản phẩm tự quản giá): invalid nếu `salePrice > 0 && salePrice <= price`.
  - **Scope variant** (khi giá do phiên bản quản): đánh dấu invalid nếu có flag từ query cho biết tồn tại variant có `salePrice > 0 && salePrice <= price`.

### 2) Mở rộng dữ liệu query admin để biết sản phẩm nào có variant sai giá
- Cập nhật `convex/products.ts` trong `listAdminWithOffset` (nhánh `variantPricing === 'variant'`):
  - Khi aggregate variants cho từng product, bổ sung cờ `hasInvalidVariantComparePrice`.
  - Rule cờ này: true nếu tồn tại active variant có `salePrice > 0` và (`price` không hợp lệ hoặc `salePrice <= price`).
- Trả cờ này ra cùng payload page admin (không đổi behavior hiển thị giá hiện tại).

### 3) Render helper text theo từng dòng ở cột Giá bán
- Trong cell giá ở `app/admin/products/page.tsx`:
  - Giữ nguyên UI giá hiện có.
  - Nếu detector báo invalid, thêm helper text nhỏ màu warning/danger ngay dưới giá:
    - text: `Giá so sánh không hợp lệ`.
  - Nếu scope variant, helper text vẫn như trên (ngắn gọn theo yêu cầu), không verbose.

### 4) Thêm badge tổng hợp ở phần header bảng (best practice)
- Tính `invalidPriceCount` từ `paginatedData` bằng cùng detector.
- Nếu `invalidPriceCount > 0`, hiển thị badge cảnh báo gần khu vực filter/column-toggle:
  - ví dụ: `X sản phẩm giá không hợp lệ`.
- Mục tiêu: giúp admin scan nhanh trước khi đi sửa từng dòng.

### 5) Verification Plan
- Typecheck: `bunx tsc --noEmit`.
- Repro checklist:
  1. Sản phẩm tự quản giá có `salePrice <= price` → helper text xuất hiện ở đúng dòng.
  2. Sản phẩm quản giá theo variant, có ít nhất 1 variant invalid → helper text xuất hiện ở dòng sản phẩm đó.
  3. Badge tổng hợp hiển thị đúng số lượng dòng lỗi trên trang hiện tại.
  4. Dòng hợp lệ không bị cảnh báo; UI giá cũ không bị thay đổi ngoài phần helper/badge.

Nếu anh duyệt, em implement đúng các bước trên, scope gọn chỉ trong `/admin/products` + query admin liên quan.