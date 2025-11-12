import { useState } from 'react';
import { useGetAdminCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation, Category } from '../api/categoriesApi';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import Modal from '@/shared/components/Modal';
import Input from '@/shared/components/Input';
import Badge from '@/shared/components/Badge';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CategoriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '', displayOrder: 0, isActive: true });

  const { data, isLoading } = useGetAdminCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = data?.categories || [];

  const handleSubmit = async () => {
    try {
      if (selectedCategory) {
        await updateCategory({ id: selectedCategory._id, data: formData }).unwrap();
        toast.success('Category updated');
      } else {
        await createCategory(formData).unwrap();
        toast.success('Category created');
      }
      setIsModalOpen(false);
      setFormData({ name: '', description: '', image: '', displayOrder: 0, isActive: true });
      setSelectedCategory(null);
    } catch (error: any) {
      toast.error(error.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name, description: category.description || '', image: category.image || '', displayOrder: category.displayOrder, isActive: category.isActive });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id).unwrap();
      toast.success('Category deleted');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-large text-grey-900 mb-2">Categories</h1>
          <p className="text-body-medium text-grey-600">Manage product categories</p>
        </div>
        <Button variant="primary" leftIcon={<PlusIcon className="w-5 h-5" />} onClick={() => setIsModalOpen(true)}>
          Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category._id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-title-medium text-grey-900">{category.name}</h3>
                  <p className="text-body-small text-grey-600 mt-1">{category.description || 'No description'}</p>
                  <div className="flex items-center space-x-2 mt-3">
                    <Badge variant={category.isActive ? 'success' : 'error'}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="text-label-small text-grey-600">{category.productCount || 0} products</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleEdit(category)} className="p-2 text-gold hover:bg-gold-pale rounded">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(category._id)} className="p-2 text-error hover:bg-red-100 rounded">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
          setFormData({ name: '', description: '', image: '', displayOrder: 0, isActive: true });
        }}
        title={selectedCategory ? 'Edit Category' : 'Create Category'}
      >
        <div className="space-y-4">
          <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <div>
            <label className="block text-label-large text-grey-900 mb-2">Description</label>
            <textarea className="input-base min-h-[80px]" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <Input label="Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
          <Input label="Display Order" type="number" value={formData.displayOrder} onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })} />
          <div className="flex items-center">
            <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="mr-2" />
            <label htmlFor="isActive" className="text-body-medium text-grey-900">Active</label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} isLoading={isCreating || isUpdating}>
              {selectedCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesPage;

