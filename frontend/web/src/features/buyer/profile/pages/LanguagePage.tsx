import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  GlobeAltIcon,
  ArrowLeftIcon,
  LanguageIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹', native: 'አማርኛ' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
  { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', native: 'Deutsch' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
];

const TIMEZONES = [
  { id: 'est', name: 'Eastern Time (ET)', offset: 'UTC-5' },
  { id: 'pst', name: 'Pacific Time (PT)', offset: 'UTC-8' },
  { id: 'gmt', name: 'GMT', offset: 'UTC+0' },
  { id: 'eat', name: 'East Africa Time', offset: 'UTC+3' },
];

const LanguagePage = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedTimezone, setSelectedTimezone] = useState('est');

  return (
    <div className="min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate('/profile/settings')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-xl">
                <GlobeAltIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Language & Region
                </h1>
                <p className="text-sm text-gray-600">Set your preferences</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Language Selection */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <LanguageIcon className="w-5 h-5 text-gray-700" />
                Language
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {LANGUAGES.map((lang, idx) => {
                  const isSelected = selectedLanguage === lang.code;

                  return (
                    <motion.button
                      key={lang.code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setSelectedLanguage(lang.code);
                        toast.success(`Language changed to ${lang.name}`);
                      }}
                      className={clsx(
                        'p-4 rounded-xl border-2 transition-all text-left',
                        isSelected
                          ? 'border-teal-500 bg-teal-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{lang.flag}</span>
                          <div>
                            <p className={clsx('font-bold text-sm', isSelected ? 'text-teal-900' : 'text-gray-900')}>
                              {lang.name}
                            </p>
                            <p className={clsx('text-xs', isSelected ? 'text-teal-700' : 'text-gray-500')}>
                              {lang.native}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircleIcon className="w-6 h-6 text-teal-600" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Currency */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5 text-gray-700" />
                Currency
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CURRENCIES.map((currency, idx) => {
                  const isSelected = selectedCurrency === currency.code;

                  return (
                    <motion.button
                      key={currency.code}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setSelectedCurrency(currency.code);
                        toast.success(`Currency changed to ${currency.code}`);
                      }}
                      className={clsx(
                        'p-4 rounded-xl border-2 transition-all',
                        isSelected
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      )}
                    >
                      <div className="text-2xl font-bold mb-1">{currency.symbol}</div>
                      <div className={clsx('text-xs font-semibold', isSelected ? 'text-green-900' : 'text-gray-700')}>
                        {currency.code}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Timezone */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-gray-700" />
                Timezone
              </h3>

              <div className="space-y-2">
                {TIMEZONES.map((tz, idx) => {
                  const isSelected = selectedTimezone === tz.id;

                  return (
                    <motion.button
                      key={tz.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        setSelectedTimezone(tz.id);
                        toast.success(`Timezone set to ${tz.name}`);
                      }}
                      className={clsx(
                        'w-full p-4 rounded-xl border-2 transition-all text-left',
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={clsx('font-bold text-sm', isSelected ? 'text-indigo-900' : 'text-gray-900')}>
                            {tz.name}
                          </p>
                          <p className={clsx('text-xs', isSelected ? 'text-indigo-700' : 'text-gray-500')}>
                            {tz.offset}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircleIcon className="w-6 h-6 text-indigo-600" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguagePage;

