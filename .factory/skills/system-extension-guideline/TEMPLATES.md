# Templates (rút gọn)

## Module list page lấy settings pagination

```tsx
const settingsData = useQuery(api.admin.modules.listModuleSettings, { moduleKey: 'posts' });
const itemsPerPage = useMemo(() => {
  const setting = settingsData?.find(s => s.settingKey === 'postsPerPage');
  return (setting?.value as number) || 10;
}, [settingsData]);

const [currentPage, setCurrentPage] = useState(1);
const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
const paginatedItems = useMemo(() => {
  const start = (currentPage - 1) * itemsPerPage;
  return sortedItems.slice(start, start + itemsPerPage);
}, [sortedItems, currentPage, itemsPerPage]);
```

## Create/Edit page conditional fields

```tsx
const fieldsData = useQuery(api.admin.modules.listEnabledModuleFields, { moduleKey: 'posts' });
const enabledFields = useMemo(() => new Set(fieldsData?.map(f => f.fieldKey)), [fieldsData]);

{enabledFields.has('excerpt') && (
  <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
)}
```

## Experience shell (vertical scroll)

```tsx
return (
  <div className="max-w-7xl mx-auto space-y-6 pb-20">
    {/* Header + Save */}
    {/* Settings cards */}
    {/* Preview card (LayoutTabs + DeviceToggle) */}
  </div>
);
```

## Home component style fallback order

```tsx
if (style === 'grid') return <Grid />;
if (style === 'minimal') return <Minimal />;
return <Default />; // default luôn ở cuối
```

## Seed + Clear (idempotent + cleanup)

```ts
const existing = await ctx.db.query('posts').first();
if (existing) return null;

// clear
const images = await ctx.db.query('images').withIndex('by_folder', q => q.eq('folder', 'posts')).collect();
for (const img of images) {
  try { await ctx.storage.delete(img.storageId); } catch {}
  await ctx.db.delete(img._id);
}
```
