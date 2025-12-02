import {
  ArrowRightIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
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
  icon: React.ElementType;
  cta: string;
  gradient: string;
  iconBg: string;
  accentColor: string;
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
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(role.id)}
      className="relative group rounded-2xl overflow-hidden cursor-pointer bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* Gradient Overlay on Hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      {/* Accent Border on Hover */}
      <div
        className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-current transition-all duration-300 ${role.accentColor}`}
      />

      <div className="relative p-4">
        {/* Header + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              className={`w-10 h-10 rounded-xl ${role.iconBg} flex items-center justify-center shadow-md`}
            >
              <role.icon className="w-5 h-5 text-white" />
            </motion.div>

            <div>
              <h3 className={`text-sm font-bold text-gray-900 group-hover:${role.accentColor} transition-colors`}>
                {role.title}
              </h3>
              <p className="text-[11px] text-gray-500">{role.name} Account</p>
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-xl font-semibold text-xs text-white bg-gradient-to-r ${role.gradient} shadow-md hover:shadow-lg flex items-center gap-1.5 transition-all duration-300`}
          >
            <span>{role.cta}</span>
            <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </div>
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
      icon: ShoppingBagIcon,
      cta: "Join",
      gradient: "from-blue-600 to-indigo-600",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      accentColor: "text-blue-600",
    },
    {
      id: "seller",
      name: "Seller",
      title: "Grow Your Business",
      icon: BuildingStorefrontIcon,
      cta: "Join",
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
      accentColor: "text-amber-600",
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
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all z-20"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>

              <div className="p-6">
                {/* Header */}
                <div className="text-center mb-5">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="inline-block mb-3"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">Z</span>
                    </div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-xl font-bold text-gray-900 mb-1"
                  >
                    Join{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-dark">
                      Zembil
                    </span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs text-gray-500"
                  >
                    Choose how you want to get started
                  </motion.p>
                </div>

                {/* Role Cards */}
                <div className="space-y-3">
                  {roles.map((role, idx) => (
                    <motion.div
                      key={role.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + idx * 0.1 }}
                    >
                      <RoleCard role={role} onSelect={handleRoleSelect} />
                    </motion.div>
                  ))}
                </div>

                {/* Footer Note */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-[10px] text-gray-400 mt-4"
                >
                  By continuing, you agree to our Terms & Privacy Policy
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
