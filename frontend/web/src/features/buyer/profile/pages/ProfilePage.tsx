import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilIcon,
  CameraIcon,
  ShoppingBagIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  StarIcon,
  TruckIcon,
  CheckBadgeIcon,
  CalendarIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

// Mock user data
const MOCK_USER = {
  name: 'Alex Thompson',
  email: 'alex.thompson@example.com',
  phone: '+1 (555) 123-4567',
  image: 'https://i.pravatar.cc/300?img=68',
  coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop',
  joinedDate: '2024-01-15',
  totalOrders: 47,
  totalSpent: 3245.50,
  favoriteCategories: ['Electronics', 'Fashion', 'Home'],
  rewardPoints: 1250,
  membershipTier: 'Gold',
};

const RECENT_ORDERS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    date: new Date(Date.now() - 172800000), // 2 days ago
    status: 'delivered',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100',
    name: 'Handcrafted Leather Bag',
    price: 189.00,
    date: new Date(Date.now() - 604800000), // 1 week ago
    status: 'delivered',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100',
    name: 'Smart Watch Pro',
    price: 349.99,
    date: new Date(Date.now() - 1209600000), // 2 weeks ago
    status: 'in-transit',
  },
];

const ACHIEVEMENTS = [
  { icon: ShoppingBagIcon, label: 'Verified Buyer', color: 'from-blue-500 to-blue-600' },
  { icon: StarIcon, label: '50+ Reviews', color: 'from-amber-500 to-amber-600' },
  { icon: HeartIcon, label: 'Wishlist Pro', color: 'from-red-500 to-pink-600' },
  { icon: SparklesIcon, label: 'Gold Member', color: 'from-gold to-gold-dark' },
];

const BuyerProfilePage = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20">
      {/* Cover Image Section */}
      <div className="relative h-80 bg-gradient-to-r from-gold/20 via-purple-500/20 to-pink-500/20 overflow-hidden group">
        {MOCK_USER.coverImage ? (
          <>
            <img
              src={MOCK_USER.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gold/30 via-purple-500/30 to-pink-500/30" />
        )}
        
        {/* Edit Cover Button */}
        <button
          onMouseEnter={() => setIsEditingCover(true)}
          onMouseLeave={() => setIsEditingCover(false)}
          className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
        >
          <CameraIcon className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative -mt-24 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="relative group/avatar"
            >
              <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white">
                {MOCK_USER.image ? (
                  <img
                    src={MOCK_USER.image}
                    alt={MOCK_USER.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                    <UserCircleIcon className="w-20 h-20 text-white" />
                  </div>
                )}
              </div>
              <button
                className="absolute bottom-2 right-2 p-2.5 bg-gold rounded-xl shadow-lg hover:bg-gold-dark transition-all opacity-0 group-hover/avatar:opacity-100 hover:scale-110"
              >
                <CameraIcon className="w-4 h-4 text-white" />
              </button>
            </motion.div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-4xl font-extrabold text-gray-900">{MOCK_USER.name}</h1>
                  <CheckBadgeIcon className="w-8 h-8 text-blue-500" title="Verified Account" />
                </div>
                <p className="text-gray-600 mb-4">{MOCK_USER.email}</p>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                  <div className="flex items-center gap-2">
                    <ShoppingBagIcon className="w-5 h-5 text-gold" />
                    <span className="text-sm font-semibold text-gray-700">
                      {MOCK_USER.totalOrders} Orders
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-gold" />
                    <span className="text-sm font-semibold text-gray-700">
                      Joined {formatDistanceToNow(new Date(MOCK_USER.joinedDate), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-gold/10 rounded-full border border-gold/30">
                    <SparklesIcon className="w-4 h-4 text-gold" />
                    <span className="text-sm font-bold text-gold">{MOCK_USER.membershipTier} Member</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Edit Profile Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => navigate('/profile/edit')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gold transition-all shadow-lg flex items-center gap-2"
            >
              <PencilIcon className="w-5 h-5" />
              Edit Profile
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Achievements */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {/* Total Spent */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white/80">Total Spent</span>
                  <ShoppingBagIcon className="w-6 h-6 text-white/90" />
                </div>
                <p className="text-4xl font-extrabold mb-1">${MOCK_USER.totalSpent.toLocaleString()}</p>
                <p className="text-xs text-white/70">Lifetime purchases</p>
              </div>

              {/* Reward Points */}
              <div className="bg-gradient-to-br from-gold to-gold-dark rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white/80">Reward Points</span>
                  <SparklesIcon className="w-6 h-6 text-white/90" />
                </div>
                <p className="text-4xl font-extrabold mb-1">{MOCK_USER.rewardPoints.toLocaleString()}</p>
                <p className="text-xs text-white/70">= ${(MOCK_USER.rewardPoints / 100).toFixed(2)} in rewards</p>
              </div>

              {/* Orders This Month */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white/80">Orders This Month</span>
                  <TruckIcon className="w-6 h-6 text-white/90" />
                </div>
                <p className="text-4xl font-extrabold mb-1">12</p>
                <p className="text-xs text-white/70">+3 from last month</p>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-gold" />
                Achievements
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {ACHIEVEMENTS.map((achievement, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className={`p-4 rounded-2xl bg-gradient-to-br ${achievement.color} text-white shadow-lg text-center`}
                  >
                    <achievement.icon className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-xs font-bold">{achievement.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <ShoppingBagIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-gray-900">My Orders</span>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                </button>
                
                <button
                  onClick={() => navigate('/wishlist')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                      <HeartIcon className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="font-semibold text-gray-900">Wishlist</span>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                </button>
                
                <button
                  onClick={() => navigate('/profile/addresses')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <MapPinIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-semibold text-gray-900">Addresses</span>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={() => navigate('/messages')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <ChatBubbleLeftRightIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-semibold text-gray-900">Messages</span>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold text-gray-900">Personal Information</h2>
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="p-2 rounded-xl bg-gold/10 text-gold hover:bg-gold hover:text-white transition-all"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCircleIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</span>
                  </div>
                  <p className="text-base font-bold text-gray-900">{MOCK_USER.name}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</span>
                  </div>
                  <p className="text-base font-bold text-gray-900 truncate">{MOCK_USER.email}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <PhoneIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</span>
                  </div>
                  <p className="text-base font-bold text-gray-900">{MOCK_USER.phone}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Member Since</span>
                  </div>
                  <p className="text-base font-bold text-gray-900">
                    {new Date(MOCK_USER.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                  <ClockIcon className="w-6 h-6 text-gold" />
                  Recent Orders
                </h2>
                <button
                  onClick={() => navigate('/orders')}
                  className="text-gold font-semibold text-sm hover:text-gold-dark flex items-center gap-1 group"
                >
                  View All
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="space-y-4">
                {RECENT_ORDERS.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer border border-gray-100 hover:border-gold group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={order.image}
                        alt={order.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 truncate group-hover:text-gold transition-colors">
                        {order.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(order.date, { addSuffix: true })}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-gray-900">${order.price}</p>
                      <span className={clsx(
                        'text-xs font-semibold px-2 py-0.5 rounded-full',
                        order.status === 'delivered' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      )}>
                        {order.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Favorite Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
            >
              <h2 className="text-xl font-extrabold text-gray-900 mb-4">Favorite Categories</h2>
              <div className="flex flex-wrap gap-2">
                {MOCK_USER.favoriteCategories.map((category, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className="px-4 py-2 bg-gradient-to-r from-gold/10 to-gold/20 border border-gold/30 rounded-full text-sm font-semibold text-gold hover:from-gold hover:to-gold-dark hover:text-white transition-all cursor-pointer"
                  >
                    {category}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerProfilePage;
