import PageHeader from "@/components/common/PageHeader";
import { ExamSeriesFilter } from "@/components/examseries";
import { DataTable } from "@/components/table";
import { useDashboard } from "@/hooks/useDashboard";
import { useEffect, useRef } from "react";
import { getGradeColor } from "@/utils";
import { GradeDisplay, SeriesDetailCard } from "@/components/dashboard";

const DashboardPage = () => {
  const hasFetchedData = useRef(false);
  const {
    fetchInitialDashboard,
    dashboardData,
    seriesOption,
    seriesSubj,
    selectedSeries,
    params,
    pagination,
    onPageChange,
    onPageSizeChange,
    onSearch,
    isLoading,
    onFilterChange,
  } = useDashboard();

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    fetchInitialDashboard();
  }, [fetchInitialDashboard]);

  const getResultForSubject = (student, subjId) => {
    return student.results.find((r) => r.subjId === subjId);
  };

  const columns = [
    {
      header: "Student",
      width: "200px",
      align: "left",
      headerClassName:
        "sm:w-64 min-w-48 text-left sticky left-0 z-10 font-medium shadow-sm bg-gray-700",
      cellClassName:
        "sm:w-64 min-w-48 text-left sticky left-0 z-10 font-medium shadow-sm bg-gray-50",
      render: (row) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {row.studentName}
          </div>
          <div className="text-sm text-gray-500">{row.studentIdNo}</div>
        </div>
      ),
    },
    ...(seriesSubj.length > 0
      ? seriesSubj.map((subject) => ({
          header: (
            <div className="flex flex-col items-center">
              <span className="font-bold text-white-900">
                {subject.subjCode}
              </span>
              <span className="text-xs text-gray-300">{subject.subjDesc}</span>
            </div>
          ),
          width: "150px",
          align: "center",
          render: (row) => {
            const result = getResultForSubject(row, subject.subjId);
            return result ? (
              <div onClick={() => console.log("clicked: ", row, result)}>
                <GradeDisplay
                  grade={result.subjGrade}
                  marks={result.marks}
                  gpa={result.subjGpa}
                  isRetake={result.isRetake}
                />
              </div>
            ) : (
              <span className="text-gray-400 text-sm">N/A</span>
            );
          },
        }))
      : [
          {
            header: "No subjects available",
            className: "text-center",
          },
        ]),
    {
      header: "Overall",
      width: "150px",
      align: "center",
      render: (row) => (
        <div className="space-y-1">
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm text-white font-semibold ${getGradeColor(
              row.summary.overallGrade,
            )}`}
          >
            {row.summary.overallGrade}
          </div>
          <div className="text-sm text-gray-600">
            GPA: {row.summary.overallGradePoint}
          </div>
          <div className="text-xs text-gray-500">{row.summary.gradeResult}</div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Manage dashboard data"
        showSearch={true}
        searchPlaceholder="Search by student name or id"
        onSearch={onSearch}
        searchMaxLength={50}
      >
        {/* Exam Series Filter */}
        <ExamSeriesFilter
          data={seriesOption}
          valueKey="seriesId"
          labelKey="seriesDesc"
          filterKey="bySeries"
          placeholder="Filter by Series"
          initialFilters={params}
          onFilterChange={onFilterChange}
          isLoading={isLoading}
          showClearBtn={false}
        />
      </PageHeader>

      {/* Series Details Card */}
      <SeriesDetailCard selectedSeries={selectedSeries} className="my-4" />

      {/* Dashboard Table */}
      <DataTable
        columns={columns}
        data={dashboardData}
        pagination={pagination}
        onPageChange={onPageChange}
        onSizeChange={onPageSizeChange}
        isLoading={isLoading}
        showActions={false}
      />
    </div>
  );
};

export default DashboardPage;
