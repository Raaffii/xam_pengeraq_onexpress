import React from "react";
import PropTypes from "prop-types";

export default function Input({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  className = "",
  disabled = false,
  readOnly = false,
  required = false,
  min,
  max,
  step,
  maxLength,
  ...props
}) {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className='block text-sm font-semibold text-gray-700 mb-2'>
          {label} {required && <span className='text-red-500'>*</span>}
        </label>
      )}

      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        min={min}
        max={max}
        step={step}
        maxLength={maxLength}
        className={`w-full transition-all duration-200 shadow-sm text-left font-medium ${
          disabled || readOnly
            ? "bg-gray-50 border-2 border-gray-200 text-gray-600 cursor-not-allowed"
            : "bg-white border-2 border-gray-300 text-gray-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
        } rounded-lg py-3 px-4`}
        {...props}
      />
    </div>
  );
}

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxLength: PropTypes.number,
};
