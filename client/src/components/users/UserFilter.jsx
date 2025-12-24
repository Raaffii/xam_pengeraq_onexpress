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

export const UserFilter = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    byRole: initialFilters.byRole ?? "all",
  });

  useEffect(() => {
    if (initialFilters.byRole !== undefined) {
      setFilters((prev) => ({
        ...prev,
        byRole: initialFilters.byRole ?? "all",
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
      byRole: newFilters.byRole === "all" ? null : newFilters.byRole,
    });
  };

  const handleClearFilters = () => {
    const cleared = {
      byRole: "all",
    };

    setFilters(cleared);
    onFilterChange({ byRole: null });
  };

  const hasActiveFilters = filters.byRole !== "all";

  return (
    <div className="flex items-center gap-2">
      <Select
        value={filters.byRole}
        onValueChange={(value) => handleFilterChange("byRole", value)}
      >
        <SelectTrigger className="w-[160px] h-10 bg-white border-gray-300">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="teacher">Teacher</SelectItem>
          <SelectItem value="student">Student</SelectItem>
        </SelectContent>
      </Select>

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
