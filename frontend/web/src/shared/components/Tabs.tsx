import { ReactNode } from 'react';
import clsx from 'clsx';

interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

const Tabs = ({ tabs, activeTab, onChange }: TabsProps) => {
  return (
    <div className="border-b border-grey-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-gold text-gold'
                : 'border-transparent text-grey-500 hover:text-grey-700 hover:border-grey-300'
            )}
          >
            {tab.icon && (
              <span
                className={clsx(
                  'mr-2',
                  activeTab === tab.id ? 'text-gold' : 'text-grey-400 group-hover:text-grey-500'
                )}
              >
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={clsx(
                  'ml-2 py-0.5 px-2 rounded-full text-xs font-medium',
                  activeTab === tab.id
                    ? 'bg-gold-pale text-gold'
                    : 'bg-grey-100 text-grey-600'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;

