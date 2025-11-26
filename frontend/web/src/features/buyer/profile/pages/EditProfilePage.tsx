import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CameraIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  language: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const MOCK_USER = {
  name: 'Alex Thompson',
  email: 'alex.thompson@example.com',
  phone: '+1 (555) 123-4567',
  dateOfBirth: '1995-06-15',
  gender: 'male' as const,
  bio: 'Tech enthusiast and avid online shopper.',
  country: 'United States',
  city: 'New York',
  language: 'English',
  image: 'https://i.pravatar.cc/300?img=68',
  coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029',
};

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [previewAvatar, setPreviewAvatar] = useState<string>(MOCK_USER.image);
  const [previewCover, setPreviewCover] = useState<string>(MOCK_USER.coverImage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: MOCK_USER.name,
      phone: MOCK_USER.phone,
      dateOfBirth: MOCK_USER.dateOfBirth,
      gender: MOCK_USER.gender,
      bio: MOCK_USER.bio,
      country: MOCK_USER.country,
      city: MOCK_USER.city,
      language: MOCK_USER.language,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Profile updated!');
    setIsSubmitting(false);
    navigate('/profile');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewCover(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Cover */}
      <div className="relative h-60 overflow-hidden">
        {previewCover ? (
          <>
            <img src={previewCover} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gold/30 via-purple-500/30 to-pink-500/30" />
        )}
        
        <label className="absolute inset-0 cursor-pointer group/cover">
          <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
          <div className="absolute inset-0 bg-black/0 group-hover/cover:bg-black/40 transition-all flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              className="p-5 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl"
            >
              <CameraIcon className="w-8 h-8 text-gray-700 mx-auto mb-1" />
              <p className="text-xs font-bold text-gray-900">Change Cover</p>
            </motion.div>
          </div>
        </label>

        <button
          onClick={() => navigate('/profile')}
          className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg shadow-lg hover:bg-white transition-all text-xs"
        >
          <ArrowLeftIcon className="w-3 h-3" />
          <span className="font-semibold">Back</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white">
                {previewAvatar ? (
                  <img src={previewAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                    <UserCircleIcon className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              <label className="absolute inset-0 cursor-pointer rounded-3xl bg-black/0 hover:bg-black/50 transition-all flex items-center justify-center group/avatar">
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                <motion.div
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  className="p-2.5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg"
                >
                  <CameraIcon className="w-5 h-5 text-gray-700" />
                </motion.div>
              </label>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center md:text-left">
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                Edit Your Profile
              </h1>
              <p className="text-xs text-gray-600">Update your information</p>
            </motion.div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-28">
          {/* Personal Info */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                  <UserCircleIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Personal Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <div className="relative group/input">
                    <UserCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within/input:text-purple-500" />
                    <input {...register('name')} type="text" className={clsx('w-full pl-10 pr-4 py-2 border-2 rounded-xl bg-white/80 transition-all duration-300 focus:bg-white text-sm', errors.name ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' : 'border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100')} placeholder="Your name" />
                  </div>
                  {errors.name && <p className="mt-1 text-[10px] text-red-500">{errors.name.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={MOCK_USER.email} disabled className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed text-sm" />
                  </div>
                  <p className="mt-1 text-[10px] text-gray-500 flex items-center gap-1"><ShieldCheckIcon className="w-2.5 h-2.5" />Email locked for security</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone</label>
                  <div className="relative group/input">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within/input:text-purple-500" />
                    <input {...register('phone')} type="tel" className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl bg-white/80 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all focus:bg-white text-sm" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Birth Date</label>
                  <div className="relative group/input">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within/input:text-purple-500" />
                    <input {...register('dateOfBirth')} type="date" className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl bg-white/80 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all focus:bg-white text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Gender</label>
                  <select {...register('gender')} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl bg-white/80 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all focus:bg-white text-sm">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Language</label>
                  <div className="relative group/input">
                    <GlobeAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within/input:text-purple-500" />
                    <select {...register('language')} className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl bg-white/80 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all focus:bg-white text-sm">
                      <option value="">Select</option>
                      <option value="English">English</option>
                      <option value="Amharic">Amharic</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bio</label>
                  <div className="relative group/input">
                    <ChatBubbleBottomCenterTextIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400 transition-colors group-focus-within/input:text-purple-500" />
                    <textarea {...register('bio')} rows={3} className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl bg-white/80 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all resize-none focus:bg-white text-sm" placeholder="About you..." />
                  </div>
                  {errors.bio && <p className="text-[10px] text-red-500">{errors.bio.message}</p>}
                  <p className="text-[10px] text-gray-500 text-right mt-1">Max 500 chars</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Location */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-lg">
                  <MapPinIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Location</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Country</label>
                  <input {...register('country')} type="text" className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl bg-white/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all focus:bg-white text-sm" placeholder="e.g., USA" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">City</label>
                  <input {...register('city')} type="text" className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl bg-white/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all focus:bg-white text-sm" placeholder="e.g., NYC" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sticky Actions */}
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-2xl border-t-2 border-gray-200 shadow-2xl">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex justify-between items-center">
                <div className="text-xs">
                  {isDirty ? (
                    <span className="flex items-center gap-2 text-amber-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Unsaved
                    </span>
                  ) : (
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <CheckIcon className="w-3 h-3 text-green-500" />
                      Saved
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button type="button" onClick={() => { if (isDirty && !confirm('Discard?')) return; navigate('/profile'); }} className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-50 transition-all flex items-center gap-1.5">
                    <XMarkIcon className="w-3.5 h-3.5" />
                    Cancel
                  </button>

                  <motion.button type="submit" disabled={isSubmitting || !isDirty} whileHover={{ scale: isDirty ? 1.05 : 1 }} whileTap={{ scale: isDirty ? 0.95 : 1 }} className={clsx('px-5 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all shadow-lg', isDirty && !isSubmitting ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-purple-500/50' : 'bg-gray-200 text-gray-400 cursor-not-allowed')}>
                    <CheckIcon className="w-3.5 h-3.5" />
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
