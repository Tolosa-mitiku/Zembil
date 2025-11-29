import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  CurrencyDollarIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface Section {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface SectionNavigationProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  className?: string;
}

const sections: Section[] = [
  { id: 'basic', label: 'Basic Info', icon: DocumentTextIcon },
  { id: 'pricing', label: 'Pricing', icon: CurrencyDollarIcon },
  { id: 'inventory', label: 'Inventory', icon: CubeIcon },
  { id: 'details', label: 'Details', icon: ClipboardDocumentListIcon },
  { id: 'seo', label: 'SEO', icon: MagnifyingGlassIcon },
  { id: 'shipping', label: 'Shipping', icon: TruckIcon },
  { id: 'advanced', label: 'Advanced', icon: Cog6ToothIcon },
];

const SectionNavigation = ({
  activeSection,
  onSectionClick,
  className,
}: SectionNavigationProps) => {
  return (
    <nav className={clsx('space-y-2', className)}>
      <div className="mb-3 px-3">
        <h4 className="text-xs font-bold text-grey-500 uppercase tracking-wider">
          Sections
        </h4>
      </div>

      {sections.map((section, index) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;

        return (
          <motion.button
            key={section.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSectionClick(section.id)}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group',
              isActive
                ? 'bg-gradient-to-r from-gold/20 to-gold/10 text-gold font-semibold shadow-sm'
                : 'text-grey-600 hover:bg-grey-100 hover:text-grey-900'
            )}
          >
            {/* Indicator Bar */}
            <div
              className={clsx(
                'w-1 h-6 rounded-full transition-all',
                isActive ? 'bg-gold scale-y-100' : 'bg-transparent group-hover:bg-grey-300 scale-y-0'
              )}
            />

            {/* Icon */}
            <div
              className={clsx(
                'flex-shrink-0 p-1.5 rounded-lg transition-all',
                isActive ? 'bg-gold/20' : 'bg-grey-100 group-hover:bg-gold/10'
              )}
            >
              <Icon
                className={clsx(
                  'w-4 h-4 transition-colors',
                  isActive ? 'text-gold' : 'text-grey-600 group-hover:text-gold'
                )}
              />
            </div>

            {/* Label */}
            <span className="text-sm">{section.label}</span>

            {/* Active Indicator Dot */}
            {isActive && (
              <motion.div
                layoutId="active-indicator"
                className="ml-auto w-2 h-2 rounded-full bg-gold"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}

      {/* Progress Bar */}
      <div className="mt-6 px-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-grey-600">Completion</span>
          <span className="text-xs font-bold text-gold">
            {Math.round((sections.findIndex((s) => s.id === activeSection) + 1) / sections.length * 100)}%
          </span>
        </div>
        <div className="h-2 bg-grey-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${((sections.findIndex((s) => s.id === activeSection) + 1) / sections.length) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-gold to-gold-dark"
          />
        </div>
      </div>
    </nav>
  );
};

export default SectionNavigation;

