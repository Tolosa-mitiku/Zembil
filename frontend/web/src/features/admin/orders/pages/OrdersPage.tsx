import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useGetAdminOrdersQuery, AdminOrder } from '../api/ordersApi';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Table from '@/shared/components/Table';
import { formatCurrency, formatDate, formatOrderStatus } from '@/core/utils/format';

const OrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading } = useGetAdminOrdersQuery({ page: 1, limit: 20, status: statusFilter });

  const orders = data?.orders || [];

  const getStatusVariant = (status: string) => {
    const statusMap: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
      delivered: 'success',
      shipped: 'info',
      processing: 'warning',
      pending: 'warning',
      canceled: 'error',
    };
    return statusMap[status] || 'default';
  };

  const columns: ColumnDef<AdminOrder>[] = [
    { accessorKey: 'orderNumber', header: 'Order #', cell: ({ row }) => `#${row.original.orderNumber}` },
    {
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          <p className="text-body-medium text-grey-900">{row.original.customer.name}</p>
          <p className="text-label-small text-grey-600">{row.original.customer.email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'seller',
      header: 'Seller',
      cell: ({ row }) => row.original.seller?.name || '-',
    },
    {
      accessorKey: 'totalPrice',
      header: 'Amount',
      cell: ({ row }) => formatCurrency(row.original.totalPrice),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {formatOrderStatus(row.original.status)}
        </Badge>
      ),
    },
    { accessorKey: 'createdAt', header: 'Date', cell: ({ row }) => formatDate(row.original.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-headline-large text-grey-900 mb-2">Orders</h1>
        <p className="text-body-medium text-grey-600">Manage all platform orders</p>
      </div>

      <Card>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-base w-64">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="canceled">Canceled</option>
        </select>
      </Card>

      <Card padding="none">
        <Table data={orders} columns={columns} isLoading={isLoading} emptyMessage="No orders found" />
      </Card>
    </div>
  );
};

export default OrdersPage;

