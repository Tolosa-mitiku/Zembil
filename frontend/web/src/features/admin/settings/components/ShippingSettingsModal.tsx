import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import { 
  MapPinIcon, 
  PlusIcon,
  CheckCircleIcon,
  TrashIcon,
  PencilIcon,
  HomeIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ShippingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangesSaved: () => void;
  onChangesMade: () => void;
}

interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
  type: 'home' | 'office';
}

const ShippingSettingsModal = ({ isOpen, onClose, onChangesSaved, onChangesMade }: ShippingSettingsModalProps) => {
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Main Office',
      name: 'Admin User',
      street: '123 Admin Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'United States',
      phone: '+1 234 567 8900',
      isDefault: true,
      type: 'office',
    },
    {
      id: '2',
      label: 'Secondary Office',
      name: 'Admin User',
      street: '456 Business Ave, Suite 200',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'United States',
      phone: '+1 234 567 8901',
      isDefault: false,
      type: 'office',
    },
  ]);

  const [newAddress, setNewAddress] = useState({
    label: '',
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: '',
    type: 'office' as 'home' | 'office',
  });

  const handleSetDefault = (addressId: string) => {
    setAddresses(prev =>
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))
    );
    toast.success('Default address updated!');
    onChangesMade();
  };

  const handleRemoveAddress = (addressId: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    toast.success('Address removed');
    onChangesMade();
  };

  const handleAddAddress = () => {
    const newAddr: Address = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, newAddr]);
    toast.success('Address added successfully!', {
      icon: '📍',
    });
    setShowAddAddress(false);
    setNewAddress({
      label: '',
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
      phone: '',
      type: 'office',
    });
    onChangesSaved();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Shipping & Addresses"
      size="lg"
    >
      <div className="space-y-6">
        {/* Addresses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-md font-semibold text-grey-900">Saved Addresses</h4>
              <p className="text-xs text-grey-500 mt-1">Manage your delivery locations</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAddAddress(!showAddAddress)}
              leftIcon={<PlusIcon className="w-4 h-4" />}
            >
              Add Address
            </Button>
          </div>

          {/* Add Address Form */}
          {showAddAddress && (
            <div className="mb-4 p-4 border-2 border-gold bg-gold-pale rounded-xl animate-slide-in-from-bottom">
              <h5 className="text-sm font-semibold text-grey-900 mb-3">Add New Address</h5>
              <div className="space-y-3">
                <Input
                  label="Label (e.g., Home, Office)"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  placeholder="Main Office"
                />
                <Input
                  label="Full Name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  placeholder="Admin User"
                />
                <Input
                  label="Street Address"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  placeholder="123 Main Street"
                  leftIcon={<MapPinIcon className="w-5 h-5" />}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    placeholder="San Francisco"
                  />
                  <Input
                    label="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    placeholder="CA"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="ZIP Code"
                    value={newAddress.zip}
                    onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                    placeholder="94102"
                  />
                  <Input
                    label="Phone"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <label className="block text-label-large text-grey-900 mb-2">Type</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setNewAddress({ ...newAddress, type: 'home' })}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all ${
                        newAddress.type === 'home'
                          ? 'border-gold bg-gold-pale'
                          : 'border-grey-200 hover:border-grey-300'
                      }`}
                    >
                      <HomeIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Home</span>
                    </button>
                    <button
                      onClick={() => setNewAddress({ ...newAddress, type: 'office' })}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all ${
                        newAddress.type === 'office'
                          ? 'border-gold bg-gold-pale'
                          : 'border-grey-200 hover:border-grey-300'
                      }`}
                    >
                      <BuildingOfficeIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Office</span>
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={handleAddAddress}>
                    Add Address
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddAddress(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Saved Addresses */}
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border-2 rounded-xl transition-all ${
                  address.isDefault
                    ? 'border-gold bg-gold-pale'
                    : 'border-grey-200 hover:border-grey-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    address.type === 'home' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {address.type === 'home' ? (
                      <HomeIcon className="w-6 h-6 text-blue-600" />
                    ) : (
                      <BuildingOfficeIcon className="w-6 h-6 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="text-sm font-semibold text-grey-900">{address.label}</h5>
                      {address.isDefault && (
                        <span className="px-2 py-0.5 bg-gold text-white text-xs font-medium rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-grey-900 mb-1">{address.name}</p>
                    <p className="text-sm text-grey-600">
                      {address.street}<br />
                      {address.city}, {address.state} {address.zip}<br />
                      {address.country}
                    </p>
                    <p className="text-sm text-grey-500 mt-2">{address.phone}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!address.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingAddress(address.id)}
                        className="p-2 text-gold hover:bg-gold-pale rounded-lg transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveAddress(address.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Preferences */}
        <div className="border border-grey-200 rounded-xl p-5">
          <h4 className="text-md font-semibold text-grey-900 mb-4">Shipping Preferences</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-grey-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-grey-900">Address Validation</div>
                <div className="text-xs text-grey-500 mt-0.5">Verify addresses automatically</div>
              </div>
              <button
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gold"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-grey-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-grey-900">Save New Addresses</div>
                <div className="text-xs text-grey-500 mt-0.5">Automatically save shipping addresses</div>
              </div>
              <button
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gold"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
              </button>
            </div>
          </div>
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

export default ShippingSettingsModal;




