// =============================================================================
// ServerCard.tsx — Karta serwera z wykresem CPU/RAM w czasie rzeczywistym
// Ścieżka: resources/scripts/components/theme/ServerCard.tsx
// =============================================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  WifiOff,
  Play,
  Square,
  RotateCcw,
  MoreVertical,
  Globe,
  Users,
  Clock,
} from 'lucide-react';

// ---- Types ----
export type ServerStatus = 'online' | 'offline' | 'starting' | 'stopping' | 'installing';

export interface ServerData {
  id: string;
  name: string;
  description?: string;
  status: ServerStatus;
  node: string;
  ip: string;
  port: number;
  cpu: {
    current: number;   // percent 0-100
    limit: number;      // percent (e.g., 200 = 2 cores)
    history: number[];  // last N data points
  };
  ram: {
    current: number;    // MB
    limit: number;      // MB
    history: number[];
  };
  disk: {
    current: number;    // MB
    limit: number;      // MB
  };
  players?: {
    current: number;
    max: number;
  };
  uptime?: string;
  egg?: string;
}

interface ServerCardProps {
  server: ServerData;
  onClick?: (serverId: string) => void;
  index?: number;
}

// ---- Status Config ----
const statusConfig: Record<ServerStatus, { color: string; glow: string; label: string }> = {
  online:     { color: '#22c55e', glow: 'rgba(34, 197, 94, 0.3)',  label: 'Online' },
  offline:    { color: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)',  label: 'Offline' },
  starting:   { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)', label: 'Uruchamianie' },
  stopping:   { color: '#f97316', glow: 'rgba(249, 115, 22, 0.3)', label: 'Zatrzymywanie' },
  installing: { color: '#6c47ff', glow: 'rgba(108, 71, 255, 0.3)', label: 'Instalacja' },
};

// ---- Mini Sparkline Chart ----
const SparklineChart: React.FC<{
  data: number[];
  color: string;
  height?: number;
  maxValue?: number;
}> = ({ data, color, height = 40, maxValue = 100 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const w = rect.width;
    const h = rect.height;
    const padding = 2;
    const effectiveH = h - padding * 2;
    const step = w / (data.length - 1);

    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, color + '30');
    gradient.addColorStop(1, color + '00');

    // Draw filled area
    ctx.beginPath();
    ctx.moveTo(0, h);
    data.forEach((val, i) => {
      const x = i * step;
      const y = padding + effectiveH - (Math.min(val, maxValue) / maxValue) * effectiveH;
      if (i === 0) {
        ctx.lineTo(x, y);
      } else {
        // Smooth curve
        const prevX = (i - 1) * step;
        const prevY =
          padding +
          effectiveH -
          (Math.min(data[i - 1], maxValue) / maxValue) * effectiveH;
        const cpX = (prevX + x) / 2;
        ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
      }
    });
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = i * step;
      const y = padding + effectiveH - (Math.min(val, maxValue) / maxValue) * effectiveH;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const prevX = (i - 1) * step;
        const prevY =
          padding +
          effectiveH -
          (Math.min(data[i - 1], maxValue) / maxValue) * effectiveH;
        const cpX = (prevX + x) / 2;
        ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
      }
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw end dot
    const lastVal = data[data.length - 1];
    const lastX = (data.length - 1) * step;
    const lastY =
      padding + effectiveH - (Math.min(lastVal, maxValue) / maxValue) * effectiveH;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fillStyle = color + '30';
    ctx.fill();
  }, [data, color, height, maxValue]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height }}
      className="block"
    />
  );
};

// ---- Resource Bar ----
const ResourceBar: React.FC<{
  icon: React.ElementType;
  label: string;
  current: number;
  limit: number;
  unit: string;
  color: string;
  history?: number[];
  historyMax?: number;
}> = ({ icon: Icon, label, current, limit, unit, color, history, historyMax }) => {
  const percentage = Math.min((current / limit) * 100, 100);
  const isHigh = percentage > 80;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon size={12} style={{ color }} />
          <span className="text-[11px] font-medium text-gray-400">{label}</span>
        </div>
        <span className="text-[11px] font-mono text-gray-300">
          {current.toFixed(1)}{unit}
          <span className="text-gray-600"> / {limit}{unit}</span>
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full relative"
          style={{
            background: isHigh
              ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
              : `linear-gradient(90deg, ${color}, ${color}cc)`,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>

      {/* Sparkline */}
      {history && history.length > 1 && (
        <SparklineChart
          data={history}
          color={color}
          height={32}
          maxValue={historyMax || limit}
        />
      )}
    </div>
  );
};

// ---- Main ServerCard Component ----
const ServerCard: React.FC<ServerCardProps> = ({ server, onClick, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const status = statusConfig[server.status];

  // Card entrance animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick?.(server.id)}
      className="relative cursor-pointer group"
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-[1px] rounded-[15px] opacity-0 group-hover:opacity-100
                   transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${status.color}20, rgba(108, 71, 255, 0.1), rgba(0, 212, 255, 0.08))`,
          filter: 'blur(1px)',
        }}
      />

      {/* Main Card */}
      <div
        className="relative rounded-[14px] p-5 overflow-hidden transition-all duration-300"
        style={{
          background: isHovered
            ? 'rgba(17, 17, 24, 0.8)'
            : 'rgba(17, 17, 24, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${
            isHovered
              ? 'rgba(108, 71, 255, 0.25)'
              : 'rgba(108, 71, 255, 0.1)'
          }`,
          boxShadow: isHovered
            ? `0 8px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${status.glow}`
            : '0 4px 24px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Top Row: Status + Actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {/* Status dot with pulse */}
            <div className="relative">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: status.color }}
              />
              {server.status === 'online' && (
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    background: status.color,
                    opacity: 0.4,
                    animationDuration: '2s',
                  }}
                />
              )}
            </div>
            <span
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: status.color }}
            >
              {status.label}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {server.status === 'offline' ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-7 h-7 rounded-lg flex items-center justify-center
                           bg-green-500/10 text-green-400 hover:bg-green-500/20
                           transition-colors"
                onClick={(e) => { e.stopPropagation(); }}
                title="Uruchom"
              >
                <Play size={13} fill="currentColor" />
              </motion.button>
            ) : server.status === 'online' ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center
                             bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20
                             transition-colors"
                  onClick={(e) => { e.stopPropagation(); }}
                  title="Restart"
                >
                  <RotateCcw size={13} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center
                             bg-red-500/10 text-red-400 hover:bg-red-500/20
                             transition-colors"
                  onClick={(e) => { e.stopPropagation(); }}
                  title="Zatrzymaj"
                >
                  <Square size={13} fill="currentColor" />
                </motion.button>
              </>
            ) : null}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 rounded-lg flex items-center justify-center
                         text-gray-500 hover:text-gray-300 hover:bg-white/5
                         transition-colors"
              onClick={(e) => { e.stopPropagation(); }}
            >
              <MoreVertical size={13} />
            </motion.button>
          </div>
        </div>

        {/* Server Name & Description */}
        <h3 className="text-base font-bold text-white mb-1 leading-snug line-clamp-1">
          {server.name}
        </h3>
        {server.description && (
          <p className="text-xs text-gray-500 line-clamp-1 mb-3">
            {server.description}
          </p>
        )}

        {/* Info Row */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <Globe size={11} />
            <span className="font-mono">
              {server.ip}:{server.port}
            </span>
          </div>
          {server.players && (
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <Users size={11} />
              <span>
                {server.players.current}/{server.players.max}
              </span>
            </div>
          )}
          {server.uptime && (
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <Clock size={11} />
              <span>{server.uptime}</span>
            </div>
          )}
        </div>

        {/* Resource Meters */}
        <div className="space-y-3">
          <ResourceBar
            icon={Cpu}
            label="CPU"
            current={server.cpu.current}
            limit={server.cpu.limit}
            unit="%"
            color="#6c47ff"
            history={server.cpu.history}
            historyMax={server.cpu.limit}
          />
          <ResourceBar
            icon={MemoryStick}
            label="RAM"
            current={server.ram.current}
            limit={server.ram.limit}
            unit=" MB"
            color="#00d4ff"
            history={server.ram.history}
            historyMax={server.ram.limit}
          />
          <ResourceBar
            icon={HardDrive}
            label="Dysk"
            current={server.disk.current}
            limit={server.disk.limit}
            unit=" MB"
            color="#8b6fff"
          />
        </div>

        {/* Bottom Network Status */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            {server.status === 'online' ? (
              <Wifi size={11} className="text-green-400" />
            ) : (
              <WifiOff size={11} className="text-gray-600" />
            )}
            <span className="font-mono">{server.node}</span>
          </div>
          {server.egg && (
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full
                           bg-purple-600/10 text-purple-400 border border-purple-600/20">
              {server.egg}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ServerCard;
export { SparklineChart, ResourceBar };
