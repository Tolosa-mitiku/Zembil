import { useState, useEffect } from 'react';
import { NotificationPreferences } from '../api/profileApi';
import Button from '@/shared/components/Button';
import {
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface NotificationsTabProps {
  preferences?: NotificationPreferences;
  onUpdate: (data: Partial<NotificationPreferences>) => Promise<any>;
}

const NotificationsTab = ({ preferences, onUpdate }: NotificationsTabProps) => {
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(
    preferences || {
      email: {
        orders: true,
        products: true,
        messages: true,
        marketing: false,
        system: true,
      },
      sms: {
        orders: true,
        products: false,
        messages: true,
      },
      push: {
        orders: true,
        products: true,
        messages: true,
        marketing: false,
        system: true,
      },
      frequency: 'instant',
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  const handleToggle = (channel: 'email' | 'sms' | 'push', category: string) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [category]: !prev[channel][category as keyof typeof prev[typeof channel]],
      },
    }));
    setHasChanges(true);
  };

  const handleFrequencyChange = (frequency: 'instant' | 'daily' | 'weekly') => {
    setLocalPreferences((prev) => ({
      ...prev,
      frequency,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(localPreferences).unwrap();
      toast.success('Notification preferences updated successfully!');
      setHasChanges(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const notificationCategories = [
    {
      id: 'orders',
      label: 'Orders',
      description: 'New orders, cancellations, returns, and refunds',
      channels: ['email', 'sms', 'push'],
    },
    {
      id: 'products',
      label: 'Products',
      description: 'Low stock alerts, price changes, and product updates',
      channels: ['email', 'push'],
    },
    {
      id: 'messages',
      label: 'Messages',
      description: 'Customer inquiries and messages',
      channels: ['email', 'sms', 'push'],
    },
    {
      id: 'marketing',
      label: 'Marketing',
      description: 'Promotions, newsletters, and updates',
      channels: ['email', 'push'],
    },
    {
      id: 'system',
      label: 'System',
      description: 'Security alerts, policy updates, and maintenance notices',
      channels: ['email', 'push'],
    },
  ];

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={clsx(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2',
        checked ? 'bg-gold' : 'bg-grey-300'
      )}
    >
      <span
        className={clsx(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Notification Channels Header */}
      <div className="bg-gradient-to-r from-gold-pale to-grey-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-grey-900 mb-3">Manage Notifications</h3>
        <p className="text-sm text-grey-600 mb-4">
          Choose how you want to receive notifications for different events
        </p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="w-5 h-5 text-gold" />
            <span className="text-sm font-medium text-grey-700">Email</span>
          </div>
          <div className="flex items-center gap-2">
            <DevicePhoneMobileIcon className="w-5 h-5 text-gold" />
            <span className="text-sm font-medium text-grey-700">SMS</span>
          </div>
          <div className="flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-gold" />
            <span className="text-sm font-medium text-grey-700">Push</span>
          </div>
        </div>
      </div>

      {/* Notification Categories */}
      <div className="bg-white rounded-xl border border-grey-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-grey-50 border-b border-grey-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-grey-700">
                  Category
                </th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-grey-700 min-w-[100px]">
                  <EnvelopeIcon className="w-5 h-5 mx-auto" />
                  <span className="text-xs mt-1 block">Email</span>
                </th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-grey-700 min-w-[100px]">
                  <DevicePhoneMobileIcon className="w-5 h-5 mx-auto" />
                  <span className="text-xs mt-1 block">SMS</span>
                </th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-grey-700 min-w-[100px]">
                  <BellIcon className="w-5 h-5 mx-auto" />
                  <span className="text-xs mt-1 block">Push</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-100">
              {notificationCategories.map((category) => (
                <tr key={category.id} className="hover:bg-grey-50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-grey-900">{category.label}</p>
                      <p className="text-sm text-grey-500 mt-0.5">{category.description}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {category.channels.includes('email') && (
                      <Toggle
                        checked={localPreferences.email[category.id as keyof typeof localPreferences.email] || false}
                        onChange={() => handleToggle('email', category.id)}
                      />
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {category.channels.includes('sms') && (
                      <Toggle
                        checked={localPreferences.sms[category.id as keyof typeof localPreferences.sms] || false}
                        onChange={() => handleToggle('sms', category.id)}
                      />
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {category.channels.includes('push') && (
                      <Toggle
                        checked={localPreferences.push[category.id as keyof typeof localPreferences.push] || false}
                        onChange={() => handleToggle('push', category.id)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notification Frequency */}
      <div className="bg-white rounded-xl border border-grey-200 p-6">
        <h3 className="text-lg font-semibold text-grey-900 mb-3">Email Digest Frequency</h3>
        <p className="text-sm text-grey-500 mb-4">
          Choose how often you want to receive email notifications
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'instant', label: 'Instant', description: 'Get notified immediately' },
            { value: 'daily', label: 'Daily', description: 'Once per day digest' },
            { value: 'weekly', label: 'Weekly', description: 'Once per week summary' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleFrequencyChange(option.value as any)}
              className={clsx(
                'p-4 rounded-lg border-2 text-left transition-all',
                localPreferences.frequency === option.value
                  ? 'border-gold bg-gold-pale'
                  : 'border-grey-200 hover:border-grey-300'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-medium text-grey-900">{option.label}</span>
                {localPreferences.frequency === option.value && (
                  <CheckCircleIcon className="w-5 h-5 text-gold" />
                )}
              </div>
              <p className="text-sm text-grey-500">{option.description}</p>
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

export default NotificationsTab;

