import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  PaintBrushIcon,
  ArrowLeftIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  SwatchIcon,
  CheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const THEMES = [
  { 
    id: 'light', 
    name: 'Light Mode', 
    description: 'Classic bright theme',
    icon: SunIcon,
    gradient: 'from-yellow-400 to-orange-500',
    bgPreview: 'bg-white',
    textPreview: 'text-gray-900',
  },
  { 
    id: 'dark', 
    name: 'Dark Mode', 
    description: 'Easy on the eyes',
    icon: MoonIcon,
    gradient: 'from-indigo-500 to-purple-600',
    bgPreview: 'bg-gray-900',
    textPreview: 'text-white',
  },
  { 
    id: 'auto', 
    name: 'Auto', 
    description: 'Matches system',
    icon: ComputerDesktopIcon,
    gradient: 'from-blue-500 to-cyan-600',
    bgPreview: 'bg-gradient-to-br from-white to-gray-100',
    textPreview: 'text-gray-900',
  },
];

const ACCENT_COLORS = [
  { id: 'gold', name: 'Gold', hex: '#D4AF37', gradient: 'from-yellow-500 to-amber-600' },
  { id: 'purple', name: 'Purple', hex: '#9333EA', gradient: 'from-purple-500 to-purple-600' },
  { id: 'blue', name: 'Blue', hex: '#3B82F6', gradient: 'from-blue-500 to-blue-600' },
  { id: 'green', name: 'Green', hex: '#10B981', gradient: 'from-green-500 to-emerald-600' },
  { id: 'pink', name: 'Pink', hex: '#EC4899', gradient: 'from-pink-500 to-rose-600' },
  { id: 'orange', name: 'Orange', hex: '#F97316', gradient: 'from-orange-500 to-red-600' },
];

const AppearancePage = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [selectedAccent, setSelectedAccent] = useState('gold');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    toast.success(`${THEMES.find(t => t.id === themeId)?.name} enabled`);
  };

  const handleAccentChange = (accentId: string) => {
    setSelectedAccent(accentId);
    toast.success(`${ACCENT_COLORS.find(c => c.id === accentId)?.name} accent applied`);
  };

  return (
    <div className="min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-rose-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate('/profile/settings')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-xl">
                <PaintBrushIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Appearance
                </h1>
                <p className="text-sm text-gray-600">Customize your visual experience</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <SunIcon className="w-5 h-5 text-gray-700" />
                Theme
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {THEMES.map((theme, idx) => {
                  const ThemeIcon = theme.icon;
                  const isSelected = selectedTheme === theme.id;

                  return (
                    <motion.button
                      key={theme.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleThemeChange(theme.id)}
                      className={clsx(
                        'relative p-5 rounded-2xl border-2 transition-all duration-300 text-left',
                        isSelected
                          ? `border-transparent bg-gradient-to-br ${theme.gradient} text-white shadow-xl`
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <CheckCircleIcon className="w-6 h-6 text-white" />
                        </div>
                      )}
                      
                      <ThemeIcon className={clsx('w-8 h-8 mb-3', isSelected ? 'text-white' : 'text-gray-600')} />
                      <h4 className={clsx('font-bold text-base mb-1', isSelected ? 'text-white' : 'text-gray-900')}>
                        {theme.name}
                      </h4>
                      <p className={clsx('text-xs', isSelected ? 'text-white/80' : 'text-gray-500')}>
                        {theme.description}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Accent Color */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <SwatchIcon className="w-5 h-5 text-gray-700" />
                Accent Color
              </h3>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {ACCENT_COLORS.map((color, idx) => {
                  const isSelected = selectedAccent === color.id;

                  return (
                    <motion.button
                      key={color.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05, type: 'spring' }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAccentChange(color.id)}
                      className="relative aspect-square rounded-2xl overflow-hidden"
                    >
                      <div className={`w-full h-full bg-gradient-to-br ${color.gradient} flex items-center justify-center`}>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring' }}
                          >
                            <CheckIcon className="w-8 h-8 text-white drop-shadow-lg" />
                          </motion.div>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-gray-700 mt-2 text-center">{color.name}</p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Display Preferences */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-gray-700" />
                Display Preferences
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl hover:bg-white transition-all">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Compact Mode</p>
                    <p className="text-xs text-gray-500">Reduce spacing and padding</p>
                  </div>
                  <button onClick={() => setCompactMode(!compactMode)} className={clsx('relative w-14 h-7 rounded-full transition-all duration-300 shadow-inner', compactMode ? 'bg-gradient-to-r from-purple-500 to-pink-600' : 'bg-gray-300')}>
                    <motion.div animate={{ x: compactMode ? 28 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl hover:bg-white transition-all">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Animations</p>
                    <p className="text-xs text-gray-500">Enable smooth transitions</p>
                  </div>
                  <button onClick={() => setAnimations(!animations)} className={clsx('relative w-14 h-7 rounded-full transition-all duration-300 shadow-inner', animations ? 'bg-gradient-to-r from-purple-500 to-pink-600' : 'bg-gray-300')}>
                    <motion.div animate={{ x: animations ? 28 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearancePage;

