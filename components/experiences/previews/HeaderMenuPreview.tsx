'use client';

import React, { useMemo, useState } from 'react';
import type { Id } from '@/convex/_generated/dataModel';
import { ChevronDown, ChevronRight, Eye, Heart, LogOut, Mail, Package, Phone, Search, ShoppingCart, User } from 'lucide-react';
import { Card, CardContent, cn } from '@/app/admin/components/ui';
import { getMenuColors, type MenuColorMode, type MenuColors } from '@/components/site/header/colors';

export type HeaderLayoutStyle = 'classic' | 'topbar' | 'allbirds';

export type HeaderMenuConfig = {
  brandName: string;
  headerBackground: 'white' | 'dots' | 'stripes';
  headerSeparator: 'none' | 'shadow' | 'border' | 'gradient';
  headerSticky: boolean;
  showBrandAccent: boolean;
  cart: { show: boolean };
  cta: { show: boolean; text: string };
  login: { show: boolean; text: string };
  search: { show: boolean; placeholder: string; searchProducts: boolean; searchPosts: boolean; searchServices: boolean };
  topbar: {
    email: string;
    hotline: string;
    show: boolean;
    showStoreSystem: boolean;
    showTrackOrder: boolean;
    useSettingsData: boolean;
  };
  wishlist: { show: boolean };
};

type MenuItem = {
  _id: Id<'menuItems'>;
  label: string;
  url: string;
  order: number;
  depth: number;
  active: boolean;
  icon?: string;
  openInNewTab?: boolean;
};

type MenuItemWithChildren = MenuItem & { children: MenuItemWithChildren[] };

export type HeaderMenuPreviewProps = {
  brandColor: string;
  secondaryColor?: string;
  colorMode?: MenuColorMode;
  config: HeaderMenuConfig;
  device: 'desktop' | 'tablet' | 'mobile';
  layoutStyle: HeaderLayoutStyle;
  menuItems: MenuItem[];
  settingsEmail?: string;
  settingsPhone?: string;
  customersEnabled: boolean;
  loginFeatureEnabled: boolean;
  ordersEnabled: boolean;
};

export function HeaderMenuPreview({
  brandColor,
  secondaryColor,
  colorMode = 'single',
  config,
  device,
  layoutStyle,
  menuItems,
  settingsEmail,
  settingsPhone,
  customersEnabled,
  loginFeatureEnabled,
  ordersEnabled,
}: HeaderMenuPreviewProps) {
  const tokens = useMemo<MenuColors>(
    () => getMenuColors(brandColor, secondaryColor, colorMode),
    [brandColor, secondaryColor, colorMode]
  );
  const menuVars: React.CSSProperties = {
    '--menu-hover-bg': tokens.navItemHoverBg,
    '--menu-hover-text': tokens.navItemHoverText,
    '--menu-dropdown-hover-bg': tokens.dropdownItemHoverBg,
    '--menu-dropdown-hover-text': tokens.dropdownItemHoverText,
    '--menu-dropdown-sub-hover-text': tokens.dropdownSubItemHoverText,
    '--menu-icon-hover': tokens.iconButtonHoverText,
  } as React.CSSProperties;
  const defaultLinks = useMemo(() => ({
    cart: '/cart',
    wishlist: '/wishlist',
    login: '/account/login',
    cta: '/contact',
    trackOrder: '/account/orders',
    storeSystem: '/stores',
    accountProfile: '/account/profile',
    accountOrders: '/account/orders',
  }), []);

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const activeItems = useMemo(() => menuItems.filter(item => item.active), [menuItems]);

  const menuTree = useMemo((): MenuItemWithChildren[] => {
    const rootItems = activeItems.filter(item => item.depth === 0);
    return rootItems.map(root => {
      const rootIndex = activeItems.indexOf(root);
      const nextRootIndex = activeItems.findIndex((item, idx) => idx > rootIndex && item.depth === 0);
      const childrenRange = nextRootIndex === -1 ? activeItems.slice(rootIndex + 1) : activeItems.slice(rootIndex + 1, nextRootIndex);

      return {
        ...root,
        children: childrenRange.filter(c => c.depth === 1).map(child => {
          const childIndex = activeItems.indexOf(child);
          const nextChildIndex = childrenRange.findIndex((item) => activeItems.indexOf(item) > childIndex && item.depth <= 1);
          const subRange = nextChildIndex === -1 ? childrenRange.slice(childrenRange.indexOf(child) + 1) : childrenRange.slice(childrenRange.indexOf(child) + 1, nextChildIndex);
          return {
            ...child,
            children: subRange.filter(s => s.depth === 2).map(s => ({ ...s, children: [] }))
          };
        })
      };
    });
  }, [activeItems]);

  const displayTopbar = useMemo(() => {
    if (config.topbar.useSettingsData) {
      return {
        ...config.topbar,
        hotline: settingsPhone || config.topbar.hotline,
        email: settingsEmail || config.topbar.email,
      };
    }
    return config.topbar;
  }, [config.topbar, settingsEmail, settingsPhone]);

  const canLogin = customersEnabled && loginFeatureEnabled;
  const showLogin = config.login.show && canLogin;
  const canTrackOrder = ordersEnabled;
  const showTrackOrder = displayTopbar.showTrackOrder && canTrackOrder;

  const renderUserMenu = (variant: 'text' | 'icon') => (
    <div className="relative">
      <button
        onClick={() => { setUserMenuOpen(prev => !prev); }}
        className={variant === 'text'
          ? 'hover:underline flex items-center gap-1'
          : 'p-2 transition-colors hover:text-[var(--menu-icon-hover)]'}
        style={variant === 'text' ? { color: tokens.topbarText } : { color: tokens.iconButtonText, ...menuVars }}
      >
        <User size={variant === 'text' ? 12 : 18} />
        {variant === 'text' && <span>{config.login.text}</span>}
      </button>
      {userMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border z-50" style={{ backgroundColor: tokens.dropdownBg, borderColor: tokens.dropdownBorder }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: tokens.border }}>
            <p className="text-sm font-semibold" style={{ color: tokens.textPrimary }}>Xin chào, Nguyễn Văn A</p>
            <p className="text-xs mt-1" style={{ color: tokens.textSubtle }}>customer@email.com</p>
          </div>
          <div className="py-2">
            <a
              href={defaultLinks.accountProfile}
              className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[var(--menu-dropdown-hover-bg)] hover:text-[var(--menu-dropdown-hover-text)]"
              style={{ color: tokens.dropdownItemText, ...menuVars }}
            >
              <User size={16} />
              Thông tin tài khoản
            </a>
            <a
              href={defaultLinks.accountOrders}
              className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[var(--menu-dropdown-hover-bg)] hover:text-[var(--menu-dropdown-hover-text)]"
              style={{ color: tokens.dropdownItemText, ...menuVars }}
            >
              <Package size={16} />
              Đơn hàng của tôi
            </a>
            <a
              href={defaultLinks.wishlist}
              className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[var(--menu-dropdown-hover-bg)] hover:text-[var(--menu-dropdown-hover-text)]"
              style={{ color: tokens.dropdownItemText, ...menuVars }}
            >
              <Heart size={16} />
              Danh sách yêu thích
            </a>
          </div>
          <div className="border-t" style={{ borderColor: tokens.border }}>
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[var(--menu-dropdown-hover-bg)]"
              style={{ color: tokens.secondary, ...menuVars }}
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const announcementText = useMemo(() => {
    const items = [displayTopbar.hotline, displayTopbar.email].filter(Boolean);
    return items.length > 0 ? items.join(' · ') : 'Shop New Arrivals';
  }, [displayTopbar.email, displayTopbar.hotline]);

  const classicBackgroundStyle: React.CSSProperties = (() => {
    if (config.headerBackground === 'dots') {
      return {
        backgroundColor: tokens.surface,
        backgroundImage: `radial-gradient(circle, ${tokens.patternDot} 1px, transparent 1px)`,
        backgroundSize: '18px 18px',
      };
    }
    if (config.headerBackground === 'stripes') {
      return {
        backgroundColor: tokens.surface,
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${tokens.patternStripe} 10px, ${tokens.patternStripe} 20px)`,
      };
    }
    return { backgroundColor: tokens.surface };
  })();

  const classicSeparatorStyle: React.CSSProperties =
    config.headerSeparator === 'border' || config.headerSeparator === 'shadow'
      ? { borderBottom: `1px solid ${tokens.border}` }
      : {};

  const classicSeparatorElement = config.headerSeparator === 'gradient'
    ? (
      <div className="h-1" style={{ backgroundColor: tokens.borderStrong }} />
    )
    : null;

  const classicPositionClass = config.headerSticky ? 'sticky top-0 z-40' : 'relative z-40';

  const toggleMobileItem = (id: string) => {
    setExpandedMobileItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const renderLink = (item: MenuItem, className: string, children: React.ReactNode, style?: React.CSSProperties) => (
    <a
      href={item.url}
      target={item.openInNewTab ? '_blank' : undefined}
      rel={item.openInNewTab ? 'noreferrer' : undefined}
      className={className}
      style={style}
    >
      {children}
    </a>
  );

  const renderMobileMenuButton = (isTransparent = false) => {
    const color = isTransparent ? tokens.textInverse : tokens.iconButtonText;
    return (
      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg" style={{ color }}>
        <div className="w-5 h-4 flex flex-col justify-between">
          <span
            className={cn('w-full h-0.5 rounded transition-all', mobileMenuOpen && 'rotate-45 translate-y-1.5')}
            style={{ backgroundColor: color }}
          ></span>
          <span
            className={cn('w-full h-0.5 rounded transition-all', mobileMenuOpen && 'opacity-0')}
            style={{ backgroundColor: color }}
          ></span>
          <span
            className={cn('w-full h-0.5 rounded transition-all', mobileMenuOpen && '-rotate-45 -translate-y-1.5')}
            style={{ backgroundColor: color }}
          ></span>
        </div>
      </button>
    );
  };

  if (activeItems.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-8 text-center">
          <Eye className="w-12 h-12 mx-auto mb-4" style={{ color: tokens.textSubtle }} />
          <h3 className="text-lg font-medium mb-2" style={{ color: tokens.textPrimary }}>Chưa có menu items</h3>
          <p style={{ color: tokens.textSubtle }}>Thêm menu items để xem preview</p>
        </CardContent>
      </Card>
    );
  }

  const renderClassicStyle = () => (
    <div className={cn(classicPositionClass)} style={{ ...classicBackgroundStyle, ...classicSeparatorStyle }}>
      {config.topbar.show && (
        <div className="px-4 py-2 text-xs" style={{ backgroundColor: tokens.topbarBg, color: tokens.topbarText }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {displayTopbar.hotline && (
                <span className="flex items-center gap-1"><Phone size={12} /><span>{displayTopbar.hotline}</span></span>
              )}
              {device !== 'mobile' && displayTopbar.email && (
                <span className="flex items-center gap-1"><Mail size={12} /><span>{displayTopbar.email}</span></span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {device !== 'mobile' && (
                <>
                  {showTrackOrder && <a href={defaultLinks.trackOrder} className="hover:underline">Theo dõi đơn hàng</a>}
                  {showTrackOrder && displayTopbar.showStoreSystem && <span style={{ color: tokens.topbarDivider }}>|</span>}
                  {displayTopbar.showStoreSystem && <a href={defaultLinks.storeSystem} className="hover:underline">Hệ thống cửa hàng</a>}
                  {(showTrackOrder || displayTopbar.showStoreSystem) && showLogin && <span style={{ color: tokens.topbarDivider }}>|</span>}
                </>
              )}
              {showLogin && renderUserMenu('text')}
            </div>
          </div>
        </div>
      )}
      {config.showBrandAccent && (
        <div className="h-0.5" style={{ backgroundColor: tokens.accentLine }} />
      )}
      <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: tokens.border }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: tokens.brandBadgeBg }}></div>
          <span className="font-semibold" style={{ color: tokens.textPrimary }}>{config.brandName}</span>
        </div>

        {device !== 'mobile' ? (
          <>
            <nav className="flex items-center gap-1">
              {menuTree.map((item) => (
                <div
                  key={item._id}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item._id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <button
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1',
                      hoveredItem === item._id
                        ? 'text-[var(--menu-hover-text)]'
                        : 'hover:bg-[var(--menu-hover-bg)] hover:text-[var(--menu-hover-text)]'
                    )}
                    style={{
                      ...(hoveredItem === item._id ? { backgroundColor: tokens.navItemHoverBg, color: tokens.navItemHoverText } : { color: tokens.navItemText }),
                      ...menuVars,
                    }}
                  >
                    {item.label}
                    {item.children.length > 0 && (
                      <ChevronDown size={14} className={cn('transition-transform', hoveredItem === item._id && 'rotate-180')} />
                    )}
                  </button>

                  {item.children.length > 0 && hoveredItem === item._id && (
                    <div
                      className="absolute top-full left-0 mt-1 rounded-lg border py-2 min-w-[200px] z-50"
                      style={{ backgroundColor: tokens.dropdownBg, borderColor: tokens.dropdownBorder }}
                    >
                      {item.children.map((child) => (
                        <div key={child._id} className="relative group">
                          {renderLink(child, 'flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-[var(--menu-dropdown-hover-bg)] hover:text-[var(--menu-dropdown-hover-text)]', (
                            <>
                              {child.label}
                              {child.children?.length > 0 && <ChevronRight size={14} />}
                            </>
                          ), { color: tokens.dropdownItemText, ...menuVars })}
                          {child.children?.length > 0 && (
                            <div
                              className="absolute left-full top-0 ml-1 rounded-lg border py-2 min-w-[180px] hidden group-hover:block"
                              style={{ backgroundColor: tokens.dropdownBg, borderColor: tokens.dropdownBorder }}
                            >
                              {child.children.map((sub) => (
                                <a
                                  key={sub._id}
                                  href={sub.url}
                                  className="block px-4 py-2 text-sm transition-colors hover:bg-[var(--menu-dropdown-hover-bg)] hover:text-[var(--menu-dropdown-sub-hover-text)]"
                                  style={{ color: tokens.dropdownSubItemText, ...menuVars }}
                                >
                                  {sub.label}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              {config.search.show && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder={config.search.placeholder}
                    className="w-48 pl-4 pr-10 py-2 rounded-full border text-sm focus:outline-none"
                    style={{
                      backgroundColor: tokens.searchInputBg,
                      borderColor: tokens.searchInputBorder,
                      color: tokens.searchInputText,
                    }}
                  />
                  <button
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full"
                    style={{ backgroundColor: tokens.searchButtonBg, color: tokens.searchButtonText }}
                  >
                    <Search size={14} />
                  </button>
                </div>
              )}
              {config.cart.show && (
                <a href={defaultLinks.cart} className="p-2 relative" style={{ color: tokens.iconButtonText }}>
                  <ShoppingCart size={20} />
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center"
                    style={{ backgroundColor: tokens.badgeBg, color: tokens.badgeText }}
                  >
                    0
                  </span>
                </a>
              )}
              {config.cta.show && (
                <a
                  href={defaultLinks.cta}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{ backgroundColor: tokens.ctaBg, color: tokens.ctaText }}
                >
                  {config.cta.text}
                </a>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            {config.search.show && (
              <button onClick={() => setSearchOpen((prev) => !prev)} className="p-2" style={{ color: tokens.iconButtonText }}>
                <Search size={20} />
              </button>
            )}
            {config.cart.show && (
              <a href={defaultLinks.cart} className="p-2 relative" style={{ color: tokens.iconButtonText }}>
                <ShoppingCart size={20} />
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{ backgroundColor: tokens.badgeBg, color: tokens.badgeText }}
                >
                  0
                </span>
              </a>
            )}
            {renderMobileMenuButton(false)}
          </div>
        )}
      </div>

      {config.search.show && searchOpen && (
        <div className="md:hidden px-6 pb-4 border-b" style={{ borderColor: tokens.border }}>
          <input
            type="text"
            placeholder={config.search.placeholder ?? 'Tìm kiếm...'}
            className="w-full px-3 py-2 rounded-full border text-sm focus:outline-none"
            style={{
              backgroundColor: tokens.searchInputBg,
              borderColor: tokens.searchInputBorder,
              color: tokens.searchInputText,
            }}
          />
        </div>
      )}

      {device === 'mobile' && mobileMenuOpen && (
        <div className="border-b" style={{ borderColor: tokens.border, backgroundColor: tokens.mobileMenuBg }}>
          {menuTree.map((item) => (
            <div key={item._id}>
              <button
                onClick={() => item.children.length > 0 && toggleMobileItem(item._id)}
                className="w-full px-6 py-3 text-left flex items-center justify-between text-sm font-medium transition-colors hover:bg-[var(--menu-dropdown-hover-bg)]"
                style={{ color: tokens.mobileMenuItemText, ...menuVars }}
              >
                {item.label}
                {item.children.length > 0 && (<ChevronDown size={16} className={cn('transition-transform', expandedMobileItems.includes(item._id) && 'rotate-180')} />)}
              </button>
              {item.children.length > 0 && expandedMobileItems.includes(item._id) && (
                <div style={{ backgroundColor: tokens.surface }}>
                  {item.children.map((child) => (
                    <a
                      key={child._id}
                      href={child.url}
                      className="block px-8 py-2.5 text-sm border-l-2 ml-6 transition-colors hover:text-[var(--menu-dropdown-sub-hover-text)]"
                      style={{ color: tokens.mobileMenuSubItemText, borderColor: tokens.mobileMenuSubItemBorder, ...menuVars }}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          {config.cta.show && (
            <div className="p-4">
              <a
                href={defaultLinks.cta}
                className="block w-full py-2.5 text-sm font-medium rounded-lg text-center"
                style={{ backgroundColor: tokens.ctaBg, color: tokens.ctaText }}
              >
                {config.cta.text}
              </a>
            </div>
          )}
        </div>
      )}
      {classicSeparatorElement}
    </div>
  );

  const renderTopbarStyle = () => (
    <div className={cn(classicPositionClass)} style={{ backgroundColor: tokens.surface }}>
      {displayTopbar.show && (
        <div className="px-4 py-2 text-xs" style={{ backgroundColor: tokens.topbarBg, color: tokens.topbarText }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {displayTopbar.hotline && (
                <span className="flex items-center gap-1"><Phone size={12} /><span>{displayTopbar.hotline}</span></span>
              )}
              {device !== 'mobile' && displayTopbar.email && (
                <span className="flex items-center gap-1"><Mail size={12} /><span>{displayTopbar.email}</span></span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {device !== 'mobile' && (
                <>
                  {showTrackOrder && <a href={defaultLinks.trackOrder} className="hover:underline">Theo dõi đơn hàng</a>}
                  {showTrackOrder && displayTopbar.showStoreSystem && <span style={{ color: tokens.topbarDivider }}>|</span>}
                  {displayTopbar.showStoreSystem && <a href={defaultLinks.storeSystem} className="hover:underline">Hệ thống cửa hàng</a>}
                  {(showTrackOrder || displayTopbar.showStoreSystem) && showLogin && <span style={{ color: tokens.topbarDivider }}>|</span>}
                </>
              )}
              {showLogin && renderUserMenu('text')}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-3 border-b" style={{ borderColor: tokens.border }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-bold"
              style={{ backgroundColor: tokens.brandBadgeBg, color: tokens.brandBadgeText }}
            >
              {config.brandName.charAt(0)}
            </div>
            <span className="font-bold text-lg" style={{ color: tokens.textPrimary }}>{config.brandName}</span>
          </div>

          {device !== 'mobile' && config.search.show && (
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder={config.search.placeholder}
                  className="w-full pl-4 pr-10 py-2 rounded-full border text-sm focus:outline-none"
                  style={{
                    backgroundColor: tokens.searchInputBg,
                    borderColor: tokens.searchInputBorder,
                    color: tokens.searchInputText,
                  }}
                />
                <button
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full"
                  style={{ backgroundColor: tokens.searchButtonBg, color: tokens.searchButtonText }}
                >
                  <Search size={14} />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {device === 'mobile' ? (
              <>
                {config.search.show && (
                  <button onClick={() => setSearchOpen((prev) => !prev)} className="p-2" style={{ color: tokens.iconButtonText }}>
                    <Search size={20} />
                  </button>
                )}
                {config.cart.show && (
                  <a href={defaultLinks.cart} className="p-2 relative" style={{ color: tokens.iconButtonText }}>
                    <ShoppingCart size={20} />
                    <span
                      className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center"
                      style={{ backgroundColor: tokens.badgeBg, color: tokens.badgeText }}
                    >
                      0
                    </span>
                  </a>
                )}
                {renderMobileMenuButton(false)}
              </>
            ) : (
              <>
                {config.wishlist.show && (
                  <a
                    href={defaultLinks.wishlist}
                    className="p-2 transition-colors flex flex-col items-center text-xs gap-0.5 hover:text-[var(--menu-icon-hover)]"
                    style={{ color: tokens.iconButtonText, ...menuVars }}
                  >
                    <Heart size={20} /><span>Yêu thích</span>
                  </a>
                )}
                {config.cart.show && (
                  <a
                    href={defaultLinks.cart}
                    className="p-2 transition-colors flex flex-col items-center text-xs gap-0.5 relative hover:text-[var(--menu-icon-hover)]"
                    style={{ color: tokens.iconButtonText, ...menuVars }}
                  >
                    <ShoppingCart size={20} /><span>Giỏ hàng</span>
                    <span
                      className="absolute top-0 right-0 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center"
                      style={{ backgroundColor: tokens.badgeBg, color: tokens.badgeText }}
                    >
                      0
                    </span>
                  </a>
                )}
                {config.cta.show && (
                  <a
                    href={defaultLinks.cta}
                    className="px-4 py-2 text-sm font-medium rounded-full transition-colors"
                    style={{ backgroundColor: tokens.ctaBg, color: tokens.ctaText }}
                  >
                    {config.cta.text}
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {device !== 'mobile' && (
        <div className="px-4 py-2 border-b" style={{ backgroundColor: tokens.navBarBg, borderColor: tokens.border }}>
          <nav className="flex items-center gap-1">
            {menuTree.map((item) => (
              <div key={item._id} className="relative" onMouseEnter={() => setHoveredItem(item._id)} onMouseLeave={() => setHoveredItem(null)}>
                <a
                  href={item.url}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1',
                    hoveredItem === item._id
                      ? 'text-[var(--menu-hover-text)]'
                      : 'hover:bg-[var(--menu-hover-bg)] hover:text-[var(--menu-hover-text)]'
                  )}
                  style={{
                    ...(hoveredItem === item._id
                      ? { backgroundColor: tokens.navItemHoverBg, color: tokens.navItemHoverText }
                      : { color: tokens.navItemText }),
                    ...menuVars,
                  }}
                >
                  {item.label}
                  {item.children.length > 0 && <ChevronDown size={14} />}
                </a>
                {item.children.length > 0 && hoveredItem === item._id && (
                  <div
                    className="absolute top-full left-0 mt-1 rounded-lg border py-2 min-w-[200px] z-50"
                    style={{ backgroundColor: tokens.dropdownBg, borderColor: tokens.dropdownBorder }}
                  >
                    {item.children.map((child) => (
                      <a
                        key={child._id}
                        href={child.url}
                        className="block px-4 py-2.5 text-sm transition-colors hover:bg-[var(--menu-dropdown-hover-bg)] hover:text-[var(--menu-dropdown-hover-text)]"
                        style={{ color: tokens.dropdownItemText, ...menuVars }}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}

      {config.search.show && searchOpen && (
        <div className="md:hidden px-4 pb-4 border-b" style={{ borderColor: tokens.border }}>
          <input
            type="text"
            placeholder={config.search.placeholder ?? 'Tìm kiếm...'}
            className="w-full px-3 py-2 rounded-full border text-sm focus:outline-none"
            style={{
              backgroundColor: tokens.searchInputBg,
              borderColor: tokens.searchInputBorder,
              color: tokens.searchInputText,
            }}
          />
        </div>
      )}

      {device === 'mobile' && mobileMenuOpen && (
        <div className="border-t" style={{ borderColor: tokens.border, backgroundColor: tokens.surface }}>
          {menuTree.map((item) => (
            <div key={item._id} className="border-b" style={{ borderColor: tokens.border }}>
              <button
                onClick={() => item.children.length > 0 && toggleMobileItem(item._id)}
                className="w-full px-4 py-3 text-left flex items-center justify-between text-sm font-medium"
                style={{ color: tokens.mobileMenuItemText }}
              >
                {item.label}
                {item.children.length > 0 && (<ChevronDown size={16} className={cn('transition-transform', expandedMobileItems.includes(item._id) && 'rotate-180')} />)}
              </button>
              {item.children.length > 0 && expandedMobileItems.includes(item._id) && (
                <div className="pb-2" style={{ backgroundColor: tokens.mobileMenuBg }}>
                  {item.children.map((child) => (
                    <a
                      key={child._id}
                      href={child.url}
                      className="block px-6 py-2 text-sm"
                      style={{ color: tokens.mobileMenuSubItemText }}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          {config.cta.show && (
            <div className="p-4">
              <a
                href={defaultLinks.cta}
                className="block w-full py-2.5 text-sm font-medium rounded-lg text-center"
                style={{ backgroundColor: tokens.ctaBg, color: tokens.ctaText }}
              >
                {config.cta.text}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderAllbirdsStyle = () => (
    <div className={cn(classicPositionClass)} style={{ backgroundColor: tokens.surface, ...classicSeparatorStyle }}>
      {displayTopbar.show && (
        <div
          className="px-4 py-2 text-[11px] uppercase tracking-[0.3em]"
          style={{ backgroundColor: tokens.allbirdsAnnouncementBg, color: tokens.allbirdsAnnouncementText }}
        >
          <div className="flex items-center justify-center gap-4">
            <span className="font-medium">{announcementText}</span>
            {device !== 'mobile' && (showTrackOrder || displayTopbar.showStoreSystem) && (
              <span className="flex items-center gap-2 text-[10px] tracking-[0.2em]">
                {showTrackOrder && <a href={defaultLinks.trackOrder} className="hover:underline">Theo dõi đơn</a>}
                {showTrackOrder && displayTopbar.showStoreSystem && <span style={{ color: tokens.topbarDivider }}>|</span>}
                {displayTopbar.showStoreSystem && <a href={defaultLinks.storeSystem} className="hover:underline">Cửa hàng</a>}
              </span>
            )}
          </div>
        </div>
      )}
      {config.showBrandAccent && (
        <div className="h-0.5" style={{ backgroundColor: tokens.accentLine }} />
      )}
      <div className="px-6 py-4 border-b" style={{ borderColor: tokens.border }}>
        {device !== 'mobile' ? (
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tokens.allbirdsAccentDot }}></div>
              <span className="text-base font-semibold" style={{ color: tokens.textPrimary }}>{config.brandName}</span>
            </div>
            <nav className="flex items-center gap-6">
              {menuTree.map((item) => {
                const hasSubItems = item.children.some((child) => child.children.length > 0);
                const totalSubItems = item.children.reduce((acc, child) => acc + child.children.length, 0);
                const isMega = item.children.length >= 3 || totalSubItems > 6;
                const isMedium = !isMega && (item.children.length > 1 || hasSubItems);
                const dropdownWidth = isMega ? 'w-[720px]' : isMedium ? 'w-[420px]' : 'w-[240px]';
                const gridCols = isMega
                  ? 'grid-cols-3'
                  : item.children.length > 1
                    ? 'grid-cols-2'
                    : 'grid-cols-1';

                return (
                  <div
                    key={item._id}
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item._id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <a
                      href={item.url}
                      className={cn(
                        'text-sm font-medium transition-colors',
                        hoveredItem === item._id ? 'text-[var(--menu-hover-text)]' : 'hover:text-[var(--menu-hover-text)]'
                      )}
                      style={{ color: tokens.allbirdsNavText, ...menuVars }}
                    >
                      {item.label}
                    </a>
                    {item.children.length > 0 && hoveredItem === item._id && (
                      <div
                        className={cn('absolute left-1/2 top-full mt-6 -translate-x-1/2 rounded-2xl border p-6 z-50', dropdownWidth)}
                        style={{ backgroundColor: tokens.dropdownBg, borderColor: tokens.dropdownBorder }}
                      >
                        <div className={cn('grid gap-6', gridCols)}>
                          {item.children.map((child) => (
                            <div key={child._id} className="space-y-3">
                              <a href={child.url} className="text-sm font-semibold" style={{ color: tokens.textPrimary }}>
                                {child.label}
                              </a>
                              <div className="space-y-2">
                                {child.children.length > 0 ? (
                                  child.children.map((sub) => (
                                    <a
                                      key={sub._id}
                                      href={sub.url}
                                      className="block text-sm hover:text-[var(--menu-dropdown-sub-hover-text)]"
                                      style={{ color: tokens.dropdownSubItemText, ...menuVars }}
                                    >
                                      {sub.label}
                                    </a>
                                  ))
                                ) : (
                                  <a
                                    href={child.url}
                                    className="text-sm hover:text-[var(--menu-dropdown-sub-hover-text)]"
                                    style={{ color: tokens.dropdownSubItemText, ...menuVars }}
                                  >
                                    Xem thêm
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
            <div className="flex items-center gap-3">
              {config.cta.show && (
                <a
                  href={defaultLinks.cta}
                  className="text-sm font-medium hover:text-[var(--menu-hover-text)]"
                  style={{ color: tokens.ctaTextLink, ...menuVars }}
                >
                  {config.cta.text}
                </a>
              )}
              {config.search.show && (
                <div className="flex items-center gap-2">
                  <div className={cn('overflow-hidden transition-all duration-200', searchOpen ? 'w-40' : 'w-0')}>
                    <input
                      type="text"
                      placeholder={config.search.placeholder ?? 'Tìm kiếm...'}
                      className={cn('w-40 px-3 py-1.5 rounded-full border text-sm focus:outline-none transition-opacity', searchOpen ? 'opacity-100' : 'opacity-0')}
                      style={{
                        backgroundColor: tokens.searchInputBg,
                        borderColor: tokens.searchInputBorder,
                        color: tokens.searchInputText,
                      }}
                    />
                  </div>
                  <button
                    onClick={() => setSearchOpen((prev) => !prev)}
                    className="p-2 transition-colors hover:text-[var(--menu-icon-hover)]"
                    style={{ color: tokens.iconButtonText, ...menuVars }}
                  >
                    <Search size={18} />
                  </button>
                </div>
              )}
              {showLogin && renderUserMenu('icon')}
              {config.cart.show && (
                <a
                  href={defaultLinks.cart}
                  className="p-2 relative transition-colors hover:text-[var(--menu-icon-hover)]"
                  style={{ color: tokens.iconButtonText, ...menuVars }}
                >
                  <ShoppingCart size={18} />
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center"
                    style={{ backgroundColor: tokens.badgeBg, color: tokens.badgeText }}
                  >
                    0
                  </span>
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tokens.allbirdsAccentDot }}></div>
              <span className="text-base font-semibold" style={{ color: tokens.textPrimary }}>{config.brandName}</span>
            </div>
            <div className="flex items-center gap-2">
              {config.search.show && (
                <button onClick={() => setSearchOpen((prev) => !prev)} className="p-2" style={{ color: tokens.iconButtonText }}>
                  <Search size={18} />
                </button>
              )}
              {config.cart.show && (
                <a href={defaultLinks.cart} className="p-2 relative" style={{ color: tokens.iconButtonText }}>
                  <ShoppingCart size={18} />
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center"
                    style={{ backgroundColor: tokens.badgeBg, color: tokens.badgeText }}
                  >
                    0
                  </span>
                </a>
              )}
              {renderMobileMenuButton(false)}
            </div>
          </div>
        )}
      </div>

      {device === 'mobile' && config.search.show && searchOpen && (
        <div className="px-6 pb-4">
          <input
            type="text"
            placeholder={config.search.placeholder ?? 'Tìm kiếm...'}
            className="w-full px-3 py-2 rounded-full border text-sm focus:outline-none"
            style={{
              backgroundColor: tokens.searchInputBg,
              borderColor: tokens.searchInputBorder,
              color: tokens.searchInputText,
            }}
          />
        </div>
      )}

      {device === 'mobile' && mobileMenuOpen && (
        <div className="border-b" style={{ borderColor: tokens.border, backgroundColor: tokens.mobileMenuBg }}>
          {menuTree.map((item) => (
            <div key={item._id}>
              <button
                onClick={() => item.children.length > 0 && toggleMobileItem(item._id)}
                className="w-full px-6 py-3 text-left flex items-center justify-between text-sm font-medium transition-colors hover:bg-[var(--menu-dropdown-hover-bg)]"
                style={{ color: tokens.mobileMenuItemText, ...menuVars }}
              >
                {item.label}
                {item.children.length > 0 && (<ChevronDown size={16} className={cn('transition-transform', expandedMobileItems.includes(item._id) && 'rotate-180')} />)}
              </button>
              {item.children.length > 0 && expandedMobileItems.includes(item._id) && (
                <div style={{ backgroundColor: tokens.surface }}>
                  {item.children.map((child) => (
                    <a
                      key={child._id}
                      href={child.url}
                      className="block px-8 py-2.5 text-sm border-l-2 ml-6 transition-colors hover:text-[var(--menu-dropdown-sub-hover-text)]"
                      style={{ color: tokens.mobileMenuSubItemText, borderColor: tokens.mobileMenuSubItemBorder, ...menuVars }}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          {config.cta.show && (
            <div className="p-4">
              <a
                href={defaultLinks.cta}
                className="block w-full py-2.5 text-sm font-medium rounded-lg text-center"
                style={{ backgroundColor: tokens.ctaBg, color: tokens.ctaText }}
              >
                {config.cta.text}
              </a>
            </div>
          )}
        </div>
      )}
      {classicSeparatorElement}
    </div>
  );

  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: tokens.border }}>
      {layoutStyle === 'classic' && renderClassicStyle()}
      {layoutStyle === 'topbar' && renderTopbarStyle()}
      {layoutStyle === 'allbirds' && renderAllbirdsStyle()}

      <div className="p-4 space-y-3" style={{ backgroundColor: tokens.surfaceAlt }}>
        <div className="h-32 rounded-lg flex items-center justify-center" style={{ backgroundColor: tokens.placeholderBg }}>
          <span className="text-sm" style={{ color: tokens.placeholderText }}>Content Area</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="h-20 rounded-lg" style={{ backgroundColor: tokens.placeholderBg }}></div>
          <div className="h-20 rounded-lg" style={{ backgroundColor: tokens.placeholderBg }}></div>
          <div className="h-20 rounded-lg" style={{ backgroundColor: tokens.placeholderBg }}></div>
        </div>
      </div>
    </div>
  );
}
