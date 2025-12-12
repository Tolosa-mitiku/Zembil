import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import { 
  QuestionMarkCircleIcon, 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  BugAntIcon,
  LightBulbIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const HelpSupportModal = ({ isOpen, onClose }: HelpSupportModalProps) => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    category: 'general',
  });
  const [bugReport, setBugReport] = useState({
    title: '',
    description: '',
    steps: '',
  });
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'bug' | 'feature'>('faq');

  const faqs: FAQItem[] = [
    {
      category: 'Account',
      question: 'How do I reset my password?',
      answer: 'Go to Security settings and click on "Change Password". You\'ll need to enter your current password and then your new password twice.',
    },
    {
      category: 'Users',
      question: 'How do I manage users?',
      answer: 'Navigate to the Users page from the main menu. You can view, add, edit, or deactivate user accounts from there.',
    },
    {
      category: 'Products',
      question: 'How do I approve products?',
      answer: 'Go to Products page and filter by "Pending Review". Each product has an approve/reject button that you can use after reviewing.',
    },
    {
      category: 'Orders',
      question: 'How do I handle order disputes?',
      answer: 'Order disputes can be found in the Orders section. Review the details and use the resolution tools to mediate between buyer and seller.',
    },
    {
      category: 'Support',
      question: 'How can I contact technical support?',
      answer: 'You can reach us through the contact form below, send an email to admin-support@zembil.com, or use the live chat feature.',
    },
  ];

  const handleContactSubmit = () => {
    toast.success('Message sent! We\'ll get back to you within 24 hours.', {
      icon: '📧',
      duration: 4000,
    });
    setContactForm({ subject: '', message: '', category: 'general' });
  };

  const handleBugSubmit = () => {
    toast.success('Bug report submitted! Thank you for helping us improve.', {
      icon: '🐛',
      duration: 4000,
    });
    setBugReport({ title: '', description: '', steps: '' });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Help & Support"
      size="xl"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-grey-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'faq'
                ? 'border-gold text-gold font-medium'
                : 'border-transparent text-grey-600 hover:text-grey-900'
            }`}
          >
            <QuestionMarkCircleIcon className="w-5 h-5" />
            <span>FAQ</span>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'contact'
                ? 'border-gold text-gold font-medium'
                : 'border-transparent text-grey-600 hover:text-grey-900'
            }`}
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            <span>Contact Us</span>
          </button>
          <button
            onClick={() => setActiveTab('bug')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'bug'
                ? 'border-gold text-gold font-medium'
                : 'border-transparent text-grey-600 hover:text-grey-900'
            }`}
          >
            <BugAntIcon className="w-5 h-5" />
            <span>Report Bug</span>
          </button>
          <button
            onClick={() => setActiveTab('feature')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'feature'
                ? 'border-gold text-gold font-medium'
                : 'border-transparent text-grey-600 hover:text-grey-900'
            }`}
          >
            <LightBulbIcon className="w-5 h-5" />
            <span>Feature Request</span>
          </button>
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <QuestionMarkCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900">Frequently Asked Questions</h4>
                <p className="text-xs text-blue-700 mt-0.5">
                  Find quick answers to common admin questions
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-grey-200 rounded-lg overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 hover:bg-grey-50 transition-colors text-left"
                  >
                    <div className="flex-1">
                      <span className="text-xs font-medium text-gold uppercase">{faq.category}</span>
                      <h5 className="text-sm font-semibold text-grey-900 mt-1">{faq.question}</h5>
                    </div>
                    {expandedFAQ === index ? (
                      <ChevronUpIcon className="w-5 h-5 text-grey-400 flex-shrink-0 ml-3" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-grey-400 flex-shrink-0 ml-3" />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-4 pb-4 text-sm text-grey-600 bg-grey-50 border-t border-grey-200 animate-slide-in-from-bottom">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button className="flex flex-col items-center gap-2 p-4 border-2 border-grey-200 rounded-lg hover:border-gold hover:bg-gold-pale transition-all">
                <DocumentTextIcon className="w-8 h-8 text-gold" />
                <span className="text-sm font-medium text-grey-900">Documentation</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 border-2 border-grey-200 rounded-lg hover:border-gold hover:bg-gold-pale transition-all">
                <VideoCameraIcon className="w-8 h-8 text-gold" />
                <span className="text-sm font-medium text-grey-900">Video Tutorials</span>
              </button>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-green-900">Contact Support</h4>
                <p className="text-xs text-green-700 mt-0.5">
                  We typically respond within 24 hours
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-label-large text-grey-900 mb-2">Category</label>
                <select
                  value={contactForm.category}
                  onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-grey-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <Input
                label="Subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="Brief description of your issue"
              />

              <div>
                <label className="block text-label-large text-grey-900 mb-2">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-grey-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
                  placeholder="Please describe your issue in detail..."
                />
              </div>

              <Button
                onClick={handleContactSubmit}
                leftIcon={<PaperAirplaneIcon className="w-4 h-4" />}
                className="w-full"
              >
                Send Message
              </Button>
            </div>

            <div className="border-t border-grey-200 pt-4">
              <h5 className="text-sm font-semibold text-grey-900 mb-3">Other Ways to Reach Us</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-grey-600">Email:</span>
                  <a href="mailto:admin-support@zembil.com" className="text-gold hover:underline">
                    admin-support@zembil.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-grey-600">Response Time:</span>
                  <span className="text-grey-900">Within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bug Report Tab */}
        {activeTab === 'bug' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <BugAntIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-red-900">Report a Bug</h4>
                <p className="text-xs text-red-700 mt-0.5">
                  Help us improve by reporting issues you encounter
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Bug Title"
                value={bugReport.title}
                onChange={(e) => setBugReport({ ...bugReport, title: e.target.value })}
                placeholder="Brief description of the bug"
              />

              <div>
                <label className="block text-label-large text-grey-900 mb-2">Description</label>
                <textarea
                  value={bugReport.description}
                  onChange={(e) => setBugReport({ ...bugReport, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-grey-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
                  placeholder="What happened? What did you expect to happen?"
                />
              </div>

              <div>
                <label className="block text-label-large text-grey-900 mb-2">Steps to Reproduce</label>
                <textarea
                  value={bugReport.steps}
                  onChange={(e) => setBugReport({ ...bugReport, steps: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-grey-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
                />
              </div>

              <Button
                onClick={handleBugSubmit}
                leftIcon={<BugAntIcon className="w-4 h-4" />}
                className="w-full"
              >
                Submit Bug Report
              </Button>
            </div>
          </div>
        )}

        {/* Feature Request Tab */}
        {activeTab === 'feature' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <LightBulbIcon className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-purple-900">Request a Feature</h4>
                <p className="text-xs text-purple-700 mt-0.5">
                  Share your ideas to help us build better features
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Feature Title"
                placeholder="What would you like to see?"
              />

              <div>
                <label className="block text-label-large text-grey-900 mb-2">Description</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-grey-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
                  placeholder="Describe the feature and how it would help you..."
                />
              </div>

              <Button
                onClick={() => toast.success('Feature request submitted! Thank you for your feedback.', { icon: '💡' })}
                leftIcon={<LightBulbIcon className="w-4 h-4" />}
                className="w-full"
              >
                Submit Feature Request
              </Button>
            </div>
          </div>
        )}

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

export default HelpSupportModal;














