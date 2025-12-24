import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';
import { 
  GlobeAltIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface LanguageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangesSaved: () => void;
  onChangesMade: () => void;
}

const LanguageSettingsModal = ({ isOpen, onClose, onChangesSaved, onChangesMade }: LanguageSettingsModalProps) => {
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('America/New_York');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [numberFormat, setNumberFormat] = useState('1,234.56');

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  ];

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Africa/Addis_Ababa', label: 'Addis Ababa (EAT)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  ];

  const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];
  const numberFormats = ['1,234.56', '1.234,56', '1 234,56'];

  const handleLanguageChange = (code: string) => {
    setLanguage(code);
    onChangesMade();
    const lang = languages.find(l => l.code === code);
    toast.success(`Language changed to ${lang?.name}`, {
      icon: lang?.flag,
    });
  };

  const handleSave = () => {
    toast.success('Localization settings saved!', {
      icon: '🌍',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    onChangesSaved();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Language & Localization"
      size="lg"
    >
      <div className="space-y-6">
        {/* Language Selection */}
        <div>
          <h4 className="text-md font-semibold text-grey-900 mb-3 flex items-center gap-2">
            <GlobeAltIcon className="w-5 h-5 text-gold" />
            Language
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all hover:scale-105 ${
                  language === lang.code
                    ? 'border-gold bg-gold-pale'
                    : 'border-grey-200 hover:border-grey-300'
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="text-left flex-1">
                  <div className="text-sm font-semibold text-grey-900">{lang.name}</div>
                  <div className="text-xs text-grey-500">{lang.nativeName}</div>
                </div>
                {language === lang.code && (
                  <CheckCircleIcon className="w-5 h-5 text-gold flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Currency */}
        <div>
          <h4 className="text-md font-semibold text-grey-900 mb-3 flex items-center gap-2">
            <CurrencyDollarIcon className="w-5 h-5 text-gold" />
            Currency
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {currencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => {
                  setCurrency(curr.code);
                  onChangesMade();
                }}
                className={`flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                  currency === curr.code
                    ? 'border-gold bg-gold-pale'
                    : 'border-grey-200 hover:border-grey-300'
                }`}
              >
                <div className="text-left">
                  <div className="text-sm font-semibold text-grey-900">
                    {curr.code} ({curr.symbol})
                  </div>
                  <div className="text-xs text-grey-500">{curr.name}</div>
                </div>
                {currency === curr.code && (
                  <CheckCircleIcon className="w-5 h-5 text-gold" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Timezone */}
        <div>
          <h4 className="text-md font-semibold text-grey-900 mb-3 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-gold" />
            Timezone
          </h4>
          <select
            value={timezone}
            onChange={(e) => {
              setTimezone(e.target.value);
              onChangesMade();
            }}
            className="w-full px-4 py-3 border-2 border-grey-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Format */}
        <div>
          <h4 className="text-md font-semibold text-grey-900 mb-3 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gold" />
            Date Format
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {dateFormats.map((format) => (
              <button
                key={format}
                onClick={() => {
                  setDateFormat(format);
                  onChangesMade();
                }}
                className={`p-3 border-2 rounded-lg transition-all text-center ${
                  dateFormat === format
                    ? 'border-gold bg-gold-pale'
                    : 'border-grey-200 hover:border-grey-300'
                }`}
              >
                <div className="text-sm font-semibold text-grey-900">{format}</div>
                {dateFormat === format && (
                  <CheckCircleIcon className="w-4 h-4 text-gold mx-auto mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Number Format */}
        <div>
          <h4 className="text-md font-semibold text-grey-900 mb-3">Number Format</h4>
          <div className="grid grid-cols-3 gap-3">
            {numberFormats.map((format) => (
              <button
                key={format}
                onClick={() => {
                  setNumberFormat(format);
                  onChangesMade();
                }}
                className={`p-3 border-2 rounded-lg transition-all text-center ${
                  numberFormat === format
                    ? 'border-gold bg-gold-pale'
                    : 'border-grey-200 hover:border-grey-300'
                }`}
              >
                <div className="text-sm font-semibold text-grey-900">{format}</div>
                {numberFormat === format && (
                  <CheckCircleIcon className="w-4 h-4 text-gold mx-auto mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-grey-50 border border-grey-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-grey-900 mb-3">Preview</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-grey-600">Date:</span>
              <span className="text-grey-900 font-medium">
                {dateFormat.replace('MM', '12').replace('DD', '25').replace('YYYY', '2024')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-grey-600">Number:</span>
              <span className="text-grey-900 font-medium">{numberFormat}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-grey-600">Price:</span>
              <span className="text-grey-900 font-medium">
                {currencies.find(c => c.code === currency)?.symbol}99.99
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-grey-200">
          <Button
            onClick={handleSave}
            leftIcon={<CheckCircleIcon className="w-4 h-4" />}
            className="flex-1"
          >
            Save Settings
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LanguageSettingsModal;
















