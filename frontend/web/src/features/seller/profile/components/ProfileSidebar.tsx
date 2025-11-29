import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UserCircleIcon, CameraIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { formatDate } from '@/core/utils/format';
import { SellerProfile } from '../api/profileApi';
import ProfileCover from './ProfileCover';
import Button from '@/shared/components/Button';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface ProfileSidebarProps {
  profile: SellerProfile;
  onUpdateCover: (file: File) => Promise<void>;
  onUpdateAvatar: (file: File) => Promise<void>;
  onEditProfile: () => void;
  isEditing: boolean;
}

const ProfileSidebar = ({
  profile,
  onUpdateCover,
  onUpdateAvatar,
  onEditProfile,
  isEditing,
}: ProfileSidebarProps) => {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { getRootProps: getAvatarProps, getInputProps: getAvatarInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setUploadingAvatar(true);
      try {
        await onUpdateAvatar(file);
        toast.success('Profile picture updated successfully!');
      } catch (error) {
        toast.error('Failed to upload profile picture');
      } finally {
        setUploadingAvatar(false);
      }
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    disabled: !isEditing || uploadingAvatar,
  });

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden sticky top-24">
      {/* Cover Photo */}
      <ProfileCover
        image={profile.coverImage}
        onUpload={onUpdateCover}
        isEditable={isEditing}
      />

      {/* Profile Info */}
      <div className="px-6 pb-6 relative">
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          <div
            {...getAvatarProps()}
            className={clsx(
              'relative w-32 h-32 rounded-full border-4 border-white bg-white shadow-md group overflow-hidden cursor-pointer',
              !isEditing && 'cursor-default'
            )}
          >
            <input {...getAvatarInputProps()} />
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold to-gold-dark">
                <UserCircleIcon className="w-24 h-24 text-white/80" />
              </div>
            )}

            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {uploadingAvatar ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                ) : (
                  <CameraIcon className="w-8 h-8 text-white" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-20">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-grey-900">{profile.name}</h2>
            {profile.verificationStatus === 'verified' && (
              <CheckBadgeIcon className="w-6 h-6 text-blue-500" title="Verified Seller" />
            )}
          </div>
          
          {profile.businessName && (
            <p className="text-grey-600 font-medium mb-2">{profile.businessName}</p>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-pale text-gold-dark capitalize">
              {profile.role}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-grey-100 text-grey-600">
              Member since {formatDate(profile.createdAt)}
            </span>
          </div>

          {!isEditing && (
            <Button
              onClick={onEditProfile}
              className="w-full justify-center"
              variant="secondary"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;

