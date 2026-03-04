// =============================================================================
// Sidebar.tsx — Nawigacja boczna z animacjami, ikonami i tooltipami
// Ścieżka: resources/scripts/components/theme/Sidebar.tsx
// =============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Server,
  Terminal,
  Database,
  Globe,
  Users,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LogOut,
  Cpu,
} from 'lucide-react';

// ---- Types ----
interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
  section?: string;
}

interface SidebarProps {
  activePath?: string;
  onNavigate?: (path: string) => void;
  isAdmin?: boolean;
}

// ---- Navigation Items ----
const mainNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/', section: 'GŁÓWNE' },
  { id: 'servers', label: 'Serwery', icon: Server, path: '/servers', section: 'GŁÓWNE' },
  { id: 'console', label: 'Konsola', icon: Terminal, path: '/console' },
  { id: 'databases', label: 'Bazy danych', icon: Database, path: '/databases' },
  { id: 'network', label: 'Sieć', icon: Globe, path: '/network' },
  { id: 'resources', label: 'Zasoby', icon: Cpu, path: '/resources' },
];

const adminNavItems: NavItem[] = [
  { id: 'users', label: 'Użytkownicy', icon: Users, path: '/admin/users', section: 'ADMIN' },
  { id: 'security', label: 'Bezpieczeństwo', icon: Shield, path: '/admin/security' },
  { id: 'settings', label: 'Ustawienia', icon: Settings, path: '/admin/settings' },
];

// ---- Sidebar Nav Item Component ----
const SidebarNavItem: React.FC<{
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}> = ({ item, isActive, isCollapsed, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const Icon = item.icon;

  return (
    <div className="relative">
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
          transition-all duration-250 relative group
          ${isActive
            ? 'bg-gradient-to-r from-purple-600/20 to-cyan-500/10 text-white'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
          }
        `}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Active indicator bar */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
            style={{
              background: 'linear-gradient(180deg, #6c47ff 0%, #00d4ff 100%)',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}

        {/* Icon */}
        <div
          className={`
            flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
            transition-all duration-250
            ${isActive
              ? 'bg-purple-600/20 text-purple-400 shadow-lg shadow-purple-600/10'
              : 'text-gray-500 group-hover:text-gray-300 group-hover:bg-white/5'
            }
          `}
        >
          <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
        </div>

        {/* Label */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="font-medium text-sm whitespace-nowrap overflow-hidden"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Badge */}
        {item.badge && !isCollapsed && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full
                       bg-purple-600/20 text-purple-400 border border-purple-600/30"
          >
            {item.badge}
          </motion.span>
        )}

        {/* Active glow */}
        {isActive && (
          <div className="absolute inset-0 rounded-xl bg-purple-600/5 pointer-events-none" />
        )}
      </motion.button>

      {/* Tooltip (only when collapsed) */}
      <AnimatePresence>
        {isCollapsed && showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className="sidebar-tooltip"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---- Section Header ----
const SectionHeader: React.FC<{ label: string; isCollapsed: boolean }> = ({
  label,
  isCollapsed,
}) => (
  <AnimatePresence>
    {!isCollapsed && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="px-4 pt-6 pb-2"
      >
        <span className="text-[10px] font-bold tracking-[0.15em] text-gray-600 uppercase">
          {label}
        </span>
      </motion.div>
    )}
  </AnimatePresence>
);

// ---- Main Sidebar Component ----
const Sidebar: React.FC<SidebarProps> = ({
  activePath = '/',
  onNavigate,
  isAdmin = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavigate = (path: string) => {
    onNavigate?.(path);
  };

  // Group items by section
  const renderNavItems = (items: NavItem[]) => {
    let currentSection = '';
    return items.map((item) => {
      const showSection = item.section && item.section !== currentSection;
      if (item.section) currentSection = item.section;

      return (
        <React.Fragment key={item.id}>
          {showSection && (
            <SectionHeader label={item.section!} isCollapsed={isCollapsed} />
          )}
          <SidebarNavItem
            item={item}
            isActive={activePath === item.path}
            isCollapsed={isCollapsed}
            onClick={() => handleNavigate(item.path)}
          />
        </React.Fragment>
      );
    });
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col"
      style={{
        background: 'rgba(14, 14, 20, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(108, 71, 255, 0.08)',
      }}
    >
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
        <motion.div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #6c47ff 0%, #00d4ff 100%)',
          }}
          whileHover={{ scale: 1.05, rotate: 5 }}
        >
          <Server size={22} className="text-white" strokeWidth={2.2} />
        </motion.div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden"
            >
              <h1 className="text-base font-bold gradient-text leading-tight">
                Predodactyl
              </h1>
              <p className="text-[10px] text-gray-500 font-medium">Game Panel</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {renderNavItems(mainNavItems)}
        {isAdmin && renderNavItems(adminNavItems)}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/5 pt-3">
        <SidebarNavItem
          item={{ id: 'help', label: 'Pomoc', icon: HelpCircle, path: '/help' }}
          isActive={activePath === '/help'}
          isCollapsed={isCollapsed}
          onClick={() => handleNavigate('/help')}
        />
        <SidebarNavItem
          item={{ id: 'logout', label: 'Wyloguj', icon: LogOut, path: '/logout' }}
          isActive={false}
          isCollapsed={isCollapsed}
          onClick={() => handleNavigate('/logout')}
        />

        {/* Collapse Toggle */}
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 mt-2
                     rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5
                     transition-all duration-200"
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </motion.div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-xs font-medium whitespace-nowrap overflow-hidden"
              >
                Zwiń panel
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
