export const SeriesDetailCard = ({
  selectedSeries,
  className = "",
  variant = "default",
}) => {
  if (!selectedSeries) {
    return null;
  }

  const baseClasses = "rounded-lg shadow-sm w-full";
  const variantClasses = {
    default: "bg-blue-100 text-black",
    light: "bg-gray-50 text-gray-900",
    dark: "bg-gray-800 text-white",
    white: "bg-white text-gray-900 border border-gray-200",
  };

  const infoItems = [
    {
      label: "Exam Series",
      value: selectedSeries.seriesDesc,
    },
    {
      label: "Exam",
      value: selectedSeries.examName,
    },
    {
      label: "Start Date",
      value: selectedSeries.seriesStartDate
        ? new Date(selectedSeries.seriesStartDate).toLocaleDateString("en-GB")
        : "-",
    },
    {
      label: "End Date",
      value: selectedSeries.seriesEndDate
        ? new Date(selectedSeries.seriesEndDate).toLocaleDateString("en-GB")
        : "-",
    },
    {
      label: "Credits",
      value: selectedSeries.seriesCredit || "N/A",
    },
  ];

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <div className="px-4 py-2 sm:p-3">
        <dl className="flex flex-wrap justify-between">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 w-full sm:w-auto mb-2 sm:mb-0"
            >
              <dt className="text-sm font-bold text-gray-700 sm:mr-2">
                {item.label}:
              </dt>
              <dd className="text-sm text-gray-900 break-words">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};
