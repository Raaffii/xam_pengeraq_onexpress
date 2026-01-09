import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useState, useEffect } from "react";
import { SearchableDropdown } from "../common";

export const UserFilter = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    byRole: initialFilters.byRole,
  });

  useEffect(() => {
    if (initialFilters.byRole !== undefined) {
      setFilters((prev) => ({
        ...prev,
        byRole: initialFilters.byRole,
      }));
    }
  }, [initialFilters.byRole]);

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };

    setFilters(newFilters);
    onFilterChange({
      byRole: newFilters.byRole,
    });
  };

  const handleClearFilters = () => {
    setFilters({ byRole: null });
    onFilterChange({ byRole: null });
  };

  const hasActiveFilters = filters.byRole;

  return (
    <div className="flex items-center gap-2">
      <div className="w-full md:min-w-[200px] md:w-auto">
        <SearchableDropdown
          value={filters.byRole}
          onChange={(value) => handleFilterChange("byRole", value)}
          options={[
            { value: "admin", label: "Admin" },
            { value: "teacher", label: "Teacher" },
            { value: "student", label: "Student" },
          ]}
          placeholder={"Filter by role"}
          searchPlaceholder="Search..."
          emptyMessage="No items found"
          icon={Filter}
          minSearchLength={0}
          className="h-10"
        />
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={handleClearFilters}
          className="h-10 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};
