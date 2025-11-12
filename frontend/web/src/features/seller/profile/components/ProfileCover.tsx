import { useState } from 'react';
import { PencilIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface ProfileCoverProps {
  image?: string;
  onUpload: (file: File) => Promise<void>;
  isEditable?: boolean;
}

const ProfileCover = ({ image, onUpload, isEditable = true }: ProfileCoverProps) => {
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setUploading(true);
      try {
        await onUpload(file);
        toast.success('Cover photo updated successfully!');
      } catch (error) {
        toast.error('Failed to upload cover photo');
      } finally {
        setUploading(false);
      }
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    disabled: !isEditable || uploading,
  });

  return (
    <div className="relative w-full h-48 md:h-64 rounded-t-xl overflow-hidden group bg-gradient-to-r from-grey-100 to-grey-200">
      {image ? (
        <>
          <img
            src={image}
            alt="Cover"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-grey-100">
          <PhotoIcon className="w-12 h-12 text-grey-300" />
        </div>
      )}

      {isEditable && (
        <div
          {...getRootProps()}
          className={clsx(
            'absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 cursor-pointer',
            isDragActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
            uploading && 'cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          <div className="text-white text-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2" />
            ) : (
              <>
                <PencilIcon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">
                  {isDragActive ? 'Drop cover photo here' : 'Change Cover Photo'}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCover;

