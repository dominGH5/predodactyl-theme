// =============================================================================
// Navbar.tsx — Górny pasek nawigacyjny z profilem użytkownika
// Ścieżka: resources/scripts/components/theme/Navbar.tsx
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
  Shield,
  ExternalLink,
} from 'lucide-react';

// ---- Types ----
interface UserData {
  name: string;
  email: string;
  avatarUrl?: string;
  isAdmin?: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}

interface NavbarProps {
  user?: UserData;
  notifications?: Notification[];
  sidebarWidth?: number;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
}

// ---- Notification Type Colors ----
const notificationColors: Record<string, string> = {
  info: '#00d4ff',
  warning: '#f59e0b',
  error: '#ef4444',
  success: '#22c55e',
};

// ---- Avatar Component ----
const UserAvatar: React.FC<{ user: UserData; size?: number }> = ({
  user,
  size = 36,
}) => {
  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white text-xs"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #6c47ff 0%, #00d4ff 100%)',
      }}
    >
      {initials}
    </div>
  );
};

// ---- Navbar Component ----
const Navbar: React.FC<NavbarProps> = ({
  user = { name: 'Admin', email: 'admin@panel.io', isAdmin: true },
  notifications = [],
  sidebarWidth = 240,
  onLogout,
  onSearch,
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  // Dropdown animation
  const dropdownVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.96 },
  };

  return (
    <header
      className="fixed top-0 right-0 h-16 z-30 flex items-center justify-between px-6"
      style={{
        left: sidebarWidth,
        background: 'rgba(14, 14, 20, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(108, 71, 255, 0.06)',
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.4)',
        transition: 'left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-lg">
        <motion.div
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl
            border transition-all duration-250
            ${searchFocused
              ? 'border-purple-500/40 bg-white/5 shadow-lg shadow-purple-600/5'
              : 'border-white/5 bg-white/[0.02]'
            }
          `}
          animate={{ width: searchFocused ? '100%' : '80%' }}
          transition={{ duration: 0.3 }}
        >
          <Search
            size={16}
            className={`flex-shrink-0 transition-colors duration-200 ${
              searchFocused ? 'text-purple-400' : 'text-gray-500'
            }`}
          />
          <input
            type="text"
            placeholder="Szukaj serwerów, ustawień..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-transparent border-none outline-none text-sm
                       text-gray-200 placeholder-gray-600"
          />
          <AnimatePresence>
            {searchFocused && (
              <motion.kbd
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px]
                           font-mono text-gray-500 bg-white/5 rounded border border-white/10"
              >
                ESC
              </motion.kbd>
            )}
          </AnimatePresence>
        </motion.div>
      </form>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <motion.button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center
                       text-gray-400 hover:text-white hover:bg-white/5
                       transition-all duration-200"
            whileTap={{ scale: 0.92 }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-[9px]
                           font-bold flex items-center justify-center text-white"
                style={{ background: '#6c47ff' }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </motion.button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-14 w-80 rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(17, 17, 24, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(108, 71, 255, 0.15)',
                  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div className="px-4 py-3 border-b border-white/5">
                  <h3 className="text-sm font-semibold text-white">Powiadomienia</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {unreadCount} nieprzeczytanych
                  </p>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      Brak powiadomień
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 border-b border-white/5 hover:bg-white/5
                                    transition-colors cursor-pointer ${
                                      !notif.read ? 'bg-purple-600/5' : ''
                                    }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                            style={{
                              background: notificationColors[notif.type] || '#6c47ff',
                            }}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-200">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-white/5 mx-1" />

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <motion.button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl
                       hover:bg-white/5 transition-all duration-200"
            whileTap={{ scale: 0.97 }}
          >
            <UserAvatar user={user} size={32} />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-200 leading-tight">
                {user.name}
              </p>
              <p className="text-[10px] text-gray-500">{user.email}</p>
            </div>
            <motion.div
              animate={{ rotate: showProfile ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} className="text-gray-500" />
            </motion.div>
          </motion.button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfile && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-14 w-56 rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(17, 17, 24, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(108, 71, 255, 0.15)',
                  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* User Header */}
                <div className="px-4 py-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} size={40} />
                    <div>
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  {[
                    { icon: User, label: 'Profil', action: '/profile' },
                    { icon: Settings, label: 'Ustawienia', action: '/settings' },
                    ...(user.isAdmin
                      ? [{ icon: Shield, label: 'Panel Admin', action: '/admin' }]
                      : []),
                    { icon: ExternalLink, label: 'Dokumentacja', action: '/docs' },
                  ].map(({ icon: Icon, label, action }) => (
                    <button
                      key={label}
                      className="w-full flex items-center gap-3 px-4 py-2.5
                                 text-sm text-gray-300 hover:text-white hover:bg-white/5
                                 transition-all duration-150"
                    >
                      <Icon size={16} className="text-gray-500" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Logout */}
                <div className="border-t border-white/5 py-1">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5
                               text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5
                               transition-all duration-150"
                  >
                    <LogOut size={16} />
                    Wyloguj się
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
