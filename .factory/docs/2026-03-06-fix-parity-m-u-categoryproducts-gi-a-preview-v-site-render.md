## Problem Graph
1. [Main] Màu CategoryProducts ở site không khớp preview <- depends on 1.1, 1.2
   1.1 [ROOT CAUSE] `CategoryProductsPreview` dùng token `colors.heading` cho tiêu đề, còn `components/site/ComponentRenderer.tsx` (function `CategoryProductsSection`) nhiều `<h2>/<h4>` đang dùng màu mặc định (`text-slate...` hoặc không set `style.color`) nên ra đen.
   1.2 Site `CategoryProductsSection` chưa build color token parity như preview (heading/body/button/empty-state), nên mỗi style (`grid/carousel/cards/bento/magazine/showcase`) lệch theo cách khác nhau.

## Execution (with reflection)
1. Solving 1.1.1 — Chuẩn hóa token màu ở runtime site
   - Thought: Dùng cùng nguồn màu như preview để hết lệch hiện tại và tránh lệch về sau.
   - Action:
     - Trong `components/site/ComponentRenderer.tsx`, ngay trong `CategoryProductsSection`, thêm `const colors = getCategoryProductsColors(brandColor, secondary, 'single')` (hoặc derive mode nếu có dữ liệu mode runtime khả dụng).
     - Map các màu theo đúng preview contract:
       - heading: `colors.heading`
       - body text: `colors.bodyText`
       - price/button text: `colors.buttonText` / `colors.priceText`
       - empty-state: `colors.emptyState*`
       - card/neutral border/background: `colors.cardBorder`, `colors.neutralBackground`, ...
   - Reflection: ✅ Nếu dùng cùng token source, tiêu đề sẽ không còn đen và các style đồng bộ hơn.

2. Solving 1.2 — Fix full parity màu cho 6 style site
   - Thought: Không chỉ sửa mỗi `h2`; cần rà toàn bộ điểm hardcoded trong từng style.
   - Action (trong `CategoryProductsSection`):
     - **Grid**: thay màu tiêu đề section, product title, empty message theo token.
     - **Carousel**: tiêu đề, link “Xem danh mục”, tên/giá item theo token.
     - **Cards**: header background/border + title + CTA + text body theo token.
     - **Bento**: section title, featured text/price, card badge/background theo token.
     - **Magazine**: editorial title/subtitle, quick-view chip, item text/price theo token.
     - **Showcase**: title/underline/link, card text/price theo token.
     - Loại bỏ các hardcode `text-slate-*` ở phần text business quan trọng nếu preview đang dùng token động.
   - Reflection: ✅ Đây là phần quyết định parity thực sự, không chỉ “fix điểm đỏ”.

3. Guardrails để không phá behavior hiện tại
   - Giữ nguyên logic dữ liệu và saleMode/price (đã fix trước đó), chỉ chỉnh lớp hiển thị màu.
   - Không đổi layout/spacing/interaction nếu không cần.
   - Ưu tiên KISS: không tạo abstraction mới nếu chỉ dùng riêng CategoryProductsSection.

4. Verification
   - Chạy `bunx tsc --noEmit`.
   - Test tay đúng URL bạn nêu:
     - `/admin/home-components/category-products/[id]/edit` preview
     - trang site render thực tương ứng
   - Checklist parity:
     - Tiêu đề section đúng màu chủ đạo như preview
     - Màu giá/nút/empty-state không còn hardcoded đen-xám lệch theme
     - 6 style chuyển qua lại vẫn đúng tone.

## Kết luận ngắn
Nguyên nhân chính đúng như bạn thấy: preview dùng token màu động, còn site render CategoryProducts vẫn còn nhiều màu hardcoded. Kế hoạch trên sẽ fix full parity màu cho toàn bộ style trong `CategoryProductsSection`, ưu tiên tiêu đề trước rồi đồng bộ toàn bộ text/cta/empty-state để không lệch lại.