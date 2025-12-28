import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useExams } from "@/hooks/useExams";

export const ExamSeriesFilter = ({
  //can use to all basicly
  data = [],
  valueKey,
  labelKey,
  filterKey,
  placeholder = "Select",
  initialFilters = {},
  onFilterChange,
}) => {
  const [value, setValue] = useState(initialFilters[filterKey] ?? "all");

  useEffect(() => {
    if (initialFilters[filterKey] !== undefined) {
      setValue(initialFilters[filterKey] ?? "all");
    }
  }, [initialFilters, filterKey]);

  const handleChange = (val) => {
    setValue(val);
    onFilterChange({
      [filterKey]: val === "all" ? null : val,
    });
  };

  const handleClear = () => {
    setValue("all");
    onFilterChange({ [filterKey]: null });
  };

  const hasActiveFilter = value !== "all";

  return (
    <div className='flex items-center gap-2'>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className='h-10 bg-white border-gray-300'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value='all'>All</SelectItem>

          {data.map((item) => (
            <SelectItem key={item[valueKey]} value={String(item[valueKey])}>
              {item[labelKey]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilter && (
        <Button
          variant='ghost'
          onClick={handleClear}
          className='h-10 text-red-600 hover:bg-red-50'>
          <X className='h-4 w-4 mr-1' />
          Clear
        </Button>
      )}
    </div>
  );
};
