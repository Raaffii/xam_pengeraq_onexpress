import React from "react";
import PropTypes from "prop-types";

export default function TextareaInput({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = "",
  className = "",
  disabled = false,
  readOnly = false,
  required = false,
  rows = 4,
  cols,
  maxLength,
  resize = "vertical",
  minHeight = "120px",
  minWidth = "100%",
  ...props
}) {
  const resizeClass = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize",
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className='block text-sm font-semibold text-gray-700 mb-2'>
          {label} {required && <span className='text-red-500'>*</span>}
        </label>
      )}

      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        rows={rows}
        cols={cols}
        maxLength={maxLength}
        style={{
          minHeight: minHeight,
          minWidth: minWidth,
        }}
        className={`w-full transition-all duration-200 shadow-sm text-left font-medium ${
          disabled || readOnly
            ? "bg-gray-50 border-2 border-gray-200 text-gray-600 cursor-not-allowed"
            : "bg-white border-2 border-gray-300 text-gray-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
        } rounded-lg py-3 px-4 ${resizeClass[resize] || "resize-y"}`}
        {...props}
      />
    </div>
  );
}

TextareaInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  rows: PropTypes.number,
  cols: PropTypes.number,
  maxLength: PropTypes.number,
  resize: PropTypes.oneOf(["none", "vertical", "horizontal", "both"]),
  minHeight: PropTypes.string,
  minWidth: PropTypes.string,
};
