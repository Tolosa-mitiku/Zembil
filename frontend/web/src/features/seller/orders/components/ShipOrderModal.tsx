import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/shared/components/Modal';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';

const shipOrderSchema = z.object({
  trackingNumber: z.string().min(1, 'Tracking number is required'),
  carrier: z.string().min(1, 'Carrier is required'),
  estimatedDelivery: z.string().optional(),
});

type ShipOrderFormData = z.infer<typeof shipOrderSchema>;

interface ShipOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ShipOrderFormData) => Promise<void>;
  isLoading: boolean;
}

const ShipOrderModal = ({ isOpen, onClose, onSubmit, isLoading }: ShipOrderModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShipOrderFormData>({
    resolver: zodResolver(shipOrderSchema),
  });

  const handleFormSubmit = async (data: ShipOrderFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ship Order"
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Carrier"
          placeholder="e.g., FedEx, UPS, DHL"
          error={errors.carrier?.message}
          {...register('carrier')}
        />

        <Input
          label="Tracking Number"
          placeholder="Enter tracking number"
          error={errors.trackingNumber?.message}
          {...register('trackingNumber')}
        />

        <Input
          label="Estimated Delivery Date"
          type="date"
          helperText="Optional"
          error={errors.estimatedDelivery?.message}
          {...register('estimatedDelivery')}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Ship Order
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ShipOrderModal;

