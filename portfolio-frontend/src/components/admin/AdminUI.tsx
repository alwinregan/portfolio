// Premium Admin UI Components

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

// Stat Card Component
interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  trend?: string;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
}

export function StatCard({ label, value, icon, trend, color = 'primary' }: StatCardProps) {
  const colorClasses = {
    primary: 'from-blue-500 to-blue-600',
    accent: 'from-emerald-500 to-emerald-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-amber-500 to-amber-600',
    danger: 'from-red-500 to-red-600',
  };

  return (
    <div className="premium-card p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        {trend && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
        {value}
      </div>
      <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

// Premium Button Component
interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  title?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  title,
  disabled = false,
  type = 'button',
  className = ''
}: ButtonProps) {
  const variants = {
    primary: 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-lg shadow-purple-900/40',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/40',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/40',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`
        inline-flex items-center gap-2 font-bold rounded-xl transition-all 
        hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {icon}
      {children}
    </button>
  );
}

// Input Field Component
interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  error?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

export function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  icon,
  error,
  min,
  max,
  step
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={`
            w-full px-4 py-3 ${icon ? 'pl-12' : ''} 
            bg-white dark:bg-slate-900 
            border-2 border-slate-200 dark:border-slate-800 
            rounded-xl font-medium
            focus:border-primary focus:ring-4 focus:ring-primary/10 
            transition-all outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : ''}
          `}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 font-semibold">{error}</p>
      )}
    </div>
  );
}

// Textarea Component
interface TextareaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  error?: string;
  className?: string;
}

export function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  error,
  className = ''
}: TextareaFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`
          w-full px-4 py-3 
          bg-white dark:bg-slate-900 
          border-2 border-slate-200 dark:border-slate-800 
          rounded-xl font-medium
          focus:border-primary focus:ring-4 focus:ring-primary/10 
          transition-all outline-none resize-none
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
      />
      {error && (
        <p className="text-sm text-red-500 font-semibold">{error}</p>
      )}
    </div>
  );
}

// Select Component
interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  icon?: ReactNode;
  error?: string;
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  icon,
  error
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            w-full px-4 py-3 ${icon ? 'pl-12' : ''} 
            bg-white dark:bg-slate-900 
            border-2 border-slate-200 dark:border-slate-800 
            rounded-xl font-medium
            focus:border-primary focus:ring-4 focus:ring-primary/10 
            transition-all outline-none
            ${error ? 'border-red-500' : ''}
          `}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="text-sm text-red-500 font-semibold">{error}</p>
      )}
    </div>
  );
}

// Card Component
interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
}

export function Card({ children, title, subtitle, icon, className = '' }: CardProps) {
  return (
    <div className={`premium-card p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {icon}
              </div>
            )}
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

// Table Component
interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  onRowClick?: (row: any) => void;
}

export function Table({ columns, data, onRowClick }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="w-full">
        <thead className="bg-slate-50 dark:bg-slate-900/50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {data.map((row, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(row)}
              className={`
                bg-white dark:bg-slate-900 
                ${onRowClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50' : ''}
                transition-colors
              `}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Badge Component
interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  className?: string;
}

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const variants = {
    primary: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-600 border-red-500/20',
    info: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
    secondary: 'bg-slate-200/50 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300 border-slate-300/50 dark:border-slate-600/50',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// Loading Spinner
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`animate-spin rounded-full border-t-2 border-primary ${sizes[size]}`} />
  );
}

// Empty State
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action}
    </div>
  );
}
