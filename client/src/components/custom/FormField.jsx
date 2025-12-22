import React from "react";
import PropTypes from "prop-types";

export default function FormField({
  children,
  label,
  required = false,
  error,
  helpText,
  className = "",
  labelClassName = "",
  ...props
}) {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {label && (
        <label
          className={`block text-sm font-semibold text-gray-700 ${labelClassName}`}>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}

      {children}

      {helpText && <p className='text-sm text-gray-500'>{helpText}</p>}

      {error && <p className='text-sm text-red-600'>{error}</p>}
    </div>
  );
}

FormField.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  helpText: PropTypes.string,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
};
