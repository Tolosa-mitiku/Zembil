import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import { 
  LockClosedIcon, 
  ShieldCheckIcon,
  KeyIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ClockIcon,
  MapPinIcon,
  DocumentTextIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface SecuritySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangesSaved: () => void;
  onChangesMade: () => void;
}

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

const SecuritySettingsModal = ({ isOpen, onClose, onChangesSaved, onChangesMade }: SecuritySettingsModalProps) => {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [sessions] = useState<Session[]>([
    {
      id: '1',
      device: 'Windows PC',
      browser: 'Chrome 120',
      location: 'San Francisco, CA',
      ip: '192.168.1.1',
      lastActive: '2 minutes ago',
      current: true,
    },
    {
      id: '2',
      device: 'iPhone 15 Pro',
      browser: 'Safari',
      location: 'San Francisco, CA',
      ip: '192.168.1.10',
      lastActive: '1 hour ago',
      current: false,
    },
  ]);

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('Passwords do not match!');
      return;
    }
    toast.success('Password changed successfully!', {
      icon: '🔒',
    });
    setPasswordData({ current: '', new: '', confirm: '' });
    setShowPasswordChange(false);
    onChangesSaved();
  };

  const handleTerminateSession = (sessionId: string) => {
    toast.success('Session terminated successfully');
  };

  const handleExportData = () => {
    toast.success('Data export started! You will receive an email when ready.', {
      icon: '📦',
    });
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted.'
    );
    if (confirmed) {
      toast.error('Account deletion initiated. You will receive a confirmation email.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy & Security"
      size="xl"
    >
      <div className="space-y-6">
        {/* Change Password */}
        <div className="border border-grey-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <LockClosedIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="text-md font-semibold text-grey-900">Change Password</h4>
                <p className="text-xs text-grey-500">Update your account password</p>
              </div>
            </div>
            {!showPasswordChange && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowPasswordChange(true)}
                leftIcon={<KeyIcon className="w-4 h-4" />}
              >
                Change
              </Button>
            )}
          </div>

          {showPasswordChange && (
            <div className="space-y-4 animate-slide-in-from-bottom">
              <Input
                label="Current Password"
                type="password"
                value={passwordData.current}
                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                leftIcon={<LockClosedIcon className="w-5 h-5" />}
              />
              <Input
                label="New Password"
                type="password"
                value={passwordData.new}
                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                leftIcon={<KeyIcon className="w-5 h-5" />}
                helperText="Minimum 8 characters, include uppercase, lowercase, and numbers"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                leftIcon={<KeyIcon className="w-5 h-5" />}
              />
              <div className="flex gap-3">
                <Button size="sm" onClick={handlePasswordChange}>
                  Update Password
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPasswordChange(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div className="border border-grey-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <ShieldCheckIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="text-md font-semibold text-grey-900">Two-Factor Authentication</h4>
                <p className="text-xs text-grey-500">Add extra security to your account</p>
              </div>
            </div>
            <button
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                toast.success(`2FA ${!twoFactorEnabled ? 'enabled' : 'disabled'}!`);
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                twoFactorEnabled ? 'bg-gold' : 'bg-grey-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="border border-grey-200 rounded-xl p-5">
          <div className="mb-4">
            <h4 className="text-md font-semibold text-grey-900 flex items-center gap-2">
              <ComputerDesktopIcon className="w-5 h-5 text-gold" />
              Active Sessions
            </h4>
            <p className="text-xs text-grey-500 mt-1">Manage your active sessions across devices</p>
          </div>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-start gap-3 p-4 bg-grey-50 rounded-lg border border-grey-200"
              >
                <div className="w-10 h-10 rounded-lg bg-white border border-grey-200 flex items-center justify-center flex-shrink-0">
                  {session.device.includes('Phone') ? (
                    <DevicePhoneMobileIcon className="w-5 h-5 text-grey-600" />
                  ) : (
                    <ComputerDesktopIcon className="w-5 h-5 text-grey-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-sm font-semibold text-grey-900">{session.device}</h5>
                    {session.current && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-grey-600 mb-2">{session.browser}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-grey-500">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="w-3 h-3" />
                      {session.location}
                    </span>
                    <span>{session.ip}</span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      {session.lastActive}
                    </span>
                  </div>
                </div>
                {!session.current && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTerminateSession(session.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Links */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center gap-3 p-4 border border-grey-200 rounded-lg hover:border-gold transition-colors text-left">
            <DocumentTextIcon className="w-5 h-5 text-grey-600" />
            <div>
              <div className="text-sm font-semibold text-grey-900">Privacy Policy</div>
              <div className="text-xs text-grey-500">Read our policy</div>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-grey-200 rounded-lg hover:border-gold transition-colors text-left">
            <DocumentTextIcon className="w-5 h-5 text-grey-600" />
            <div>
              <div className="text-sm font-semibold text-grey-900">Terms of Service</div>
              <div className="text-xs text-grey-500">View terms</div>
            </div>
          </button>
        </div>

        {/* Data Management */}
        <div className="border border-grey-200 rounded-xl p-5">
          <h4 className="text-md font-semibold text-grey-900 mb-4 flex items-center gap-2">
            <EyeIcon className="w-5 h-5 text-gold" />
            Data & Privacy
          </h4>
          <div className="space-y-3">
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="text-left">
                <div className="text-sm font-semibold text-blue-900">Download Your Data</div>
                <div className="text-xs text-blue-700">Export all your account data</div>
              </div>
              <CheckCircleIcon className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border-2 border-red-200 rounded-xl p-5 bg-red-50">
          <div className="flex items-start gap-3 mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h4 className="text-md font-semibold text-red-900">Danger Zone</h4>
              <p className="text-xs text-red-700 mt-1">
                Irreversible actions that permanently affect your account
              </p>
            </div>
          </div>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            leftIcon={<TrashIcon className="w-4 h-4" />}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Account
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-grey-200">
          <Button onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SecuritySettingsModal;












