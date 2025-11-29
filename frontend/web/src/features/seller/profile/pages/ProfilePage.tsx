import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckIcon,
  XMarkIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CalendarIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { 
  useGetSellerProfileQuery, 
  useUpdateSellerProfileMutation,
  useUploadProfileAvatarMutation,
  useUploadCoverImageMutation
} from '../api/profileApi';
import { useAppSelector } from '@/store/hooks';
import ProfileMediaSidebar from '../components/ProfileMediaSidebar';
import ProfilePageSkeleton from '../components/ProfilePageSkeleton';
import { formatDate } from '@/core/utils/format';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
  businessDescription: z.string().max(500, 'Max 500 characters').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { data: profile, isLoading, error } = useGetSellerProfileQuery();
  const [updateProfile] = useUpdateSellerProfileMutation();
  const [uploadAvatar] = useUploadProfileAvatarMutation();
  const [uploadCover] = useUploadCoverImageMutation();
  
  const [isEditing, setIsEditing] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  // Use fallback data if API fails
  const profileData = profile || {
    _id: user?.uid || '',
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    role: user?.role || 'seller',
    verificationStatus: 'pending' as const,
    accountStatus: 'active' as const,
    createdAt: new Date().toISOString(),
    image: user?.image,
    coverImage: '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: profileData.name || '',
      phone: profileData.phone || '',
      businessName: profileData.businessName || '',
      businessAddress: profileData.businessAddress || '',
      businessDescription: profileData.businessDescription || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data).unwrap();
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
    try {
      const formData = new FormData();
      formData.append('image', file);
      await uploadAvatar(formData).unwrap();
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      toast.error('Failed to upload profile picture');
      throw error;
    }
  };

  const handleCoverUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      await uploadCover(formData).unwrap();
      toast.success('Cover photo updated successfully!');
    } catch (error) {
      toast.error('Failed to upload cover photo');
      throw error;
    }
  };

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  // Show warning if API error but continue with fallback data
  if (error) {
    console.error('Profile API error:', error);
  }

  return (
    <div className="min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <UserCircleIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Profile Settings
              </h1>
              <p className="text-sm text-grey-600 mt-1">Manage your public profile and account settings</p>
            </div>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN - Main Content (60-65%) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            
            {/* Personal Information Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                      <UserCircleIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Personal Information
                    </h3>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Input
                        label="Full Name"
                        {...register('name')}
                        error={errors.name?.message}
                        leftIcon={<UserCircleIcon className="w-5 h-5" />}
                        disabled={!isEditing}
                        className="bg-white/80 transition-all duration-300 focus:bg-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-grey-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className="w-5 h-5 text-grey-400" />
                        </div>
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="w-full pl-10 pr-4 py-3 border border-grey-200 rounded-xl bg-grey-50 text-grey-600 cursor-not-allowed transition-all duration-300"
                        />
                      </div>
                      <p className="text-xs text-grey-500 mt-2 flex items-center gap-1">
                        <ShieldCheckIcon className="w-3 h-3" />
                        Email cannot be changed for security reasons
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        label="Phone Number"
                        {...register('phone')}
                        error={errors.phone?.message}
                        leftIcon={<PhoneIcon className="w-5 h-5" />}
                        placeholder="+1 (555) 000-0000"
                        disabled={!isEditing}
                        className="bg-white/80 transition-all duration-300 focus:bg-white"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Business Information Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-lg">
                    <BuildingStorefrontIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Business Information
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input
                      label="Business Name"
                      {...register('businessName')}
                      error={errors.businessName?.message}
                      placeholder="e.g., Acme Corporation"
                      disabled={!isEditing}
                      className="bg-white/80 transition-all duration-300 focus:bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Business Address"
                      {...register('businessAddress')}
                      error={errors.businessAddress?.message}
                      leftIcon={<MapPinIcon className="w-5 h-5" />}
                      placeholder="123 Business St, City, Country"
                      disabled={!isEditing}
                      className="bg-white/80 transition-all duration-300 focus:bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-grey-700 mb-2">
                      Business Description
                    </label>
                    <textarea
                      {...register('businessDescription')}
                      rows={4}
                      placeholder="Tell us about your business..."
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 ${
                        isEditing
                          ? 'border-grey-300 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white'
                          : 'border-grey-200 bg-grey-50 text-grey-700 cursor-not-allowed'
                      }`}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.businessDescription && (
                        <p className="text-sm text-red-500">{errors.businessDescription.message}</p>
                      )}
                      <p className="text-xs text-grey-500 ml-auto">Max 500 characters</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Statistics Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg shadow-lg">
                    <ShieldCheckIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                    Account Status
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-4 border border-green-200 group/card hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -mr-10 -mt-10 group-hover/card:scale-150 transition-transform duration-500"></div>
                    <div className="relative">
                      <p className="text-sm font-medium text-grey-600 mb-2">Verification Status</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold inline-flex items-center gap-1 ${
                          profileData.verificationStatus === 'verified' 
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/50' 
                            : 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50'
                        }`}>
                          {profileData.verificationStatus === 'verified' && <CheckBadgeIcon className="w-4 h-4" />}
                          {profileData.verificationStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4 border border-blue-200 group/card hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full -mr-10 -mt-10 group-hover/card:scale-150 transition-transform duration-500"></div>
                    <div className="relative">
                      <p className="text-sm font-medium text-grey-600 mb-2">Account Status</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                          profileData.accountStatus === 'active' 
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/50' 
                            : 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                        }`}>
                          {profileData.accountStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 border border-purple-200 group/card hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -mr-10 -mt-10 group-hover/card:scale-150 transition-transform duration-500"></div>
                    <div className="relative">
                      <p className="text-sm font-medium text-grey-600 mb-2">Role</p>
                      <p className="text-lg font-bold text-grey-900 capitalize">{profileData.role}</p>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50 p-4 border border-orange-200 group/card hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full -mr-10 -mt-10 group-hover/card:scale-150 transition-transform duration-500"></div>
                    <div className="relative">
                      <p className="text-sm font-medium text-grey-600 mb-2 flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        Member Since
                      </p>
                      <p className="text-sm font-semibold text-grey-900">{formatDate(profileData.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="sticky bottom-4 z-20 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 p-4 shadow-2xl flex justify-end gap-3 animate-in slide-in-from-bottom duration-300">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  leftIcon={<XMarkIcon className="w-4 h-4" />}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="profile-form"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  leftIcon={<CheckIcon className="w-4 h-4" />}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/50 hover:scale-105 transition-all duration-200"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Media Sidebar (35-40%) */}
          <div className="lg:col-span-5 xl:col-span-5">
            <ProfileMediaSidebar
              profile={profileData}
              onUpdateCover={handleCoverUpload}
              onUpdateAvatar={handleAvatarUpload}
              onEditProfile={() => setIsEditing(true)}
              isEditing={isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
