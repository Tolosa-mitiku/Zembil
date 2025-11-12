import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  Cog6ToothIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  useGetSellerProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from '../api/productsApi';
import {
  ImageGalleryEditor,
  RichTextEditor,
  CurrencyInput,
  TagInput,
  AutoSaveIndicator,
  UnsavedChangesModal,
  SectionNavigation,
  ImageItem,
  ProductEditSkeleton,
} from '../components';
import { productFormSchema, ProductFormData } from '../validation/productSchema';
import Input from '@/shared/components/Input';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const ProductEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewProduct = id === 'new';

  // Fetch existing product data if editing
  const { data: existingProduct, isLoading: isLoadingProduct } = useGetSellerProductQuery(id!, {
    skip: isNewProduct,
  });

  // Mutations
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // Form state
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price: 0,
      stockQuantity: 0,
      images: [],
      status: 'active',
      isFeatured: false,
      tags: [],
      trackInventory: true,
      taxable: true,
      shipping: {
        requiresShipping: true,
      },
    },
  });

  // UI State
  const [activeSection, setActiveSection] = useState('basic');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Auto-save timer
  const autoSaveTimer = useRef<NodeJS.Timeout>();
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Block navigation if there are unsaved changes (simple implementation)
  // Note: For production, consider using a proper blocker pattern

  // Load existing product data
  useEffect(() => {
    if (existingProduct && !isNewProduct) {
      const imageItems: ImageItem[] = (existingProduct.images || []).map((url, index) => ({
        id: `existing-${index}`,
        url,
        isPrimary: index === 0,
      }));

      setImages(imageItems);

      reset({
        title: existingProduct.title,
        description: existingProduct.description,
        category: existingProduct.category,
        brand: existingProduct.brand,
        sku: existingProduct.sku,
        price: existingProduct.price,
        compareAtPrice: existingProduct.discountPrice,
        stockQuantity: existingProduct.stock || existingProduct.stockQuantity || 0,
        images: existingProduct.images,
        tags: existingProduct.tags || [],
        status: existingProduct.status as any,
        isFeatured: existingProduct.isFeatured,
        trackInventory: true,
        taxable: true,
        shipping: {
          requiresShipping: true,
        },
      });
    }
  }, [existingProduct, isNewProduct, reset]);

  // Auto-save functionality
  useEffect(() => {
    if (isDirty && !isNewProduct) {
      // Clear existing timer
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }

      // Set new timer for 30 seconds
      autoSaveTimer.current = setTimeout(() => {
        handleAutoSave();
      }, 30000);
    }

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [isDirty, watch()]);

  const handleAutoSave = async () => {
    if (!isDirty || isNewProduct) return;

    setAutoSaveStatus('saving');

    try {
      const data = watch();
      await updateProduct({
        id: id!,
        data: {
          ...data,
          stock: data.stockQuantity,
        },
      }).unwrap();

      setAutoSaveStatus('saved');
      setLastSaved(new Date());

      // Reset to idle after 2 seconds
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (error) {
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    }
  };

  // Handle form submission
  const onSubmit = async (data: ProductFormData) => {
    try {
      const imageUrls = (images || []).map((img) => img.url);

      const productData = {
        ...data,
        images: imageUrls,
        stock: data.stockQuantity,
      };

      if (isNewProduct) {
        const result = await createProduct(productData as any).unwrap();
        toast.success('Product created successfully!');
        navigate(`/seller/products/${result._id}`);
      } else {
        await updateProduct({
          id: id!,
          data: productData as any,
        }).unwrap();
        toast.success('Product updated successfully!');
        navigate(`/seller/products/${id}`);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save product');
    }
  };

  // Handle navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleDiscardChanges = () => {
    setShowUnsavedModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
  };

  const handleSaveAndContinue = async () => {
    await handleSubmit(onSubmit)();
    setShowUnsavedModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
  };

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  // Handle image upload
  const handleImageUpload = async (files: File[]): Promise<string[]> => {
    // Simulate upload - replace with actual upload logic
    return files.map((file) => URL.createObjectURL(file));
  };

  if (isLoadingProduct && !isNewProduct) {
    return <ProductEditSkeleton />;
  }

  const isSaving = isCreating || isUpdating;

  return (
    <div className="min-h-screen bg-gradient-to-br from-grey-50 via-white to-gold/5">
      {/* Fixed Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-grey-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/seller/products')}
                className="p-2 rounded-lg hover:bg-grey-100 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-grey-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-grey-900">
                  {isNewProduct ? 'Create New Product' : 'Edit Product'}
                </h1>
                <p className="text-sm text-grey-500">
                  {isNewProduct ? 'Fill in the details below' : `Editing: ${existingProduct?.title}`}
                </p>
              </div>
            </div>

            {/* Middle: Auto-save indicator */}
            <AutoSaveIndicator
              status={autoSaveStatus}
              lastSaved={lastSaved}
              className="hidden md:flex"
            />

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(isNewProduct ? '/seller/products' : `/seller/products/${id}`)}
                className="px-4 py-2 rounded-xl border-2 border-grey-200 text-grey-700 font-semibold hover:border-grey-300 transition-all flex items-center gap-2"
              >
                <XMarkIcon className="w-5 h-5" />
                Cancel
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSaving || (!isDirty && !isNewProduct)}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    {isNewProduct ? 'Create Product' : 'Save Changes'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar: Image Gallery + Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Image Gallery */}
            <div className="sticky top-24 space-y-6">
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <ImageGalleryEditor
                    images={images || []}
                    onImagesChange={(newImages) => {
                      setImages(newImages);
                      field.onChange((newImages || []).map((img) => img.url));
                    }}
                    onUpload={handleImageUpload}
                    maxImages={10}
                    maxSizePerImage={5}
                  />
                )}
              />

              {/* Section Navigation */}
              <div className="hidden lg:block">
                <SectionNavigation
                  activeSection={activeSection}
                  onSectionClick={scrollToSection}
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Form Sections */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-6"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* SECTION 1: Basic Information */}
              <div
                ref={(el) => (sectionRefs.current['basic'] = el)}
                className="p-6 rounded-2xl bg-white border-2 border-grey-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gold/10">
                    <DocumentTextIcon className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-grey-900">Basic Information</h2>
                    <p className="text-sm text-grey-500">Essential product details</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Product Title */}
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Product Title"
                        placeholder="Enter product title..."
                        error={errors.title?.message}
                        required
                        maxLength={200}
                      />
                    )}
                  />

                  {/* Description */}
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        label="Description"
                        placeholder="Describe your product in detail..."
                        error={errors.description?.message}
                        required
                        maxLength={5000}
                        minLength={10}
                      />
                    )}
                  />

                  {/* Category & Brand (Grid) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-semibold text-grey-700 mb-2">
                            Category <span className="text-red-500">*</span>
                          </label>
                          <select
                            {...field}
                            className={clsx(
                              'w-full px-4 py-3 rounded-xl border-2 transition-all outline-none text-base',
                              errors.category
                                ? 'border-red-500 ring-2 ring-red-100'
                                : 'border-grey-300 focus:border-gold focus:ring-2 focus:ring-gold/20'
                            )}
                          >
                            <option value="">Select a category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Home & Garden">Home & Garden</option>
                            <option value="Sports">Sports</option>
                            <option value="Books">Books</option>
                            <option value="Toys">Toys</option>
                          </select>
                          {errors.category && (
                            <p className="mt-2 text-sm text-red-500">{errors.category.message}</p>
                          )}
                        </div>
                      )}
                    />

                    <Controller
                      name="brand"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Brand"
                          placeholder="e.g., Nike, Apple..."
                          error={errors.brand?.message}
                        />
                      )}
                    />
                  </div>

                  {/* SKU */}
                  <Controller
                    name="sku"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="SKU (Stock Keeping Unit)"
                        placeholder="e.g., PROD-12345"
                        error={errors.sku?.message}
                        helperText="Unique identifier for inventory tracking"
                      />
                    )}
                  />
                </div>
              </div>

              {/* SECTION 2: Pricing & Discounts */}
              <div
                ref={(el) => (sectionRefs.current['pricing'] = el)}
                className="p-6 rounded-2xl bg-white border-2 border-grey-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-green-100">
                    <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-grey-900">Pricing & Discounts</h2>
                    <p className="text-sm text-grey-500">Set your pricing strategy</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Price & Compare At Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="price"
                      control={control}
                      render={({ field }) => (
                        <CurrencyInput
                          value={field.value}
                          onChange={field.onChange}
                          label="Price"
                          error={errors.price?.message}
                          required
                          helperText="Regular selling price"
                        />
                      )}
                    />

                    <Controller
                      name="compareAtPrice"
                      control={control}
                      render={({ field }) => (
                        <CurrencyInput
                          value={field.value || 0}
                          onChange={field.onChange}
                          label="Compare at Price"
                          error={errors.compareAtPrice?.message}
                          helperText="Original price (for showing discounts)"
                        />
                      )}
                    />
                  </div>

                  {/* Tax Settings */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-grey-50">
                    <Controller
                      name="taxable"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="w-5 h-5 rounded border-grey-300 text-gold focus:ring-gold"
                        />
                      )}
                    />
                    <div>
                      <p className="text-sm font-semibold text-grey-900">Charge tax on this product</p>
                      <p className="text-xs text-grey-500">Tax will be calculated at checkout</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Inventory & Variants */}
              <div
                ref={(el) => (sectionRefs.current['inventory'] = el)}
                className="p-6 rounded-2xl bg-white border-2 border-grey-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-purple-100">
                    <CubeIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-grey-900">Inventory & Stock</h2>
                    <p className="text-sm text-grey-500">Manage stock levels</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Stock Quantity */}
                  <Controller
                    name="stockQuantity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        label="Stock Quantity"
                        placeholder="0"
                        error={errors.stockQuantity?.message}
                        required
                        min={0}
                      />
                    )}
                  />

                  {/* Track Inventory */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-grey-50">
                    <Controller
                      name="trackInventory"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="w-5 h-5 rounded border-grey-300 text-gold focus:ring-gold"
                        />
                      )}
                    />
                    <div>
                      <p className="text-sm font-semibold text-grey-900">Track inventory for this product</p>
                      <p className="text-xs text-grey-500">Automatically update stock when orders are placed</p>
                    </div>
                  </div>

                  {/* Barcode & Weight */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="barcode"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Barcode"
                          placeholder="e.g., 123456789012"
                          error={errors.barcode?.message}
                        />
                      )}
                    />

                    <Controller
                      name="weight"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          label="Weight (kg)"
                          placeholder="0.0"
                          error={errors.weight?.message}
                          step="0.1"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Product Details & Specifications */}
              <div
                ref={(el) => (sectionRefs.current['details'] = el)}
                className="p-6 rounded-2xl bg-white border-2 border-grey-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-blue-100">
                    <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-grey-900">Product Details</h2>
                    <p className="text-sm text-grey-500">Additional product information</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-700">
                      Add detailed specifications, features, and other information to help customers make informed decisions.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 5: SEO & Metadata */}
              <div
                ref={(el) => (sectionRefs.current['seo'] = el)}
                className="p-6 rounded-2xl bg-white border-2 border-grey-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-indigo-100">
                    <MagnifyingGlassIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-grey-900">SEO & Discoverability</h2>
                    <p className="text-sm text-grey-500">Optimize for search engines</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Tags */}
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <TagInput
                        value={field.value || []}
                        onChange={field.onChange}
                        label="Product Tags"
                        placeholder="Type and press Enter..."
                        error={errors.tags?.message}
                        maxTags={20}
                        suggestions={['New Arrival', 'Best Seller', 'Limited Edition', 'Trending', 'Sale']}
                      />
                    )}
                  />

                  {/* Meta Description */}
                  <Controller
                    name="metaDescription"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-semibold text-grey-700 mb-2">
                          Meta Description
                        </label>
                        <textarea
                          {...field}
                          placeholder="Brief description for search engines (160 characters max)"
                          maxLength={160}
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border-2 border-grey-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                        />
                        <p className="mt-1 text-xs text-grey-500">
                          {(field.value?.length || 0)} / 160 characters
                        </p>
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* SECTION 6: Shipping & Fulfillment */}
              <div
                ref={(el) => (sectionRefs.current['shipping'] = el)}
                className="p-6 rounded-2xl bg-white border-2 border-grey-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-orange-100">
                    <TruckIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-grey-900">Shipping & Fulfillment</h2>
                    <p className="text-sm text-grey-500">Shipping options and settings</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Requires Shipping */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-grey-50">
                    <Controller
                      name="shipping.requiresShipping"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="w-5 h-5 rounded border-grey-300 text-gold focus:ring-gold"
                        />
                      )}
                    />
                    <div>
                      <p className="text-sm font-semibold text-grey-900">This product requires shipping</p>
                      <p className="text-xs text-grey-500">Uncheck for digital products or services</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 7: Advanced Options */}
              <div
                ref={(el) => (sectionRefs.current['advanced'] = el)}
                className="p-6 rounded-2xl bg-white border-2 border-grey-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-grey-200">
                    <Cog6ToothIcon className="w-6 h-6 text-grey-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-grey-900">Advanced Options</h2>
                    <p className="text-sm text-grey-500">Product status and visibility</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Product Status */}
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-semibold text-grey-700 mb-3">
                          Product Status
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['active', 'inactive', 'pending', 'draft'].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => field.onChange(status)}
                              className={clsx(
                                'px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all',
                                field.value === status
                                  ? 'border-gold bg-gold/10 text-gold'
                                  : 'border-grey-200 text-grey-600 hover:border-gold/50'
                              )}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  />

                  {/* Featured Product */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/30">
                    <Controller
                      name="isFeatured"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="w-5 h-5 rounded border-gold text-gold focus:ring-gold"
                        />
                      )}
                    />
                    <div>
                      <p className="text-sm font-semibold text-grey-900 flex items-center gap-2">
                        ⭐ Featured Product
                      </p>
                      <p className="text-xs text-grey-600">Display this product prominently on your store</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button (Mobile) */}
              <div className="lg:hidden sticky bottom-0 bg-white border-t border-grey-200 p-4 -mx-6">
                <button
                  type="submit"
                  disabled={isSaving || (!isDirty && !isNewProduct)}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : isNewProduct ? 'Create Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Unsaved Changes Modal */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onCancel={() => {
          setShowUnsavedModal(false);
          setPendingNavigation(null);
        }}
        onDiscard={handleDiscardChanges}
        onSave={handleSaveAndContinue}
        isSaving={isSaving}
      />
    </div>
  );
};

export default ProductEditPage;

