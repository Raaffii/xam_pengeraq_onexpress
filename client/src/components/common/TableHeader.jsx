import { useState } from "react";

import SearchInput from "../custom/SearchInput";

export default function TableHeader({
  search = {},
  filters = [],
  actions = [],
  className = "",
}) {
  const [activeFilters, setActiveFilters] = useState({});

  const handleFilterChange = (filterId, value) => {
    const newFilters = { ...activeFilters };
    if (value === "" || value === "all") {
      delete newFilters[filterId];
    } else {
      newFilters[filterId] = value;
    }
    setActiveFilters(newFilters);

    // Call the filter's onChange handler
    const filter = filters.find((f) => f.id === filterId);
    if (filter && filter.onChange) {
      filter.onChange(value);
    }
  };

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className='px-4 sm:px-6 py-4'>
        {/* Main Controls Row */}
        <div className='flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:gap-4'>
          {/* Left Side - Filters and Actions */}
          <div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:gap-4'>
            {/* Filters */}
            {filters.length > 0 && (
              <div className='flex flex-col space-y-3 sm:flex-row sm:flex-wrap sm:items-center sm:space-y-0 sm:gap-4'>
                {filters.map((filter) => (
                  <div key={filter.id} className='w-full sm:w-auto sm:min-w-0'>
                    {filter.type === "dropdown" ? (
                      <SearchableDropdown
                        id={filter.id}
                        name={filter.id}
                        options={
                          filter.hideAllOption
                            ? filter.options
                            : [
                                { value: "", label: `All ${filter.label}` },
                                ...filter.options,
                              ]
                        }
                        value={
                          filter.value !== undefined
                            ? filter.value
                            : activeFilters[filter.id] || ""
                        }
                        onChange={(e) =>
                          handleFilterChange(filter.id, e.target.value)
                        }
                        placeholder={`Select ${filter.label}...`}
                        className='w-full sm:min-w-[200px] lg:min-w-[250px]'
                      />
                    ) : filter.type === "select" ? (
                      <div className='w-full'>
                        <select
                          className='block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm text-black'
                          value={
                            filter.value !== undefined
                              ? filter.value
                              : activeFilters[filter.id] || ""
                          }
                          onChange={(e) =>
                            handleFilterChange(filter.id, e.target.value)
                          }>
                          {!filter.hideAllOption && (
                            <option value=''>All {filter.label}</option>
                          )}
                          {filter.options.map((option, idx) => (
                            <option key={idx} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            {/* Additional Actions */}
            {actions.length > 0 && (
              <div className='flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:gap-2'>
                {actions.map((action, index) => (
                  <button
                    key={index}
                    type='button'
                    className={`inline-flex items-center justify-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors duration-200 ${
                      action.variant === "primary"
                        ? "border-blue-600 text-white bg-blue-600 hover:bg-blue-700"
                        : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    onClick={action.onClick}
                    disabled={action.disabled}>
                    {action.icon && (
                      <action.icon
                        className='h-4 w-4 mr-2'
                        aria-hidden='true'
                      />
                    )}
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Search */}
          {search.enabled && (
            <div className='w-full lg:w-auto lg:max-w-md'>
              <SearchInput
                id='search'
                name='search'
                placeholder={search.placeholder || "Search..."}
                value={search.value || ""}
                onChange={search.onChange}
                onSubmit={search.onSubmit}
                showLabel={false}
                showSearchButton={!!search.onSubmit}
                className='w-full sm:min-w-[250px] lg:w-80'
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
