# Strict Quality Gates

Gate nào fail thì coi như **chưa hoàn tất**.

## Gate A — Schema / Index / Validator

- [ ] Schema table đúng naming + fields bắt buộc.
- [ ] Index cho mọi filter/sort; compound index đúng thứ tự.
- [ ] Validators đầy đủ cho queries/mutations.
- [ ] Pagination dùng `paginate` hoặc `take` có limit.

## Gate B — System ↔ Admin Sync

- [ ] Admin list đọc `{module}PerPage` từ settings.
- [ ] Default status lấy từ settings.
- [ ] Feature toggle ảnh hưởng UI (ẩn/hiện cột, filter, field).
- [ ] Field toggle ảnh hưởng create/edit form.

## Gate C — Experience ↔ Module Dependency (1-way)

- [ ] Experience chỉ đọc trạng thái module, không sửa module.
- [ ] Module disabled → Experience hiển thị trạng thái phụ thuộc.
- [ ] Preview parity với renderer.

## Gate D — Home Preview ↔ Renderer Parity

- [ ] Đủ 6 styles.
- [ ] Fallback style return đặt cuối.
- [ ] Preview buttons có `type="button"`.
- [ ] Config fields thay cho hardcode nội dung.

## Gate E — Seed Wizard / Cleanup / Idempotent

- [ ] Seed kiểm tra tồn tại trước khi insert.
- [ ] Clear xóa DB + storage + relations.
- [ ] Wizard dependency graph rõ ràng, không circular.
- [ ] Reset = clear + seed theo đúng thứ tự.
