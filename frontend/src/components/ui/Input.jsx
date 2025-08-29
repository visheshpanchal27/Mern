import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  type = 'text',
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'w-full';
  
  const inputClasses = error 
    ? 'input-error'
    : 'input-primary';
  
  const classes = `${baseClasses} ${inputClasses} ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={classes}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;