'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';
import { 
  Button, Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label, cn
} from '../components/ui';
import { ModuleGuard } from '../components/ModuleGuard';
import { 
  ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Copy, ExternalLink, Eye, EyeOff, 
  GripVertical, Loader2, Menu, Plus, Trash2
} from 'lucide-react';
import { SimpleMenuPreview } from './SimpleMenuPreview';

const MODULE_KEY = 'menus';

const QUICK_ROUTE_GROUPS = ['Trang cơ bản', 'Module', 'Danh mục'] as const;

type QuickRouteOption = {
  group: (typeof QUICK_ROUTE_GROUPS)[number];
  label: string;
  source: string;
  url: string;
};

const CORE_ROUTE_OPTIONS: QuickRouteOption[] = [
  { label: 'Trang chủ', url: '/', source: 'Core', group: 'Trang cơ bản' },
  { label: 'Liên hệ', url: '/contact', source: 'Core', group: 'Trang cơ bản' },
];

const MODULE_SITE_ROUTE_CATALOG: Record<string, { label: string; url: string }[]> = {
  cart: [
    { label: 'Giỏ hàng', url: '/cart' },
  ],
  customers: [
    { label: 'Đăng nhập', url: '/account/login' },
    { label: 'Đăng ký', url: '/account/register' },
    { label: 'Tài khoản', url: '/account/profile' },
    { label: 'Đơn hàng', url: '/account/orders' },
  ],
  orders: [
    { label: 'Đơn hàng', url: '/account/orders' },
    { label: 'Checkout', url: '/checkout' },
  ],
  posts: [
    { label: 'Danh sách bài viết', url: '/posts' },
  ],
  products: [
    { label: 'Danh sách sản phẩm', url: '/products' },
  ],
  promotions: [
    { label: 'Khuyến mãi', url: '/promotions' },
  ],
  services: [
    { label: 'Danh sách dịch vụ', url: '/services' },
  ],
  wishlist: [
    { label: 'Wishlist', url: '/wishlist' },
  ],
};


interface MenuItem {
  _id: Id<"menuItems">;
  _creationTime: number;
  menuId: Id<"menus">;
  label: string;
  url: string;
  order: number;
  depth: number;
  parentId?: Id<"menuItems">;
  icon?: string;
  openInNewTab?: boolean;
  active: boolean;
}

interface DraftMenuItem {
  id?: Id<"menuItems">;
  localId: string;
  label: string;
  url: string;
  order: number;
  depth: number;
  parentId?: Id<"menuItems">;
  icon?: string;
  openInNewTab?: boolean;
  active: boolean;
}

export default function MenuBuilderPageWrapper() {
  return (
    <ModuleGuard moduleKey="menus">
      <MenuBuilderPage />
    </ModuleGuard>
  );
}

function MenuBuilderPage() {
  const menusData = useQuery(api.menus.listMenus);

  const isLoading = menusData === undefined;

  // Only get header menu
  const headerMenu = menusData?.find(m => m.location === 'header');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Header Menu</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Quản lý menu điều hướng chính trên thanh header</p>
        </div>
        <div />
      </div>

      {headerMenu ? (
        <MenuItemsEditor menuId={headerMenu._id} />
      ) : (
        <Card className="p-8 text-center">
          <Menu className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Chưa có Header Menu</h3>
          <p className="text-slate-500 mb-4">Chưa có dữ liệu menu.</p>
        </Card>
      )}
    </div>
  );
}

function MenuItemsEditor({ menuId }: { menuId: Id<"menus"> }) {
  const menuItemsData = useQuery(api.menus.listMenuItems, { menuId });
  const settingsData = useQuery(api.admin.modules.listModuleSettings, { moduleKey: MODULE_KEY });
  const featuresData = useQuery(api.admin.modules.listModuleFeatures, { moduleKey: MODULE_KEY });
  const enabledModules = useQuery(api.admin.modules.listEnabledModules);
  const productCategories = useQuery(api.productCategories.listActive);
  const postCategories = useQuery(api.postCategories.listActive, { limit: 100 });
  const serviceCategories = useQuery(api.serviceCategories.listActive, { limit: 100 });
  const saveMenuItemsBulk = useMutation(api.menus.saveMenuItemsBulk);

  const [draftItems, setDraftItems] = useState<DraftMenuItem[]>([]);
  const [originalItems, setOriginalItems] = useState<DraftMenuItem[]>([]);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [pendingSync, setPendingSync] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isQuickPickerOpen, setIsQuickPickerOpen] = useState(false);
  const [quickPickerTargetId, setQuickPickerTargetId] = useState<string | null>(null);
  const [quickRouteSearch, setQuickRouteSearch] = useState('');

  // Settings from System Config
  const menusPerPage = useMemo(() => {
    const setting = settingsData?.find(s => s.settingKey === 'menusPerPage');
    return (setting?.value as number) || 10;
  }, [settingsData]);

  const maxDepth = useMemo(() => {
    const setting = settingsData?.find(s => s.settingKey === 'maxDepth');
    return (setting?.value as number) || 3;
  }, [settingsData]);

  // Feature toggles from System Config
  const enabledFeatures = useMemo(() => {
    const features: Record<string, boolean> = {};
    featuresData?.forEach(f => { features[f.featureKey] = f.enabled; });
    return features;
  }, [featuresData]);

  const showNested = enabledFeatures.enableNested ?? true;
  const showNewTab = enabledFeatures.enableNewTab ?? true;

  const quickRouteOptions = useMemo(() => {
    const enabledKeys = new Set((enabledModules ?? []).map(moduleItem => moduleItem.key));
    const options: QuickRouteOption[] = [...CORE_ROUTE_OPTIONS];

    Object.entries(MODULE_SITE_ROUTE_CATALOG).forEach(([moduleKey, routes]) => {
      if (!enabledKeys.has(moduleKey)) {return;}
      routes.forEach(route => {
        options.push({ ...route, source: moduleKey, group: 'Module' });
      });
    });

    if (enabledKeys.has('products')) {
      (productCategories ?? []).forEach(category => {
        options.push({
          group: 'Danh mục',
          label: category.name,
          source: 'products',
          url: `/products?category=${category.slug}`,
        });
      });
    }

    if (enabledKeys.has('posts')) {
      (postCategories ?? []).forEach(category => {
        options.push({
          group: 'Danh mục',
          label: category.name,
          source: 'posts',
          url: `/posts?catpost=${category.slug}`,
        });
      });
    }

    if (enabledKeys.has('services')) {
      (serviceCategories ?? []).forEach(category => {
        options.push({
          group: 'Danh mục',
          label: category.name,
          source: 'services',
          url: `/services?category=${category.slug}`,
        });
      });
    }

    const deduped = new Map<string, QuickRouteOption>();
    options.forEach(option => {
      if (!deduped.has(option.url)) {
        deduped.set(option.url, option);
      }
    });

    return Array.from(deduped.values());
  }, [enabledModules, postCategories, productCategories, serviceCategories]);

  const filteredQuickRoutes = useMemo(() => {
    const keyword = quickRouteSearch.trim().toLowerCase();
    if (!keyword) {return quickRouteOptions;}
    return quickRouteOptions.filter(option =>
      option.label.toLowerCase().includes(keyword)
      || option.url.toLowerCase().includes(keyword)
      || option.source.toLowerCase().includes(keyword)
    );
  }, [quickRouteOptions, quickRouteSearch]);

  const groupedQuickRoutes = useMemo(() => {
    const groups = new Map<QuickRouteOption['group'], QuickRouteOption[]>();
    filteredQuickRoutes.forEach(option => {
      const list = groups.get(option.group) ?? [];
      list.push(option);
      groups.set(option.group, list);
    });

    return QUICK_ROUTE_GROUPS.flatMap(group => {
      const options = groups.get(group);
      if (!options || options.length === 0) {return [];}
      return [{
        group,
        options: options.slice().sort((a, b) => a.label.localeCompare(b.label)),
      }];
    });
  }, [filteredQuickRoutes]);

  const buildDraftItems = (items: MenuItem[]) => items
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({
      id: item._id,
      localId: item._id,
      label: item.label,
      url: item.url,
      order: index,
      depth: item.depth,
      parentId: item.parentId,
      icon: item.icon,
      openInNewTab: item.openInNewTab,
      active: item.active,
    }));

  const normalizeOrders = (items: DraftMenuItem[]) => items.map((item, index) => ({ ...item, order: index }));

  const createLocalItem = (partial: Partial<DraftMenuItem>): DraftMenuItem => ({
    localId: `new-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    label: 'Liên kết mới',
    url: '/',
    depth: 0,
    order: 0,
    active: true,
    ...partial,
  });

  const hasChanges = useMemo(() => {
    const normalize = (items: DraftMenuItem[]) => items.map(item => ({
      id: item.id,
      label: item.label,
      url: item.url,
      depth: item.depth,
      active: item.active,
      icon: item.icon,
      openInNewTab: item.openInNewTab,
      parentId: item.parentId,
      order: item.order,
    }));
    return JSON.stringify(normalize(draftItems)) !== JSON.stringify(normalize(originalItems));
  }, [draftItems, originalItems]);

  useEffect(() => {
    if (!menuItemsData) {return;}
    const nextItems = buildDraftItems(menuItemsData);
    if (pendingSync || originalItems.length === 0 || !hasChanges) {
      setDraftItems(nextItems);
      setOriginalItems(nextItems);
      setPendingSync(false);
    }
  }, [menuItemsData, pendingSync, originalItems.length, hasChanges]);

  useEffect(() => {
    if (isQuickPickerOpen) {return;}
    if (!quickRouteSearch) {return;}
    setQuickRouteSearch('');
  }, [isQuickPickerOpen, quickRouteSearch]);

  // Pagination
  const totalPages = Math.ceil(draftItems.length / menusPerPage);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * menusPerPage;
    return draftItems.slice(start, start + menusPerPage);
  }, [draftItems, currentPage, menusPerPage]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const isLoading = menuItemsData === undefined;

  const handleMove = (index: number, direction: 'up' | 'down') => {
    setDraftItems(prev => {
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === prev.length - 1)) {return prev;}
      const next = [...prev];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      return normalizeOrders(next);
    });
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setDraftItems(prev => {
      const next = [...prev];
      const [removed] = next.splice(draggedIndex, 1);
      next.splice(dropIndex, 0, removed);
      return normalizeOrders(next);
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleIndent = (item: DraftMenuItem, direction: 'in' | 'out') => {
    const newDepth = direction === 'in' 
      ? Math.min(item.depth + 1, maxDepth - 1) 
      : Math.max(item.depth - 1, 0);
    
    if (newDepth === item.depth) {return;}

    setDraftItems(prev => prev.map(current => current.localId === item.localId ? { ...current, depth: newDepth } : current));
  };

  const handleToggleActive = (item: DraftMenuItem) => {
    setDraftItems(prev => prev.map(current => current.localId === item.localId ? { ...current, active: !current.active } : current));
  };

  const handleDelete = (item: DraftMenuItem) => {
    if (confirm('Xóa liên kết này?')) {
      setDraftItems(prev => normalizeOrders(prev.filter(current => current.localId !== item.localId)));
    }
  };

  const handleAdd = () => {
    setDraftItems(prev => {
      const next = [...prev, createLocalItem({ order: prev.length })];
      return normalizeOrders(next);
    });
  };

  const handleAddBelow = (item: DraftMenuItem) => {
    setDraftItems(prev => {
      const index = prev.findIndex(current => current.localId === item.localId);
      const next = [...prev];
      const newItem = createLocalItem({
        depth: item.depth,
        parentId: item.parentId,
      });
      next.splice(index + 1, 0, newItem);
      return normalizeOrders(next);
    });
  };

  const handleCopy = (item: DraftMenuItem) => {
    setDraftItems(prev => {
      const index = prev.findIndex(current => current.localId === item.localId);
      const next = [...prev];
      const newItem = createLocalItem({
        label: `${item.label} (copy)`,
        url: item.url,
        depth: item.depth,
        active: item.active,
        parentId: item.parentId,
        icon: item.icon,
        openInNewTab: item.openInNewTab,
      });
      next.splice(index + 1, 0, newItem);
      return normalizeOrders(next);
    });
  };

  const handleUpdateField = (itemId: string, field: 'label' | 'url', value: string) => {
    setDraftItems(prev => prev.map(item => item.localId === itemId ? { ...item, [field]: value } : item));
  };

  const handleOpenQuickPicker = (itemId: string) => {
    setQuickPickerTargetId(itemId);
    setIsQuickPickerOpen(true);
  };

  const handleCloseQuickPicker = () => {
    setIsQuickPickerOpen(false);
    setQuickPickerTargetId(null);
    setQuickRouteSearch('');
  };

  const handleSelectQuickRoute = (option: QuickRouteOption) => {
    if (!quickPickerTargetId) {return;}
    handleUpdateField(quickPickerTargetId, 'url', option.url);
    handleUpdateField(quickPickerTargetId, 'label', option.label);
    handleCloseQuickPicker();
  };

  const handleSaveAll = async () => {
    if (!hasChanges) {return;}
    setIsSavingAll(true);
    try {
      await saveMenuItemsBulk({
        menuId,
        items: draftItems.map(item => ({
          id: item.id,
          label: item.label,
          url: item.url,
          depth: item.depth,
          active: item.active,
          icon: item.icon,
          openInNewTab: item.openInNewTab,
          parentId: item.parentId,
        })),
      });
      toast.success('Đã lưu tất cả thay đổi');
      setPendingSync(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Có lỗi khi lưu');
    } finally {
      setIsSavingAll(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 size={24} className="animate-spin text-orange-500" />
      </div>
    );
  }

  // Get actual index in full items array for move operations
  const getActualIndex = (item: DraftMenuItem) => draftItems.findIndex(i => i.localId === item.localId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-500">Chỉnh sửa menu và bấm lưu để áp dụng</p>
          <Button
            type="button"
            onClick={handleSaveAll}
            disabled={!hasChanges || isSavingAll}
            className="gap-2"
          >
            {isSavingAll && <Loader2 size={14} className="animate-spin" />}
            {hasChanges ? 'Lưu tất cả' : 'Đã lưu'}
          </Button>
        </div>
        {paginatedItems.map((item) => {
          const actualIndex = getActualIndex(item);
          
          return (
            <div 
              key={item.localId}
              draggable
              onDragStart={(e) =>{  handleDragStart(e, actualIndex); }}
              onDragOver={(e) =>{  handleDragOver(e, actualIndex); }}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, actualIndex)}
              onDragEnd={handleDragEnd}
              className={cn(
                "flex items-center gap-2 p-3 bg-white dark:bg-slate-900 border rounded-lg shadow-sm transition-all min-w-0",
                showNested && item.depth === 1 ? "ml-8 border-l-4 border-l-orange-500/30" : "",
                showNested && item.depth === 2 ? "ml-16 border-l-4 border-l-orange-500/50" : "border-slate-200 dark:border-slate-700",
                !item.active && "opacity-50",
                draggedIndex === actualIndex && "opacity-50 scale-[0.98]",
                dragOverIndex === actualIndex && "border-orange-500 border-2 bg-orange-50 dark:bg-orange-900/20"
              )}
            >
              <div className="flex flex-col gap-1 text-slate-300 cursor-grab active:cursor-grabbing">
                <button type="button" onClick={ async () => handleMove(actualIndex, 'up')} className="hover:text-orange-600 disabled:opacity-30" disabled={actualIndex === 0}><ArrowUp size={14}/></button>
                <GripVertical size={14} className="text-slate-400" />
                <button type="button" onClick={ async () => handleMove(actualIndex, 'down')} className="hover:text-orange-600 disabled:opacity-30" disabled={actualIndex === draftItems.length - 1}><ArrowDown size={14}/></button>
              </div>
              
              <div className="flex-1 grid grid-cols-2 gap-3 min-w-0">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Nhãn hiển thị</Label>
                  <Input 
                    value={item.label} 
                    onChange={(e) =>{  handleUpdateField(item.localId, 'label', e.target.value); }} 
                    className="h-8 text-sm min-w-0" 
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">URL</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={item.url} 
                      onChange={(e) =>{  handleUpdateField(item.localId, 'url', e.target.value); }} 
                      className="h-8 text-sm font-mono text-xs min-w-0" 
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 whitespace-nowrap"
                      onClick={() => handleOpenQuickPicker(item.localId)}
                    >
                      Gợi ý
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-0.5 border-l border-slate-100 dark:border-slate-700 pl-2">
                {showNested && (
                  <>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleIndent(item, 'out')} disabled={item.depth === 0} title="Thụt lề trái">
                      <ChevronRight size={14} className="rotate-180"/>
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleIndent(item, 'in')} disabled={item.depth >= maxDepth - 1} title="Thụt lề phải">
                      <ChevronRight size={14}/>
                    </Button>
                  </>
                )}
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAddBelow(item)} title="Thêm ngay bên dưới">
                  <Plus size={14}/>
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(item)} title="Copy menu item">
                  <Copy size={14}/>
                </Button>
                {showNewTab && item.openInNewTab && (
                  <span title="Mở tab mới"><ExternalLink size={14} className="text-slate-400" /></span>
                )}
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleActive(item)} title={item.active ? 'Ẩn' : 'Hiện'}>
                  {item.active ? <Eye size={14}/> : <EyeOff size={14} className="text-slate-400"/>}
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDelete(item)}>
                  <Trash2 size={14}/>
                </Button>
              </div>
            </div>
          );
        })}

        <Button variant="outline" className="w-full border-dashed" onClick={handleAdd}>
          <Plus size={16} className="mr-2"/> Thêm liên kết mới
        </Button>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500">
              Hiển thị {(currentPage - 1) * menusPerPage + 1}-{Math.min(currentPage * menusPerPage, draftItems.length)} / {draftItems.length}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() =>{  setCurrentPage(p => Math.max(1, p - 1)); }}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={14} />
              </Button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Trang {currentPage} / {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() =>{  setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Thống kê</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tổng menu items:</span>
              <span className="font-medium">{draftItems.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Đang hiện:</span>
              <span className="font-medium text-green-600">{draftItems.filter(i => i.active).length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Đang ẩn:</span>
              <span className="font-medium text-slate-400">{draftItems.filter(i => !i.active).length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Cấp 1 (Root):</span>
              <span className="font-medium">{draftItems.filter(i => i.depth === 0).length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Cấp 2 (Dropdown):</span>
              <span className="font-medium">{draftItems.filter(i => i.depth === 1).length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Cấp 3 (Sub-menu):</span>
              <span className="font-medium">{draftItems.filter(i => i.depth === 2).length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Hướng dẫn</CardTitle></CardHeader>
          <CardContent className="text-sm text-slate-500 space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
              <p className="font-medium text-slate-900 dark:text-slate-100 mb-1">Cấp 1 (Root)</p>
              <p>Hiển thị trực tiếp trên thanh menu ngang.</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 ml-4 border-l-4 border-l-orange-500/30">
              <p className="font-medium text-slate-900 dark:text-slate-100 mb-1">Cấp 2 (Dropdown)</p>
              <p>Hiển thị khi hover vào mục cấp 1.</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 ml-8 border-l-4 border-l-orange-500/50">
              <p className="font-medium text-slate-900 dark:text-slate-100 mb-1">Cấp 3 (Sub-menu)</p>
              <p>Hiển thị khi hover vào mục cấp 2.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Preview Section */}
      <div className="lg:col-span-3">
        <SimpleMenuPreview
          items={draftItems.map(item => ({
            _id: (item.id ?? item.localId) as Id<"menuItems">,
            label: item.label,
            url: item.url,
            order: item.order,
            depth: item.depth,
            active: item.active,
          }))}
        />
      </div>

      <Dialog open={isQuickPickerOpen} onOpenChange={(open) =>{ if (open) { setIsQuickPickerOpen(true); } else { handleCloseQuickPicker(); } }}>
        <DialogContent className="max-w-4xl w-[80vw]">
          <DialogHeader>
            <DialogTitle>Chọn nhanh URL</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={quickRouteSearch}
              onChange={(e) => setQuickRouteSearch(e.target.value)}
              placeholder="Tìm nhanh theo tên hoặc URL"
              className="h-9 text-sm"
            />
            <div className="max-h-[60vh] overflow-auto rounded-md border border-slate-200 dark:border-slate-800">
              {groupedQuickRoutes.length === 0 && (
                <div className="px-4 py-6 text-sm text-slate-500">Không có gợi ý phù hợp.</div>
              )}
              {groupedQuickRoutes.map(group => (
                <div key={group.group} className="border-t border-slate-100 first:border-t-0 dark:border-slate-800">
                  <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {group.group}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {group.options.map(option => (
                      <button
                        key={`${option.url}-${option.source}`}
                        type="button"
                        onClick={() => handleSelectQuickRoute(option)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                            {option.label}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono truncate">{option.url}</div>
                        </div>
                        <span className="text-[10px] uppercase tracking-wide text-slate-400">
                          {option.source}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
