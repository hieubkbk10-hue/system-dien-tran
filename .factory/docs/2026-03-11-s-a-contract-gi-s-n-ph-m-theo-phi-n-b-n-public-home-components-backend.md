## Audit Summary

### Observation (evidence)
- `lib/products/public-price.ts` đang quyết định `Giá liên hệ` theo `saleMode !== 'cart' && price<=0`, không biết gì về variant.
- Nhiều UI hiển thị giá đang đọc từ `api.products.listAll` (không resolve variant pricing):
  - `components/site/ProductListSection.tsx`
  - `components/site/ComponentRenderer.tsx` (CategoryProducts/ProductCategories block)
  - `app/admin/home-components/create/product-grid/page.tsx`
  - `app/admin/home-components/product-grid/[id]/edit/page.tsx`
- `convex/products.ts` có resolve variant nhưng logic aggregate public hiện loại variant `stock<=0` khi tính min price (`getVariantAggregates`), dẫn tới fallback về base price (thường 0) => UI thành “Giá liên hệ”.
- Ở chi tiết sản phẩm, related products dùng `api.products.searchPublished` nhưng render giá từ `p.price/p.salePrice`; nếu aggregate sai thì related cũng sai.

### Inference
- Lỗi không chỉ ở UI: contract dữ liệu backend và nguồn query chưa đồng nhất.
- Khi bật `variantEnabled=true` + `variantPricing=variant`, nếu mọi nơi vẫn gọi `listAll` thì sẽ tiếp tục lệch nghiệp vụ.

### Decision theo nghiệp vụ anh đã chốt
- Luôn lấy **giá thấp nhất của phiên bản Active**, **không phụ thuộc stock**.
- Bỏ qua variant giá 0 khi tìm giá tối thiểu; nếu tất cả variant Active đều giá 0 thì mới `Giá liên hệ`.
- Trường hợp hết hàng nhưng có giá > 0: vẫn hiện giá (badge Hết hàng do luồng stock quyết định riêng).
- Scope: fix toàn bộ UI public/home-components hiển thị giá products + backend contract.

## Root Cause Confidence
**High** — vì có bằng chứng trực tiếp trong code:
1) aggregate backend public loại `stock<=0` khi tính giá min;
2) nhiều UI dùng `listAll` (raw product) thay vì query đã resolve variant pricing;
3) biểu hiện đúng với mô tả bug (hiện “Giá liên hệ” dù variant có giá).

## Proposal (implementation plan)

1. **Chuẩn hóa contract backend cho public price** (`convex/products.ts`)
   - Sửa `getVariantAggregates`:
     - Tính `minPrice` từ variant Active, **không lọc stock**.
     - `candidatePrice`: ưu tiên `variant.salePrice` nếu >0, fallback `variant.price` nếu >0.
     - Nếu không có candidate >0 thì `minPrice = null`.
   - Trong `resolveVariantOverrides` khi `variantPricing==='variant'`:
     - nếu có `minPrice` -> `product.price = minPrice`, `salePrice = undefined`.
     - nếu `minPrice===null` -> `product.price = 0`, `salePrice = undefined` (để FE hiển thị Giá liên hệ theo rule hiện tại).

2. **Thêm public query chuyên dùng cho UI hiển thị giá** (tránh dùng `listAll` raw)
   - Tạo query mới ví dụ: `api.products.listPublicResolved({ limit? })`:
     - lấy sản phẩm Active (theo limit),
     - áp dụng `resolveVariantOverrides` trước khi trả về.
   - Giữ `listAll` cho admin/internal để không phá backward compatibility.

3. **Đổi nguồn dữ liệu ở các UI đang hiển thị giá products**
   - `components/site/ProductListSection.tsx`: đổi `listAll` -> `listPublicResolved`.
   - `components/site/ComponentRenderer.tsx` (các block có render giá sản phẩm như CategoryProducts/Product list-like blocks): đổi các chỗ `listAll` dùng để render giá -> query public resolved tương ứng.
   - `app/admin/home-components/create/product-grid/page.tsx` và `.../product-grid/[id]/edit/page.tsx`:
     - phần preview hiển thị giá dùng query resolved (để preview khớp site).
     - vẫn có thể giữ danh sách chọn sản phẩm từ `listAll` nếu cần metadata đầy đủ, nhưng dữ liệu giá hiển thị phải lấy từ resolved map theo id.

4. **Rà soát toàn repo các chỗ render giá từ `api.products.listAll`**
   - Chỉ đổi những chỗ thuộc scope “public/home-component hiển thị giá”.
   - Không đụng luồng admin thuần quản trị không yêu cầu hiển thị giá public semantics.

5. **Giữ nguyên FE formatter hiện tại**
   - Không cần đổi `getPublicPriceLabel` nếu backend đã đảm bảo price resolved đúng semantics.
   - FE vẫn hiển thị “Giá liên hệ” khi `price<=0` ở mode contact/affiliate (đúng rule “toàn bộ variant giá 0”).

6. **Static self-review trước bàn giao**
   - Soát type-safety, null-safety và các fallback khi query undefined.
   - Soát parity create/edit preview vs site list/detail related.

## Verification Plan
- Không chạy lint/test/build theo guideline repo.
- Verification tĩnh + checklist logic:
  1) `variantEnabled=true`, `variantPricing=variant`, có variant giá `0, 199k, 299k` -> hiển thị `199k` ở:
     - `/products`
     - `/products/[slug]` phần related
     - admin home-components product-grid create/edit preview
     - site home-components render liên quan.
  2) mọi variant Active giá `0` -> hiển thị `Giá liên hệ`.
  3) mọi variant có giá >0 nhưng stock=0 -> vẫn hiện giá + badge hết hàng (nếu UI bật hiển thị stock).
  4) sản phẩm không dùng variants -> giữ behavior cũ.

Nếu anh duyệt spec này, em triển khai đúng theo các bước trên, thay đổi nhỏ và an toàn rollback.