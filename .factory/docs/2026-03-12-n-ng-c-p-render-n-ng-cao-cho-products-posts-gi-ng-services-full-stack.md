## Audit Summary
- User xác nhận scope **full-stack giống Services** cho cả Posts và Products, và với Products thì `content` mặc định là `description`.
- Hiện trạng:
  - Module config `posts.config.ts` và `products.config.ts` chưa có feature `enableMarkdownRender/enableHtmlRender` và chưa có runtime fields `renderType/markdownRender/htmlRender`.
  - Admin create/edit của Posts và Products chưa có card `Render nâng cao`, chưa có select `renderType` theo toggle module.
  - Convex hiện chỉ có Services xử lý trọn bộ render fields; Posts/Products chưa có validator + model + mutation cho 3 field này.
  - Public detail page Posts/Products hiện vẫn render theo luồng cũ (content/description), chưa resolve theo `renderType`.

## Root Cause Confidence
**High** — thiếu đồng bộ xuyên suốt module (config toggle + admin UI + convex data contract + public render) nên không thể có hành vi “tương tự Services”.

## Proposal
1. **Mở rộng module config cho Posts/Products**
   - Files: `lib/modules/configs/posts.config.ts`, `lib/modules/configs/products.config.ts`.
   - Thêm features:
     - `enableMarkdownRender` (linkedField: `markdownRender`)
     - `enableHtmlRender` (linkedField: `htmlRender`)
   - Thêm runtime fields:
     - `renderType` (select)
     - `markdownRender` (textarea, linked feature)
     - `htmlRender` (textarea, linked feature)

2. **Mở rộng Convex schema + model + functions**
   - Files dự kiến: `convex/schema.ts`, `convex/model/posts.ts`, `convex/model/products.ts`, `convex/posts.ts`, `convex/products.ts`, `convex/seed.ts` (nếu cần seed features/fields tương ứng).
   - Thêm 3 field cho bảng `posts` và `products`:
     - `renderType?: 'content' | 'markdown' | 'html'`
     - `markdownRender?: string`
     - `htmlRender?: string`
   - Cập nhật args/create/update validators + return validators (`postDoc`, `productDoc`) để không lệch contract.

3. **Admin UI create/edit cho Posts/Products theo pattern Services**
   - Files:
     - `app/admin/posts/create/page.tsx`
     - `app/admin/posts/[id]/edit/page.tsx`
     - `app/admin/products/create/page.tsx`
     - `app/admin/products/[id]/edit/page.tsx`
   - Thêm logic:
     - `hasMarkdownRender`, `hasHtmlRender`, `showAdvancedRenderCard` từ `enabledFields`.
     - Card `Render nâng cao` chỉ hiện khi ít nhất một toggle bật.
     - Option `renderType` động:
       - luôn có `content`
       - có `markdown` khi bật markdown
       - có `html` khi bật html
     - Edit pages thêm guard fallback `renderType` về `content` khi option cũ không còn hợp lệ.
   - Với pages có dirty-state (`posts/[id]/edit`, `products/[id]/edit`): bổ sung snapshot/dependency để render fields trigger `Lưu thay đổi` đúng.

4. **Public render cho Posts/Products theo renderType**
   - Files dự kiến:
     - `app/(site)/posts/[slug]/page.tsx`
     - `app/(site)/products/[slug]/page.tsx`
   - Áp dụng resolver giống Services:
     - `renderType=content` -> Posts dùng `content`, Products dùng `description`
     - `renderType=markdown` -> render từ `markdownRender`
     - `renderType=html` -> render từ `htmlRender`
   - Dùng `RichContent + withFormatMarker` để thống nhất pipeline render.

## Verification Plan
- Chạy `npx convex codegen` (nếu cần cập nhật generated types sau schema thay đổi).
- Chạy `bunx tsc --noEmit`.
- Manual verify cho cả Posts + Products:
  1) Toggle markdown/html ở `/system/modules/{posts|products}`.
  2) Kiểm tra create/edit: card ẩn/hiện đúng, option `renderType` đúng số lượng.
  3) Sửa markdown/html ở edit => nút đổi sang `Lưu thay đổi`.
  4) Lưu thành công và mở trang detail public => hiển thị đúng theo `renderType` đã chọn.