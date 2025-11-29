import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
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
      className,
      type = 'text',
      ...props
    },
    ref
  ) => {
    return (
      <div className={clsx('w-full', containerClassName)}>
        {label && (
          <label className="block text-label-large text-grey-900 mb-2">
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
              'input-base',
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

