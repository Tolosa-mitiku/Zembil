import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordChangeSchema, PasswordChangeFormData } from '../validation/schemas';
import { ActiveSession } from '../api/profileApi';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import Modal from '@/shared/components/Modal';
import {
  LockClosedIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { formatDate } from '@/core/utils/format';

interface SecurityTabProps {
  sessions?: ActiveSession[];
  onChangePassword: (data: any) => Promise<any>;
  onTerminateSession: (sessionId: string) => Promise<any>;
}

const SecurityTab = ({ sessions = [], onChangePassword, onTerminateSession }: SecurityTabProps) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [sessionToTerminate, setSessionToTerminate] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const newPassword = watch('newPassword');

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    
    return Math.min(strength, 100);
  };

  React.useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(newPassword));
  }, [newPassword]);

  const getStrengthColor = (strength: number) => {
    if (strength < 40) return 'bg-red-500';
    if (strength < 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = (strength: number) => {
    if (strength < 40) return 'Weak';
    if (strength < 70) return 'Medium';
    return 'Strong';
  };

  const onSubmit = async (data: PasswordChangeFormData) => {
    try {
      await onChangePassword(data).unwrap();
      toast.success('Password changed successfully!');
      reset();
      setIsChangingPassword(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to change password');
    }
  };

  const handleTerminateSession = async () => {
    if (!sessionToTerminate) return;
    
    try {
      await onTerminateSession(sessionToTerminate).unwrap();
      toast.success('Session terminated successfully');
      setShowTerminateModal(false);
      setSessionToTerminate(null);
    } catch (error) {
      toast.error('Failed to terminate session');
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('mobile') || device.toLowerCase().includes('phone')) {
      return <DevicePhoneMobileIcon className="w-5 h-5" />;
    }
    return <ComputerDesktopIcon className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="bg-white rounded-xl border border-grey-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-grey-900">Change Password</h3>
            <p className="text-sm text-grey-500 mt-1">
              Ensure your account stays secure with a strong password
            </p>
          </div>
          {!isChangingPassword && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsChangingPassword(true)}
              icon={<LockClosedIcon className="w-4 h-4" />}
            >
              Change Password
            </Button>
          )}
        </div>

        {isChangingPassword && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <Input
              label="Current Password"
              type="password"
              {...register('currentPassword')}
              error={errors.currentPassword?.message}
              icon={<LockClosedIcon className="w-5 h-5" />}
              placeholder="Enter your current password"
              required
            />

            <div>
              <Input
                label="New Password"
                type="password"
                {...register('newPassword')}
                error={errors.newPassword?.message}
                icon={<LockClosedIcon className="w-5 h-5" />}
                placeholder="Enter new password"
                required
              />
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-grey-600">Password Strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength < 40 ? 'text-red-600' : 
                      passwordStrength < 70 ? 'text-orange-600' : 
                      'text-green-600'
                    }`}>
                      {getStrengthLabel(passwordStrength)}
                    </span>
                  </div>
                  <div className="w-full bg-grey-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-grey-500">Password must contain:</p>
                    <ul className="text-xs text-grey-500 space-y-0.5 ml-4">
                      <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                        • At least 8 characters
                      </li>
                      <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                        • One uppercase letter
                      </li>
                      <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>
                        • One lowercase letter
                      </li>
                      <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                        • One number
                      </li>
                      <li className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                        • One special character
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm New Password"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              icon={<LockClosedIcon className="w-5 h-5" />}
              placeholder="Confirm new password"
              required
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                icon={<CheckCircleIcon className="w-4 h-4" />}
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => {
                  reset();
                  setIsChangingPassword(false);
                }}
                disabled={isSubmitting}
                icon={<XMarkIcon className="w-4 h-4" />}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl border border-grey-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-grey-900 mb-1">Two-Factor Authentication</h3>
            <p className="text-sm text-grey-500">
              Add an extra layer of security to your account
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-grey-500">Coming Soon</span>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-grey-200 opacity-50 cursor-not-allowed">
              <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-xl border border-grey-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-grey-900 mb-1">Active Sessions</h3>
          <p className="text-sm text-grey-500">
            Manage your active sessions across different devices
          </p>
        </div>

        <div className="space-y-3">
          {sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className="flex items-start justify-between p-4 border border-grey-200 rounded-lg hover:border-grey-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-grey-50 rounded-lg">
                    {getDeviceIcon(session.device)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-grey-900">{session.device}</h4>
                      {session.current && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-grey-600 mb-1">{session.browser}</p>
                    <div className="flex items-center gap-4 text-xs text-grey-500">
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3" />
                        {session.location} • {session.ipAddress}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        Last active {formatDate(session.lastActive)}
                      </span>
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSessionToTerminate(session._id);
                      setShowTerminateModal(true);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Terminate
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-grey-400">
              <ShieldCheckIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No active sessions</p>
            </div>
          )}
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-orange-900 mb-2">Security Recommendations</h3>
            <ul className="space-y-1 text-sm text-orange-800">
              <li>• Use a strong, unique password for your account</li>
              <li>• Enable two-factor authentication when available</li>
              <li>• Review your active sessions regularly</li>
              <li>• Never share your password with anyone</li>
              <li>• Log out from shared or public devices</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Terminate Session Modal */}
      <Modal
        isOpen={showTerminateModal}
        onClose={() => {
          setShowTerminateModal(false);
          setSessionToTerminate(null);
        }}
        title="Terminate Session"
      >
        <div className="space-y-4">
          <p className="text-grey-600">
            Are you sure you want to terminate this session? The device will be logged out immediately.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setShowTerminateModal(false);
                setSessionToTerminate(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleTerminateSession}
              className="bg-red-600 hover:bg-red-700"
            >
              Terminate Session
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SecurityTab;

