import React from "react";
import PropTypes from "prop-types";

export default function Checkbox({
  id,
  name,
  label,
  checked = false,
  onChange,
  className = "",
  disabled = false,
  required = false,
  ...props
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`h-4 w-4 transition-all duration-200 ${
          disabled
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-600 focus:ring-blue-500 hover:ring-2 hover:ring-blue-200"
        } border-gray-300 rounded focus:ring-2 focus:ring-offset-0`}
        {...props}
      />
      {label && (
        <label
          htmlFor={id}
          className={`ml-2 block text-sm font-medium ${
            disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-900"
          }`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
    </div>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};
