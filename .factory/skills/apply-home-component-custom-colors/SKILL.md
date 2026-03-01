---
name: apply-home-component-custom-colors
description: Chuẩn hoá rollout hệ thống custom color cho toàn bộ home-components (system/admin/preview/site). Dùng khi mở rộng từ Hero sang các type còn lại, cần checklist đầy đủ, tránh mismatch preview-site, sai single/dual, thiếu reset hoặc thiếu sonner toast.
---

# Apply Home Component Custom Colors

## Mục tiêu
- Áp dụng custom color theo type cho **tất cả home-components**.
- Đảm bảo **preview = site render** và tuân thủ dual-brand-color-system.
- Tránh lặp bug đã gặp ở pilot Hero.

## Khi nào dùng
- Khi user yêu cầu “áp dụng custom color cho các home-component còn lại”.
- Khi mở rộng từ pilot Hero sang các type khác.

## Không dùng khi
- Chỉ chỉnh màu admin UI chung.
- Chỉ cần đổi text/spacing, không liên quan tới brand colors.

## Nguồn chân lý (bắt buộc đọc trước khi làm)
- `dual-brand-color-system` skill.
- 4 commit lessons:
  - `f99ecc5`: control center + settings storage + filter create + reset seed/module.
  - `7641f05`: table 1 khối + per-row action + bulk action.
  - `bec3060`: site render phải đọc override (tránh preview ≠ site), UI compact.
  - `dc764b4`: toggle cần sonner feedback.

## Quy trình bắt buộc per-component (A → Z)
1) **System config**
   - Thêm type vào `CUSTOM_SUPPORTED_TYPES`.
   - Đảm bảo toggle row + bulk action có **toast success/error**.
   - Không đổi shape settings (`home_components/type_color_overrides`).

2) **Admin create/edit**
   - Create page vẫn filter theo `hiddenTypes`.
   - Edit page của type:
     - Custom block đặt gần preview.
     - Ẩn custom block nếu system đang OFF.
     - Nếu có mode switch: single → dual auto secondary (analogous + deltaE guard).

3) **Preview + Site parity (critical)**
   - Preview và Site dùng chung helper/tokens.
   - Site render **bắt buộc đọc override type** (tránh bug như Hero).
   - Single mode luôn `secondary = primary`.

4) **Ops & reset**
   - Seed wizard/module enable không để state ẩn/cấu hình dở dang.
   - Toggle actions luôn có toast để dev biết thao tác đã lưu.

## Checklist rollout toàn bộ (global)
- [ ] `CUSTOM_SUPPORTED_TYPES` cập nhật đầy đủ.
- [ ] Table system có per-row action + bulk action (không phá UX hiện tại).
- [ ] Mọi edit page có custom block + hide khi system OFF.
- [ ] Site render dùng override theo type (không chỉ preview/edit).
- [ ] Single mode = monochromatic (secondary = primary).
- [ ] Sonner toast cho mọi toggle.
- [ ] Seed/module reset không phá default.

## Anti-pattern phải tránh
- Preview đổi màu nhưng site render không đổi.
- Single mode vẫn hiển thị/đòi secondary.
- Bỏ toast cho toggle (UX mờ).
- Hardcode màu ở site thay vì helper/tokens.

## Done criteria
- Đổi màu ở `/system/home-components` → edit + preview + site đổi đúng.
- Đổi mode single/dual → preview + site thống nhất.
- Tất cả toggle đều có toast xác nhận.
