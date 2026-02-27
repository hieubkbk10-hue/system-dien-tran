---
name: system-extension-guideline
description: Guideline tổng hợp mở rộng hệ thống VietAdmin (module/experience/home-component/seed/convex). Dùng khi thêm/sửa tại /system/modules, /system/experiences, /admin/home-components, /system/data hoặc seed wizard để tránh xung đột.
---

# System Extension Guideline (Master Playbook)

Skill này là **nguồn chuẩn duy nhất** để mở rộng hệ thống VietAdmin theo 4 mũi chính: Module, Experience, Home Component, Seed/Wizard + Convex. Mục tiêu: đồng bộ cross-layer, tránh xung đột và đảm bảo quality gate bắt buộc.

## When to use

- Thêm module mới ở `/system/modules/*`.
- Thêm experience mới ở `/system/experiences/*`.
- Thêm home-component mới ở `/admin/home-components/*`.
- Thêm seed data và cấu hình wizard ở `/system/data`.
- Bất kỳ thay đổi Convex schema/queries/mutations/seed/cleanup liên quan hệ thống.

## Where to place guidance

- **Nguồn chuẩn duy nhất:** `.factory/skills/system-extension-guideline/*`.
- Các skill chuyên biệt khác vẫn dùng bình thường, nhưng nếu thay đổi cross-domain thì **phải** theo master playbook này.

## Gap Analysis (Design Pattern hiện tại)

**Đã tốt:**
- Module: CRUD + config tabs, seed cơ bản.
- Experience: layout preview, settings cards.
- Home Component: 6 styles, preview + renderer.
- QA: checklist nền cho module.

**Thiếu cần bổ sung:**
- Contract cross-layer (System ↔ Admin ↔ Frontend).
- Seed/Wizard contract rõ ràng (idempotent + dependencies + cleanup).
- Convex full-scope contract (index, validator, pagination, storage cleanup).
- Strict gate bắt buộc pass trước khi coi hoàn tất.

## Master Contract (4 luồng bắt buộc)

### 1) Tạo Module mới ở `/system/modules/*`

**Input contract:** moduleKey, displayName, category, fields, features, settings, seed scope.

**Files phải có:**
- `convex/schema.ts` (table + indexes)
- `convex/{module}.ts` (queries/mutations + validators)
- `convex/seed.ts` (seed + clear)
- `app/system/modules/{module}/page.tsx`
- `app/admin/{module}/page.tsx`
- `app/admin/{module}/create/page.tsx`
- `app/admin/{module}/[id]/edit/page.tsx`

**Acceptance criteria:**
- Feature/Field/Settings sync sang Admin UI.
- Pagination admin list lấy `{module}PerPage`.
- Default status lấy từ settings.
- Seed/clear có cleanup storage, idempotent.

**Anti-pattern cấm:**
- Fetch ALL rồi filter JS.
- Không dùng index cho filter/sort.
- list page không đọc settings.
- Feature toggle không ẩn UI.

### 2) Tạo Experience mới ở `/system/experiences/*`

**Input contract:** experienceKey, module dependency (1-way), layout styles, settings schema.

**Files phải có:**
- `app/system/experiences/{experience}/page.tsx`
- preview component trong `components/experiences/*` hoặc `lib/experiences/*`

**Acceptance criteria:**
- Layout preview/real render parity.
- Module dependency theo 1-way (Experience phụ thuộc Module, không ngược lại).
- Save flow: `hasChanges` + `useExperienceSave`.

**Anti-pattern cấm:**
- Split panels/z-index overlay gây conflict.
- Không có DeviceToggle/LayoutTabs.

### 3) Tạo Home Component ở `/admin/home-components/*`

**Input contract:** componentType, 6 styles, config schema, preview parity.

**Files phải có:**
- `app/admin/home-components/create/{component}/page.tsx`
- `app/admin/home-components/previews.tsx`
- `app/admin/home-components/[id]/edit/page.tsx`
- `components/site/ComponentRenderer.tsx`

**Acceptance criteria:**
- Đúng 6 styles, preview = renderer.
- Fallback style nằm cuối function (không chặn styles sau).
- Không hardcode nội dung đặc thù; dùng config fields.

**Anti-pattern cấm:**
- Preview button thiếu `type="button"`.
- Style fallback return trước các case khác.

### 4) Thêm Seed + Wizard ở `/system/data`

**Input contract:** module seed scope, dependencies, reset policy.

**Files phải có:**
- `convex/seed.ts` (seed + clear)
- wizard registry (theo REFERENCE)
- UI wizard step (nếu thêm bước)

**Acceptance criteria:**
- Idempotent: seed chạy lại không nhân bản.
- Clear xóa data + storage + relations.
- Wizard dependency graph rõ ràng.

**Anti-pattern cấm:**
- Seed không kiểm tra tồn tại.
- Clear xóa DB nhưng bỏ storage.

## Convex Full Contract (Strict)

1) **Schema + Index**: Filter/sort phải có index; compound index: equality trước, range/sort sau.
2) **Queries/Mutations**: có validators, pagination chuẩn, limit mặc định 20, max 100–500.
3) **Bandwidth**: Không N+1, không collect toàn bộ; dùng take + pagination.
4) **Seed/Clear**: idempotent, cleanup storage, cascade delete.
5) **Wizard wiring**: registry có dependencies rõ, tránh circular.

## Strict Quality Gate

Xem file [CHECKLISTS.md](CHECKLISTS.md). Gate nào fail thì **không** được coi task hoàn tất.

## Templates & Reference

- Mẫu code ngắn: [TEMPLATES.md](TEMPLATES.md)
- Mapping path/convention: [REFERENCE.md](REFERENCE.md)

## Testing

- Khi thay đổi TS/TSX: chạy `bunx tsc --noEmit`.
- Không chạy lint/test khác nếu không được yêu cầu.

## Output format

Khi dùng skill này, luôn trả về:
1) Các bước cần làm theo thứ tự.
2) Checklist gate phải pass.
3) File/path sẽ thay đổi.
4) Cảnh báo anti-pattern nếu có.
