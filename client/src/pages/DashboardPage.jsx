import PageHeader from "@/components/common/PageHeader";
import { ExamSeriesFilter } from "@/components/examseries";
import { DataTable } from "@/components/table";
import { useDashboard } from "@/hooks/useDashboard";
import { useEffect, useRef, useState } from "react";
import { getGradeColor } from "@/utils";
import {
  ExamResultModal,
  GradeDisplay,
  SeriesDetailCard,
} from "@/components/dashboard";
import { useExamsResult } from "@/hooks/useExamResult";
import { usePageTitle } from "@/hooks/usePageTitle";

const DashboardPage = () => {
  const hasFetchedData = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [initialFormValues, setInitialFormValues] = useState({});
  const {
    fetchInitialDashboard,
    dashboardData,
    setDashboardData,
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
    fetchDashboard,
    setParams,
  } = useDashboard();
  const { postExamResult, putExamResult, isSubmitting } = useExamsResult();
  usePageTitle("Dashboard");

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
    ...(seriesSubj.length > 0 ?
      seriesSubj.map((subject) => ({
        header: (
          <div className="flex flex-col items-center">
            <span className="font-bold text-white-900">{subject.subjCode}</span>
            <span className="text-xs text-gray-300">{subject.subjDesc}</span>
          </div>
        ),
        width: "150px",
        align: "center",
        render: (row) => {
          const result = getResultForSubject(row, subject.subjId);
          return result ?
              <div
                onClick={() => {
                  setModalMode("edit");
                  setInitialFormValues({
                    resultId: result.resultId,
                    studentId: row.studentId,
                    studentName: row.studentName,
                    examSeriesId: selectedSeries.seriesId,
                    seriesDesc: selectedSeries.seriesDesc,
                    examSubjId: result.subjId,
                    subjDesc: result.subjDesc,
                    isRetake: result.isRetake,
                    marks: Number(result.marks).toFixed(2),
                    subjGpa: Number(result.subjGpa).toFixed(2),
                    subjResult: result.subjResult,
                    subjGrade: result.subjGrade,
                  });
                  setIsModalOpen(true);
                }}
              >
                <GradeDisplay
                  grade={result.subjGrade}
                  marks={Number(result.marks).toFixed(2)}
                  gpa={Number(result.subjGpa).toFixed(2)}
                  isRetake={result.isRetake}
                />
              </div>
            : <span className="text-gray-400 text-sm">N/A</span>;
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

  const handleFormSubmit = async (formData) => {
    console.log(formData);
    let result;
    if (modalMode === "create") {
      result = await postExamResult(formData);
    } else {
      result = await putExamResult(initialFormValues.resultId, formData);
    }

    if (result.success) {
      if (modalMode === "edit") {
        setDashboardData((prevData) => {
          return prevData.map((student) => {
            if (student.studentId === initialFormValues.studentId) {
              return {
                ...student,
                results: student.results.map((res) => {
                  if (res.resultId === initialFormValues.resultId) {
                    return {
                      ...res,
                      ...formData,
                      isRetake: formData.isRetake ? true : false,
                      editedDate: new Date()
                        .toISOString()
                        .slice(0, 19)
                        .replace("T", " "),
                    };
                  }
                  return res;
                }),
              };
            }
            return student;
          });
        });
      } else {
        setParams((prev) => ({ ...prev, page: 1 }));
        fetchDashboard();
      }

      setIsModalOpen(false);
    }
    return result.success;
  };

  const handleSuccessDelete = () => {
    setDashboardData((prevData) => {
      return prevData
        .map((student) => {
          if (student.studentId === initialFormValues.studentId) {
            return {
              ...student,
              results: student.results.filter(
                (result) => result.resultId !== initialFormValues.resultId,
              ),
            };
          }
          return student;
        })
        .filter((student) => student.results.length > 0);
    });
  };

  const options =
    Array.isArray(seriesOption) ?
      seriesOption.map((item) => ({
        value: item.seriesId,
        label: item.seriesDesc,
      }))
    : [];

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
        primaryAction={{
          label: "New Exam Result",
          onClick: () => {
            setModalMode("create");
            setInitialFormValues({});
            setIsModalOpen(true);
          },
        }}
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

      <ExamResultModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}
        onSuccessDelete={handleSuccessDelete}
        isSubmitting={isSubmitting}
        mode={modalMode}
        seriesOptions={options}
        optionDisabled={modalMode === "edit"}
      />
    </div>
  );
};

export default DashboardPage;
