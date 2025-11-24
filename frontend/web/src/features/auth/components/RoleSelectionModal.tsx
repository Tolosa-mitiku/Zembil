import {
  ArrowRightIcon,
  BoltIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  CheckIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Role {
  id: "buyer" | "seller";
  name: string;
  title: string;
  description: string;
  icon: React.ElementType;
  cta: string;
  features: Array<{ icon: React.ElementType; text: string }>;
  gradient: string;
  iconBg: string;
  accentColor: string;
  bgPattern: string;
}

const RoleCard = ({
  role,
  onSelect,
}: {
  role: Role;
  onSelect: (id: "buyer" | "seller") => void;
}) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => onSelect(role.id)}
      className="relative group rounded-3xl overflow-hidden cursor-pointer bg-white shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className={`absolute inset-0 ${role.bgPattern}`} />
      </div>

      {/* Gradient Overlay on Hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
      />

      {/* Accent Border on Hover */}
      <div
        className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-current transition-all duration-500 ${role.accentColor}`}
      />

      <div className="relative p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <motion.div
            whileHover={{ rotate: 5, scale: 1.1 }}
            className={`w-12 h-12 rounded-xl ${role.iconBg} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500`}
          >
            <role.icon className="w-6 h-6 text-white" />
          </motion.div>

          <div
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 group-hover:${role.iconBg} group-hover:text-white transition-all duration-300 shadow-sm`}
          >
            {role.name}
          </div>
        </div>

        {/* Title & Description */}
        <h3
          className={`text-xl font-extrabold text-gray-900 mb-2 group-hover:${role.accentColor} transition-colors duration-300`}
        >
          {role.title}
        </h3>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          {role.description}
        </p>

        {/* Features */}
        <div className="flex-1 space-y-2.5 mb-4">
          {role.features.map((feature, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2.5 text-xs text-gray-700 font-medium group/item"
            >
              <div
                className={`w-7 h-7 rounded-lg ${role.iconBg} flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform`}
              >
                <feature.icon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="group-hover/item:translate-x-1 transition-transform duration-200">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${role.gradient} shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group/btn transition-all duration-300`}
        >
          <span>{role.cta}</span>
          <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
};

const RoleSelectionModal = ({ isOpen, onClose }: RoleSelectionModalProps) => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: "buyer" | "seller") => {
    navigate("/signup", { state: { role } });
    onClose();
  };

  const roles: Role[] = [
    {
      id: "buyer",
      name: "Buyer",
      title: "Start Shopping",
      description:
        "Discover a curated marketplace of unique products from verified sellers worldwide.",
      icon: ShoppingBagIcon,
      cta: "Join as Buyer",
      features: [
        { icon: SparklesIcon, text: "Thousands of unique items" },
        { icon: ShieldCheckIcon, text: "Secure payment protection" },
        { icon: BoltIcon, text: "Real-time order tracking" },
        { icon: CheckIcon, text: "Verified seller reviews" },
      ],
      gradient: "from-blue-600 to-indigo-600",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      accentColor: "text-blue-600",
      bgPattern: "bg-gradient-to-br from-blue-50 to-indigo-50",
    },
    {
      id: "seller",
      name: "Seller",
      title: "Grow Your Business",
      description:
        "Turn your passion into profit with our powerful seller tools and global reach.",
      icon: BuildingStorefrontIcon,
      cta: "Join as Seller",
      features: [
        { icon: ChartBarIcon, text: "Advanced analytics" },
        { icon: BoltIcon, text: "Instant product listing" },
        { icon: ShieldCheckIcon, text: "Seller protection" },
        { icon: CheckIcon, text: "24/7 support team" },
      ],
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
      accentColor: "text-amber-600",
      bgPattern: "bg-gradient-to-br from-amber-50 to-orange-50",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
              className="relative bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl w-[75vw] max-w-6xl overflow-hidden border border-gray-200"
              style={{ height: "75vh", maxHeight: "900px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all z-20 shadow-md hover:shadow-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <div className="relative p-8 md:p-10 h-full flex flex-col overflow-y-auto">
                {/* Header */}
                <div className="text-center mb-8 shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="inline-block mb-4"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-xl">
                      <span className="text-white font-bold text-2xl">Z</span>
                    </div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight"
                  >
                    Welcome to{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-dark to-gold">
                      Zembil
                    </span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-base text-gray-600 font-medium"
                  >
                    Choose your journey and unlock endless possibilities
                  </motion.p>
                </div>

                {/* Role Cards */}
                <div className="grid md:grid-cols-2 gap-6 flex-1 overflow-y-auto">
                  {roles.map((role, idx) => (
                    <motion.div
                      key={role.id}
                      initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1, duration: 0.6 }}
                    >
                      <RoleCard role={role} onSelect={handleRoleSelect} />
                    </motion.div>
                  ))}
                </div>

                {/* Footer Note */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center text-[10px] text-gray-400 mt-6 shrink-0"
                >
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy
                </motion.p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RoleSelectionModal;
