import { useNavigate } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  MegaphoneIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  StarIcon,
  LifebuoyIcon,
  Cog6ToothIcon,
  UsersIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const AdminQuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Finance',
      icon: CurrencyDollarIcon,
      path: '/admin/finance',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Orders',
      icon: ShoppingCartIcon,
      path: '/admin/orders',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Promotions',
      icon: MegaphoneIcon,
      path: '/admin/promotions',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Messages',
      icon: ChatBubbleLeftRightIcon,
      path: '/admin/messages',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Returns',
      icon: ArrowPathIcon,
      path: '/admin/returns',
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Reviews',
      icon: StarIcon,
      path: '/admin/reviews',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'Support',
      icon: LifebuoyIcon,
      path: '/admin/support',
      color: 'bg-cyan-100 text-cyan-600'
    },
    {
      title: 'Settings',
      icon: Cog6ToothIcon,
      path: '/admin/settings',
      color: 'bg-grey-100 text-grey-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
      {actions.map((action) => (
        <button
          key={action.title}
          onClick={() => navigate(action.path)}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-grey-100"
        >
          <div className={`p-3 rounded-full mb-2 ${action.color}`}>
            <action.icon className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-grey-700">{action.title}</span>
        </button>
      ))}
    </div>
  );
};

export default AdminQuickActions;












