import React from "react";
import PropTypes from "prop-types";
import { Search } from "lucide-react";

export default function SearchInput({
  id = "search",
  name = "search",
  label,
  placeholder = "Search...",
  value = "",
  onChange,
  onSubmit,
  className = "",
  disabled = false,
  showLabel = true,
  showSearchButton = false,
}) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && label && (
        <label
          htmlFor={id}
          className='block text-sm font-semibold text-gray-700 mb-2'>
          {label}
        </label>
      )}

      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
          <Search className='h-5 w-5 text-gray-400' aria-hidden='true' />
        </div>

        <input
          type='text'
          name={name}
          id={id}
          disabled={disabled}
          className={`block w-full pl-12 ${
            showSearchButton ? "pr-20" : "pr-4"
          } py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 ${
            disabled
              ? "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-400"
              : "bg-white"
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyPress={handleKeyPress}
        />

        {showSearchButton && onSubmit && (
          <div className='absolute inset-y-0 right-0 flex items-center'>
            <button
              type='button'
              className='mr-3 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none transition-colors duration-200'
              onClick={onSubmit}
              disabled={disabled}>
              Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

SearchInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  showLabel: PropTypes.bool,
  showSearchButton: PropTypes.bool,
};
