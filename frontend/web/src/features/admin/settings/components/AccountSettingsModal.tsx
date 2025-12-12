import { useState, useEffect } from 'react';
import Modal from '@/shared/components/Modal';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import ImageUpload from '@/shared/components/ImageUpload';
import { 
  UserCircleIcon, 
  BuildingStorefrontIcon, 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangesSaved: () => void;
  onChangesMade: () => void;
}

const AccountSettingsModal = ({ isOpen, onClose, onChangesSaved, onChangesMade }: AccountSettingsModalProps) => {
  const [formData, setFormData] = useState({
    fullName: 'Admin User',
    email: 'admin@zembil.com',
    phone: '+1 234 567 8900',
    businessName: 'Zembil Admin',
    businessAddress: '123 Admin St, San Francisco, CA',
    bio: 'Platform administrator managing the Zembil marketplace',
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    onChangesMade();
  };

  const handleImageUpload = (file: File) => {
    // In a real app, upload to server
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
      onChangesMade();
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Account settings saved successfully!', {
      icon: '✅',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    
    setIsSaving(false);
    onChangesSaved();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Account & Profile"
      size="lg"
    >
      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center pb-6 border-b border-grey-200">
          <div className="relative group">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-gold shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg">
                <UserCircleIcon className="w-12 h-12 text-white" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-gold rounded-full flex items-center justify-center cursor-pointer hover:bg-gold-dark transition-colors shadow-lg border-2 border-white">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              />
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
          </div>
          <p className="text-sm text-grey-500 mt-3">Click to upload profile picture</p>
        </div>

        {/* Personal Information */}
        <div>
          <h4 className="text-md font-semibold text-grey-900 mb-4 flex items-center gap-2">
            <UserCircleIcon className="w-5 h-5 text-gold" />
            Personal Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              leftIcon={<UserCircleIcon className="w-5 h-5" />}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<EnvelopeIcon className="w-5 h-5" />}
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              leftIcon={<PhoneIcon className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Business Information */}
        <div>
          <h4 className="text-md font-semibold text-grey-900 mb-4 flex items-center gap-2">
            <BuildingStorefrontIcon className="w-5 h-5 text-gold" />
            Admin Details
          </h4>
          <div className="space-y-4">
            <Input
              label="Organization Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              leftIcon={<BuildingStorefrontIcon className="w-5 h-5" />}
              required
            />
            <Input
              label="Office Address"
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleChange}
              leftIcon={<MapPinIcon className="w-5 h-5" />}
            />
            <div>
              <label className="block text-label-large text-grey-900 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-grey-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
                placeholder="Tell about your role..."
              />
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-green-900">Account Verified</h4>
              <p className="text-xs text-green-700 mt-0.5">
                Your admin account has been verified and is in good standing
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-grey-200">
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<CheckCircleIcon className="w-4 h-4" />}
            className="flex-1"
          >
            Save Changes
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

export default AccountSettingsModal;














