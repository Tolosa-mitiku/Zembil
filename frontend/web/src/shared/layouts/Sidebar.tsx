import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '@/core/constants';
import {
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  MegaphoneIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  StarIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ArrowPathIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useAppDispatch } from '@/store/hooks';
import { signOut } from '@/features/auth/store/authSlice';
import { useSidebar } from './SidebarContext';

interface SidebarProps {
  role: UserRole;
}

interface NavItem {
  name: string;
  path?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
  section?: string;
}

const sellerNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/seller/dashboard', icon: HomeIcon },
  {
    name: 'Ecommerce',
    icon: ShoppingBagIcon,
    children: [
      { name: 'All Order', path: '/seller/orders', icon: ShoppingCartIcon, badge: 0 },
      { name: 'All Product', path: '/seller/products', icon: ShoppingBagIcon },
      { name: 'Earning', path: '/seller/finance', icon: CurrencyDollarIcon },
      { name: 'Promotion', path: '/seller/promotions', icon: SpeakerWaveIcon },
      { name: 'Customer', path: '/seller/customers', icon: UsersIcon },
      { name: 'Message Center', path: '/seller/messages', icon: ChatBubbleLeftRightIcon },
    ],
  },
  { name: 'Return Request', path: '/seller/returns', icon: ArrowPathIcon, badge: 0, section: 'Product & Event' },
  { name: 'Calendar', path: '/seller/calendar', icon: CalendarIcon, section: 'Product & Event' },
  { name: 'Product Review', path: '/seller/reviews', icon: StarIcon, section: 'Product & Event' },
  { name: 'Help & Support', path: '/seller/support', icon: QuestionMarkCircleIcon, section: 'Account' },
  { name: 'Analytics', path: '/seller/analytics', icon: ChartBarIcon, section: 'Account' },
  { name: 'Settings', path: '/seller/settings', icon: Cog6ToothIcon, section: 'Account' },
];

const adminNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon },
  { name: 'Users', path: '/admin/users', icon: UsersIcon },
  { name: 'Customers', path: '/admin/customers', icon: UsersIcon },
  { name: 'Sellers', path: '/admin/sellers', icon: UserGroupIcon },
  { name: 'Products', path: '/admin/products', icon: ShoppingBagIcon },
  { name: 'Orders', path: '/admin/orders', icon: ClipboardDocumentListIcon },
  { name: 'Categories', path: '/admin/categories', icon: TagIcon },
  { name: 'Banners', path: '/admin/banners', icon: MegaphoneIcon },
  { name: 'Analytics', path: '/admin/analytics', icon: ChartBarIcon },
];

const Sidebar = ({ role }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const navItems = role === 'admin' ? adminNavItems : sellerNavItems;
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { isCollapsed, setIsHovered, isMobile } = useSidebar();

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const handleLogout = () => {
    dispatch(signOut());
  };

  const renderNavItem = (item: NavItem, depth = 0, index = 0) => {
    const isExpanded = expandedItems.includes(item.name);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <li 
          key={item.name}
          style={{
            animationDelay: `${index * 30}ms`
          }}
          className={clsx(
            'transition-all duration-300',
            !isCollapsed && 'animate-fadeInSlide'
          )}
        >
          <button
            onClick={() => toggleExpanded(item.name)}
            aria-label={isCollapsed ? item.name : undefined}
            className={clsx(
              'w-full flex items-center rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden',
              'hover:shadow-md',
              isCollapsed ? 'justify-center px-3 py-3' : 'justify-between px-4 py-3',
              'text-grey-700 hover:bg-grey-100/80 hover:backdrop-blur-sm',
              'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/60 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300',
              'hover:before:opacity-100'
            )}
          >
            <div className="flex items-center relative z-10">
              <item.icon className={clsx(
                'w-5 h-5 text-grey-500 transition-all duration-300 group-hover:text-gold group-hover:scale-110 group-hover:rotate-3',
                isCollapsed ? '' : 'mr-3'
              )} />
              <span className={clsx(
                'transition-all duration-300 whitespace-nowrap',
                isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
              )}>
                {item.name}
              </span>
            </div>
            {!isCollapsed && (
              <div className={clsx(
                'transition-all duration-300',
                isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              )}>
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4 text-grey-500 transition-transform duration-300" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-grey-500 transition-transform duration-300" />
                )}
              </div>
            )}
          </button>
          {isExpanded && !isCollapsed && (
            <ul className="mt-1 ml-8 space-y-1 animate-fadeInSlide">
              {item.children.map((child, childIndex) => (
                <li 
                  key={child.path}
                  style={{
                    animationDelay: `${childIndex * 30}ms`
                  }}
                >
                  <NavLink
                    to={child.path!}
                    aria-label={child.name}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden',
                        'hover:shadow-sm',
                        isActive
                          ? 'bg-gradient-to-r from-gold to-gold-dark text-white backdrop-blur-sm border border-gold/30 shadow-md shadow-gold/20'
                          : 'text-grey-600 hover:bg-grey-100/70 hover:backdrop-blur-sm hover:text-gold',
                        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/40 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300',
                        'hover:before:opacity-100'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center relative z-10">
                          <child.icon
                            className={clsx(
                              'w-4 h-4 mr-3 transition-all duration-300 group-hover:scale-110',
                              isActive ? 'text-gold' : 'text-grey-400 group-hover:text-gold'
                            )}
                          />
                          <span className="transition-colors duration-300">
                            {child.name}
                          </span>
                        </div>
                        {child.badge !== undefined && child.badge > 0 && (
                          <span className={clsx(
                            'text-xs font-bold rounded-full px-2 py-0.5 transition-all duration-300 animate-pulse',
                            'shadow-lg',
                            isActive 
                              ? 'bg-gold text-white' 
                              : 'bg-red-500 text-white'
                          )}>
                            {child.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li 
        key={item.path}
        style={{
          animationDelay: `${index * 30}ms`
        }}
        className={clsx(
          'transition-all duration-300',
          !isCollapsed && 'animate-fadeInSlide'
        )}
      >
        <NavLink
          to={item.path!}
          aria-label={isCollapsed ? item.name : undefined}
          className={({ isActive }) =>
            clsx(
              'flex items-center rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden',
              'hover:shadow-md',
              isCollapsed ? 'justify-center px-3 py-3' : 'justify-between px-4 py-3',
              isActive
                ? 'bg-gradient-to-r from-gold to-gold-dark text-white shadow-md shadow-gold/30 backdrop-blur-sm'
                : 'text-grey-700 hover:bg-grey-100/80 hover:backdrop-blur-sm hover:text-gold',
              'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/40 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300',
              'hover:before:opacity-100'
            )
          }
        >
          {({ isActive }) => (
            <>
              <div className="flex items-center relative z-10">
                <item.icon
                  className={clsx(
                    'w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3',
                    isActive ? 'text-white' : 'text-grey-500 group-hover:text-gold',
                    isCollapsed ? '' : 'mr-3'
                  )}
                />
                <span className={clsx(
                  'transition-all duration-300 whitespace-nowrap',
                  isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
                )}>
                  {item.name}
                </span>
              </div>
              {item.badge !== undefined && item.badge > 0 && !isCollapsed && (
                <span className={clsx(
                  'text-xs font-bold rounded-full px-2 py-0.5 transition-all duration-300 animate-pulse shadow-lg',
                  isActive ? 'bg-white text-gold' : 'bg-red-500 text-white'
                )}>
                  {item.badge}
                </span>
              )}
              {item.badge !== undefined && item.badge > 0 && isCollapsed && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
              )}
            </>
          )}
        </NavLink>
      </li>
    );
  };

  const groupedItems = navItems.reduce((acc, item) => {
    const section = item.section || 'main';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  return (
    <aside 
      className={clsx(
        'fixed top-0 left-0 h-screen flex flex-col z-40 transition-all duration-300 ease-in-out',
        'backdrop-blur-xl shadow-xl',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/95 before:via-white/90 before:to-grey-50/95',
        'after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:via-grey-50/30 after:to-grey-100/40',
        'border-r border-grey-200/60',
        isCollapsed ? 'w-16 md:w-16' : 'w-64',
        isMobile && 'w-64'
      )}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      style={{
        boxShadow: isCollapsed 
          ? '0 8px 24px -6px rgba(0, 0, 0, 0.08), 0 4px 8px -2px rgba(0, 0, 0, 0.04)'
          : '0 20px 40px -8px rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <div className={clsx(
          'h-20 flex items-center border-b transition-all duration-300',
          'border-grey-200/60 bg-white/40 backdrop-blur-sm',
          isCollapsed ? 'justify-center px-2' : 'px-6'
        )}>
          <div className="flex items-center overflow-hidden">
            <div className={clsx(
              'bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center shadow-lg transition-all duration-300',
              'group-hover:shadow-gold/50',
              isCollapsed ? 'w-10 h-10' : 'w-12 h-12 mr-3',
              'hover:scale-110 hover:rotate-3'
            )}>
              <svg
                className={clsx(
                  'text-white transition-all duration-300',
                  isCollapsed ? 'w-5 h-5' : 'w-7 h-7'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className={clsx(
              'transition-all duration-300',
              isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
            )}>
              <h1 className="text-lg font-bold text-grey-900 whitespace-nowrap">Zembil</h1>
              <p className="text-xs text-grey-500 capitalize whitespace-nowrap">{role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-grey-300/40 scrollbar-track-transparent hover:scrollbar-thumb-grey-400/60">
          {/* Main Items */}
          <ul className={clsx(
            'space-y-1 transition-all duration-300',
            isCollapsed ? 'px-2' : 'px-4'
          )}>
            {groupedItems.main?.map((item, index) => renderNavItem(item, 0, index))}
          </ul>

          {/* Product & Event Section */}
          {groupedItems['Product & Event'] && (
            <>
              {!isCollapsed && (
                <div className={clsx(
                  'mt-6 mb-3 transition-all duration-300 overflow-hidden',
                  'px-6 opacity-100'
                )}>
                  <div className="flex items-center">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-grey-300/60 to-transparent" />
                    <p className="text-xs font-semibold text-grey-400 uppercase tracking-wider px-3 whitespace-nowrap">
                      Product & Event
                    </p>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-grey-300/60 to-transparent" />
                  </div>
                </div>
              )}
              {isCollapsed && (
                <div className="mt-4 mb-2 mx-auto w-8 h-px bg-grey-300/40" />
              )}
              <ul className={clsx(
                'space-y-1 transition-all duration-300',
                isCollapsed ? 'px-2' : 'px-4'
              )}>
                {groupedItems['Product & Event'].map((item, index) => renderNavItem(item, 0, index))}
              </ul>
            </>
          )}

          {/* Account Section */}
          {groupedItems['Account'] && (
            <>
              {!isCollapsed && (
                <div className={clsx(
                  'mt-6 mb-3 transition-all duration-300 overflow-hidden',
                  'px-6 opacity-100'
                )}>
                  <div className="flex items-center">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-grey-300/60 to-transparent" />
                    <p className="text-xs font-semibold text-grey-400 uppercase tracking-wider px-3 whitespace-nowrap">
                      Account
                    </p>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-grey-300/60 to-transparent" />
                  </div>
                </div>
              )}
              {isCollapsed && (
                <div className="mt-4 mb-2 mx-auto w-8 h-px bg-grey-300/40" />
              )}
              <ul className={clsx(
                'space-y-1 transition-all duration-300',
                isCollapsed ? 'px-2' : 'px-4'
              )}>
                {groupedItems['Account'].map((item, index) => renderNavItem(item, 0, index))}
              </ul>
            </>
          )}

          {/* Logout */}
          <div className={clsx(
            'mt-4 transition-all duration-300',
            isCollapsed ? 'px-2' : 'px-4'
          )}>
            <button
              onClick={handleLogout}
              aria-label={isCollapsed ? 'Logout' : undefined}
              className={clsx(
                'w-full flex items-center rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden',
                'hover:shadow-md',
                'text-grey-700 hover:bg-red-50/90 hover:backdrop-blur-sm hover:text-red-600',
                'before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-50/60 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300',
                'hover:before:opacity-100',
                isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'
              )}
            >
              <ArrowLeftOnRectangleIcon className={clsx(
                'w-5 h-5 text-grey-500 transition-all duration-300 group-hover:text-red-600 group-hover:scale-110 group-hover:-rotate-12',
                isCollapsed ? '' : 'mr-3'
              )} />
              <span className={clsx(
                'transition-all duration-300 whitespace-nowrap',
                isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
              )}>
                Logout
              </span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className={clsx(
          'p-4 border-t border-grey-200/60 bg-white/40 backdrop-blur-sm transition-all duration-300',
          isCollapsed ? 'opacity-0 h-0 overflow-hidden p-0' : 'opacity-100'
        )}>
          <div className="text-center text-xs text-grey-400 whitespace-nowrap animate-fadeIn">
            © 2024 Zembil
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

