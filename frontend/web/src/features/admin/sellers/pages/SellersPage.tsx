import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useGetAdminSellersQuery, useVerifySellerMutation, useRejectSellerMutation, Seller } from '../api/sellersApi';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Table from '@/shared/components/Table';
import Button from '@/shared/components/Button';
import { formatDate, formatNumber } from '@/core/utils/format';
import toast from 'react-hot-toast';

const SellersPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data, isLoading } = useGetAdminSellersQuery({ page: 1, limit: 20, verificationStatus: statusFilter });
  const [verifySeller] = useVerifySellerMutation();
  const [rejectSeller] = useRejectSellerMutation();

  const sellers = data?.sellers || [];

  const handleVerify = async (id: string) => {
    try {
      await verifySeller(id).unwrap();
      toast.success('Seller verified successfully');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to verify seller');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      await rejectSeller({ id, reason }).unwrap();
      toast.success('Seller rejected');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to reject seller');
    }
  };

  const getStatusVariant = (status: string) => {
    const map: Record<string, 'success' | 'warning' | 'error'> = {
      verified: 'success',
      pending: 'warning',
      rejected: 'error',
    };
    return map[status] || 'default';
  };

  const columns: ColumnDef<Seller>[] = [
    {
      accessorKey: 'userId.name',
      header: 'Seller',
      cell: ({ row }) => (
        <div>
          <p className="text-body-medium font-medium text-grey-900">{row.original.userId.name}</p>
          <p className="text-label-small text-grey-600">{row.original.userId.email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'businessName',
      header: 'Business Name',
      cell: ({ row }) => row.original.businessName || '-',
    },
    {
      accessorKey: 'verificationStatus',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.verificationStatus)}>
          {row.original.verificationStatus}
        </Badge>
      ),
    },
    {
      accessorKey: 'totalProducts',
      header: 'Products',
      cell: ({ row }) => formatNumber(row.original.totalProducts || 0),
    },
    {
      accessorKey: 'totalSales',
      header: 'Sales',
      cell: ({ row }) => formatNumber(row.original.totalSales || 0),
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          {row.original.verificationStatus === 'pending' && (
            <>
              <Button size="sm" variant="primary" onClick={() => handleVerify(row.original._id)}>
                Verify
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleReject(row.original._id)}>
                Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-headline-large text-grey-900 mb-2">Sellers</h1>
        <p className="text-body-medium text-grey-600">Manage seller verifications</p>
      </div>

      <Card>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-base w-64">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </Card>

      <Card padding="none">
        <Table data={sellers} columns={columns} isLoading={isLoading} emptyMessage="No sellers found" />
      </Card>
    </div>
  );
};

export default SellersPage;

