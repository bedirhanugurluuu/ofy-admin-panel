import React from 'react';

// Form Input Component
interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'number' | 'email' | 'url';
  className?: string;
}

export function FormInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  className = ''
}: FormInputProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

// Form File Input Component
interface FormFileInputProps {
  label: string;
  onChange: (file: File | null) => void;
  accept?: string;
  required?: boolean;
  className?: string;
  helperText?: string;
}

export function FormFileInput({
  label,
  onChange,
  accept = 'image/*',
  required = false,
  className = '',
  helperText
}: FormFileInputProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <input
        type="file"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        accept={accept}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required={required}
      />
      {helperText && (
        <p className="text-sm text-gray-500 mt-2">{helperText}</p>
      )}
    </div>
  );
}

// Form Textarea Component
interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  className = ''
}: FormTextareaProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

// Form Select Component
interface FormSelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: FormSelectOption[];
  required?: boolean;
  className?: string;
}

export function FormSelect({
  label,
  value,
  onChange,
  options,
  required = false,
  className = ''
}: FormSelectProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required={required}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Form Button Component
interface FormButtonProps {
  type?: 'submit' | 'button';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
}

export function FormButton({
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  children,
  variant = 'primary',
  className = ''
}: FormButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Form Actions Component
interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function FormActions({ children, className = '' }: FormActionsProps) {
  return (
    <div className={`flex space-x-4 pt-6 ${className}`}>
      {children}
    </div>
  );
}

