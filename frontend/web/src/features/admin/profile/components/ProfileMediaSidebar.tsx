import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  UserCircleIcon, 
  CameraIcon, 
  CheckBadgeIcon,
  CalendarIcon,
  BuildingStorefrontIcon,
  PencilIcon,
  PhotoIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';
import { formatDate } from '@/core/utils/format';
import { AdminProfile } from '../api/profileApi';
import Button from '@/shared/components/Button';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface ProfileMediaSidebarProps {
  profile: AdminProfile;
  onUpdateCover: (file: File) => Promise<void>;
  onUpdateAvatar: (file: File) => Promise<void>;
  onEditProfile: () => void;
  isEditing: boolean;
}

const ProfileMediaSidebar = ({
  profile,
  onUpdateCover,
  onUpdateAvatar,
  onEditProfile,
  isEditing,
}: ProfileMediaSidebarProps) => {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Avatar dropzone
  const { getRootProps: getAvatarProps, getInputProps: getAvatarInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setUploadingAvatar(true);
      try {
        await onUpdateAvatar(file);
        setAvatarPreview(null);
      } catch (error) {
        setAvatarPreview(null);
      } finally {
        setUploadingAvatar(false);
      }
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
  });

  // Cover dropzone
  const { getRootProps: getCoverProps, getInputProps: getCoverInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setUploadingCover(true);
      try {
        await onUpdateCover(file);
        setCoverPreview(null);
      } catch (error) {
        setCoverPreview(null);
      } finally {
        setUploadingCover(false);
      }
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
  });

  return (
    <div className="sticky top-24 space-y-6">
      {/* Main Media Card */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden transition-all duration-300 hover:shadow-2xl">
          
          {/* Cover Photo Section */}
          <div className="relative">
            <div
              {...getCoverProps()}
              className={clsx(
                'relative w-full h-48 overflow-hidden cursor-pointer group/cover',
                isDragActive && 'ring-4 ring-purple-500'
              )}
            >
              <input {...getCoverInputProps()} />
              
              {/* Cover Image or Placeholder */}
              {coverPreview || profile.coverImage ? (
                <>
                  <img
                    src={coverPreview || profile.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/cover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center">
                  <PhotoIcon className="w-16 h-16 text-white/50" />
                </div>
              )}

              {/* Upload Overlay */}
              <div className={clsx(
                'absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300',
                isDragActive ? 'opacity-100' : 'opacity-0 group-hover/cover:opacity-100'
              )}>
                {uploadingCover ? (
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20"></div>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white absolute top-0 left-0"></div>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full mb-2 group-hover/cover:scale-110 transition-transform duration-300">
                      <CameraIcon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-white text-sm font-medium">
                      {isDragActive ? 'Drop cover photo here' : 'Change Cover Photo'}
                    </p>
                    <p className="text-white/70 text-xs mt-1">16:9 recommended, max 5MB</p>
                  </>
                )}
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4">
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300">
                  <PencilIcon className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Avatar Section - Overlapping Cover */}
            <div className="absolute -bottom-16 left-6">
              <div
                {...getAvatarProps()}
                className="relative w-32 h-32 rounded-2xl border-4 border-white bg-white shadow-2xl group/avatar overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:rotate-2"
              >
                <input {...getAvatarInputProps()} />
                
                {/* Avatar Image or Placeholder */}
                {avatarPreview || profile.image ? (
                  <img
                    src={avatarPreview || profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500">
                    <UserCircleIcon className="w-20 h-20 text-white/80" />
                  </div>
                )}

                {/* Upload Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                  {uploadingAvatar ? (
                    <div className="relative">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/20"></div>
                      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-white absolute top-0 left-0"></div>
                    </div>
                  ) : (
                    <>
                      <CameraIcon className="w-6 h-6 text-white mb-1" />
                      <p className="text-white text-xs font-medium">Upload</p>
                    </>
                  )}
                </div>

                {/* Verification Badge */}
                {profile.verificationStatus === 'verified' && (
                  <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-lg">
                    <CheckBadgeIcon className="w-6 h-6 text-blue-500" title="Verified Admin" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="px-6 pt-20 pb-6">
            {/* Name and Business */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {profile.name}
                    </h2>
                    {profile.verificationStatus === 'verified' && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500 text-white rounded-full text-xs font-medium shadow-lg shadow-blue-500/50">
                        <SparklesIcon className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                  </div>
                  
                  {profile.businessName && (
                    <div className="flex items-center gap-2 text-grey-600 mb-2">
                      <BuildingStorefrontIcon className="w-4 h-4 text-purple-500" />
                      <p className="font-medium">{profile.businessName}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-grey-500">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Joined {formatDate(profile.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Role Badge */}
              <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg shadow-purple-500/50 capitalize">
                {profile.role}
              </div>
            </div>

            {/* Edit Profile Button */}
            {!isEditing && (
              <Button
                onClick={onEditProfile}
                className="w-full justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/50 hover:scale-105 transition-all duration-300"
                leftIcon={<PencilIcon className="w-4 h-4" />}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Card */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent uppercase tracking-wide">
              Quick Stats
            </h4>
          </div>
          
          <div className="space-y-3">
            {/* Profile Completion */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-3 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-grey-700">Profile Completion</span>
                <span className="text-sm font-bold text-green-600">
                  {profile.profileCompletion || 85}%
                </span>
              </div>
              <div className="relative h-2 bg-grey-200 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500 shadow-lg shadow-green-500/50"
                  style={{ width: `${profile.profileCompletion || 85}%` }}
                />
              </div>
            </div>

            {/* Total Users */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-3 border border-purple-200 group/stat hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-grey-700">Total Users</span>
                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {profile.totalProducts || 0}
                </span>
              </div>
            </div>

            {/* Total Orders */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-3 border border-blue-200 group/stat hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-grey-700">Total Orders</span>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {profile.totalOrders || 0}
                </span>
              </div>
            </div>

            {/* Platform Uptime */}
            {profile.customerSatisfaction && (
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50 p-3 border border-orange-200 group/stat hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-grey-700">System Health</span>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                      {profile.customerSatisfaction}%
                    </span>
                    <SparklesIcon className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMediaSidebar;

