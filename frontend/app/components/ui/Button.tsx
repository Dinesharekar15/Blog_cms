'use client'

import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'social';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  disabled = false,
  icon
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer inline-flex items-center justify-center';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg',
    secondary: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50',
    social: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
  };
  
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  
  const content = (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );
  
  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {content}
      </Link>
    );
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${buttonClasses} ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
    >
      {content}
    </button>
  );
}