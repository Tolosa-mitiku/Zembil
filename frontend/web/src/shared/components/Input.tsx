import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
  labelClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      containerClassName,
      labelClassName,
      className,
      type = 'text',
      ...props
    },
    ref
  ) => {
    return (
      <div className={clsx('w-full', containerClassName)}>
        {label && (
          <label className={clsx("block text-label-large text-grey-900 mb-2", labelClassName)}>
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-grey-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={clsx(
              'w-full bg-white border border-gray-200 text-gray-900 rounded-lg focus:border-gold focus:ring-1 focus:ring-gold block p-2.5 outline-none transition-colors',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-error focus:border-error focus:ring-error',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-grey-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-label-medium text-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-label-medium text-grey-600">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

