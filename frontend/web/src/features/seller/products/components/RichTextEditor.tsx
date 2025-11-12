import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  NumberedListIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Enter product description...',
  maxLength = 5000,
  minLength = 10,
  error,
  label,
  required,
  className,
}: RichTextEditorProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCharCount(value?.length || 0);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const formatButtons = [
    {
      icon: BoldIcon,
      action: () => insertFormatting('**', '**'),
      label: 'Bold',
    },
    {
      icon: ItalicIcon,
      action: () => insertFormatting('*', '*'),
      label: 'Italic',
    },
    {
      icon: ListBulletIcon,
      action: () => insertFormatting('\n• ', ''),
      label: 'Bullet List',
    },
    {
      icon: NumberedListIcon,
      action: () => insertFormatting('\n1. ', ''),
      label: 'Numbered List',
    },
  ];

  const isValid = charCount >= minLength && charCount <= maxLength;
  const isWarning = charCount > maxLength * 0.9;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-grey-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={clsx(
          'relative rounded-xl border-2 transition-all overflow-hidden',
          isFocused && !error && 'border-gold ring-2 ring-gold/20',
          error && 'border-red-500 ring-2 ring-red-100',
          !isFocused && !error && 'border-grey-300'
        )}
      >
        {/* Toolbar */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isFocused ? 'auto' : 0 }}
          className="overflow-hidden bg-grey-50 border-b border-grey-200"
        >
          <div className="flex items-center gap-1 p-2">
            {formatButtons.map((button, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={button.action}
                type="button"
                className="p-2 rounded-lg hover:bg-gold/10 transition-colors group"
                title={button.label}
              >
                <button.icon className="w-5 h-5 text-grey-600 group-hover:text-gold" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white resize-none outline-none font-normal text-base text-grey-900 placeholder:text-grey-400 min-h-[200px]"
          style={{ maxHeight: '500px' }}
        />

        {/* Character Count */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <motion.div
            animate={{
              scale: isWarning ? [1, 1.1, 1] : 1,
            }}
            transition={{ repeat: isWarning ? Infinity : 0, duration: 1 }}
            className={clsx(
              'px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm',
              isWarning
                ? 'bg-yellow-100 text-yellow-700'
                : charCount < minLength
                ? 'bg-grey-100 text-grey-600'
                : 'bg-green-100 text-green-700'
            )}
          >
            {charCount} / {maxLength}
          </motion.div>
        </div>
      </div>

      {/* Error or Helper Text */}
      <AnimatePresence>
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm text-red-500 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </motion.p>
        ) : (
          charCount < minLength && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-grey-500"
            >
              At least {minLength} characters recommended
            </motion.p>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default RichTextEditor;

