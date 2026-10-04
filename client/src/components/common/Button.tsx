import React from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'emergency';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] min-w-[44px]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-2 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900 focus:ring-teal-600 shadow-sm disabled:bg-slate-100 disabled:text-slate-400',
    secondary:
      'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 focus:ring-slate-400 disabled:bg-slate-50 disabled:text-slate-300',
    ghost:
      'bg-transparent text-teal-700 hover:bg-teal-50 hover:text-teal-800 focus:ring-teal-600 disabled:text-slate-300',
    destructive:
      'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:ring-rose-500 disabled:text-slate-300',
    emergency:
      'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500 shadow-clinical-emergency',
  }[variant];

  return (
    <button
      className={clsx(baseStyles, sizeStyles, variantStyles, className)}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
