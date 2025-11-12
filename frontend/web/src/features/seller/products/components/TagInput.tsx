import { useState, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PlusIcon, TagIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  maxTags?: number;
  suggestions?: string[];
  className?: string;
}

const TagInput = ({
  value = [],
  onChange,
  label,
  placeholder = 'Type and press Enter...',
  error,
  required,
  maxTags = 20,
  suggestions = [],
  className,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      !value.includes(suggestion) &&
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag) && value.length < maxTags) {
      onChange([...value, trimmedTag]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-grey-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Tags Container */}
        <div
          onClick={() => inputRef.current?.focus()}
          className={clsx(
            'min-h-[48px] p-2 rounded-xl border-2 transition-all cursor-text',
            isFocused && !error && 'border-gold ring-2 ring-gold/20',
            error && 'border-red-500 ring-2 ring-red-100',
            !isFocused && !error && 'border-grey-300 hover:border-grey-400'
          )}
        >
          <div className="flex flex-wrap gap-2">
            {/* Existing Tags */}
            <AnimatePresence>
              {value.map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/30 rounded-lg text-sm font-medium text-grey-800 group hover:from-gold/20 hover:to-gold/10 transition-all"
                >
                  <TagIcon className="w-3.5 h-3.5 text-gold" />
                  {tag}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(index);
                    }}
                    type="button"
                    className="ml-1 p-0.5 rounded-full hover:bg-gold/20 transition-colors"
                  >
                    <XMarkIcon className="w-3.5 h-3.5 text-grey-600 group-hover:text-gold" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>

            {/* Input */}
            {value.length < maxTags && (
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setIsFocused(true);
                  setShowSuggestions(true);
                }}
                onBlur={() => {
                  setIsFocused(false);
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                placeholder={value.length === 0 ? placeholder : ''}
                className="flex-1 min-w-[120px] px-2 py-1 outline-none bg-transparent text-sm"
              />
            )}
          </div>
        </div>

        {/* Tag Counter */}
        <div className="absolute -top-2 right-2 px-2 py-0.5 bg-white rounded-full">
          <span className={clsx(
            'text-xs font-medium',
            value.length >= maxTags ? 'text-red-500' : 'text-grey-500'
          )}>
            {value.length} / {maxTags}
          </span>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && inputValue && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto bg-white border-2 border-grey-200 rounded-xl shadow-xl"
            >
              <div className="p-2">
                <p className="px-3 py-2 text-xs font-semibold text-grey-500 uppercase">
                  Suggested Tags
                </p>
                {filteredSuggestions.map((suggestion) => (
                  <motion.button
                    key={suggestion}
                    whileHover={{ x: 4 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-grey-700 hover:bg-gold/10 hover:text-gold transition-colors"
                  >
                    <PlusIcon className="w-4 h-4 text-gold" />
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helper Text */}
      <div className="mt-2 flex items-start justify-between gap-2">
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500 flex items-center gap-1"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </motion.p>
        ) : (
          <p className="text-sm text-grey-500">
            Press <kbd className="px-1.5 py-0.5 bg-grey-100 rounded text-xs font-semibold">Enter</kbd> or <kbd className="px-1.5 py-0.5 bg-grey-100 rounded text-xs font-semibold">,</kbd> to add tags
          </p>
        )}
      </div>
    </div>
  );
};

export default TagInput;

