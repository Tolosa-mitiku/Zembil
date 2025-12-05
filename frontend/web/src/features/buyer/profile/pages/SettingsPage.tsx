import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  BellIcon,
  LockClosedIcon,
  CreditCardIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  KeyIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  SunIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  iconColor: string;
}

const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: 'account',
    title: 'Account & Profile',
    description: 'Manage your personal information',
    icon: UserCircleIcon,
    gradient: 'from-purple-500 to-pink-600',
    iconColor: 'text-purple-600',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Control how you receive updates',
    icon: BellIcon,
    gradient: 'from-blue-500 to-cyan-600',
    iconColor: 'text-blue-600',
  },
  {
    id: 'security',
    title: 'Privacy & Security',
    description: 'Password and security settings',
    icon: LockClosedIcon,
    gradient: 'from-orange-500 to-amber-600',
    iconColor: 'text-orange-600',
  },
  {
    id: 'payment',
    title: 'Payment Methods',
    description: 'Manage your payment options',
    icon: CreditCardIcon,
    gradient: 'from-green-500 to-emerald-600',
    iconColor: 'text-green-600',
  },
  {
    id: 'language',
    title: 'Language & Region',
    description: 'Language, currency, and timezone',
    icon: GlobeAltIcon,
    gradient: 'from-teal-500 to-cyan-600',
    iconColor: 'text-teal-600',
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Theme and display preferences',
    icon: PaintBrushIcon,
    gradient: 'from-pink-500 to-rose-600',
    iconColor: 'text-pink-600',
  },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl">
              <Cog6ToothIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-sm text-gray-600">Manage your account preferences</p>
            </div>
          </div>
        </motion.div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {SETTINGS_SECTIONS.map((section, index) => (
            <div key={section.id} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${section.gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`} />
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (section.id === 'account') navigate('/profile');
                  else if (section.id === 'notifications') navigate('/profile/notifications');
                  else if (section.id === 'security') navigate('/profile/security');
                  else if (section.id === 'appearance') navigate('/profile/appearance');
                  else if (section.id === 'language') navigate('/profile/language');
                  else if (section.id === 'payment') navigate('/profile/payment');
                }}
                className="relative w-full bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-2xl text-left"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${section.gradient} shadow-lg shrink-0`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-gray-900 mb-1">{section.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{section.description}</p>
                  </div>

                  <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gold group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </motion.button>
            </div>
          ))}
        </div>

        {/* Quick Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-extrabold text-gray-900">Quick Settings</h2>

          {/* Notifications */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-lg">
                  <BellIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Notifications
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl hover:bg-white transition-all">
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">Email Notifications</p>
                      <p className="text-xs text-gray-500">Receive order updates via email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={clsx(
                      'relative w-14 h-7 rounded-full transition-all duration-300 shadow-inner',
                      emailNotifications ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-300'
                    )}
                  >
                    <motion.div
                      animate={{ x: emailNotifications ? 28 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl hover:bg-white transition-all">
                  <div className="flex items-center gap-3">
                    <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">Push Notifications</p>
                      <p className="text-xs text-gray-500">Get real-time alerts on your device</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={clsx(
                      'relative w-14 h-7 rounded-full transition-all duration-300 shadow-inner',
                      pushNotifications ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-300'
                    )}
                  >
                    <motion.div
                      animate={{ x: pushNotifications ? 28 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg shadow-lg">
                  <ShieldCheckIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Security
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl hover:bg-white transition-all">
                  <div className="flex items-center gap-3">
                    <KeyIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500">Add an extra layer of security</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                    className={clsx(
                      'relative w-14 h-7 rounded-full transition-all duration-300 shadow-inner',
                      twoFactorAuth ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-300'
                    )}
                  >
                    <motion.div
                      animate={{ x: twoFactorAuth ? 28 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                    />
                  </button>
                </div>

                <button className="w-full flex items-center justify-between p-4 bg-white/80 rounded-xl hover:bg-white transition-all group/btn">
                  <div className="flex items-center gap-3">
                    <LockClosedIcon className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="font-semibold text-sm text-gray-900">Change Password</p>
                      <p className="text-xs text-gray-500">Update your password regularly</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover/btn:text-gold group-hover/btn:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg shadow-lg">
                  <PaintBrushIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Appearance
                </h3>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl hover:bg-white transition-all">
                <div className="flex items-center gap-3">
                  <SunIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Dark Mode</p>
                    <p className="text-xs text-gray-500">Switch between light and dark theme</p>
                  </div>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={clsx(
                    'relative w-14 h-7 rounded-full transition-all duration-300 shadow-inner',
                    darkMode ? 'bg-gradient-to-r from-purple-500 to-pink-600' : 'bg-gray-300'
                  )}
                >
                  <motion.div
                    animate={{ x: darkMode ? 28 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
