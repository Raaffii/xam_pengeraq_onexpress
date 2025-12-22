import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

import { ChevronDown, Search } from "lucide-react";

export default function SearchableDropdown({
  id,
  name,
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  className = "",
  disabled = false,
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
    setHighlightedIndex(-1);
  }, [searchTerm, options]);

  // Calculate dropdown position to avoid clipping
  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const dropdownHeight = 350;
        const spaceBelow = window.innerHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        let position = {
          left: buttonRect.left,
          width: buttonRect.width,
          zIndex: 9999,
        };

        // If there's not enough space below but enough above, position above
        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          position.bottom = window.innerHeight - buttonRect.top + 8;
        } else {
          position.top = buttonRect.bottom + 8;
        }

        setDropdownPosition(position);
      }
    };

    updatePosition();

    if (isOpen) {
      // Update position on scroll or resize
      const handleScroll = () => updatePosition();
      const handleResize = () => updatePosition();

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    const handleKeyDown = (event) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleOptionSelect(filteredOptions[highlightedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          break;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, filteredOptions, highlightedIndex]);

  const selectedOption = options.find((option) => option.value === value);

  const handleOptionSelect = (option) => {
    onChange({ target: { value: option.value } });
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleToggleDropdown = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  };

  // Portal dropdown content
  const dropdownContent = isOpen && !disabled && (
    <div
      ref={dropdownRef}
      className='fixed bg-white shadow-xl max-h-80 rounded-lg border border-gray-200 overflow-hidden focus:outline-none'
      style={dropdownPosition}>
      {/* Search Input */}
      <div className='sticky top-0 z-10 bg-white px-4 py-3 border-b border-gray-100'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <input
            type='text'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-800'
            placeholder='Search options...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          {searchTerm && (
            <button
              type='button'
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              onClick={() => setSearchTerm("")}>
              ×
            </button>
          )}
        </div>
      </div>

      {/* Options List */}
      <div className='max-h-64 overflow-auto py-1'>
        {filteredOptions.length === 0 ? (
          <div className='px-4 py-8 text-center'>
            <div className='text-gray-400 mb-1'>
              <Search className='h-8 w-8 mx-auto mb-2 opacity-50' />
            </div>
            <p className='text-sm text-gray-500'>
              {searchTerm
                ? `No results found for "${searchTerm}"`
                : "No options available"}
            </p>
          </div>
        ) : (
          <>
            {/* Show count of results */}
            {searchTerm && (
              <div className='px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-100'>
                {filteredOptions.length} result
                {filteredOptions.length !== 1 ? "s" : ""} found
              </div>
            )}

            {filteredOptions.map((option, index) => (
              <div
                key={option.value || index}
                className={`cursor-pointer select-none relative py-3 px-4 transition-colors duration-150 ${
                  index === highlightedIndex
                    ? "bg-blue-50 text-blue-900 border-l-4 border-blue-500"
                    : value === option.value
                    ? "bg-blue-100 text-blue-900 font-medium border-l-4 border-blue-400"
                    : "text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => handleOptionSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                role='option'
                aria-selected={value === option.value}>
                <div className='flex items-center justify-between'>
                  <span className='block truncate text-sm'>{option.label}</span>
                  {value === option.value && (
                    <span className='text-blue-600 ml-2'>✓</span>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className={`relative ${className}`}>
        {label && (
          <label
            htmlFor={id}
            className={`block text-sm font-semibold mb-2 ${
              disabled ? "text-gray-400" : "text-gray-700"
            }`}>
            {label} {required && <span className='text-red-500'>*</span>}
          </label>
        )}

        <button
          ref={buttonRef}
          type='button'
          disabled={disabled}
          className={`relative w-full border-2 rounded-lg py-3 pl-4 pr-12 text-left transition-all duration-200 shadow-sm focus:outline-none ${
            disabled
              ? "bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400 shadow-none"
              : `bg-white cursor-pointer hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isOpen
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-gray-400"
                }`
          }`}
          onClick={handleToggleDropdown}
          aria-haspopup='listbox'
          aria-expanded={isOpen}
          aria-labelledby={label ? `${id}-label` : undefined}
          title={disabled ? "This field is disabled" : undefined}>
          <span
            className={`block truncate ${
              disabled
                ? "text-gray-400"
                : selectedOption
                ? "text-gray-900 font-medium"
                : "text-gray-500"
            }`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-200 ${
                disabled
                  ? "text-gray-300"
                  : isOpen
                  ? "text-gray-400 rotate-180"
                  : "text-gray-400"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Portal the dropdown to avoid modal clipping */}
      {typeof window !== "undefined" &&
        createPortal(dropdownContent, document.body)}
    </>
  );
}

SearchableDropdown.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};
