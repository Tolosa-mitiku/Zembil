import { useState } from 'react';
import { 
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  VideoCameraIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  GlobeAltIcon,
  BugAntIcon,
  LightBulbIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
  LifebuoyIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  TruckIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ServerIcon,
} from '@heroicons/react/24/outline';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import toast from 'react-hot-toast';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

interface SupportTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  iconBg: string;
  count: number;
}

interface ContactMethod {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  action: string;
  available: boolean;
}

const SupportPage = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium',
  });

  // FAQ Data - Admin specific
  const faqs: FAQItem[] = [
    {
      id: 'faq1',
      category: 'Platform Management',
      question: 'How do I manage user accounts and permissions?',
      answer: 'Navigate to the Users page to view, edit, or suspend user accounts. You can assign roles, manage permissions, and monitor user activity. Use the bulk actions feature for managing multiple accounts simultaneously.',
      tags: ['users', 'permissions', 'management'],
    },
    {
      id: 'faq2',
      category: 'System Configuration',
      question: 'How do I configure platform settings?',
      answer: 'Access the Settings page to configure system-wide parameters including payment gateways, shipping options, tax settings, email templates, and platform policies. Changes take effect immediately.',
      tags: ['settings', 'configuration', 'system'],
    },
    {
      id: 'faq3',
      category: 'Order Management',
      question: 'How do I handle dispute resolution?',
      answer: 'Go to the Orders page and filter by disputed orders. Review the dispute details, communicate with both parties, and make a decision. The system automatically processes refunds or releases payments based on your resolution.',
      tags: ['disputes', 'orders', 'resolution'],
    },
    {
      id: 'faq4',
      category: 'Analytics',
      question: 'How do I generate platform reports?',
      answer: 'The Analytics dashboard provides comprehensive reports on sales, users, revenue, and performance metrics. You can customize date ranges, export data in multiple formats, and schedule automated reports.',
      tags: ['reports', 'analytics', 'data'],
    },
    {
      id: 'faq5',
      category: 'Seller Management',
      question: 'How do I verify and approve seller accounts?',
      answer: 'Navigate to the Sellers page to view pending verification requests. Review business documents, verify information, and approve or reject applications. You can also suspend existing sellers if needed.',
      tags: ['sellers', 'verification', 'approval'],
    },
    {
      id: 'faq6',
      category: 'Content Management',
      question: 'How do I manage banners and promotions?',
      answer: 'Use the Banners page to create, edit, or remove promotional banners. You can schedule banners, target specific user segments, and track click-through rates. Changes are reflected immediately on the platform.',
      tags: ['banners', 'promotions', 'marketing'],
    },
    {
      id: 'faq7',
      category: 'Security',
      question: 'How do I monitor platform security?',
      answer: 'Access the Security dashboard to monitor login attempts, suspicious activities, and system logs. You can enable two-factor authentication requirements, set password policies, and configure IP whitelisting.',
      tags: ['security', 'monitoring', 'logs'],
    },
    {
      id: 'faq8',
      category: 'Support',
      question: 'How can I contact technical support?',
      answer: 'Our technical support team is available 24/7 for admin-related issues. Reach us through priority support at admin-support@zembil.com, or call our dedicated admin hotline at 1-800-ADMIN-SUPPORT.',
      tags: ['support', 'contact', 'technical'],
    },
  ];

  // Support Topics - Admin specific
  const supportTopics: SupportTopic[] = [
    {
      id: 'platform-management',
      title: 'Platform Management',
      description: 'User & seller administration',
      icon: UserGroupIcon,
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      count: 15,
    },
    {
      id: 'system-config',
      title: 'System Configuration',
      description: 'Settings and preferences',
      icon: Cog6ToothIcon,
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      count: 20,
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      description: 'Data and insights',
      icon: ChartBarIcon,
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
      count: 12,
    },
    {
      id: 'orders',
      title: 'Order Management',
      description: 'Processing and disputes',
      icon: TruckIcon,
      gradient: 'from-amber-500 to-amber-600',
      iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
      count: 10,
    },
    {
      id: 'security',
      title: 'Security & Access',
      description: 'Platform protection',
      icon: ShieldCheckIcon,
      gradient: 'from-red-500 to-red-600',
      iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
      count: 8,
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure',
      description: 'Server and performance',
      icon: ServerIcon,
      gradient: 'from-pink-500 to-pink-600',
      iconBg: 'bg-gradient-to-br from-pink-500 to-pink-600',
      count: 6,
    },
  ];

  // Contact Methods
  const contactMethods: ContactMethod[] = [
    {
      id: 'live-chat',
      title: 'Priority Chat',
      description: 'Admin priority support',
      icon: ChatBubbleLeftRightIcon,
      gradient: 'from-blue-500 to-cyan-500',
      action: 'Start Chat',
      available: true,
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Response within 1-2 hours',
      icon: EnvelopeIcon,
      gradient: 'from-purple-500 to-pink-500',
      action: 'Send Email',
      available: true,
    },
    {
      id: 'phone',
      title: 'Phone Support',
      description: '1-800-ADMIN-SUPPORT (24/7)',
      icon: PhoneIcon,
      gradient: 'from-green-500 to-emerald-500',
      action: 'Call Now',
      available: true,
    },
    {
      id: 'documentation',
      title: 'Admin Docs',
      description: 'Technical documentation',
      icon: BookOpenIcon,
      gradient: 'from-orange-500 to-red-500',
      action: 'View Docs',
      available: true,
    },
  ];

  // Filter FAQs based on search and topic
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTopic = selectedTopic === 'all' || faq.category.toLowerCase().replace(/\s+/g, '-') === selectedTopic;
    
    return matchesSearch && matchesTopic;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Priority ticket created! We\'ll respond within 1-2 hours.', {
      icon: '📧',
      duration: 4000,
    });
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'medium',
    });
  };

  const handleQuickAction = (action: string) => {
    toast.success(`Redirecting to ${action}...`, { icon: '🚀' });
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 md:p-16 shadow-2xl">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Floating Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg animate-float">
            <LifebuoyIcon className="w-10 h-10 text-white" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <SparklesIcon className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span className="text-white/90 text-sm font-medium tracking-wide uppercase">
              Admin Priority Support
            </span>
            <SparklesIcon className="w-5 h-5 text-yellow-300 animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Admin Support Center
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Technical support and platform management assistance
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            {[
              { label: 'Admin Guides', value: '100+', icon: BookOpenIcon },
              { label: 'Video Tutorials', value: '40+', icon: VideoCameraIcon },
              { label: 'Avg Response', value: '1-2h', icon: ClockIcon },
              { label: 'Uptime', value: '99.9%', icon: CheckCircleIcon },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 transform hover:scale-105 transition-transform duration-200"
                  style={{ animation: `slideInFromBottom 0.5s ease-out ${index * 0.1}s both` }}
                >
                  <Icon className="w-6 h-6 text-white/80 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card padding="lg" className="shadow-lg">
        <div className="flex items-center gap-4">
          <MagnifyingGlassIcon className="w-6 h-6 text-grey-400" />
          <input
            type="text"
            placeholder="Search for admin guides, system help, technical documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-lg outline-none text-grey-900 placeholder:text-grey-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-grey-400 hover:text-grey-600 transition-colors"
            >
              <span className="text-sm font-medium">Clear</span>
            </button>
          )}
        </div>
      </Card>

      {/* Support Topics Grid */}
      <div>
        <h2 className="text-2xl font-bold text-grey-900 mb-6 flex items-center gap-3">
          <QuestionMarkCircleIcon className="w-7 h-7 text-gold" />
          Browse by Topic
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportTopics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <div
                key={topic.id}
                className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                onClick={() => setSelectedTopic(topic.id)}
                style={{ animation: `slideInFromBottom 0.5s ease-out ${index * 0.1}s both` }}
              >
                <Card
                  padding="lg"
                  hover
                  className={`h-full border-2 transition-all duration-300 ${
                    selectedTopic === topic.id
                      ? 'border-gold shadow-lg scale-105'
                      : 'border-grey-100 group-hover:border-transparent group-hover:shadow-xl'
                  }`}
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${topic.iconBg} mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-grey-900 mb-2 group-hover:text-gold transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-grey-600 mb-4">{topic.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-grey-500">
                      {topic.count} articles
                    </span>
                    <ChevronRightIcon className="w-4 h-4 text-grey-400 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
        {selectedTopic !== 'all' && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setSelectedTopic('all')}
              className="text-sm font-medium text-gold hover:underline"
            >
              View All Topics
            </button>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-2xl font-bold text-grey-900 mb-6 flex items-center gap-3">
          <BookOpenIcon className="w-7 h-7 text-gold" />
          Frequently Asked Questions
          <span className="text-sm font-normal text-grey-500 ml-auto">
            {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'}
          </span>
        </h2>
        
        {filteredFAQs.length > 0 ? (
          <div className="space-y-3">
            {filteredFAQs.map((faq, index) => (
              <div
                key={faq.id}
                className="border-2 border-grey-100 rounded-xl overflow-hidden transition-all hover:border-gold hover:shadow-md"
                style={{ animation: `fade-in 0.3s ease-out ${index * 0.05}s both` }}
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-grey-50 transition-colors text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gold-pale text-gold text-xs font-medium">
                        {faq.category}
                      </span>
                    </div>
                    <h5 className="text-base font-semibold text-grey-900">{faq.question}</h5>
                  </div>
                  {expandedFAQ === faq.id ? (
                    <ChevronUpIcon className="w-5 h-5 text-gold flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-grey-400 flex-shrink-0 ml-4" />
                  )}
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-5 pb-5 text-sm text-grey-600 bg-gold-pale/30 border-t border-gold/20 animate-slide-in-from-bottom">
                    <p className="leading-relaxed pt-4">{faq.answer}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {faq.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-white border border-grey-200 rounded-md text-xs font-medium text-grey-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Card padding="lg" className="text-center">
            <div className="py-8">
              <MagnifyingGlassIcon className="w-16 h-16 text-grey-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-grey-900 mb-2">No results found</h3>
              <p className="text-grey-600 mb-4">
                Try adjusting your search or browse by topic
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedTopic('all'); }} variant="secondary">
                Clear Filters
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Contact Methods */}
      <div>
        <h2 className="text-2xl font-bold text-grey-900 mb-6 flex items-center gap-3">
          <ChatBubbleLeftRightIcon className="w-7 h-7 text-gold" />
          Get in Touch
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                className="group cursor-pointer"
                onClick={() => handleQuickAction(method.title)}
                style={{ animation: `slideInFromBottom 0.5s ease-out ${index * 0.1}s both` }}
              >
                <Card
                  padding="lg"
                  hover
                  className="h-full text-center border-2 border-grey-100 group-hover:border-transparent group-hover:shadow-xl transition-all"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${method.gradient} mb-4 transform transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-grey-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-sm text-grey-600 mb-4">{method.description}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full group-hover:bg-gold group-hover:text-white group-hover:border-gold"
                  >
                    {method.action}
                  </Button>
                  {method.available && (
                    <div className="mt-3 flex items-center justify-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-green-600 font-medium">Available Now</span>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Form */}
      <div>
        <h2 className="text-2xl font-bold text-grey-900 mb-6 flex items-center gap-3">
          <EnvelopeIcon className="w-7 h-7 text-gold" />
          Create Support Ticket
        </h2>
        <Card padding="lg" className="max-w-3xl mx-auto shadow-xl">
          <form onSubmit={handleContactSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Your Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Admin Name"
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="admin@zembil.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="Brief description of issue"
                required
              />
              <div>
                <label className="block text-label-large text-grey-900 mb-2">
                  Priority Level
                </label>
                <select
                  value={contactForm.priority}
                  onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-grey-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all bg-white"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Need assistance</option>
                  <option value="high">High - Urgent system issue</option>
                  <option value="critical">Critical - Platform down</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-label-large text-grey-900 mb-2">
                Message
              </label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border-2 border-grey-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none bg-white"
                placeholder="Please describe the issue in detail, including any error messages..."
                required
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                leftIcon={<PaperAirplaneIcon className="w-4 h-4" />}
                className="flex-1"
              >
                Create Ticket
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setContactForm({ name: '', email: '', subject: '', message: '', priority: 'medium' })}
              >
                Clear
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Additional Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padding="lg" className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0">
              <BugAntIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-grey-900 mb-2">Report System Bug</h3>
              <p className="text-sm text-grey-600 mb-4">
                Found a critical bug? Report it immediately for priority investigation and resolution.
              </p>
              <Button variant="secondary" size="sm">
                Report Bug
              </Button>
            </div>
          </div>
        </Card>

        <Card padding="lg" className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
              <LightBulbIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-grey-900 mb-2">Feature Request</h3>
              <p className="text-sm text-grey-600 mb-4">
                Suggest platform improvements or new administrative features.
              </p>
              <Button variant="secondary" size="sm">
                Request Feature
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer Banner */}
      <Card padding="lg" className="bg-gradient-to-r from-gold-pale via-white to-gold-pale border-2 border-gold/30">
        <div className="text-center">
          <SparklesIcon className="w-12 h-12 text-gold mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-grey-900 mb-2">
            Need Immediate Assistance?
          </h3>
          <p className="text-grey-600 mb-6 max-w-2xl mx-auto">
            Our admin priority support team is available 24/7 to assist with platform issues.
            Critical issues receive immediate attention with 1-2 hour response time.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button leftIcon={<ChatBubbleLeftRightIcon className="w-4 h-4" />}>
              Start Priority Chat
            </Button>
            <Button variant="secondary" leftIcon={<PhoneIcon className="w-4 h-4" />}>
              Call Admin Support
            </Button>
            <Button variant="ghost" leftIcon={<GlobeAltIcon className="w-4 h-4" />}>
              Visit Admin Docs
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SupportPage;
