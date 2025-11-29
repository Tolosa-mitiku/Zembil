import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useGetAdminUsersQuery, useUpdateUserRoleMutation, useUpdateUserStatusMutation, User } from '../api/usersApi';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Table from '@/shared/components/Table';
import Input from '@/shared/components/Input';
import Dropdown from '@/shared/components/Dropdown';
import { formatDate } from '@/core/utils/format';
import { MagnifyingGlassIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  const { data, isLoading } = useGetAdminUsersQuery({ page, limit: 20, search, role: roleFilter });
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();

  const users = data?.users || [];

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await updateUserRole({ id: userId, role: role as any }).unwrap();
      toast.success('User role updated');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to update role');
    }
  };

  const handleUpdateStatus = async (userId: string, status: string) => {
    try {
      await updateUserStatus({ id: userId, accountStatus: status as any }).unwrap();
      toast.success('User status updated');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to update status');
    }
  };

  const getUserActions = (user: User) => [
    {
      label: 'Make Seller',
      onClick: () => handleUpdateRole(user._id, 'seller'),
      disabled: user.role === 'seller',
    },
    {
      label: 'Make Admin',
      onClick: () => handleUpdateRole(user._id, 'admin'),
      disabled: user.role === 'admin',
    },
    {
      label: 'Suspend',
      onClick: () => handleUpdateStatus(user._id, 'suspended'),
      disabled: user.accountStatus === 'suspended',
      variant: 'danger' as const,
    },
    {
      label: 'Ban',
      onClick: () => handleUpdateStatus(user._id, 'banned'),
      disabled: user.accountStatus === 'banned',
      variant: 'danger' as const,
    },
    {
      label: 'Activate',
      onClick: () => handleUpdateStatus(user._id, 'active'),
      disabled: user.accountStatus === 'active',
    },
  ];

  const getStatusVariant = (status: string) => {
    const map: Record<string, 'success' | 'error' | 'warning'> = {
      active: 'success',
      suspended: 'warning',
      banned: 'error',
    };
    return map[status] || 'default';
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.image ? (
            <img src={row.original.image} alt={row.original.name} className="w-10 h-10 rounded-full mr-3" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-grey-200 flex items-center justify-center mr-3">
              <span className="text-grey-600 font-medium">{row.original.name[0]}</span>
            </div>
          )}
          <div>
            <p className="text-body-medium font-medium text-grey-900">{row.original.name}</p>
            <p className="text-label-small text-grey-600">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => <Badge variant="gold">{row.original.role}</Badge>,
    },
    {
      accessorKey: 'accountStatus',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.accountStatus)}>
          {row.original.accountStatus}
        </Badge>
      ),
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
        <Dropdown
          trigger={
            <button className="p-2 hover:bg-grey-100 rounded transition-colors">
              <EllipsisVerticalIcon className="w-5 h-5 text-grey-600" />
            </button>
          }
          items={getUserActions(row.original)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-headline-large text-grey-900 mb-2">Users</h1>
        <p className="text-body-medium text-grey-600">Manage platform users</p>
      </div>

      <Card>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
            containerClassName="flex-1"
          />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-base w-48">
            <option value="">All Roles</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </Card>

      <Card padding="none">
        <Table data={users} columns={columns} isLoading={isLoading} emptyMessage="No users found" />
      </Card>
    </div>
  );
};

export default UsersPage;

