import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

import { ChevronDown, Search } from "lucide-react";

export default function SearchableDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  className = "",
  disabled = false,
  required = false,
  name,
  icon: Icon = Search,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const [openUp, setOpenUp] = useState(false);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter((o) =>
        o.label.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
    setHighlightedIndex(-1);
  }, [searchTerm, options]);

  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  }, [isOpen]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  const handleSelect = (option) => {
    onChange({
      target: {
        name,
        value: option.value,
      },
    });
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleToggle = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 260; // kira-kira tinggi dropdown

    setOpenUp(spaceBelow < dropdownHeight);
    setIsOpen((p) => !p);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className='block text-sm font-medium mb-1'>
          {label} {required && <span className='text-red-500'>*</span>}
        </label>
      )}

      {/* BUTTON */}
      <button
        ref={buttonRef}
        type='button'
        disabled={disabled}
        onClick={handleToggle}
        className='
      w-full
      relative
      border-2
      border-gray-300
      rounded-lg
      py-2.5
      pl-3
      pr-10
      text-left
      bg-white
      focus:ring-2
      focus:ring-gray-500
    '>
        <span
          className={`flex items-center gap-2
          ${selectedOption ? "" : "text-gray-400 "}}`}>
          <Icon className='w-5 h-5 shrink-0 text-gray-600' />
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
      </button>

      {/* DROPDOWN */}
      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className={`
          absolute
          z-50
          w-full
    bg-white
    border
    border-gray-300
    rounded-lg
    shadow-lg
    overflow-hidden
    ${openUp ? "bottom-full mb-1" : "top-full mt-1"}
  `}>
          {/* SEARCH */}
          <div className='px-3 py-2 border-b bg-white sticky top-0'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
              <input
                name={name}
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search...'
                className='
              w-full
              pl-9
              pr-3
              py-2
              border
              rounded-md
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            '
              />
            </div>
          </div>

          {/* OPTIONS */}
          <div className='max-h-64 overflow-auto'>
            {filteredOptions.map((option, index) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`
              cursor-pointer
              px-4 py-2
              text-sm
              ${
                index === highlightedIndex
                  ? "bg-blue-50 text-blue-900"
                  : "hover:bg-gray-50"
              }
            `}>
                {option.label}
              </div>
            ))}

            {filteredOptions.length === 0 && (
              <div className='px-4 py-6 text-sm text-gray-500 text-center'>
                No results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

SearchableDropdown.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};
