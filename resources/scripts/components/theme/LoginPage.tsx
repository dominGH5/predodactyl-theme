// =============================================================================
// LoginPage.tsx — Strona logowania z animowanym tłem i glassmorphism
// Ścieżka: resources/scripts/components/theme/LoginPage.tsx
// =============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Github,
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

// ---- Types ----
interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

interface LoginPageProps {
  onLogin?: (data: LoginFormData) => void;
  error?: string;
  loading?: boolean;
  panelName?: string;
}

// ---- Animated Particle ----
const Particle: React.FC<{ index: number }> = ({ index }) => {
  const size = 2 + Math.random() * 3;
  const duration = 15 + Math.random() * 25;
  const delay = Math.random() * -20;
  const startX = Math.random() * 100;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${startX}%`,
        background:
          index % 3 === 0
            ? 'rgba(108, 71, 255, 0.5)'
            : index % 3 === 1
            ? 'rgba(0, 212, 255, 0.4)'
            : 'rgba(139, 111, 255, 0.3)',
      }}
      initial={{ bottom: '-5%', opacity: 0 }}
      animate={{
        bottom: '105%',
        opacity: [0, 0.8, 0.8, 0],
        x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 150],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

// ---- Animated Grid Background ----
const GridBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Grid pattern */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(108, 71, 255, 0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(108, 71, 255, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />

    {/* Radial gradients */}
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(108, 71, 255, 0.12) 0%, transparent 70%)',
        top: '10%',
        left: '20%',
        filter: 'blur(60px)',
      }}
      animate={{
        x: [0, 50, -30, 0],
        y: [0, -40, 20, 0],
        scale: [1, 1.1, 0.95, 1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute w-[500px] h-[500px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 70%)',
        bottom: '10%',
        right: '15%',
        filter: 'blur(60px)',
      }}
      animate={{
        x: [0, -40, 30, 0],
        y: [0, 30, -50, 0],
        scale: [1, 0.9, 1.1, 1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Floating particles */}
    {Array.from({ length: 30 }).map((_, i) => (
      <Particle key={i} index={i} />
    ))}
  </div>
);

// ---- Main LoginPage Component ----
const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  error: externalError,
  loading: externalLoading,
  panelName = 'Predodactyl',
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Sync external state
  useEffect(() => {
    if (externalError) setError(externalError);
  }, [externalError]);

  const isLoading = externalLoading || isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim()) {
      setError('Wprowadź adres e-mail');
      return;
    }
    if (!formData.password) {
      setError('Wprowadź hasło');
      return;
    }

    setIsSubmitting(true);
    try {
      onLogin?.(formData);
    } catch (err) {
      setError('Wystąpił błąd podczas logowania');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#0a0a0f' }}
    >
      <GridBackground />

      {/* Login Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Outer glow */}
        <div
          className="absolute -inset-1 rounded-[22px] opacity-50 blur-xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(108, 71, 255, 0.15), rgba(0, 212, 255, 0.08))',
          }}
        />

        {/* Card */}
        <div
          className="relative rounded-[20px] overflow-hidden"
          style={{
            background: 'rgba(17, 17, 24, 0.7)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(108, 71, 255, 0.12)',
            boxShadow: '0 8px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Top gradient line */}
          <div
            className="h-[2px] w-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #6c47ff, #00d4ff, transparent)',
            }}
          />

          <div className="px-8 py-10">
            {/* Logo & Title */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <motion.div
                className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background: 'linear-gradient(135deg, #6c47ff 0%, #00d4ff 100%)',
                  boxShadow: '0 8px 30px rgba(108, 71, 255, 0.3)',
                }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Server size={30} className="text-white" strokeWidth={2} />
              </motion.div>
              <h1 className="text-2xl font-bold gradient-text mb-1">
                {panelName}
              </h1>
              <p className="text-sm text-gray-500">
                Zaloguj się do panelu zarządzania
              </p>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-5"
                >
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl
                                bg-red-500/10 border border-red-500/20">
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-xs font-medium text-gray-400 mb-2 ml-1">
                  Adres e-mail
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                      focusedField === 'email' ? 'text-purple-400' : 'text-gray-600'
                    }`}
                  />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm
                             outline-none transition-all duration-250
                             disabled:opacity-50"
                    style={{
                      background: '#0e0e15',
                      border: `1px solid ${
                        focusedField === 'email'
                          ? 'rgba(108, 71, 255, 0.5)'
                          : 'rgba(108, 71, 255, 0.1)'
                      }`,
                      color: '#e4e4ed',
                      boxShadow:
                        focusedField === 'email'
                          ? '0 0 0 3px rgba(108, 71, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.3)'
                          : '0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label className="text-xs font-medium text-gray-400">
                    Hasło
                  </label>
                  <a
                    href="/auth/password"
                    className="text-[11px] text-purple-400 hover:text-purple-300
                             transition-colors"
                  >
                    Zapomniałeś hasła?
                  </a>
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                      focusedField === 'password' ? 'text-purple-400' : 'text-gray-600'
                    }`}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    disabled={isLoading}
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm
                             outline-none transition-all duration-250
                             disabled:opacity-50"
                    style={{
                      background: '#0e0e15',
                      border: `1px solid ${
                        focusedField === 'password'
                          ? 'rgba(108, 71, 255, 0.5)'
                          : 'rgba(108, 71, 255, 0.1)'
                      }`,
                      color: '#e4e4ed',
                      boxShadow:
                        focusedField === 'password'
                          ? '0 0 0 3px rgba(108, 71, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.3)'
                          : '0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500
                             hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </motion.div>

              {/* Remember Me */}
              <motion.div variants={itemVariants} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateField('remember', !formData.remember)}
                  className={`
                    w-5 h-5 rounded-md flex items-center justify-center
                    transition-all duration-200 border
                    ${formData.remember
                      ? 'bg-purple-600 border-purple-500'
                      : 'bg-transparent border-white/10 hover:border-purple-500/30'
                    }
                  `}
                >
                  {formData.remember && (
                    <CheckCircle size={12} className="text-white" />
                  )}
                </button>
                <span className="text-xs text-gray-400">
                  Zapamiętaj mnie na tym urządzeniu
                </span>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full py-3.5 rounded-xl font-semibold text-sm
                           text-white overflow-hidden group disabled:opacity-70"
                  style={{
                    background: 'linear-gradient(135deg, #6c47ff 0%, #5535cc 100%)',
                    boxShadow: '0 4px 20px rgba(108, 71, 255, 0.3)',
                  }}
                  whileHover={{ scale: 1.01, boxShadow: '0 6px 30px rgba(108, 71, 255, 0.4)' }}
                  whileTap={{ scale: 0.99 }}
                >
                  {/* Hover gradient overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #8b6fff 0%, #6c47ff 100%)',
                    }}
                  />

                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: 'easeInOut',
                    }}
                  />

                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Logowanie...
                      </>
                    ) : (
                      <>
                        Zaloguj się
                        <ArrowRight size={16} />
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-[11px] text-gray-600" style={{ background: '#111118' }}>
                  lub kontynuuj z
                </span>
              </div>
            </motion.div>

            {/* OAuth Buttons */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl
                         text-sm font-medium text-gray-300 transition-all duration-200"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.borderColor = 'rgba(108, 71, 255, 0.2)';
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.03)';
                }}
              >
                <Github size={16} />
                GitHub
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl
                         text-sm font-medium text-gray-300 transition-all duration-200"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.borderColor = 'rgba(108, 71, 255, 0.2)';
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.03)';
                }}
              >
                <Shield size={16} />
                Discord
              </motion.button>
            </motion.div>
          </div>

          {/* Footer */}
          <div
            className="px-8 py-4 text-center border-t border-white/5"
            style={{ background: 'rgba(10, 10, 15, 0.4)' }}
          >
            <p className="text-[11px] text-gray-600">
              Powered by{' '}
              <span className="gradient-text font-semibold">Predodactyl Theme</span>
              {' '}&bull; Pterodactyl Panel v1.11
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
