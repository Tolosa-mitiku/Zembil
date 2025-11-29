import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (file: File | null) => void;
  onUpload?: (file: File) => Promise<string>;
  maxSize?: number; // in MB
  shape?: 'circle' | 'square';
  label?: string;
  description?: string;
}

const ImageUpload = ({
  value,
  onChange,
  onUpload,
  maxSize = 5,
  shape = 'circle',
  label,
  description,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File size must be less than ${maxSize}MB`);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Call onChange
      onChange(file);

      // Upload if handler provided
      if (onUpload) {
        setUploading(true);
        try {
          const url = await onUpload(file);
          setPreview(url);
          toast.success('Image uploaded successfully!');
        } catch (error) {
          toast.error('Failed to upload image');
          setPreview(null);
        } finally {
          setUploading(false);
        }
      }
    },
    [maxSize, onChange, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-grey-700 mb-2">{label}</label>
      )}
      
      <div
        {...getRootProps()}
        className={clsx(
          'relative border-2 border-dashed transition-all cursor-pointer group',
          shape === 'circle' ? 'rounded-full w-32 h-32' : 'rounded-xl w-full h-48',
          isDragActive
            ? 'border-gold bg-gold-pale'
            : 'border-grey-300 hover:border-gold hover:bg-grey-50',
          uploading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} disabled={uploading} />

        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className={clsx(
                'w-full h-full object-cover',
                shape === 'circle' ? 'rounded-full' : 'rounded-xl'
              )}
            />
            <button
              onClick={handleRemove}
              disabled={uploading}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
            ) : (
              <>
                {isDragActive ? (
                  <CloudArrowUpIcon className="w-12 h-12 text-gold mb-2" />
                ) : (
                  <PhotoIcon className="w-12 h-12 text-grey-400 mb-2" />
                )}
                <p className="text-sm font-medium text-grey-600 text-center px-4">
                  {isDragActive ? 'Drop image here' : 'Click or drag to upload'}
                </p>
                {description && (
                  <p className="text-xs text-grey-400 mt-1 text-center px-4">{description}</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;

