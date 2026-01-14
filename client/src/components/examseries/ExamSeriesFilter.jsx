import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { SearchableDropdown } from "../common";

export const ExamSeriesFilter = ({
  data = [],
  valueKey,
  labelKey,
  filterKey,
  placeholder = "Select",
  initialFilters = {},
  onFilterChange,
  isLoading,
  showClearBtn = true,
}) => {
  const [value, setValue] = useState(initialFilters[filterKey] ?? null);

  useEffect(() => {
    if (initialFilters[filterKey] !== undefined) {
      setValue(initialFilters[filterKey] ?? null);
    }
  }, [initialFilters, filterKey]);

  const options = useMemo(() => {
    return Array.isArray(data)
      ? data.map((item) => ({
          value: item[valueKey],
          label: item[labelKey],
        }))
      : [];
  }, [data, valueKey, labelKey]);

  const handleChange = (val) => {
    setValue(val);
    onFilterChange({
      [filterKey]: val === null ? null : val,
    });
  };

  const handleClear = () => {
    setValue(null);
    onFilterChange({ [filterKey]: null });
  };

  const hasActiveFilter = value !== null;

  const defaultOption = useMemo(() => {
    if (value && data.length > 0) {
      const selectedItem = data.find(
        (item) => String(item[valueKey]) === String(value),
      );
      if (selectedItem) {
        return {
          value: String(selectedItem[valueKey]),
          label: selectedItem[labelKey],
        };
      }
    }
    return null;
  }, [value, data, valueKey, labelKey]);

  return (
    <div className="flex items-center gap-2">
      <div className="w-full md:min-w-[200px] md:w-auto">
        <SearchableDropdown
          value={value}
          onChange={handleChange}
          options={options}
          placeholder={placeholder}
          searchPlaceholder="Search..."
          emptyMessage="No items found"
          icon={Filter}
          defaultOption={defaultOption}
          minSearchLength={0}
          className="h-10"
          isLoading={isLoading}
        />
      </div>

      {showClearBtn && hasActiveFilter && (
        <Button
          variant="ghost"
          onClick={handleClear}
          className="h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};
