'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useBrandColors, useSiteSettings } from './hooks';
import { HeaderSearchAutocomplete } from './HeaderSearchAutocomplete';
import { ChevronDown, ChevronRight, Heart, LogOut, Mail, Package, Phone, Search, User } from 'lucide-react';
import { CartIcon } from './CartIcon';
import { useCustomerAuth } from '@/app/(site)/auth/context';
import { getMenuColors, type MenuColors } from './header/colors';

interface MenuItem {
  _id: Id<"menuItems">;
  label: string;
  url: string;
  order: number;
  depth: number;
  active: boolean;
  icon?: string;
  openInNewTab?: boolean;
}

interface MenuItemWithChildren extends MenuItem {
  children: MenuItemWithChildren[];
}

type HeaderStyle = 'classic' | 'topbar' | 'allbirds';

interface TopbarConfig {
  show?: boolean;
  hotline?: string;
  email?: string;
  showTrackOrder?: boolean;
  showStoreSystem?: boolean;
  useSettingsData?: boolean;
}

interface SearchConfig {
  show?: boolean;
  placeholder?: string;
  searchProducts?: boolean;
  searchPosts?: boolean;
  searchServices?: boolean;
}

interface HeaderConfig {
  brandName?: string;
  headerBackground?: 'white' | 'dots' | 'stripes';
  headerSeparator?: 'none' | 'shadow' | 'border' | 'gradient';
  headerSticky?: boolean;
  showBrandAccent?: boolean;
  cta?: { show?: boolean; text?: string };
  topbar?: TopbarConfig;
  search?: SearchConfig;
  cart?: { show?: boolean };
  wishlist?: { show?: boolean };
  login?: { show?: boolean; text?: string };
}

const DEFAULT_CONFIG: HeaderConfig = {
  brandName: 'YourBrand',
  headerBackground: 'white',
  headerSeparator: 'none',
  headerSticky: true,
  showBrandAccent: false,
  cart: { show: true },
  cta: { show: true, text: 'Liên hệ' },
  login: { show: true, text: 'Đăng nhập' },
  search: { placeholder: 'Tìm kiếm...', searchPosts: true, searchProducts: true, searchServices: true, show: true },
  topbar: {
    email: 'contact@example.com',
    hotline: '1900 1234',
    show: true,
    showStoreSystem: true,
    showTrackOrder: true,
    useSettingsData: false,
  },
  wishlist: { show: true },
};

const DEFAULT_LINKS = {
  cart: '/cart',
  wishlist: '/wishlist',
  login: '/account/login',
  cta: '/contact',
  trackOrder: '/account/orders',
  storeSystem: '/stores',
  accountProfile: '/account/profile',
  accountOrders: '/account/orders',
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function Header() {
  const brandColors = useBrandColors();
  const { siteName, logo } = useSiteSettings();
  const menuData = useQuery(api.menus.getFullMenu, { location: 'header' });
  const headerStyleSetting = useQuery(api.settings.getByKey, { key: 'header_style' });
  const headerConfigSetting = useQuery(api.settings.getByKey, { key: 'header_config' });
  const contactSettings = useQuery(api.settings.listByGroup, { group: 'contact' });
  const customersModule = useQuery(api.admin.modules.getModuleByKey, { key: 'customers' });
  const ordersModule = useQuery(api.admin.modules.getModuleByKey, { key: 'orders' });
  const productsModule = useQuery(api.admin.modules.getModuleByKey, { key: 'products' });
  const postsModule = useQuery(api.admin.modules.getModuleByKey, { key: 'posts' });
  const servicesModule = useQuery(api.admin.modules.getModuleByKey, { key: 'services' });
  const customerLoginFeature = useQuery(api.admin.modules.getModuleFeature, { moduleKey: 'customers', featureKey: 'enableLogin' });
  const router = useRouter();
  const { customer, isAuthenticated, logout } = useCustomerAuth();
  
  const headerStyleRaw = headerStyleSetting?.value as string | undefined;
  const headerStyle: HeaderStyle = (headerStyleRaw === 'transparent' || headerStyleRaw === 'centered' ? 'allbirds' : headerStyleRaw as HeaderStyle) || 'classic';
  const savedConfig = (headerConfigSetting?.value as HeaderConfig) || {};
  const config: HeaderConfig = {
    ...DEFAULT_CONFIG,
    ...savedConfig,
    topbar: { ...DEFAULT_CONFIG.topbar, ...savedConfig.topbar },
    search: { ...DEFAULT_CONFIG.search, ...savedConfig.search },
    cta: { ...DEFAULT_CONFIG.cta, ...savedConfig.cta },
    cart: { ...DEFAULT_CONFIG.cart, ...savedConfig.cart },
    wishlist: { ...DEFAULT_CONFIG.wishlist, ...savedConfig.wishlist },
    login: { ...DEFAULT_CONFIG.login, ...savedConfig.login },
  };
  
  // Get contact settings when useSettingsData is enabled
  const settingsPhone = contactSettings?.find(s => s.key === 'contact_phone')?.value as string | undefined;
  const settingsEmail = contactSettings?.find(s => s.key === 'contact_email')?.value as string | undefined;
  
  // Merge topbar data with settings if useSettingsData is enabled
  const topbarConfig = useMemo(() => {
    const base = config.topbar ?? {};
    if (base.useSettingsData) {
      return {
        ...base,
        hotline: settingsPhone ?? base.hotline,
        email: settingsEmail ?? base.email,
      };
    }
    return base;
  }, [config.topbar, settingsPhone, settingsEmail]);

  const canLogin = (customersModule?.enabled ?? false) && (customerLoginFeature?.enabled ?? false);
  const showLogin = Boolean(config.login?.show && canLogin);
  const showUserMenu = showLogin && isAuthenticated;
  const showLoginLink = showLogin && !isAuthenticated;
  const canTrackOrder = ordersModule?.enabled ?? false;
  const showTrackOrder = Boolean(topbarConfig.showTrackOrder && canTrackOrder);
  const canSearchProducts = Boolean(config.search?.searchProducts && (productsModule?.enabled ?? false));
  const canSearchPosts = Boolean(config.search?.searchPosts && (postsModule?.enabled ?? false));
  const canSearchServices = Boolean(config.search?.searchServices && (servicesModule?.enabled ?? false));
  const showSearch = Boolean(config.search?.show && (canSearchProducts || canSearchPosts || canSearchServices));
  
  const displayName = (siteName ?? config.brandName) ?? 'YourBrand';

  const tokens = useMemo<MenuColors>(
    () => getMenuColors(brandColors.primary, brandColors.secondary, brandColors.mode),
    [brandColors.primary, brandColors.secondary, brandColors.mode]
  );
  const menuVars: React.CSSProperties = {
    '--menu-hover-bg': tokens.navItemHoverBg,
    '--menu-hover-text': tokens.navItemHoverText,
    '--menu-dropdown-hover-bg': tokens.dropdownItemHoverBg,
    '--menu-dropdown-hover-text': tokens.dropdownItemHoverText,
    '--menu-dropdown-sub-hover-text': tokens.dropdownSubItemHoverText,
    '--menu-icon-hover': tokens.iconButtonHoverText,
  } as React.CSSProperties;
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleMenuEnter = useCallback((itemId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredItem(itemId);
  }, []);

  const handleMenuLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 150);
  }, []);

  const menuItems = menuData?.items;

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

  const classicPositionClass = (config.headerSticky ?? true) ? 'sticky top-0 z-50' : 'relative z-50';
  const menuTree = useMemo((): MenuItemWithChildren[] => {
    if (!menuItems) {return [];}
    
    const items = [...menuItems].sort((a, b) => a.order - b.order);
    const rootItems = items.filter(item => item.depth === 0);
    
    return rootItems.map(root => {
      const rootIndex = items.indexOf(root);
      const nextRootIndex = items.findIndex((item, idx) => idx > rootIndex && item.depth === 0);
      const childrenRange = nextRootIndex === -1 ? items.slice(rootIndex + 1) : items.slice(rootIndex + 1, nextRootIndex);

      return {
        ...root,
        children: childrenRange.filter(c => c.depth === 1).map(child => {
          const childIndex = items.indexOf(child);
          const nextChildIndex = childrenRange.findIndex((item) => items.indexOf(item) > childIndex && item.depth <= 1);
          const subRange = nextChildIndex === -1 
            ? childrenRange.slice(childrenRange.indexOf(child) + 1) 
            : childrenRange.slice(childrenRange.indexOf(child) + 1, nextChildIndex);
          return {
            ...child,
            children: subRange.filter(s => s.depth === 2).map(s => ({ ...s, children: [] }))
          };
        })
      };
    });
  }, [menuItems]);

  const announcementText = useMemo(() => {
    const items = [topbarConfig.hotline, topbarConfig.email].filter(Boolean);
    return items.length > 0 ? items.join(' · ') : 'Shop New Arrivals';
  }, [topbarConfig.email, topbarConfig.hotline]);

  const toggleMobileItem = (id: string) => {
    setExpandedMobileItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setUserMenuOpen(false);
    router.push('/');
  }, [logout, router]);

  const renderUserMenu = (variant: 'text' | 'icon', textClassName = '') => (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={() => { setUserMenuOpen(prev => !prev); }}
        className={cn(
          variant === 'text'
            ? `hover:underline flex items-center gap-1 ${textClassName}`
            : 'p-2 transition-colors hover:text-[var(--menu-icon-hover)]',
        )}
        style={variant === 'icon' ? { color: tokens.iconButtonText, ...menuVars } : undefined}
      >
        <User size={variant === 'text' ? 12 : 18} />
        {variant === 'text' && <span>{customer?.name || (config.login?.text ?? 'Tài khoản')}</span>}
      </button>
      {userMenuOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl border z-50"
          style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: tokens.border }}>
            <p className="text-sm font-semibold" style={{ color: tokens.textPrimary }}>Xin chào, {customer?.name || 'Khách hàng'}</p>
            {customer?.email && (
              <p className="text-xs mt-1" style={{ color: tokens.textSubtle }}>{customer.email}</p>
            )}
          </div>
          <div className="py-2">
            <Link
              href={DEFAULT_LINKS.accountProfile}
              onClick={() => { setUserMenuOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[var(--menu-dropdown-hover-bg)]"
              style={{ color: tokens.dropdownItemText, ...menuVars }}
            >
              <User size={16} />
              Thông tin tài khoản
            </Link>
            <Link
              href={DEFAULT_LINKS.accountOrders}
              onClick={() => { setUserMenuOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[var(--menu-dropdown-hover-bg)]"
              style={{ color: tokens.dropdownItemText, ...menuVars }}
            >
              <Package size={16} />
              Đơn hàng của tôi
            </Link>
            <Link
              href={DEFAULT_LINKS.wishlist}
              onClick={() => { setUserMenuOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[var(--menu-dropdown-hover-bg)]"
              style={{ color: tokens.dropdownItemText, ...menuVars }}
            >
              <Heart size={16} />
              Danh sách yêu thích
            </Link>
          </div>
          <div className="border-t" style={{ borderColor: tokens.border }}>
            <button
              onClick={() => { void handleLogout(); }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[var(--menu-dropdown-hover-bg)]"
              style={{ color: tokens.textSubtle, ...menuVars }}
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (menuData === undefined) {
    return (
      <header style={{ backgroundColor: tokens.surface }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="h-8 w-32 animate-pulse rounded" style={{ backgroundColor: tokens.placeholderBg }}></div>
        </div>
      </header>
    );
  }

  // Inline mobile menu button renderer
  const renderMobileMenuButton = (isTransparent = false) => {
    const color = isTransparent ? tokens.textInverse : tokens.iconButtonText;
    return (
      <button onClick={handleMobileMenuToggle} className={cn('p-2 rounded-lg lg:hidden')} style={{ color }}>
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

  // Classic Style
  if (headerStyle === 'classic') {
    return (
      <header className={cn(classicPositionClass)} style={{ ...classicBackgroundStyle, ...classicSeparatorStyle }}>
        {topbarConfig.show !== false && (
          <div className="px-4 py-2 text-xs" style={{ backgroundColor: tokens.topbarBg, color: tokens.topbarText }}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                {topbarConfig.hotline && (
                  <a href={`tel:${topbarConfig.hotline}`} className="flex items-center gap-1">
                    <Phone size={12} />
                    <span>{topbarConfig.hotline}</span>
                  </a>
                )}
                {topbarConfig.email && (
                  <a href={`mailto:${topbarConfig.email}`} className="hidden sm:flex items-center gap-1">
                    <Mail size={12} />
                    <span>{topbarConfig.email}</span>
                  </a>
                )}
              </div>
              <div className="flex items-center gap-3">
                {showTrackOrder && (
                  <>
                    <Link href={DEFAULT_LINKS.trackOrder} className="hover:underline hidden sm:inline">Theo dõi đơn hàng</Link>
                    {topbarConfig.showStoreSystem && <span className="hidden sm:inline" style={{ color: tokens.topbarDivider }}>|</span>}
                  </>
                )}
                {topbarConfig.showStoreSystem && (
                  <>
                    <Link href={DEFAULT_LINKS.storeSystem} className="hover:underline hidden sm:inline">Hệ thống cửa hàng</Link>
                    {showLogin && <span className="hidden sm:inline" style={{ color: tokens.topbarDivider }}>|</span>}
                  </>
                )}
                {showUserMenu && renderUserMenu('text', '')}
                {showLoginLink && (
                  <Link href={DEFAULT_LINKS.login} className="hover:underline flex items-center gap-1">
                    <User size={12} />
                    {config.login?.text ?? 'Đăng nhập'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
        {config.showBrandAccent && (
          <div className="h-0.5" style={{ backgroundColor: tokens.accentLine }} />
        )}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {logo ? (
              <Image src={logo} alt={displayName} width={32} height={32} className="h-8 w-auto" />
            ) : (
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: tokens.brandBadgeBg }}></div>
            )}
            <span className="font-semibold" style={{ color: tokens.textPrimary }}>{displayName}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuTree.map((item) => (
              <div
                key={item._id}
                className="relative"
                onMouseEnter={() =>{  handleMenuEnter(item._id); }}
                onMouseLeave={handleMenuLeave}
              >
                <Link
                  href={item.url}
                  target={item.openInNewTab ? '_blank' : undefined}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1",
                    hoveredItem === item._id
                      ? "text-[var(--menu-hover-text)]"
                      : "hover:bg-[var(--menu-hover-bg)] hover:text-[var(--menu-hover-text)]"
                  )}
                  style={{
                    ...(hoveredItem === item._id
                      ? { backgroundColor: tokens.navItemHoverBg, color: tokens.navItemHoverText }
                      : { color: tokens.navItemText }),
                    ...menuVars,
                  }}
                >
                  {item.label}
                  {item.children.length > 0 && (
                    <ChevronDown size={14} className={cn("transition-transform", hoveredItem === item._id && "rotate-180")} />
                  )}
                </Link>

                {item.children.length > 0 && hoveredItem === item._id && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div
                      className="rounded-lg border py-2 min-w-[200px]"
                      style={{ backgroundColor: tokens.dropdownBg, borderColor: tokens.dropdownBorder }}
                    >
                      {item.children.map((child) => (
                        <div key={child._id} className="relative group/child">
                          <Link
                            href={child.url}
                            target={child.openInNewTab ? '_blank' : undefined}
                            className="flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-[var(--menu-dropdown-hover-bg)] hover:text-[var(--menu-dropdown-hover-text)]"
                            style={{ color: tokens.dropdownItemText, ...menuVars }}
                          >
                            {child.label}
                            {child.children?.length > 0 && <ChevronRight size={14} />}
                          </Link>
                          {child.children?.length > 0 && (
                            <div className="absolute left-full top-0 pl-1 hidden group-hover/child:block">
                              <div
                                className="rounded-lg border py-2 min-w-[180px]"
                                style={{ backgroundColor: tokens.dropdownBg, borderColor: tokens.dropdownBorder }}
                              >
                                {child.children.map((sub) => (
                                  <Link
                                    key={sub._id}
                                    href={sub.url}
                                    target={sub.openInNewTab ? '_blank' : undefined}
                                    className="block px-4 py-2 text-sm transition-colors hover:bg-[var(--menu-dropdown-hover-bg)] hover:text-[var(--menu-dropdown-sub-hover-text)]"
                                    style={{ color: tokens.dropdownSubItemText, ...menuVars }}
                                  >
                                    {sub.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {showSearch && (
              <div className="hidden lg:block">
                <HeaderSearchAutocomplete
                  placeholder={config.search?.placeholder}
                  searchProducts={canSearchProducts}
                  searchPosts={canSearchPosts}
                  searchServices={canSearchServices}
                  tokens={tokens}
                  className="w-48"
                  inputClassName="w-full pl-4 pr-10 py-2 rounded-full border text-sm focus:outline-none"
                  inputStyle={{
                    backgroundColor: tokens.searchInputBg,
                    borderColor: tokens.searchInputBorder,
                    color: tokens.searchInputText,
                  }}
                  buttonClassName="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full"
                />
              </div>
            )}
            {config.cart?.show && (
              <CartIcon variant="mobile" className="hidden lg:flex" tokens={tokens} />
            )}
            {config.cta?.show && (
              <Link
                href={DEFAULT_LINKS.cta}
                className="hidden lg:inline-flex px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ backgroundColor: tokens.ctaBg, color: tokens.ctaText }}
              >
                {config.cta.text ?? 'Liên hệ'}
              </Link>
            )}
            <div className="flex items-center gap-1 lg:hidden">
              {showSearch && (
                <button
                  onClick={() => { setSearchOpen((prev) => !prev); }}
                  className="p-2"
                  style={{ color: tokens.iconButtonText }}
                >
                  <Search size={20} />
                </button>
              )}
              {config.cart?.show && (
                <CartIcon variant="mobile" tokens={tokens} />
              )}
              {renderMobileMenuButton(false)}
            </div>
          </div>
        </div>

        {showSearch && searchOpen && (
          <div className="lg:hidden px-4 pb-4 border-b" style={{ borderColor: tokens.border }}>
            <HeaderSearchAutocomplete
              placeholder={config.search?.placeholder}
              searchProducts={canSearchProducts}
              searchPosts={canSearchPosts}
              searchServices={canSearchServices}
              tokens={tokens}
              showButton={false}
              className="w-full"
              inputClassName="w-full px-3 py-2 rounded-full border text-sm focus:outline-none"
              inputStyle={{
                backgroundColor: tokens.searchInputBg,
                borderColor: tokens.searchInputBorder,
                color: tokens.searchInputText,
              }}
            />
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t" style={{ borderColor: tokens.border, backgroundColor: tokens.mobileMenuBg }}>
            {menuTree.map((item) => (
              <div key={item._id}>
                <button
                  onClick={() => item.children.length > 0 && toggleMobileItem(item._id)}
                  className="w-full px-6 py-3 text-left flex items-center justify-between text-sm font-medium transition-colors hover:bg-[var(--menu-dropdown-hover-bg)]"
                  style={{ color: tokens.mobileMenuItemText, ...menuVars }}
                >
                  {item.label}
                  {item.children.length > 0 && (
                    <ChevronDown size={16} className={cn("transition-transform", expandedMobileItems.includes(item._id) && "rotate-180")} />
                  )}
                </button>
                {item.children.length > 0 && expandedMobileItems.includes(item._id) && (
                  <div style={{ backgroundColor: tokens.surface }}>
                    {item.children.map((child) => (
                      <Link 
                        key={child._id} 
                        href={child.url}
                        target={child.openInNewTab ? '_blank' : undefined}
                        onClick={() =>{  setMobileMenuOpen(false); }}
                        className="block px-8 py-2.5 text-sm border-l-2 ml-6 transition-colors hover:text-[var(--menu-dropdown-sub-hover-text)]"
                        style={{ color: tokens.mobileMenuSubItemText, borderColor: tokens.mobileMenuSubItemBorder, ...menuVars }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {config.cta?.show && (
              <div className="p-4">
              <Link 
                  href={DEFAULT_LINKS.cta} 
                  onClick={() =>{  setMobileMenuOpen(false); }}
                  className="block w-full py-2.5 text-sm font-medium rounded-lg text-center" 
                  style={{ backgroundColor: tokens.ctaBg, color: tokens.ctaText }}
                >
                  {config.cta.text ?? 'Liên hệ'}
                </Link>
              </div>
            )}
          </div>
        )}
        {classicSeparatorElement}
      </header>
    );
  }

  // Topbar Style
  if (headerStyle === 'topbar') {
    return (
      <header className={cn(classicPositionClass)} style={{ backgroundColor: tokens.surface }}>
        {/* Topbar */}
        {topbarConfig.show !== false && (
          <div className="px-4 py-2 text-xs" style={{ backgroundColor: tokens.topbarBg, color: tokens.topbarText }}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                {topbarConfig.hotline && (
                  <a href={`tel:${topbarConfig.hotline}`} className="flex items-center gap-1">
                    <Phone size={12} />
                    <span>{topbarConfig.hotline}</span>
                  </a>
                )}
                {topbarConfig.email && (
                  <a href={`mailto:${topbarConfig.email}`} className="hidden sm:flex items-center gap-1">
                    <Mail size={12} />
                    <span>{topbarConfig.email}</span>
                  </a>
                )}
              </div>
              <div className="flex items-center gap-3">
                {showTrackOrder && (
                  <>
                    <Link href={DEFAULT_LINKS.trackOrder} className="hover:underline hidden sm:inline">Theo dõi đơn hàng</Link>
                    {topbarConfig.showStoreSystem && <span className="hidden sm:inline" style={{ color: tokens.topbarDivider }}>|</span>}
                  </>
                )}
                {topbarConfig.showStoreSystem && (
                  <>
                    <Link href={DEFAULT_LINKS.storeSystem} className="hover:underline hidden sm:inline">Hệ thống cửa hàng</Link>
                    {showLogin && <span className="hidden sm:inline" style={{ color: tokens.topbarDivider }}>|</span>}
                  </>
                )}
                {showUserMenu && renderUserMenu('text', '')}
                {showLoginLink && (
                  <Link href={DEFAULT_LINKS.login} className="hover:underline flex items-center gap-1">
                    <User size={12} />
                    {config.login?.text ?? 'Đăng nhập'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Header */}
        <div className="px-4 py-3 border-b" style={{ borderColor: tokens.border }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              {logo ? (
                <Image src={logo} alt={displayName} width={36} height={36} className="h-9 w-auto" />
              ) : (
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-bold" 
                  style={{ backgroundColor: tokens.brandBadgeBg, color: tokens.brandBadgeText }}
                >
                  {displayName.charAt(0)}
                </div>
              )}
              <span className="font-bold text-lg" style={{ color: tokens.textPrimary }}>{displayName}</span>
            </Link>

            {/* Search Bar */}
            {showSearch && (
              <div className="hidden md:block flex-1 max-w-md">
                <HeaderSearchAutocomplete
                  placeholder={config.search?.placeholder}
                  searchProducts={canSearchProducts}
                  searchPosts={canSearchPosts}
                  searchServices={canSearchServices}
                  tokens={tokens}
                  className="w-full"
                  inputClassName="w-full pl-4 pr-10 py-2 rounded-full border text-sm focus:outline-none"
                  inputStyle={{
                    backgroundColor: tokens.searchInputBg,
                    borderColor: tokens.searchInputBorder,
                    color: tokens.searchInputText,
                  }}
                  buttonClassName="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile: Search + Cart */}
              <div className="flex lg:hidden items-center gap-1">
                {showSearch && (
                  <button
                    onClick={() => { setSearchOpen((prev) => !prev); }}
                    className="p-2"
                    style={{ color: tokens.iconButtonText }}
                  >
                    <Search size={20} />
                  </button>
                )}
                {config.cart?.show && (
                  <CartIcon variant="mobile" tokens={tokens} />
                )}
                {renderMobileMenuButton(false)}
              </div>

              {/* Desktop: Wishlist + Cart */}
              <div className="hidden lg:flex items-center gap-2">
                {config.wishlist?.show && (
                  <Link
                    href={DEFAULT_LINKS.wishlist}
                    className="p-2 transition-colors flex flex-col items-center text-xs gap-0.5 hover:text-[var(--menu-icon-hover)]"
                    style={{ color: tokens.iconButtonText, ...menuVars }}
                  >
                    <Heart size={20} />
                    <span>Yêu thích</span>
                  </Link>
                )}
                {config.cart?.show && (
                  <CartIcon tokens={tokens} />
                )}
                {config.cta?.show && (
                  <Link
                    href={DEFAULT_LINKS.cta}
                    className="hidden lg:inline-flex px-4 py-2 text-sm font-medium rounded-full transition-colors"
                    style={{ backgroundColor: tokens.ctaBg, color: tokens.ctaText }}
                  >
                    {config.cta.text ?? 'Liên hệ'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {showSearch && searchOpen && (
          <div className="lg:hidden px-4 pb-4 border-b" style={{ borderColor: tokens.border }}>
            <HeaderSearchAutocomplete
              placeholder={config.search?.placeholder}
              searchProducts={canSearchProducts}
              searchPosts={canSearchPosts}
              searchServices={canSearchServices}
              tokens={tokens}
              showButton={false}
              className="w-full"
              inputClassName="w-full px-3 py-2 rounded-full border text-sm focus:outline-none"
              inputStyle={{
                backgroundColor: tokens.searchInputBg,
                borderColor: tokens.searchInputBorder,
                color: tokens.searchInputText,
              }}
            />
          </div>
        )}

        {/* Navigation Bar */}
        <div className="hidden lg:block px-4 py-2 border-b" style={{ backgroundColor: tokens.navBarBg, borderColor: tokens.border }}>
          <nav className="max-w-7xl mx-auto flex items-center gap-1">
            {menuTree.map((item) => (
              <div
                key={item._id}
                className="relative"
                onMouseEnter={() =>{  handleMenuEnter(item._id); }}
                onMouseLeave={handleMenuLeave}
              >
                <Link
                  href={item.url}
                  target={item.openInNewTab ? '_blank' : undefined}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1",
                    hoveredItem === item._id
                      ? "text-[var(--menu-hover-text)]"
                      : "hover:bg-[var(--menu-hover-bg)] hover:text-[var(--menu-hover-text)]"
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
                </Link>

                {item.children.length > 0 && hoveredItem === item._id && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div
                      className="rounded-lg border py-2 min-w-[200px]"
                      style={{ backgroundColor: tokens.dropdownBg, borderColor: tokens.dropdownBorder }}
                    >
                      {item.children.map((child) => (
                        <Link 
                          key={child._id} 
                          href={child.url}
                          target={child.openInNewTab ? '_blank' : undefined}
                          className="block px-4 py-2.5 text-sm transition-colors hover:bg-[var(--menu-dropdown-hover-bg)] hover:text-[var(--menu-dropdown-hover-text)]"
                          style={{ color: tokens.dropdownItemText, ...menuVars }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t" style={{ borderColor: tokens.border, backgroundColor: tokens.surface }}>
            {menuTree.map((item) => (
              <div key={item._id} className="border-b" style={{ borderColor: tokens.border }}>
                <button
                  onClick={() => item.children.length > 0 && toggleMobileItem(item._id)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between text-sm font-medium"
                  style={{ color: tokens.mobileMenuItemText }}
                >
                  {item.label}
                  {item.children.length > 0 && (
                    <ChevronDown size={16} className={cn("transition-transform", expandedMobileItems.includes(item._id) && "rotate-180")} />
                  )}
                </button>
                {item.children.length > 0 && expandedMobileItems.includes(item._id) && (
                  <div className="pb-2" style={{ backgroundColor: tokens.mobileMenuBg }}>
                    {item.children.map((child) => (
                      <Link 
                        key={child._id} 
                        href={child.url}
                        target={child.openInNewTab ? '_blank' : undefined}
                        onClick={() =>{  setMobileMenuOpen(false); }}
                        className="block px-6 py-2 text-sm"
                        style={{ color: tokens.mobileMenuSubItemText }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {config.cta?.show && (
              <div className="p-4">
                <Link
                  href={DEFAULT_LINKS.cta}
                  onClick={() =>{  setMobileMenuOpen(false); }}
                  className="block w-full py-2.5 text-sm font-medium rounded-lg text-center"
                  style={{ backgroundColor: tokens.ctaBg, color: tokens.ctaText }}
                >
                  {config.cta.text ?? 'Liên hệ'}
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    );
  }

  // Allbirds Style
  return (
    <header className={cn(classicPositionClass)} style={{ backgroundColor: tokens.surface, ...classicSeparatorStyle }}>
        {topbarConfig.show !== false && (
          <div
            className="px-4 py-2 text-[11px] uppercase tracking-[0.3em]"
            style={{ backgroundColor: tokens.allbirdsAnnouncementBg, color: tokens.allbirdsAnnouncementText }}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
              <span className="font-medium">{announcementText}</span>
              {(showTrackOrder || topbarConfig.showStoreSystem) && (
                <span className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.2em]">
                  {showTrackOrder && (
                    <Link href={DEFAULT_LINKS.trackOrder} className="hover:underline">Theo dõi đơn</Link>
                  )}
                  {showTrackOrder && topbarConfig.showStoreSystem && <span style={{ color: tokens.topbarDivider }}>|</span>}
                  {topbarConfig.showStoreSystem && (
                    <Link href={DEFAULT_LINKS.storeSystem} className="hover:underline">Cửa hàng</Link>
                  )}
                </span>
              )}
            </div>
          </div>
        )}
        {config.showBrandAccent && (
          <div className="h-0.5" style={{ backgroundColor: tokens.accentLine }} />
        )}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 border-b" style={{ borderColor: tokens.border }}>
          <div className="flex items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2">
              {logo ? (
                <Image src={logo} alt={displayName} width={24} height={24} className="h-6 w-auto" />
              ) : (
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tokens.allbirdsAccentDot }}></div>
              )}
              <span className="text-base font-semibold" style={{ color: tokens.textPrimary }}>
                {displayName}
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
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
                    onMouseEnter={() => { handleMenuEnter(item._id); }}
                    onMouseLeave={handleMenuLeave}
                  >
                    <Link
                      href={item.url}
                      target={item.openInNewTab ? '_blank' : undefined}
                      className={cn(
                        'text-sm font-medium transition-colors',
                        hoveredItem === item._id
                          ? 'text-[var(--menu-hover-text)]'
                          : 'hover:text-[var(--menu-hover-text)]'
                      )}
                      style={{ color: tokens.allbirdsNavText, ...menuVars }}
                    >
                      {item.label}
                    </Link>

                    {item.children.length > 0 && hoveredItem === item._id && (
                      <div className="absolute left-1/2 top-full pt-6 -translate-x-1/2 z-50">
                        <div
                          className={cn('rounded-2xl border p-6', dropdownWidth)}
                          style={{ backgroundColor: tokens.dropdownBg, borderColor: tokens.dropdownBorder }}
                        >
                          <div className={cn('grid gap-6', gridCols)}>
                            {item.children.map((child) => (
                              <div key={child._id} className="space-y-3">
                                <Link
                                  href={child.url}
                                  target={child.openInNewTab ? '_blank' : undefined}
                                  className="text-sm font-semibold"
                                  style={{ color: tokens.textPrimary }}
                                >
                                  {child.label}
                                </Link>
                                <div className="space-y-2">
                                  {child.children.length > 0 ? (
                                    child.children.map((sub) => (
                                      <Link
                                        key={sub._id}
                                        href={sub.url}
                                        target={sub.openInNewTab ? '_blank' : undefined}
                                        className="block text-sm hover:text-[var(--menu-dropdown-sub-hover-text)]"
                                        style={{ color: tokens.dropdownSubItemText, ...menuVars }}
                                      >
                                        {sub.label}
                                      </Link>
                                    ))
                                  ) : (
                                    <Link
                                      href={child.url}
                                      target={child.openInNewTab ? '_blank' : undefined}
                                      className="text-sm hover:text-[var(--menu-dropdown-sub-hover-text)]"
                                      style={{ color: tokens.dropdownSubItemText, ...menuVars }}
                                    >
                                      Xem thêm
                                    </Link>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-3">
                {config.cta?.show && (
                  <Link
                    href={DEFAULT_LINKS.cta}
                    className="text-sm font-medium hover:text-[var(--menu-hover-text)]"
                    style={{ color: tokens.ctaTextLink, ...menuVars }}
                  >
                    {config.cta.text ?? 'Liên hệ'}
                  </Link>
                )}
                {showSearch && (
                  <div className="flex items-center gap-2">
                    <div className={cn('transition-all duration-200', searchOpen ? 'w-48 opacity-100' : 'w-0 opacity-0 pointer-events-none')}>
                      <HeaderSearchAutocomplete
                        placeholder={config.search?.placeholder}
                        searchProducts={canSearchProducts}
                        searchPosts={canSearchPosts}
                        searchServices={canSearchServices}
                        tokens={tokens}
                        showButton={false}
                        autoFocus={searchOpen}
                        className={cn('w-48 transition-opacity', searchOpen ? 'opacity-100' : 'opacity-0')}
                        inputClassName={cn('w-48 px-3 py-2 rounded-full border text-sm focus:outline-none transition-opacity', searchOpen ? 'opacity-100' : 'opacity-0')}
                        inputStyle={{
                          backgroundColor: tokens.searchInputBg,
                          borderColor: tokens.searchInputBorder,
                          color: tokens.searchInputText,
                        }}
                      />
                    </div>
                    <button
                      onClick={() => { setSearchOpen((prev) => !prev); }}
                      className="p-2 transition-colors hover:text-[var(--menu-icon-hover)]"
                      style={{ color: tokens.iconButtonText, ...menuVars }}
                    >
                      <Search size={18} />
                    </button>
                  </div>
                )}
                {showUserMenu && renderUserMenu('icon')}
                {showLoginLink && (
                  <Link
                    href={DEFAULT_LINKS.login}
                    className="p-2 transition-colors hover:text-[var(--menu-icon-hover)]"
                    style={{ color: tokens.iconButtonText, ...menuVars }}
                  >
                    <User size={18} />
                  </Link>
                )}
                {config.cart?.show && (
                  <CartIcon variant="mobile" tokens={tokens} />
                )}
              </div>
              <div className="flex items-center gap-1 lg:hidden">
                {showSearch && (
                  <button
                    onClick={() => { setSearchOpen((prev) => !prev); }}
                    className="p-2"
                    style={{ color: tokens.iconButtonText }}
                  >
                    <Search size={18} />
                  </button>
                )}
                {config.cart?.show && (
                  <CartIcon variant="mobile" tokens={tokens} />
                )}
                {renderMobileMenuButton(false)}
              </div>
            </div>
          </div>
        </div>

        {showSearch && searchOpen && (
          <div className="lg:hidden px-4 pb-4">
            <HeaderSearchAutocomplete
              placeholder={config.search?.placeholder}
              searchProducts={canSearchProducts}
              searchPosts={canSearchPosts}
              searchServices={canSearchServices}
              tokens={tokens}
              showButton={false}
              className="w-full"
              inputClassName="w-full px-3 py-2 rounded-full border text-sm focus:outline-none"
              inputStyle={{
                backgroundColor: tokens.searchInputBg,
                borderColor: tokens.searchInputBorder,
                color: tokens.searchInputText,
              }}
            />
          </div>
        )}

        {mobileMenuOpen && (
          <div className="lg:hidden border-t" style={{ borderColor: tokens.border, backgroundColor: tokens.mobileMenuBg }}>
            {menuTree.map((item) => (
              <div key={item._id}>
                <button
                  onClick={() => item.children.length > 0 && toggleMobileItem(item._id)}
                  className="w-full px-6 py-3 text-left flex items-center justify-between text-sm font-medium transition-colors hover:bg-[var(--menu-dropdown-hover-bg)]"
                  style={{ color: tokens.mobileMenuItemText, ...menuVars }}
                >
                  {item.label}
                  {item.children.length > 0 && (
                    <ChevronDown size={16} className={cn("transition-transform", expandedMobileItems.includes(item._id) && "rotate-180")} />
                  )}
                </button>
                {item.children.length > 0 && expandedMobileItems.includes(item._id) && (
                  <div style={{ backgroundColor: tokens.surface }}>
                    {item.children.map((child) => (
                      <Link
                        key={child._id}
                        href={child.url}
                        target={child.openInNewTab ? '_blank' : undefined}
                        onClick={() => { setMobileMenuOpen(false); }}
                        className="block px-8 py-2.5 text-sm border-l-2 ml-6 transition-colors hover:text-[var(--menu-dropdown-sub-hover-text)]"
                        style={{ color: tokens.mobileMenuSubItemText, borderColor: tokens.mobileMenuSubItemBorder, ...menuVars }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {config.cta?.show && (
              <div className="p-4">
                <Link
                  href={DEFAULT_LINKS.cta}
                  onClick={() => { setMobileMenuOpen(false); }}
                  className="block w-full py-2.5 text-sm font-medium rounded-lg text-center"
                  style={{ backgroundColor: tokens.ctaBg, color: tokens.ctaText }}
                >
                  {config.cta.text ?? 'Liên hệ'}
                </Link>
              </div>
            )}
          </div>
        )}
        {classicSeparatorElement}
    </header>
  );
}
