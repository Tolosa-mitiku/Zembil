import { motion } from 'framer-motion';
import { User } from '../api/usersApi';
import Badge from '@/shared/components/Badge';
import Button from '@/shared/components/Button';
import { formatDate } from '@/core/utils/format';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  EyeIcon,
  ShieldCheckIcon,
  UserIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface CustomerCardProps {
  user: User;
  onViewDetails: (user: User) => void;
  index: number;
}

const CustomerCard = ({ user, onViewDetails, index }: CustomerCardProps) => {
  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-50 border-green-200 text-green-700',
      suspended: 'bg-orange-50 border-orange-200 text-orange-700',
      banned: 'bg-red-50 border-red-200 text-red-700',
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'seller':
        return BriefcaseIcon;
      case 'admin':
        return ShieldCheckIcon;
      default:
        return UserIcon;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'seller':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'admin':
        return 'bg-gold-pale text-gold-dark border-gold-accent';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const RoleIcon = getRoleIcon(user.role);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={() => onViewDetails(user)}
      className={clsx(
        'bg-white rounded-xl border-2 border-grey-200 overflow-hidden',
        'transition-all duration-300 cursor-pointer',
        'hover:shadow-xl hover:border-gold-accent',
        'group'
      )}
    >
      {/* Header with gradient background */}
      <div className="relative h-24 bg-gradient-to-br from-gold via-gold-accent to-gold-light overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <div className={clsx('px-3 py-1 rounded-full text-label-small font-semibold border-2', getStatusColor(user.accountStatus))}>
            {user.accountStatus.charAt(0).toUpperCase() + user.accountStatus.slice(1)}
          </div>
        </div>
      </div>

      {/* Profile Picture */}
      <div className="relative -mt-12 px-6">
        <div className="relative">
          {user.image ? (
            <motion.img
              whileHover={{ scale: 1.1, rotate: 5 }}
              src={user.image}
              alt={user.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-24 h-24 rounded-2xl bg-gradient-to-br from-grey-300 to-grey-400 flex items-center justify-center border-4 border-white shadow-lg"
            >
              <UserCircleIcon className="w-14 h-14 text-white" />
            </motion.div>
          )}
          
          {/* Role indicator badge */}
          <div className={clsx('absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center border-2 border-white shadow-md', getRoleColor(user.role))}>
            <RoleIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        {/* Name and Email */}
        <div className="mb-4">
          <h3 className="text-headline-small font-bold text-grey-900 mb-1 group-hover:text-gold transition-colors">
            {user.name}
          </h3>
          <div className="flex items-center gap-2 text-label-medium text-grey-600">
            <EnvelopeIcon className="w-4 h-4" />
            <span className="truncate">{user.email}</span>
          </div>
        </div>

        {/* Role Badge */}
        <div className="mb-4">
          <div className={clsx('inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-label-medium font-semibold border-2', getRoleColor(user.role))}>
            <RoleIcon className="w-4 h-4" />
            <span>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          {/* Phone Number */}
          {user.phoneNumber && (
            <div className="flex items-center gap-2 text-label-medium text-grey-700">
              <PhoneIcon className="w-4 h-4 text-grey-400" />
              <span>{user.phoneNumber}</span>
            </div>
          )}

          {/* Join Date */}
          <div className="flex items-center gap-2 text-label-medium text-grey-700">
            <CalendarIcon className="w-4 h-4 text-grey-400" />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>
        </div>

        {/* View Details Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<EyeIcon className="w-4 h-4" />}
            onClick={() => onViewDetails(user)}
            className="w-full group-hover:bg-gold group-hover:text-white group-hover:border-gold"
          >
            View Full Profile
          </Button>
        </motion.div>
      </div>

      {/* Decorative bottom bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: index * 0.05 + 0.3, duration: 0.4 }}
        className="h-1 bg-gradient-to-r from-gold via-gold-accent to-gold-light"
        style={{ transformOrigin: 'left' }}
      />
    </motion.div>
  );
};

export default CustomerCard;

