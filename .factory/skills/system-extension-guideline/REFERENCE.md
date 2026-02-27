# Reference Map

## Path Map (chuẩn hoá)

**Module**
- Convex: `convex/{module}.ts`, `convex/model/{module}.ts`, `convex/schema.ts`, `convex/seed.ts`
- Admin: `app/admin/{module}/page.tsx`, `app/admin/{module}/create/page.tsx`, `app/admin/{module}/[id]/edit/page.tsx`
- System: `app/system/modules/{module}/page.tsx`

**Experience**
- System: `app/system/experiences/{experience}/page.tsx`
- Preview helpers: `components/experiences/*` + `lib/experiences/*`

**Home Component**
- Create: `app/admin/home-components/create/{component}/page.tsx`
- Edit: `app/admin/home-components/[id]/edit/page.tsx`
- Preview: `app/admin/home-components/previews.tsx`
- Renderer: `components/site/ComponentRenderer.tsx`

**Seed/Wizard**
- Seed: `convex/seed.ts`
- Wizard registry: theo file hiện có ở `/system/data` (đảm bảo dependencies rõ ràng)

## Naming & Keys

- `moduleKey`: camelCase (vd: `posts`, `productCategories`).
- Setting keys: camelCase, phải khớp DB.
- Feature keys: `enableXxx` để auto-link field.
- Component type: PascalCase; route: kebab-case.

## Convex conventions

- Index: equality trước, range/sort sau.
- Query list: dùng `paginate`/`take` + limit.
- Không `collect()` nếu không cần; tránh N+1.
- Clear data phải cleanup storage.

## System ↔ Admin sync

- `listModuleSettings` để lấy `{module}PerPage`, `defaultStatus`.
- Feature/Field toggle ảnh hưởng UI ngay trong Admin pages.

## Experience dependency

- Experience chỉ đọc module status/config.
- Không để module phụ thuộc vào experience.
