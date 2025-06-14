import React from 'react';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:bg-primary-700',
  secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:bg-gray-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:bg-red-700',
  icon: 'text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

const shapes = {
  square: 'rounded-md',
  circle: 'rounded-full',
};

function Button({
  children,
  variant = 'primary',
  size = 'md',
  shape = 'square',
  className = '',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200 hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] focus:shadow-[0_4px_8px_rgba(0,0,0,0.1)] active:shadow-[0_1px_2px_rgba(0,0,0,0.1)]';
  
  const classes = [
    baseClasses,
    variants[variant],
    sizes[size],
    shapes[shape],
    className,
  ].join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button; 