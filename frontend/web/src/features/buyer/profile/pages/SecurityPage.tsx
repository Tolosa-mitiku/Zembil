import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LockClosedIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  KeyIcon,
  FingerPrintIcon,
  EyeIcon,
  EyeSlashIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const SecurityPage = () => {
  const navigate = useNavigate();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate('/profile/settings')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-xl">
                <ShieldCheckIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Privacy & Security
                </h1>
                <p className="text-sm text-gray-600">Keep your account safe</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Change Password */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg">
                  <KeyIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Change Password
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Current Password</label>
                  <div className="relative">
                    <input type={showCurrentPassword ? 'text' : 'password'} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-sm bg-white/80" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showCurrentPassword ? <EyeSlashIcon className="w-4 h-4 text-gray-400" /> : <EyeIcon className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">New Password</label>
                  <div className="relative">
                    <input type={showNewPassword ? 'text' : 'password'} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-sm bg-white/80" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showNewPassword ? <EyeSlashIcon className="w-4 h-4 text-gray-400" /> : <EyeIcon className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-sm hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg">
                  Update Password
                </button>
              </div>
            </motion.div>
          </div>

          {/* Security Options */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg shadow-lg">
                  <ShieldCheckIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Security Features
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl hover:bg-white transition-all">
                  <div className="flex items-center gap-3">
                    <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500">Protect your account with 2FA</p>
                    </div>
                  </div>
                  <button onClick={() => { setTwoFactorEnabled(!twoFactorEnabled); toast.success(twoFactorEnabled ? '2FA Disabled' : '2FA Enabled'); }} className={clsx('relative w-14 h-7 rounded-full transition-all duration-300 shadow-inner', twoFactorEnabled ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-300')}>
                    <motion.div animate={{ x: twoFactorEnabled ? 28 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl hover:bg-white transition-all">
                  <div className="flex items-center gap-3">
                    <FingerPrintIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">Biometric Login</p>
                      <p className="text-xs text-gray-500">Use fingerprint or face ID</p>
                    </div>
                  </div>
                  <button onClick={() => setBiometricEnabled(!biometricEnabled)} className={clsx('relative w-14 h-7 rounded-full transition-all duration-300 shadow-inner', biometricEnabled ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-300')}>
                    <motion.div animate={{ x: biometricEnabled ? 28 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl hover:bg-white transition-all">
                  <div className="flex items-center gap-3">
                    <LockClosedIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">Login Alerts</p>
                      <p className="text-xs text-gray-500">Get notified of new logins</p>
                    </div>
                  </div>
                  <button onClick={() => setLoginAlerts(!loginAlerts)} className={clsx('relative w-14 h-7 rounded-full transition-all duration-300 shadow-inner', loginAlerts ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-300')}>
                    <motion.div animate={{ x: loginAlerts ? 28 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg" />
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

export default SecurityPage;

