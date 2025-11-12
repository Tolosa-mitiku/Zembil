import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/shared/components/Modal';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import { Product } from '../api/productsApi';

const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive').or(
    z.string().transform((val) => parseFloat(val))
  ),
  discountPrice: z.number().positive().optional().or(
    z.string().transform((val) => val ? parseFloat(val) : undefined)
  ),
  stock: z.number().int().min(0, 'Stock must be 0 or more').or(
    z.string().transform((val) => parseInt(val, 10))
  ),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  images: z.string().min(1, 'At least one image URL is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  product?: Product | null;
  isLoading: boolean;
}

const ProductModal = ({ isOpen, onClose, onSubmit, product, isLoading }: ProductModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice,
        stock: product.stock,
        category: product.category,
        brand: product.brand || '',
        images: product.images.join(', '),
      });
    } else {
      reset({
        title: '',
        description: '',
        price: 0,
        discountPrice: undefined,
        stock: 0,
        category: '',
        brand: '',
        images: '',
      });
    }
  }, [product, reset]);

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      const formattedData = {
        ...data,
        images: data.images.split(',').map((url) => url.trim()).filter(Boolean),
      };
      await onSubmit(formattedData);
      reset();
    } catch (error) {
      // Error handling is done by the parent component
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Create Product'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Product Title"
          placeholder="Enter product title"
          error={errors.title?.message}
          {...register('title')}
        />

        <div>
          <label className="block text-label-large text-grey-900 mb-2">
            Description <span className="text-error">*</span>
          </label>
          <textarea
            className="input-base min-h-[100px]"
            placeholder="Enter product description"
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-label-medium text-error">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.price?.message}
            {...register('price', { valueAsNumber: true })}
          />

          <Input
            label="Discount Price"
            type="number"
            step="0.01"
            placeholder="0.00 (optional)"
            error={errors.discountPrice?.message}
            {...register('discountPrice', { valueAsNumber: true })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Stock"
            type="number"
            placeholder="0"
            error={errors.stock?.message}
            {...register('stock', { valueAsNumber: true })}
          />

          <Input
            label="Category"
            placeholder="e.g., Electronics"
            error={errors.category?.message}
            {...register('category')}
          />
        </div>

        <Input
          label="Brand"
          placeholder="Brand name (optional)"
          error={errors.brand?.message}
          {...register('brand')}
        />

        <Input
          label="Image URLs"
          placeholder="Enter comma-separated image URLs"
          helperText="Separate multiple URLs with commas"
          error={errors.images?.message}
          {...register('images')}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;

