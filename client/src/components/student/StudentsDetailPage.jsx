import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useStudents } from "@/hooks/useStudents";
import { useExamsResult } from "@/hooks/useExamResult";
import { DataTable } from "@/components/table";
import PageHeader from "../common/PageHeader";
import { useStudentsExamSeries } from "@/hooks/useStudentsExamSeries";
import Delete_modal from "../modals/Delete_modal";
import { DetailsInfoCard } from "../common";
import { ExamResultModal } from "../dashboard";
import { ExamSeriesFilter } from "../examseries";

export default function StudentsDetailPage() {
  const { id } = useParams();
  const hasFetchedData = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [initialFormValues, setInitialFormValues] = useState({});

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExamsResult, setSelectedExamsResult] = useState();
  const { fetchStudentExamSeriesById, studentsExamSeries } =
    useStudentsExamSeries();
  const { getStudentById, students, isLoading: loadStudent } = useStudents();
  const {
    fetchExamsResult,
    examsResult,
    onPageChange,
    onPageSizeChange,
    pagination,
    onSearch,
    onFilterChange,
    deleteExamResult,
    isLoading,
    postExamResult,
    putExamResult,
    isSubmitting,
    setParams,
    params,
  } = useExamsResult();

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    const fetchData = async () => {
      try {
        const student = await getStudentById(id);

        if (!student?.data?.studentId) return;
        setParams((prev) => ({
          ...prev,
          studentId: student.data.studentId,
          page: 1,
        }));
        await fetchStudentExamSeriesById(id);

        await fetchExamsResult({ studentId: student.data.studentId, page: 1 });
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [
    id,
    getStudentById,
    fetchStudentExamSeriesById,
    fetchExamsResult,
    setParams,
  ]);

  const openDeleteModal = (examsResult) => {
    setIsDeleteModalOpen(true);
    setSelectedExamsResult(examsResult);
  };

  const handleExamResultDelete = async () => {
    await deleteExamResult(selectedExamsResult.resultId);
    setIsDeleteModalOpen(false);
  };

  const columns = [
    {
      accessorKey: "subjCode",
      header: <div className="text-left w-full">Subject Code</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "subjDesc",
      header: <div className="text-left w-full">Subject</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "marks",
      header: <div className="text-left w-full">Marks</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "subjGpa",
      header: <div className="text-left w-full">GPA</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "subjGrade",
      header: <div className="text-left w-full">Grade</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "subjResult",
      header: <div className="text-left w-full">Rank</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "isRetake",
      header: <div className="text-left w-full">Retake</div>,
      cellClassName: "text-left",
      render: (row) => {
        const isRetake = row.isRetake === "Yes";

        return (
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full border
        ${
          isRetake
            ? "bg-red-100 text-red-700 border-red-200"
            : "bg-green-100 text-green-700 border-green-200"
        }`}
          >
            {isRetake ? "Yes" : "No"}
          </span>
        );
      },
    },
  ];

  const handleFormSubmit = async (formData) => {
    let result;
    if (modalMode === "create") {
      result = await postExamResult(formData);
    } else {
      result = await putExamResult(initialFormValues.resultId, formData);
    }

    if (result.success) {
      setParams((prev) => ({ ...prev, page: 1 }));
      await fetchExamsResult();

      setIsModalOpen(false);
    }
    return result.success;
  };

  const options = Array.isArray(studentsExamSeries)
    ? studentsExamSeries.map((item) => ({
        value: item.seriesId,
        label: item.seriesDesc,
      }))
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <PageHeader
          title={`Student Details - ${students.studentName || "Loading..."}`}
          subtitle={`Student ID: ${students.studentIdNo || ""}`}
          primaryAction={{
            label: "Add Grades",
            onClick: () => {
              setModalMode("create");
              setInitialFormValues({
                studentId: students.studentId,
                studentName: students.studentName,
              });
              setIsModalOpen(true);
            },
          }}
        />

        <DetailsInfoCard
          title="Student Information"
          fields={[
            {
              label: "Student ID",
              value: students.studentIdNo,
            },
            {
              label: "Student Name",
              value: students.studentName,
            },
          ]}
          columnSize={2}
          isLoading={loadStudent}
          className="mb-6"
        />

        <PageHeader
          title=""
          subtitle=""
          showSearch={true}
          searchPlaceholder="Search exam result..."
          onSearch={onSearch}
          searchMaxLength={50}
        >
          <ExamSeriesFilter
            data={studentsExamSeries}
            valueKey="seriesId"
            labelKey="seriesDesc"
            filterKey="bySeries"
            placeholder="Filter by Series"
            initialFilters={params}
            onFilterChange={onFilterChange}
            isLoading={isLoading}
          />
        </PageHeader>

        <DataTable
          data={examsResult}
          columns={columns}
          idAccessor="resultId"
          onEdit={(result) => {
            setModalMode("edit");
            setInitialFormValues({
              resultId: result.resultId,
              studentId: students.studentId,
              studentName: students.studentName,
              examSeriesId: result.seriesId,
              seriesDesc: result.seriesDesc,
              examSubjId: result.subjId,
              subjDesc: result.subjDesc,
              isRetake: result.isRetake,
              marks: result.marks,
              subjGpa: result.subjGpa,
              subjResult: result.subjResult,
              subjGrade: result.subjGrade,
            });
            setIsModalOpen(true);
          }}
          onDelete={openDeleteModal}
          onPageChange={onPageChange}
          onSizeChange={onPageSizeChange}
          pagination={pagination}
          isLoading={isLoading}
        />
        <ExamResultModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          initialValues={initialFormValues}
          onSubmit={handleFormSubmit}
          onSuccessDelete={() => {
            fetchExamsResult();
          }}
          isSubmitting={isSubmitting}
          mode={modalMode}
          seriesOptions={options}
          optionDisabled={modalMode === "edit"}
          lockStudent={true}
        />
        {isDeleteModalOpen && selectedExamsResult && (
          <Delete_modal
            open={isDeleteModalOpen}
            setOpen={setIsDeleteModalOpen}
            onSubmit={handleExamResultDelete}
            entityData={selectedExamsResult}
            title="Delete Exam Result"
            confirmationText={`Are you sure you want to delete exam result "${selectedExamsResult.subjDesc}"? This action cannot be undone.`}
          />
        )}
      </div>
    </div>
  );
}
