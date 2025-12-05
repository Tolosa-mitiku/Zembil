import { useState, useEffect } from 'react';
import { 
  UserCircleIcon, 
  PaintBrushIcon, 
  BellIcon, 
  GlobeAltIcon,
  LockClosedIcon,
  CreditCardIcon,
  MapPinIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  SparklesIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import Card from '@/shared/components/Card';
import AccountSettingsModal from '../components/AccountSettingsModal';
import AppearanceSettingsModal from '../components/AppearanceSettingsModal';
import NotificationSettingsModal from '../components/NotificationSettingsModal';
import LanguageSettingsModal from '../components/LanguageSettingsModal';
import SecuritySettingsModal from '../components/SecuritySettingsModal';
import PaymentSettingsModal from '../components/PaymentSettingsModal';
import ShippingSettingsModal from '../components/ShippingSettingsModal';
import HelpSupportModal from '../components/HelpSupportModal';
import AboutModal from '../components/AboutModal';
import SettingsPageSkeleton from '../components/SettingsPageSkeleton';

interface SettingsCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  iconBg: string;
  hoverGlow: string;
}

const SettingsPage = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading settings data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Simulate API call - extended delay to see shimmer

    return () => clearTimeout(timer);
  }, []);

  const categories: SettingsCategory[] = [
    {
      id: 'account',
      title: 'Account & Profile',
      description: 'Manage your personal information and admin details',
      icon: UserCircleIcon,
      gradient: 'from-purple-500 via-purple-600 to-purple-700',
      iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      hoverGlow: 'hover:shadow-glow-purple',
    },
    {
      id: 'appearance',
      title: 'Appearance & Theme',
      description: 'Customize colors, themes, and visual preferences',
      icon: PaintBrushIcon,
      gradient: 'from-pink-500 via-pink-600 to-rose-600',
      iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
      hoverGlow: 'hover:shadow-glow-pink',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Control how and when you receive notifications',
      icon: BellIcon,
      gradient: 'from-blue-500 via-blue-600 to-cyan-600',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      hoverGlow: 'hover:shadow-glow-blue',
    },
    {
      id: 'language',
      title: 'Language & Localization',
      description: 'Set your language, currency, and regional preferences',
      icon: GlobeAltIcon,
      gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      hoverGlow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    },
    {
      id: 'security',
      title: 'Privacy & Security',
      description: 'Manage passwords, 2FA, and privacy settings',
      icon: LockClosedIcon,
      gradient: 'from-orange-500 via-orange-600 to-amber-600',
      iconBg: 'bg-gradient-to-br from-orange-500 to-amber-600',
      hoverGlow: 'hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]',
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      description: 'Manage payment options and billing information',
      icon: CreditCardIcon,
      gradient: 'from-violet-500 via-violet-600 to-purple-600',
      iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
      hoverGlow: 'hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]',
    },
    {
      id: 'shipping',
      title: 'Shipping & Addresses',
      description: 'Manage delivery addresses and preferences',
      icon: MapPinIcon,
      gradient: 'from-cyan-500 via-cyan-600 to-blue-600',
      iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      hoverGlow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]',
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get help, contact support, and access resources',
      icon: QuestionMarkCircleIcon,
      gradient: 'from-indigo-500 via-indigo-600 to-blue-600',
      iconBg: 'bg-gradient-to-br from-indigo-500 to-blue-600',
      hoverGlow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]',
    },
    {
      id: 'about',
      title: 'About & Legal',
      description: 'App version, changelog, and legal information',
      icon: InformationCircleIcon,
      gradient: 'from-gray-500 via-gray-600 to-slate-600',
      iconBg: 'bg-gradient-to-br from-gray-500 to-slate-600',
      hoverGlow: 'hover:shadow-[0_0_20px_rgba(107,114,128,0.5)]',
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setActiveModal(categoryId);
  };

  const handleCloseModal = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        setActiveModal(null);
        setHasUnsavedChanges(false);
      }
    } else {
      setActiveModal(null);
    }
  };

  // Show skeleton while loading
  if (isLoading) {
    return <SettingsPageSkeleton />;
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-8 md:p-12 shadow-xl">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center gap-6">
          {/* Icon with Glassmorphism */}
          <div className="hidden md:flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg">
            <Cog6ToothIcon className="w-10 h-10 text-white animate-spin-slow" />
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <SparklesIcon className="w-5 h-5 text-yellow-200 animate-pulse" />
              <span className="text-white/80 text-sm font-medium">Customize Your Experience</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-white/90 text-base md:text-lg max-w-2xl">
              Personalize your dashboard, manage preferences, and control your account
            </p>
          </div>

          {/* Unsaved Changes Indicator */}
          {hasUnsavedChanges && (
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-yellow-500/90 backdrop-blur-sm rounded-full text-white text-sm font-medium shadow-lg animate-pulse-slow">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Unsaved Changes
            </div>
          )}
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-grey-600">
        <span className="hover:text-gold cursor-pointer transition-colors">Dashboard</span>
        <ChevronRightIcon className="w-4 h-4" />
        <span className="text-gold font-medium">Settings</span>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <div
              key={category.id}
              className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:scale-105"
              onClick={() => handleCategoryClick(category.id)}
              style={{ 
                animation: `slideInFromBottom 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              <Card
                padding="none"
                hover
                className={`h-full border-2 border-grey-100 transition-all duration-300 group-hover:border-transparent ${category.hoverGlow}`}
              >
                <div className="p-6">
                  {/* Icon with Gradient Background */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${category.iconBg} mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-lg font-semibold text-grey-900 mb-2 group-hover:text-gold transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-grey-600 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Arrow Indicator */}
                  <div className="mt-4 flex items-center text-grey-400 group-hover:text-gold transition-colors">
                    <span className="text-sm font-medium">Configure</span>
                    <ChevronRightIcon className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Animated Bottom Border */}
                <div className={`h-1 bg-gradient-to-r ${category.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-2xl`} />
              </Card>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Card */}
      <Card padding="lg" className="bg-gradient-to-br from-gold-pale to-white border-2 border-gold/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-grey-900 mb-1 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-gold" />
              Quick Actions
            </h3>
            <p className="text-sm text-grey-600">
              Common settings at your fingertips
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveModal('appearance')}
              className="px-4 py-2 bg-white border-2 border-gold text-gold font-medium rounded-lg hover:bg-gold hover:text-white transition-all duration-200 active:scale-95"
            >
              Switch Theme
            </button>
            <button
              onClick={() => setActiveModal('notifications')}
              className="px-4 py-2 bg-gradient-to-r from-gold to-gold-dark text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              Manage Notifications
            </button>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <AccountSettingsModal
        isOpen={activeModal === 'account'}
        onClose={handleCloseModal}
        onChangesSaved={() => setHasUnsavedChanges(false)}
        onChangesMade={() => setHasUnsavedChanges(true)}
      />
      <AppearanceSettingsModal
        isOpen={activeModal === 'appearance'}
        onClose={handleCloseModal}
        onChangesSaved={() => setHasUnsavedChanges(false)}
        onChangesMade={() => setHasUnsavedChanges(true)}
      />
      <NotificationSettingsModal
        isOpen={activeModal === 'notifications'}
        onClose={handleCloseModal}
        onChangesSaved={() => setHasUnsavedChanges(false)}
        onChangesMade={() => setHasUnsavedChanges(true)}
      />
      <LanguageSettingsModal
        isOpen={activeModal === 'language'}
        onClose={handleCloseModal}
        onChangesSaved={() => setHasUnsavedChanges(false)}
        onChangesMade={() => setHasUnsavedChanges(true)}
      />
      <SecuritySettingsModal
        isOpen={activeModal === 'security'}
        onClose={handleCloseModal}
        onChangesSaved={() => setHasUnsavedChanges(false)}
        onChangesMade={() => setHasUnsavedChanges(true)}
      />
      <PaymentSettingsModal
        isOpen={activeModal === 'payment'}
        onClose={handleCloseModal}
        onChangesSaved={() => setHasUnsavedChanges(false)}
        onChangesMade={() => setHasUnsavedChanges(true)}
      />
      <ShippingSettingsModal
        isOpen={activeModal === 'shipping'}
        onClose={handleCloseModal}
        onChangesSaved={() => setHasUnsavedChanges(false)}
        onChangesMade={() => setHasUnsavedChanges(true)}
      />
      <HelpSupportModal
        isOpen={activeModal === 'help'}
        onClose={handleCloseModal}
      />
      <AboutModal
        isOpen={activeModal === 'about'}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default SettingsPage;
