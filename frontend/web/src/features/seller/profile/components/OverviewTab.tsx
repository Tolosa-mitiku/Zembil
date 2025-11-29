import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema, PersonalInfoFormData } from '../validation/schemas';
import { SellerProfile } from '../api/profileApi';
import ImageUpload from '@/shared/components/ImageUpload';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import Badge from '@/shared/components/Badge';
import { formatDate } from '@/core/utils/format';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface OverviewTabProps {
  profile: SellerProfile;
  onUpdate: (data: any) => Promise<any>;
  onUploadAvatar: (formData: FormData) => Promise<any>;
}

const OverviewTab = ({ profile, onUpdate, onUploadAvatar }: OverviewTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    values: {
      name: profile.name || '',
      phone: profile.phone || '',
    },
  });

  const onSubmit = async (data: PersonalInfoFormData) => {
    try {
      await onUpdate(data).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleAvatarUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      await onUploadAvatar(formData).unwrap();
      toast.success('Avatar updated successfully!');
      return profile.image || '';
    } catch (error) {
      toast.error('Failed to upload avatar');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Calculate profile completion
  const calculateCompletion = () => {
    const fields = [
      profile.name,
      profile.email,
      profile.phone,
      profile.image,
      profile.businessName,
      profile.businessAddress,
      profile.businessDescription,
      profile.taxId,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const completion = profile.profileCompletion || calculateCompletion();

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' => {
    const statusMap: Record<string, 'success' | 'warning' | 'error'> = {
      verified: 'success',
      pending: 'warning',
      rejected: 'error',
      active: 'success',
      suspended: 'warning',
      banned: 'error',
    };
    return statusMap[status] || 'warning';
  };

  return (
    <div className="space-y-6">
      {/* Profile Header with Avatar */}
      <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-gold-pale to-grey-50 rounded-xl">
        <div className="flex-shrink-0">
          <ImageUpload
            value={profile.image}
            onChange={() => {}}
            onUpload={handleAvatarUpload}
            shape="circle"
            maxSize={5}
            description="Max 5MB"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-grey-900">{profile.name}</h2>
            <Badge variant={getStatusVariant(profile.verificationStatus)}>
              {profile.verificationStatus}
            </Badge>
            <Badge variant={getStatusVariant(profile.accountStatus)}>
              {profile.accountStatus}
            </Badge>
          </div>
          <p className="text-grey-600 mb-1">{profile.email}</p>
          <div className="flex items-center gap-4 text-sm text-grey-500">
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              Joined {formatDate(profile.createdAt)}
            </span>
            {profile.lastLoginAt && (
              <span className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                Last login {formatDate(profile.lastLoginAt)}
              </span>
            )}
          </div>

          {/* Profile Completion */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-grey-700">Profile Completion</span>
              <span className="text-sm font-bold text-gold">{completion}%</span>
            </div>
            <div className="w-full bg-grey-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-gold to-gold-dark h-2 rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            {completion < 100 && (
              <p className="text-xs text-grey-500 mt-1">
                Complete your profile to unlock all features
              </p>
            )}
          </div>
        </div>

        {!isEditing && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing(true)}
            icon={<PencilIcon className="w-4 h-4" />}
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* Personal Information Form */}
      <div className="bg-white rounded-xl border border-grey-200 p-6">
        <h3 className="text-lg font-semibold text-grey-900 mb-4">Personal Information</h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              {...register('name')}
              error={errors.name?.message}
              icon={<UserCircleIcon className="w-5 h-5" />}
              disabled={!isEditing}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-grey-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="w-5 h-5 text-grey-400" />
                </div>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-grey-200 rounded-lg bg-grey-50 text-grey-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-grey-400 mt-1 flex items-center gap-1">
                <CheckCircleIcon className="w-3 h-3" />
                Email cannot be changed for security
              </p>
            </div>

            <Input
              label="Phone Number"
              {...register('phone')}
              error={errors.phone?.message}
              icon={<PhoneIcon className="w-5 h-5" />}
              placeholder="+1234567890"
              disabled={!isEditing}
            />

            <div>
              <label className="block text-sm font-medium text-grey-700 mb-2">
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircleIcon className="w-5 h-5 text-grey-400" />
                </div>
                <input
                  type="text"
                  value={profile.role.toUpperCase()}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-grey-200 rounded-lg bg-grey-50 text-grey-500 cursor-not-allowed capitalize"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-grey-100">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting || isUploading}
                icon={<CheckIcon className="w-4 h-4" />}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={handleCancel}
                disabled={isSubmitting}
                icon={<XMarkIcon className="w-4 h-4" />}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-grey-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-grey-500 mb-1">Account Type</p>
              <p className="text-xl font-bold text-grey-900 capitalize">{profile.role}</p>
            </div>
            <div className="p-3 bg-gold-pale rounded-lg">
              <UserCircleIcon className="w-6 h-6 text-gold" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-grey-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-grey-500 mb-1">Verification</p>
              <p className="text-xl font-bold text-grey-900 capitalize">
                {profile.verificationStatus}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              profile.verificationStatus === 'verified' ? 'bg-green-50' : 'bg-orange-50'
            }`}>
              <CheckCircleIcon className={`w-6 h-6 ${
                profile.verificationStatus === 'verified' ? 'text-green-600' : 'text-orange-600'
              }`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-grey-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-grey-500 mb-1">Account Status</p>
              <p className="text-xl font-bold text-grey-900 capitalize">{profile.accountStatus}</p>
            </div>
            <div className={`p-3 rounded-lg ${
              profile.accountStatus === 'active' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <CheckCircleIcon className={`w-6 h-6 ${
                profile.accountStatus === 'active' ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;

