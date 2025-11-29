import { useState } from 'react';
import { useGetAdminBannersQuery, useCreateBannerMutation, useUpdateBannerMutation, useToggleBannerMutation, useDeleteBannerMutation, Banner } from '../api/bannersApi';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import Modal from '@/shared/components/Modal';
import Input from '@/shared/components/Input';
import Badge from '@/shared/components/Badge';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/core/utils/format';
import toast from 'react-hot-toast';

const BannersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({ title: '', image: '', link: '', placement: 'home_top', targetAudience: 'all', startDate: '', endDate: '', isActive: true });

  const { data, isLoading } = useGetAdminBannersQuery();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [toggleBanner] = useToggleBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const banners = data?.banners || [];

  const handleSubmit = async () => {
    try {
      if (selectedBanner) {
        await updateBanner({ id: selectedBanner._id, data: formData }).unwrap();
        toast.success('Banner updated');
      } else {
        await createBanner(formData).unwrap();
        toast.success('Banner created');
      }
      setIsModalOpen(false);
      setFormData({ title: '', image: '', link: '', placement: 'home_top', targetAudience: 'all', startDate: '', endDate: '', isActive: true });
      setSelectedBanner(null);
    } catch (error: any) {
      toast.error(error.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      image: banner.image,
      link: banner.link || '',
      placement: banner.placement,
      targetAudience: banner.targetAudience,
      startDate: banner.startDate || '',
      endDate: banner.endDate || '',
      isActive: banner.isActive,
    });
    setIsModalOpen(true);
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleBanner(id).unwrap();
      toast.success('Banner status toggled');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to toggle');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await deleteBanner(id).unwrap();
      toast.success('Banner deleted');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-large text-grey-900 mb-2">Banners</h1>
          <p className="text-body-medium text-grey-600">Manage promotional banners</p>
        </div>
        <Button variant="primary" leftIcon={<PlusIcon className="w-5 h-5" />} onClick={() => setIsModalOpen(true)}>
          Add Banner
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <Card key={banner._id}>
              <div className="space-y-3">
                <img src={banner.image} alt={banner.title} className="w-full h-40 object-cover rounded-md" />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-title-medium text-grey-900">{banner.title}</h3>
                    <Badge variant={banner.isActive ? 'success' : 'error'}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-body-small text-grey-600">Placement: {banner.placement}</p>
                  <p className="text-body-small text-grey-600">Clicks: {banner.clicks || 0}</p>
                  {banner.startDate && (
                    <p className="text-label-small text-grey-600 mt-1">
                      {formatDate(banner.startDate)} - {banner.endDate ? formatDate(banner.endDate) : 'Ongoing'}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2 pt-2 border-t border-grey-200">
                  <Button size="sm" variant="secondary" onClick={() => handleToggle(banner._id)}>
                    {banner.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <button onClick={() => handleEdit(banner)} className="p-2 text-gold hover:bg-gold-pale rounded">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(banner._id)} className="p-2 text-error hover:bg-red-100 rounded">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedBanner(null); }} title={selectedBanner ? 'Edit Banner' : 'Create Banner'} size="lg">
        <div className="space-y-4">
          <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <Input label="Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
          <Input label="Link (optional)" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} />
          <div>
            <label className="block text-label-large text-grey-900 mb-2">Placement</label>
            <select value={formData.placement} onChange={(e) => setFormData({ ...formData, placement: e.target.value })} className="input-base">
              <option value="home_top">Home Top</option>
              <option value="home_middle">Home Middle</option>
              <option value="category">Category</option>
              <option value="product">Product</option>
            </select>
          </div>
          <div>
            <label className="block text-label-large text-grey-900 mb-2">Target Audience</label>
            <select value={formData.targetAudience} onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })} className="input-base">
              <option value="all">All</option>
              <option value="buyers">Buyers</option>
              <option value="sellers">Sellers</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
            <Input label="End Date" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="bannerActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="mr-2" />
            <label htmlFor="bannerActive" className="text-body-medium text-grey-900">Active</label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} isLoading={isCreating || isUpdating}>
              {selectedBanner ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BannersPage;

