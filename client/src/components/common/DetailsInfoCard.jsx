import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * DetailsInfoCard Component
 *
 * @param {string} title - Card title
 * @param {Array} fields - Array of field objects with { label, value, className }
 * @param {number} columnSize - Number of columns in grid (1-4)
 * @param {boolean} isLoading - Loading state
 * @param {string} className - Additional classes for the card
 */
export const DetailsInfoCard = ({
  title = "Details",
  fields = [],
  columnSize = 3,
  isLoading = false,
  className,
}) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  const gridClass = gridCols[columnSize] || gridCols[3];

  if (isLoading) {
    return (
      <div
        className={cn(
          "bg-white overflow-hidden shadow-md ring-1 ring-gray-200 rounded-md border border-gray-100",
          className,
        )}
      >
        <div className="px-6 py-6">
          <Skeleton className="h-7 w-48 mb-4" />
          <div className={cn("grid gap-6", gridClass)}>
            {Array.from({ length: columnSize * 2 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white overflow-hidden shadow-md ring-1 ring-gray-200 rounded-md border border-gray-100",
        className,
      )}
    >
      <div className="px-6 py-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className={cn("grid gap-6", gridClass)}>
          {fields.map((field, index) => (
            <div key={index} className={field.className}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <span className="text-gray-900 font-medium">
                  {field.value || "-"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
