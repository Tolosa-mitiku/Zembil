import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';
import { 
  BellIcon, 
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  SpeakerWaveIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangesSaved: () => void;
  onChangesMade: () => void;
}

interface NotificationSettings {
  email: {
    enabled: boolean;
    orders: boolean;
    products: boolean;
    messages: boolean;
    marketing: boolean;
    system: boolean;
  };
  push: {
    enabled: boolean;
    orders: boolean;
    messages: boolean;
  };
  sms: boolean;
  sound: boolean;
  frequency: 'instant' | 'daily' | 'weekly';
}

const NotificationSettingsModal = ({ isOpen, onClose, onChangesSaved, onChangesMade }: NotificationSettingsModalProps) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      orders: true,
      products: true,
      messages: true,
      marketing: false,
      system: true,
    },
    push: {
      enabled: true,
      orders: true,
      messages: true,
    },
    sms: false,
    sound: true,
    frequency: 'instant',
  });

  const handleToggle = (category: 'email' | 'push', key: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key as keyof typeof prev[typeof category]],
      },
    }));
    onChangesMade();
  };

  const handleMainToggle = (key: 'sms' | 'sound') => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    onChangesMade();
  };

  const handleFrequencyChange = (frequency: 'instant' | 'daily' | 'weekly') => {
    setSettings(prev => ({ ...prev, frequency }));
    onChangesMade();
  };

  const handleSave = () => {
    toast.success('Notification preferences saved!', {
      icon: '🔔',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    onChangesSaved();
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-gold' : 'bg-grey-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      size="lg"
    >
      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="border border-grey-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <EnvelopeIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-md font-semibold text-grey-900">Email Notifications</h4>
                <p className="text-xs text-grey-500">Receive updates via email</p>
              </div>
            </div>
            <ToggleSwitch
              checked={settings.email.enabled}
              onChange={() => handleToggle('email', 'enabled')}
            />
          </div>

          {settings.email.enabled && (
            <div className="space-y-3 pl-13 animate-slide-in-from-bottom">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <ShoppingBagIcon className="w-4 h-4 text-grey-500" />
                  <span className="text-sm text-grey-700">Order Updates</span>
                </div>
                <ToggleSwitch
                  checked={settings.email.orders}
                  onChange={() => handleToggle('email', 'orders')}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <ShoppingBagIcon className="w-4 h-4 text-grey-500" />
                  <span className="text-sm text-grey-700">Product Updates</span>
                </div>
                <ToggleSwitch
                  checked={settings.email.products}
                  onChange={() => handleToggle('email', 'products')}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 text-grey-500" />
                  <span className="text-sm text-grey-700">Messages</span>
                </div>
                <ToggleSwitch
                  checked={settings.email.messages}
                  onChange={() => handleToggle('email', 'messages')}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <MegaphoneIcon className="w-4 h-4 text-grey-500" />
                  <span className="text-sm text-grey-700">Marketing & Promotions</span>
                </div>
                <ToggleSwitch
                  checked={settings.email.marketing}
                  onChange={() => handleToggle('email', 'marketing')}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <BellIcon className="w-4 h-4 text-grey-500" />
                  <span className="text-sm text-grey-700">System Notifications</span>
                </div>
                <ToggleSwitch
                  checked={settings.email.system}
                  onChange={() => handleToggle('email', 'system')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Push Notifications */}
        <div className="border border-grey-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <BellIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="text-md font-semibold text-grey-900">Push Notifications</h4>
                <p className="text-xs text-grey-500">Browser notifications</p>
              </div>
            </div>
            <ToggleSwitch
              checked={settings.push.enabled}
              onChange={() => handleToggle('push', 'enabled')}
            />
          </div>

          {settings.push.enabled && (
            <div className="space-y-3 pl-13 animate-slide-in-from-bottom">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <ShoppingBagIcon className="w-4 h-4 text-grey-500" />
                  <span className="text-sm text-grey-700">Order Updates</span>
                </div>
                <ToggleSwitch
                  checked={settings.push.orders}
                  onChange={() => handleToggle('push', 'orders')}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 text-grey-500" />
                  <span className="text-sm text-grey-700">New Messages</span>
                </div>
                <ToggleSwitch
                  checked={settings.push.messages}
                  onChange={() => handleToggle('push', 'messages')}
                />
              </div>
            </div>
          )}
        </div>

        {/* SMS & Sound */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-grey-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DevicePhoneMobileIcon className="w-5 h-5 text-grey-600" />
                <span className="text-sm font-medium text-grey-900">SMS Alerts</span>
              </div>
              <ToggleSwitch
                checked={settings.sms}
                onChange={() => handleMainToggle('sms')}
              />
            </div>
          </div>
          <div className="border border-grey-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SpeakerWaveIcon className="w-5 h-5 text-grey-600" />
                <span className="text-sm font-medium text-grey-900">Sound</span>
              </div>
              <ToggleSwitch
                checked={settings.sound}
                onChange={() => handleMainToggle('sound')}
              />
            </div>
          </div>
        </div>

        {/* Notification Frequency */}
        <div>
          <h4 className="text-md font-semibold text-grey-900 mb-3">Notification Frequency</h4>
          <div className="space-y-2">
            {['instant', 'daily', 'weekly'].map((freq) => (
              <button
                key={freq}
                onClick={() => handleFrequencyChange(freq as any)}
                className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                  settings.frequency === freq
                    ? 'border-gold bg-gold-pale'
                    : 'border-grey-200 hover:border-grey-300'
                }`}
              >
                <div className="text-left">
                  <span className="text-sm font-semibold text-grey-900 capitalize">{freq}</span>
                  <p className="text-xs text-grey-500 mt-0.5">
                    {freq === 'instant' && 'Receive notifications immediately'}
                    {freq === 'daily' && 'Once per day digest'}
                    {freq === 'weekly' && 'Weekly summary'}
                  </p>
                </div>
                {settings.frequency === freq && (
                  <CheckCircleIcon className="w-5 h-5 text-gold" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Notification */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center flex-shrink-0">
              <BellIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-semibold text-grey-900">Preview Notification</h5>
              <p className="text-xs text-grey-600 mt-1">
                This is how your notifications will appear
              </p>
            </div>
            <span className="text-xs text-grey-500">2m ago</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-grey-200">
          <Button
            onClick={handleSave}
            leftIcon={<CheckCircleIcon className="w-4 h-4" />}
            className="flex-1"
          >
            Save Preferences
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

export default NotificationSettingsModal;












