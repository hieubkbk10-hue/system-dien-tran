## Audit Summary
**Observation (evidence):**
- `services` hiện chỉ có `content` trong schema/model/mutation: `convex/schema.ts:803-823`, `convex/model/services.ts`, `convex/services.ts:524-555`.
- Admin Services create/edit hiện chỉ có 1 card `Nội dung` dùng `LexicalEditor`: `app/admin/services/create/page.tsx`, `app/admin/services/[id]/edit/page.tsx`.
- Public service detail đang render cứng `service.content` bằng `dangerouslySetInnerHTML` ở cả 3 style: `components/site/services/detail/ServiceDetailStyles.tsx:237,455,624`.
- Module Services hiện mới có 3 feature (`enablePrice`, `enableDuration`, `enableFeatured`), chưa có toggle cho markdown/html render: `lib/modules/configs/services.config.ts`.
- User muốn giữ 3 field mô tả cũ như hiện tại, thêm 2 field mới `markdown render`, `html render`, có `renderType = content | markdown | html`, toggle độc lập ở module Services, UI admin tách card riêng, public chỉ áp dụng ở **Services detail page trước**.

## Root Cause Confidence
**High** — vì hiện kiến trúc Services chưa có data fields + selector để public biết phải render `content`, `markdown`, hay `html raw`; detail page cũng đang hardcode vào `service.content` nên dù admin có thêm input mới cũng không có tác dụng nếu không mở rộng schema/model/render path.

## Proposal
Em sẽ triển khai theo hướng ít rủi ro, không đụng Posts/Products ở phase này:

### 1) Mở rộng data model cho Services
**Files:**
- `convex/schema.ts`
- `convex/model/services.ts`
- `convex/services.ts`

**Thay đổi:**
- Thêm 3 field mới cho bảng `services`:
  - `renderType?: 'content' | 'markdown' | 'html'`
  - `markdownRender?: string`
  - `htmlRender?: string`
- Update create/update validators + model args để lưu 3 field mới.
- Default `renderType` là `'content'` để giữ backward compatibility với data cũ.

### 2) Bật/tắt field bằng module features + runtime fields cho Services
**Files:**
- `lib/modules/configs/services.config.ts`
- nếu cần, các helper runtime config liên quan sẽ được đọc để match pattern hiện có

**Thay đổi:**
- Thêm 2 feature độc lập:
  - `enableMarkdownRender`
  - `enableHtmlRender`
- Thêm 3 runtime fields mới cho Services:
  - `renderType` (select)
  - `markdownRender` (textarea)
  - `htmlRender` (textarea)
- `markdownRender` gắn `linkedFeature: 'enableMarkdownRender'`
- `htmlRender` gắn `linkedFeature: 'enableHtmlRender'`
- `renderType` luôn hiện vì user muốn có nút chọn kiểu render; options là `content | markdown | html`.

### 3) Cập nhật admin Services create/edit
**Files:**
- `app/admin/services/create/page.tsx`
- `app/admin/services/[id]/edit/page.tsx`
- có thể cần đọc latest `app/admin/components/LexicalEditor.tsx` nhưng không sửa nếu không cần

**Thay đổi:**
- Giữ nguyên card `Nội dung` cũ với `LexicalEditor`.
- Thêm card mới riêng: **Render nâng cao**.
- Trong card này có:
  - select `Kiểu render` (`content | markdown | html`)
  - textarea `Markdown render` nếu field được bật
  - textarea `HTML render` nếu field được bật
- Save/load đầy đủ 3 field mới ở create/edit.
- Edit page sẽ thêm 3 field này vào snapshot dirty-state để nút lưu hoạt động đúng.
- Không ép fallback nội dung: nếu chọn `markdown` mà field rỗng thì public render rỗng đúng như yêu cầu.

### 4) Cập nhật public Services detail render
**Files:**
- `app/(site)/services/[slug]/page.tsx` hoặc chủ yếu `components/site/services/detail/ServiceDetailStyles.tsx`
- tái dùng `components/common/RichContent.tsx`

**Thay đổi:**
- Tạo helper chọn nội dung render cho service detail:
  - `content` -> render `service.content`
  - `markdown` -> render `service.markdownRender`
  - `html` -> render `service.htmlRender`
- Dùng `RichContent` để render markdown/html/content thống nhất thay cho `dangerouslySetInnerHTML` hardcoded.
- Với `renderType = markdown/html` nhưng field tương ứng rỗng: render rỗng, **không fallback**.
- Chỉ áp dụng cho **service detail page**, không đổi service list excerpt phase này.

### 5) Guardrails / không mở rộng scope
- Chưa làm Posts/Products ở task này.
- Không đổi LexicalEditor core.
- Không đổi SEO logic sâu ngoài việc đảm bảo page detail render đúng field được chọn.
- Nếu cần meta description fallback, vẫn giữ logic hiện tại từ `excerpt/content`; chưa lấy markdown/html vào SEO ở phase 1 trừ khi bắt buộc để type pass.

## Verification Plan
- Static verify:
  - Schema/model/create/update/getBySlug đồng bộ 3 field mới.
  - Admin Services create/edit load/save đúng `renderType`, `markdownRender`, `htmlRender`.
  - Detail styles không còn render cứng `service.content`.
  - `RichContent` được dùng đúng format theo `renderType`.
- Command verify theo rule repo:
  - Chỉ chạy `bunx tsc --noEmit`.
- Manual repro checklist:
  1. Vào `/system/modules/services` bật/tắt `Markdown render` và `HTML render`.
  2. Vào `/admin/services/create` thấy card `Render nâng cao` và lưu được từng kiểu.
  3. Vào `/admin/services/[id]/edit` load lại đúng dữ liệu cũ + dữ liệu mới.
  4. Public `/services/[slug]`:
     - `renderType=content` -> hiện nội dung Lexical cũ
     - `renderType=markdown` -> hiện markdown render
     - `renderType=html` -> hiện HTML inline render
     - field được chọn rỗng -> khu vực nội dung rỗng

## Decision
Em recommend triển khai theo phase này vì bám đúng yêu cầu hiện tại cho Services, ít rủi ro nhất: giữ field cũ, thêm 2 field mới + selector rõ ràng, detail page render đúng theo lựa chọn, rồi khi ổn mới nhân sang Posts/Products.