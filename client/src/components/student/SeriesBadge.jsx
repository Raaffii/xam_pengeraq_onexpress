import { useState } from "react";
import { StatusBadge } from "../common";

export const SeriesBadge = ({ series, rowId, maxVisible = 3 }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleExpand = () => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const seriesList = series || [];

  if (!series || seriesList.length === 0) {
    return <span className="text-gray-500 text-sm">N/A</span>;
  }

  const isExpanded = expandedRows.has(rowId);
  const visibleSeries =
    isExpanded ? seriesList : seriesList.slice(0, maxVisible);
  const remaining = seriesList.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-1 max-w-md items-center">
      {visibleSeries.map((item, index) => (
        <StatusBadge
          key={`${item.examSeriesId}-${index}`}
          label={item.examSeriesDescription}
          variant={"yellow"}
          size="xs"
        />
      ))}
      {remaining > 0 && (
        <button
          onClick={toggleExpand}
          className="px-2 py-0.5 text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
        >
          {isExpanded ? "Show less" : `+${remaining} more`}
        </button>
      )}
    </div>
  );
};
