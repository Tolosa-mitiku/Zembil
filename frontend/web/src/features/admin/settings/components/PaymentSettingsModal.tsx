import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import { 
  CreditCardIcon, 
  PlusIcon,
  CheckCircleIcon,
  TrashIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface PaymentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangesSaved: () => void;
  onChangesMade: () => void;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  expiryDate?: string;
  isDefault: boolean;
}

const PaymentSettingsModal = ({ isOpen, onClose, onChangesSaved, onChangesMade }: PaymentSettingsModalProps) => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryDate: '12/25',
      isDefault: true,
    },
    {
      id: '2',
      type: 'card',
      last4: '5555',
      brand: 'Mastercard',
      expiryDate: '08/26',
      isDefault: false,
    },
  ]);

  const [billingAddress, setBillingAddress] = useState({
    street: '123 Admin St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'United States',
  });

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );
    toast.success('Default payment method updated!');
    onChangesMade();
  };

  const handleRemoveMethod = (methodId: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
    toast.success('Payment method removed');
    onChangesMade();
  };

  const handleAddCard = () => {
    toast.success('Card added successfully!', {
      icon: '💳',
    });
    setShowAddCard(false);
    onChangesSaved();
  };

  const getCardIcon = (brand?: string) => {
    return <CreditCardIcon className="w-6 h-6" />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Methods"
      size="lg"
    >
      <div className="space-y-6">
        {/* Payment Methods */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-md font-semibold text-grey-900">Saved Payment Methods</h4>
              <p className="text-xs text-grey-500 mt-1">Manage your payment options</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAddCard(!showAddCard)}
              leftIcon={<PlusIcon className="w-4 h-4" />}
            >
              Add Card
            </Button>
          </div>

          {/* Add Card Form */}
          {showAddCard && (
            <div className="mb-4 p-4 border-2 border-gold bg-gold-pale rounded-xl animate-slide-in-from-bottom">
              <h5 className="text-sm font-semibold text-grey-900 mb-3">Add New Card</h5>
              <div className="space-y-3">
                <Input
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  leftIcon={<CreditCardIcon className="w-5 h-5" />}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Expiry Date"
                    placeholder="MM/YY"
                    leftIcon={<CalendarIcon className="w-5 h-5" />}
                  />
                  <Input
                    label="CVV"
                    placeholder="123"
                    leftIcon={<CheckCircleIcon className="w-5 h-5" />}
                  />
                </div>
                <Input
                  label="Cardholder Name"
                  placeholder="John Doe"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddCard}>
                    Add Card
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddCard(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Saved Cards */}
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                  method.isDefault
                    ? 'border-gold bg-gold-pale'
                    : 'border-grey-200 hover:border-grey-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  method.type === 'card' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {method.type === 'card' ? (
                    getCardIcon(method.brand)
                  ) : (
                    <BuildingLibraryIcon className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-sm font-semibold text-grey-900">
                      {method.brand} •••• {method.last4}
                    </h5>
                    {method.isDefault && (
                      <span className="px-2 py-0.5 bg-gold text-white text-xs font-medium rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  {method.expiryDate && (
                    <p className="text-xs text-grey-500">Expires {method.expiryDate}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <button
                    onClick={() => handleRemoveMethod(method.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Address */}
        <div className="border border-grey-200 rounded-xl p-5">
          <h4 className="text-md font-semibold text-grey-900 mb-4">Billing Address</h4>
          <div className="space-y-3">
            <Input
              label="Street Address"
              value={billingAddress.street}
              onChange={(e) => {
                setBillingAddress({ ...billingAddress, street: e.target.value });
                onChangesMade();
              }}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City"
                value={billingAddress.city}
                onChange={(e) => {
                  setBillingAddress({ ...billingAddress, city: e.target.value });
                  onChangesMade();
                }}
              />
              <Input
                label="State"
                value={billingAddress.state}
                onChange={(e) => {
                  setBillingAddress({ ...billingAddress, state: e.target.value });
                  onChangesMade();
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="ZIP Code"
                value={billingAddress.zip}
                onChange={(e) => {
                  setBillingAddress({ ...billingAddress, zip: e.target.value });
                  onChangesMade();
                }}
              />
              <Input
                label="Country"
                value={billingAddress.country}
                onChange={(e) => {
                  setBillingAddress({ ...billingAddress, country: e.target.value });
                  onChangesMade();
                }}
              />
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="border border-grey-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-md font-semibold text-grey-900 flex items-center gap-2">
                <ReceiptPercentIcon className="w-5 h-5 text-gold" />
                Recent Transactions
              </h4>
              <p className="text-xs text-grey-500 mt-1">View your payment history</p>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-grey-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-grey-900">Payment received</div>
                    <div className="text-xs text-grey-500">Jan {15 + idx}, 2024</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">+$299.00</div>
                  <div className="text-xs text-grey-500">Completed</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-grey-200">
          <Button
            onClick={() => {
              toast.success('Payment settings saved!');
              onChangesSaved();
            }}
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

export default PaymentSettingsModal;




