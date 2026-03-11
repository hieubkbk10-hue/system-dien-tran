## Audit Summary

### Observation (evidence mới theo yêu cầu)
1. **Variant edit form đang đảo thứ tự field giá**
   - File: `app/admin/products/[id]/variants/components/VariantForm.tsx`
   - Hiện tại đang render:
     - Trái: `Giá so sánh (trước giảm)`
     - Phải: `Giá bán (VNĐ)`
   - Điều này gây lệch mental model nhập liệu (best practice: nhập giá bán/current trước, giá so sánh/original sau).

2. **Product create/edit khi bật variantPricing=variant vẫn hiển thị text thừa**
   - Files:
     - `app/admin/products/create/page.tsx` (đoạn `Giá lấy theo phiên bản.`)
     - `app/admin/products/[id]/edit/page.tsx` (đoạn `Giá lấy theo phiên bản.`)
   - Text này không còn hữu ích (anh yêu cầu ẩn luôn), và tạo nhiễu UX trong card “Giá & Kho hàng”.

3. **Các điểm tương tự trong admin variants list cũng đang theo thứ tự ngược**
   - File: `app/admin/products/[id]/variants/page.tsx`
   - Có nhiều chỗ đặt “Giá so sánh (trước giảm)” trước “Giá bán”:
     - Form bulk/default values
     - Header bảng variants
   - Cần đồng bộ lại thứ tự: **Giá bán trước, Giá so sánh sau** để tránh lộn.

4. **Compare-price semantics ở public/home-components (audit trước đó) vẫn cần chuẩn hóa theo policy đã chốt**
   - List/home variant: “Giá từ X”, ẩn compare/%.
   - Detail: compare chỉ theo phiên bản đang chọn nếu hợp lệ.

## Root Cause Confidence
**High** — do inconsistency naming/ordering và microcopy cũ còn sót giữa nhiều màn admin variant + contract public price chưa encode rõ policy list vs detail.

## Proposal (đã bổ sung theo yêu cầu mới)

### A) Chuẩn UX nhập giá cho phiên bản (Admin)
1. `VariantForm.tsx`
   - Đảo thứ tự 2 field trong section giá:
     - Field 1: **Giá bán (VNĐ)**
     - Field 2: **Giá so sánh (trước giảm)**
   - Giữ validation hiện tại, chỉ đổi thứ tự hiển thị + label/helper nhất quán.

2. `app/admin/products/[id]/variants/page.tsx`
   - Đảo thứ tự ở:
     - form giá mặc định / bulk apply
     - table columns
   - Chuẩn hóa wording, luôn current price trước compare price sau.

### B) Ẩn phần “Giá lấy theo phiên bản” ở Product create/edit
1. `app/admin/products/create/page.tsx`
2. `app/admin/products/[id]/edit/page.tsx`
   - Khi `hideBasePricing=true`, ẩn block text “Giá lấy theo phiên bản.” hoàn toàn.
   - Card “Giá & Kho hàng” chỉ còn phần cần thiết (không để thông báo thừa).

### C) Giữ policy compare-price SaaS cho public/home-components (từ spec trước)
1. List/home variant => chỉ “Giá từ X”, không compare/%
2. Detail variant => compare chỉ theo selected variant khi `original > effective > 0`
3. Sale invalid => bỏ compare/%

### D) Audit mở rộng điểm tương tự (anti-regression)
- Quét toàn bộ text/label liên quan:
  - `Giá bán`, `Giá so sánh (trước giảm)`, `Giá lấy theo phiên bản`
- Đảm bảo không còn chỗ nào đặt compare trước current trong luồng variants admin.

## Verification Plan
- Typecheck: `bunx tsc --noEmit`.
- Checklist manual logic:
  1) `/admin/products/:id/variants/:vid/edit`: Giá bán đứng trước, Giá so sánh đứng sau.
  2) `/admin/products/:id/variants`: form mặc định + bảng cùng thứ tự.
  3) `/admin/products/:id/edit` và `/admin/products/create` khi bật variant pricing: không còn text “Giá lấy theo phiên bản.”.
  4) Public/home-components + detail tuân thủ policy compare-price đã chốt (list/home “Giá từ”, detail theo variant đang chọn).

Nếu anh duyệt spec này, em triển khai gộp một lượt để đồng bộ toàn hệ thống và tránh regressions.