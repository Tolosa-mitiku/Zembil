import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  currency?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  min?: number;
  max?: number;
  className?: string;
  helperText?: string;
}

const CurrencyInput = ({
  value,
  onChange,
  currency = 'USD',
  label,
  placeholder = '0.00',
  error,
  required,
  min = 0,
  max,
  className,
  helperText,
}: CurrencyInputProps) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Format the value for display
    if (value !== undefined && value !== null) {
      setDisplayValue(value.toFixed(2));
    }
  }, [value]);

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$',
  };

  const symbol = currencySymbols[currency] || '$';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow only numbers and decimal point
    const sanitized = inputValue.replace(/[^0-9.]/g, '');

    // Prevent multiple decimal points
    const parts = sanitized.split('.');
    let formatted = parts[0];
    if (parts.length > 1) {
      formatted += '.' + parts[1].substring(0, 2); // Limit to 2 decimal places
    }

    setDisplayValue(formatted);

    // Convert to number and call onChange
    const numValue = parseFloat(formatted) || 0;
    if (max === undefined || numValue <= max) {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Format to 2 decimal places on blur
    const numValue = parseFloat(displayValue) || 0;
    setDisplayValue(numValue.toFixed(2));
    onChange(numValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
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
        {/* Currency Symbol */}
        <div
          className={clsx(
            'absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold pointer-events-none transition-colors',
            isFocused ? 'text-gold' : 'text-grey-600'
          )}
        >
          {symbol}
        </div>

        {/* Input */}
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={clsx(
            'w-full pl-12 pr-20 py-3 text-lg font-semibold rounded-xl border-2 transition-all outline-none',
            isFocused && !error && 'border-gold ring-2 ring-gold/20',
            error && 'border-red-500 ring-2 ring-red-100',
            !isFocused && !error && 'border-grey-300 hover:border-grey-400',
            'placeholder:text-grey-400 placeholder:font-normal'
          )}
        />

        {/* Currency Code */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-grey-500">
          {currency}
        </div>

        {/* Focus Glow Effect */}
        {isFocused && !error && (
          <motion.div
            layoutId="currency-focus"
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </div>

      {/* Helper or Error Text */}
      {error ? (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
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
        helperText && (
          <p className="mt-2 text-sm text-grey-500">{helperText}</p>
        )
      )}
    </div>
  );
};

export default CurrencyInput;

