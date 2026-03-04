// =============================================================================
// Dashboard.tsx — Główny widok z siatką serwerów i statystykami
// Ścieżka: resources/scripts/components/theme/Dashboard.tsx
// =============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  Cpu,
  MemoryStick,
  HardDrive,
  Activity,
  Search,
  LayoutGrid,
  List,
  Filter,
  RefreshCw,
  Plus,
  TrendingUp,
  Clock,
  Zap,
} from 'lucide-react';
import ServerCard, { ServerData, ServerStatus } from './ServerCard';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

// ---- Types ----
interface DashboardStats {
  totalServers: number;
  onlineServers: number;
  totalCpu: number;
  totalRam: number;
  totalDisk: number;
}

// ---- Animated Background ----
const AnimatedBackground: React.FC = () => (
  <div className="predodactyl-bg">
    <div className="predodactyl-bg-orb predodactyl-bg-orb--purple" />
    <div className="predodactyl-bg-orb predodactyl-bg-orb--cyan" />
    <div className="predodactyl-bg-orb predodactyl-bg-orb--mixed" />
  </div>
);

// ---- Stat Card Component ----
const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
  trend?: number;
  index: number;
}> = ({ icon: Icon, label, value, subValue, color, trend, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="relative group"
  >
    <div
      className="relative rounded-xl p-4 overflow-hidden transition-all duration-300
                 hover:border-purple-500/20"
      style={{
        background: 'rgba(17, 17, 24, 0.5)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(108, 71, 255, 0.08)',
      }}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.07]
                   group-hover:opacity-[0.12] transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          transform: 'translate(30%, -30%)',
        }}
      />

      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
              trend >= 0
                ? 'text-green-400 bg-green-500/10'
                : 'text-red-400 bg-red-500/10'
            }`}
          >
            <TrendingUp
              size={11}
              style={{ transform: trend < 0 ? 'rotate(180deg)' : undefined }}
            />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {subValue && (
        <p className="text-[10px] text-gray-600 mt-1">{subValue}</p>
      )}
    </div>
  </motion.div>
);

// ---- Filter Tabs ----
const statusFilters: { id: string; label: string; color?: string }[] = [
  { id: 'all', label: 'Wszystkie' },
  { id: 'online', label: 'Online', color: '#22c55e' },
  { id: 'offline', label: 'Offline', color: '#ef4444' },
  { id: 'starting', label: 'Uruchamianie', color: '#f59e0b' },
];

// ---- Mock Data Generator ----
const generateMockHistory = (length: number, min: number, max: number): number[] => {
  const result: number[] = [];
  let current = min + Math.random() * (max - min);
  for (let i = 0; i < length; i++) {
    current += (Math.random() - 0.5) * (max - min) * 0.2;
    current = Math.max(min, Math.min(max, current));
    result.push(Math.round(current * 10) / 10);
  }
  return result;
};

const mockServers: ServerData[] = [
  {
    id: '1',
    name: 'Survival SMP',
    description: 'Główny serwer survival z modami',
    status: 'online',
    node: 'Node-01',
    ip: '192.168.1.10',
    port: 25565,
    cpu: { current: 45.2, limit: 200, history: generateMockHistory(20, 20, 80) },
    ram: { current: 3200, limit: 8192, history: generateMockHistory(20, 2000, 5000) },
    disk: { current: 12500, limit: 50000 },
    players: { current: 23, max: 50 },
    uptime: '3d 14h',
    egg: 'Paper 1.20.4',
  },
  {
    id: '2',
    name: 'Creative World',
    description: 'Serwer kreatywny z WorldEdit',
    status: 'online',
    node: 'Node-01',
    ip: '192.168.1.10',
    port: 25566,
    cpu: { current: 12.8, limit: 100, history: generateMockHistory(20, 5, 30) },
    ram: { current: 1400, limit: 4096, history: generateMockHistory(20, 800, 2000) },
    disk: { current: 8300, limit: 25000 },
    players: { current: 5, max: 20 },
    uptime: '7d 2h',
    egg: 'Paper 1.20.4',
  },
  {
    id: '3',
    name: 'Proxy BungeeCord',
    description: 'Główny proxy łączący serwery',
    status: 'online',
    node: 'Node-02',
    ip: '192.168.1.11',
    port: 25577,
    cpu: { current: 3.5, limit: 100, history: generateMockHistory(20, 1, 10) },
    ram: { current: 512, limit: 2048, history: generateMockHistory(20, 300, 800) },
    disk: { current: 250, limit: 5000 },
    players: { current: 28, max: 100 },
    uptime: '14d 6h',
    egg: 'Waterfall',
  },
  {
    id: '4',
    name: 'Modded ATM9',
    description: 'All The Mods 9 — modpack',
    status: 'starting',
    node: 'Node-03',
    ip: '192.168.1.12',
    port: 25565,
    cpu: { current: 85.0, limit: 400, history: generateMockHistory(20, 50, 100) },
    ram: { current: 10200, limit: 16384, history: generateMockHistory(20, 6000, 12000) },
    disk: { current: 45000, limit: 100000 },
    uptime: '0h',
    egg: 'Forge 1.20.1',
  },
  {
    id: '5',
    name: 'Discord Bot',
    description: 'Bot Discord na Node.js',
    status: 'offline',
    node: 'Node-01',
    ip: '192.168.1.10',
    port: 3000,
    cpu: { current: 0, limit: 100, history: generateMockHistory(20, 0, 5) },
    ram: { current: 0, limit: 1024, history: generateMockHistory(20, 0, 200) },
    disk: { current: 450, limit: 5000 },
    egg: 'Node.js 18',
  },
  {
    id: '6',
    name: 'Web Server',
    description: 'Hosting strony internetowej',
    status: 'online',
    node: 'Node-02',
    ip: '192.168.1.11',
    port: 8080,
    cpu: { current: 8.3, limit: 100, history: generateMockHistory(20, 3, 15) },
    ram: { current: 380, limit: 2048, history: generateMockHistory(20, 200, 600) },
    disk: { current: 1200, limit: 10000 },
    uptime: '30d 0h',
    egg: 'Nginx',
  },
];

// ---- Main Dashboard Component ----
const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [servers, setServers] = useState<ServerData[]>(mockServers);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Derived sidebar width
  const sidebarWidth = sidebarCollapsed ? 72 : 240;

  // Filtered servers
  const filteredServers = useMemo(() => {
    let result = servers;
    if (filter !== 'all') {
      result = result.filter((s) => s.status === filter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.node.toLowerCase().includes(q) ||
          s.egg?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [servers, filter, searchQuery]);

  // Stats
  const stats: DashboardStats = useMemo(() => {
    const online = servers.filter((s) => s.status === 'online').length;
    return {
      totalServers: servers.length,
      onlineServers: online,
      totalCpu: Math.round(
        servers.reduce((sum, s) => sum + s.cpu.current, 0) * 10
      ) / 10,
      totalRam: Math.round(
        servers.reduce((sum, s) => sum + s.ram.current, 0)
      ),
      totalDisk: Math.round(
        servers.reduce((sum, s) => sum + s.disk.current, 0)
      ),
    };
  }, [servers]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setServers((prev) =>
        prev.map((server) => {
          if (server.status !== 'online') return server;
          const cpuChange = (Math.random() - 0.5) * 10;
          const ramChange = (Math.random() - 0.5) * 200;
          const newCpu = Math.max(0, Math.min(server.cpu.limit, server.cpu.current + cpuChange));
          const newRam = Math.max(0, Math.min(server.ram.limit, server.ram.current + ramChange));
          return {
            ...server,
            cpu: {
              ...server.cpu,
              current: Math.round(newCpu * 10) / 10,
              history: [...server.cpu.history.slice(1), newCpu],
            },
            ram: {
              ...server.ram,
              current: Math.round(newRam),
              history: [...server.ram.history.slice(1), newRam],
            },
          };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div
      className="min-h-screen relative"
      style={{ background: '#0a0a0f' }}
    >
      <AnimatedBackground />

      {/* Sidebar */}
      <Sidebar
        activePath="/"
        isAdmin={true}
        onNavigate={(path) => console.log('Navigate:', path)}
      />

      {/* Navbar */}
      <Navbar
        sidebarWidth={sidebarWidth}
        notifications={[
          {
            id: '1',
            title: 'Serwer uruchomiony',
            message: 'Modded ATM9 został pomyślnie uruchomiony',
            time: '2 minuty temu',
            read: false,
            type: 'success',
          },
          {
            id: '2',
            title: 'Wysokie zużycie RAM',
            message: 'Survival SMP przekroczył 80% limitu RAM',
            time: '15 minut temu',
            read: false,
            type: 'warning',
          },
          {
            id: '3',
            title: 'Backup zakończony',
            message: 'Automatyczny backup wszystkich serwerów',
            time: '1 godzinę temu',
            read: true,
            type: 'info',
          },
        ]}
      />

      {/* Main Content */}
      <main
        className="relative z-10 pt-16 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-white mb-1">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Przegląd Twoich serwerów i zasobów
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Server}
              label="Serwery"
              value={`${stats.onlineServers}/${stats.totalServers}`}
              subValue="aktywnych / łącznie"
              color="#6c47ff"
              trend={5}
              index={0}
            />
            <StatCard
              icon={Cpu}
              label="CPU łącznie"
              value={`${stats.totalCpu}%`}
              subValue="wykorzystanie procesorów"
              color="#00d4ff"
              trend={-2}
              index={1}
            />
            <StatCard
              icon={MemoryStick}
              label="RAM łącznie"
              value={`${(stats.totalRam / 1024).toFixed(1)} GB`}
              subValue="wykorzystanie pamięci"
              color="#8b6fff"
              trend={8}
              index={2}
            />
            <StatCard
              icon={HardDrive}
              label="Dysk łącznie"
              value={`${(stats.totalDisk / 1024).toFixed(1)} GB`}
              subValue="zajęte miejsce"
              color="#00d4ff"
              index={3}
            />
          </div>

          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between
                       gap-4 mb-6"
          >
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03]
                           border border-white/5">
              {statusFilters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                    transition-all duration-200
                    ${filter === f.id
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
                    }
                  `}
                >
                  {f.color && (
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: f.color }}
                    />
                  )}
                  {f.label}
                  {f.id === 'all' && (
                    <span className="ml-1 text-gray-600">{servers.length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Szukaj..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 text-xs rounded-lg bg-white/[0.03] border border-white/5
                             text-gray-300 placeholder-gray-600 outline-none focus:border-purple-500/30
                             transition-all w-44 focus:w-56"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center border border-white/5 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-purple-600/20 text-purple-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-purple-600/20 text-purple-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <List size={14} />
                </button>
              </div>

              {/* Refresh */}
              <motion.button
                onClick={handleRefresh}
                animate={isRefreshing ? { rotate: 360 } : {}}
                transition={{ duration: 1, ease: 'linear' }}
                className="w-9 h-9 rounded-lg flex items-center justify-center
                           text-gray-500 hover:text-gray-300 hover:bg-white/5
                           border border-white/5 transition-colors"
              >
                <RefreshCw size={14} />
              </motion.button>
            </div>
          </motion.div>

          {/* Server Grid */}
          <AnimatePresence exitBeforeEnter>
            {filteredServers.length > 0 ? (
              <motion.div
                key={filter + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
                    : 'flex flex-col gap-3'
                }
              >
                {filteredServers.map((server, i) => (
                  <ServerCard
                    key={server.id}
                    server={server}
                    index={i}
                    onClick={(id) => console.log('Open server:', id)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  <Server size={28} className="text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-400 mb-1">
                  Brak serwerów
                </h3>
                <p className="text-sm text-gray-600 max-w-sm">
                  {searchQuery
                    ? `Nie znaleziono serwerów pasujących do "${searchQuery}"`
                    : 'Brak serwerów w wybranej kategorii'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex items-center justify-between text-[11px] text-gray-600"
          >
            <div className="flex items-center gap-1.5">
              <Activity size={11} />
              <span>Dane odświeżane co 3s</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap size={11} className="text-purple-500" />
              <span>Predodactyl Theme v1.0</span>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
