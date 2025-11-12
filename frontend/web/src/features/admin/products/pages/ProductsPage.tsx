import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useGetAdminProductsQuery, useFeatureProductMutation, useApproveProductMutation, useRejectProductMutation, useDeleteProductMutation, AdminProduct } from '../api/productsApi';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Table from '@/shared/components/Table';
import Button from '@/shared/components/Button';
import Dropdown from '@/shared/components/Dropdown';
import { formatCurrency } from '@/core/utils/format';
import { EllipsisVerticalIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading } = useGetAdminProductsQuery({ page: 1, limit: 20, status: statusFilter });
  const [featureProduct] = useFeatureProductMutation();
  const [approveProduct] = useApproveProductMutation();
  const [rejectProduct] = useRejectProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.products || [];

  const handleFeature = async (id: string, isFeatured: boolean) => {
    try {
      await featureProduct({ id, isFeatured: !isFeatured }).unwrap();
      toast.success(isFeatured ? 'Product unfeatured' : 'Product featured');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to update product');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveProduct(id).unwrap();
      toast.success('Product approved');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to approve product');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await rejectProduct({ id, reason }).unwrap();
      toast.success('Product rejected');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to reject product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id).unwrap();
      toast.success('Product deleted');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to delete product');
    }
  };

  const getProductActions = (product: AdminProduct) => {
    const actions = [
      {
        label: product.isFeatured ? 'Unfeature' : 'Feature',
        onClick: () => handleFeature(product._id, product.isFeatured),
        icon: product.isFeatured ? <StarIconSolid className="w-4 h-4" /> : <StarIcon className="w-4 h-4" />,
      },
    ];

    if (product.status === 'pending') {
      actions.push(
        { label: 'Approve', onClick: () => handleApprove(product._id) },
        { label: 'Reject', onClick: () => handleReject(product._id), variant: 'danger' as const }
      );
    }

    actions.push({
      label: 'Delete',
      onClick: () => handleDelete(product._id),
      variant: 'danger' as const,
    });

    return actions;
  };

  const columns: ColumnDef<AdminProduct>[] = [
    {
      accessorKey: 'title',
      header: 'Product',
      cell: ({ row }) => (
        <div>
          <p className="text-body-medium font-medium text-grey-900">{row.original.title}</p>
          {row.original.isFeatured && (
            <Badge variant="gold" size="sm" className="mt-1">
              Featured
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'seller',
      header: 'Seller',
      cell: ({ row }) => row.original.seller?.userId?.name || '-',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => formatCurrency(row.original.price),
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: ({ row }) => row.original.stock,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const statusMap: Record<string, 'success' | 'warning' | 'error'> = {
          active: 'success',
          pending: 'warning',
          rejected: 'error',
          inactive: 'error',
        };
        return <Badge variant={statusMap[row.original.status]}>{row.original.status}</Badge>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Dropdown
          trigger={
            <button className="p-2 hover:bg-grey-100 rounded transition-colors">
              <EllipsisVerticalIcon className="w-5 h-5 text-grey-600" />
            </button>
          }
          items={getProductActions(row.original)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-headline-large text-grey-900 mb-2">Products</h1>
        <p className="text-body-medium text-grey-600">Moderate platform products</p>
      </div>

      <Card>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-base w-64">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="rejected">Rejected</option>
        </select>
      </Card>

      <Card padding="none">
        <Table data={products} columns={columns} isLoading={isLoading} emptyMessage="No products found" />
      </Card>
    </div>
  );
};

export default ProductsPage;

