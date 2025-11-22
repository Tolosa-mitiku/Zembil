import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';
import { 
  InformationCircleIcon, 
  SparklesIcon,
  DocumentTextIcon,
  ScaleIcon,
  CodeBracketIcon,
  CheckCircleIcon,
  ClockIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  const version = '1.0.0';
  const buildDate = 'November 28, 2025';

  const features = [
    'Advanced Admin Dashboard',
    'User Management System',
    'Product Approval Workflow',
    'Order & Dispute Management',
    'Financial Analytics',
    'Real-time Platform Monitoring',
  ];

  const licenses = [
    { name: 'React', version: '18.2.0', license: 'MIT' },
    { name: 'TypeScript', version: '5.3.3', license: 'Apache 2.0' },
    { name: 'Tailwind CSS', version: '3.4.1', license: 'MIT' },
    { name: 'Heroicons', version: '2.1.1', license: 'MIT' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="About Zembil"
      size="lg"
    >
      <div className="space-y-6">
        {/* App Info */}
        <div className="text-center pb-6 border-b border-grey-200">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg">
            <SparklesIcon className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-grey-900 mb-2">Zembil Admin Dashboard</h3>
          <p className="text-grey-600">Comprehensive platform management tools</p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-grey-500">
            <span className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              Version {version}
            </span>
            <span>•</span>
            <span>Built {buildDate}</span>
          </div>
        </div>

        {/* What's New */}
        <div className="border border-grey-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="text-md font-semibold text-grey-900">What's New in v{version}</h4>
          </div>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-grey-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div className="text-sm font-semibold text-green-900">API Status</div>
            <div className="text-xs text-green-700 mt-0.5">Operational</div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
              <GlobeAltIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-sm font-semibold text-blue-900">Uptime</div>
            <div className="text-xs text-blue-700 mt-0.5">99.9%</div>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-100 flex items-center justify-center">
              <CodeBracketIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-sm font-semibold text-purple-900">Build</div>
            <div className="text-xs text-purple-700 mt-0.5">Stable</div>
          </div>
        </div>

        {/* Open Source Licenses */}
        <div className="border border-grey-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-grey-100 flex items-center justify-center">
              <CodeBracketIcon className="w-5 h-5 text-grey-600" />
            </div>
            <h4 className="text-md font-semibold text-grey-900">Open Source Licenses</h4>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {licenses.map((lib, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-grey-50 rounded-lg hover:bg-grey-100 transition-colors"
              >
                <div>
                  <div className="text-sm font-medium text-grey-900">{lib.name}</div>
                  <div className="text-xs text-grey-500">v{lib.version}</div>
                </div>
                <span className="text-xs font-medium text-grey-600 px-2 py-1 bg-white rounded border border-grey-200">
                  {lib.license}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 text-sm text-gold hover:underline font-medium">
            View All Licenses
          </button>
        </div>

        {/* Legal Links */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 p-4 border border-grey-200 rounded-lg hover:border-gold hover:bg-gold-pale transition-all">
            <DocumentTextIcon className="w-5 h-5 text-grey-600" />
            <span className="text-sm font-medium text-grey-900">Privacy Policy</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 border border-grey-200 rounded-lg hover:border-gold hover:bg-gold-pale transition-all">
            <ScaleIcon className="w-5 h-5 text-grey-600" />
            <span className="text-sm font-medium text-grey-900">Terms of Service</span>
          </button>
        </div>

        {/* Credits */}
        <div className="text-center p-4 bg-grey-50 rounded-lg">
          <p className="text-sm text-grey-600">
            Made with ❤️ by the Zembil Team
          </p>
          <p className="text-xs text-grey-500 mt-1">
            © 2025 Zembil. All rights reserved.
          </p>
        </div>

        {/* Close Button */}
        <div className="flex gap-3 pt-4 border-t border-grey-200">
          <Button onClick={onClose} variant="secondary" className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AboutModal;




