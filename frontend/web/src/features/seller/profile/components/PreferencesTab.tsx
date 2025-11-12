import { useState } from 'react';
import { SellerProfile } from '../api/profileApi';
import Button from '@/shared/components/Button';
import {
  GlobeAltIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface PreferencesTabProps {
  profile: SellerProfile;
  onUpdate: (data: any) => Promise<any>;
}

const PreferencesTab = ({ profile, onUpdate }: PreferencesTabProps) => {
  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'USD',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    themeColor: '#D4AF37',
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key: string, value: string) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate({ preferences }).unwrap();
      toast.success('Preferences updated successfully!');
      setHasChanges(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
    { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris, Berlin, Rome' },
    { value: 'Africa/Addis_Ababa', label: 'Addis Ababa, Nairobi' },
    { value: 'Asia/Dubai', label: 'Dubai, Abu Dhabi' },
  ];

  const dateFormats = [
    { value: 'MM/DD/YYYY', label: '12/31/2024', example: '12/31/2024' },
    { value: 'DD/MM/YYYY', label: '31/12/2024', example: '31/12/2024' },
    { value: 'YYYY-MM-DD', label: '2024-12-31', example: '2024-12-31' },
    { value: 'DD MMM YYYY', label: '31 Dec 2024', example: '31 Dec 2024' },
  ];

  const themeColors = [
    { value: '#D4AF37', name: 'Gold (Default)', bg: 'bg-gold' },
    { value: '#2563EB', name: 'Blue', bg: 'bg-blue-600' },
    { value: '#DC2626', name: 'Red', bg: 'bg-red-600' },
    { value: '#059669', name: 'Green', bg: 'bg-green-600' },
    { value: '#7C3AED', name: 'Purple', bg: 'bg-purple-600' },
    { value: '#EA580C', name: 'Orange', bg: 'bg-orange-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Language */}
      <div className="bg-white rounded-xl border border-grey-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <GlobeAltIcon className="w-5 h-5 text-grey-600" />
          <h3 className="text-lg font-semibold text-grey-900">Language</h3>
        </div>
        <p className="text-sm text-grey-500 mb-4">
          Select your preferred language for the dashboard
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChange('language', lang.code)}
              className={clsx(
                'p-4 rounded-lg border-2 text-left transition-all hover:border-grey-300',
                preferences.language === lang.code
                  ? 'border-gold bg-gold-pale'
                  : 'border-grey-200'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium text-grey-900">{lang.name}</span>
              </div>
              {preferences.language === lang.code && (
                <CheckCircleIcon className="w-4 h-4 text-gold mt-2" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Currency */}
      <div className="bg-white rounded-xl border border-grey-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CurrencyDollarIcon className="w-5 h-5 text-grey-600" />
          <h3 className="text-lg font-semibold text-grey-900">Currency</h3>
        </div>
        <p className="text-sm text-grey-500 mb-4">
          Choose your preferred currency for transactions
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => handleChange('currency', curr.code)}
              className={clsx(
                'p-4 rounded-lg border-2 text-center transition-all hover:border-grey-300',
                preferences.currency === curr.code
                  ? 'border-gold bg-gold-pale'
                  : 'border-grey-200'
              )}
            >
              <div className="text-2xl font-bold text-grey-900 mb-1">{curr.symbol}</div>
              <div className="text-sm font-medium text-grey-700">{curr.code}</div>
              <div className="text-xs text-grey-500 mt-1">{curr.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Timezone */}
      <div className="bg-white rounded-xl border border-grey-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <ClockIcon className="w-5 h-5 text-grey-600" />
          <h3 className="text-lg font-semibold text-grey-900">Timezone</h3>
        </div>
        <p className="text-sm text-grey-500 mb-4">
          Set your timezone for accurate time display
        </p>
        <select
          value={preferences.timezone}
          onChange={(e) => handleChange('timezone', e.target.value)}
          className="w-full p-3 border border-grey-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold-pale transition-colors"
        >
          {timezones.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Format */}
      <div className="bg-white rounded-xl border border-grey-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-5 h-5 text-grey-600" />
          <h3 className="text-lg font-semibold text-grey-900">Date Format</h3>
        </div>
        <p className="text-sm text-grey-500 mb-4">
          Choose how dates should be displayed
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {dateFormats.map((format) => (
            <button
              key={format.value}
              onClick={() => handleChange('dateFormat', format.value)}
              className={clsx(
                'p-4 rounded-lg border-2 text-center transition-all hover:border-grey-300',
                preferences.dateFormat === format.value
                  ? 'border-gold bg-gold-pale'
                  : 'border-grey-200'
              )}
            >
              <div className="font-medium text-grey-900 mb-1">{format.value}</div>
              <div className="text-sm text-grey-500">{format.example}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Color */}
      <div className="bg-white rounded-xl border border-grey-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <PaintBrushIcon className="w-5 h-5 text-grey-600" />
          <h3 className="text-lg font-semibold text-grey-900">Theme Color</h3>
        </div>
        <p className="text-sm text-grey-500 mb-4">
          Customize your dashboard with your brand color
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {themeColors.map((color) => (
            <button
              key={color.value}
              onClick={() => handleChange('themeColor', color.value)}
              className={clsx(
                'p-4 rounded-lg border-2 transition-all hover:border-grey-300',
                preferences.themeColor === color.value
                  ? 'border-gold bg-gold-pale'
                  : 'border-grey-200'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${color.bg}`} />
                <div className="text-left">
                  <div className="font-medium text-grey-900">{color.name}</div>
                  <div className="text-xs text-grey-500">{color.value}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      {hasChanges && (
        <div className="bg-white rounded-xl border border-grey-200 p-6 sticky bottom-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-grey-600">You have unsaved changes</p>
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={isSaving}
              icon={<CheckCircleIcon className="w-4 h-4" />}
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferencesTab;

