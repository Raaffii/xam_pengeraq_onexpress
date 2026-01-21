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
import { usePageTitle } from "@/hooks/usePageTitle";
import { ResourceNotFound } from "../layout";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";

export default function StudentsDetailPage() {
  const { studentId } = useParams();
  const hasFetchedData = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [initialFormValues, setInitialFormValues] = useState({});

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExamsResult, setSelectedExamsResult] = useState();
  const { fetchStudentExamSeriesById, studentsExamSeries } =
    useStudentsExamSeries();
  const { getStudentById, student, isLoading: loadStudent } = useStudents();
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
  usePageTitle(student ? `${student?.studentName}` : "");

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    const fetchData = async () => {
      const response = await getStudentById(studentId);

      if (response.success) {
        setParams((prev) => ({
          ...prev,
          studentId: studentId,
          page: 1,
        }));
        await fetchStudentExamSeriesById(studentId);
        await fetchExamsResult({
          studentId: studentId,
          page: 1,
        });
      }
    };

    if (studentId) {
      fetchData();
    }
  }, [
    studentId,
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

      header: "Subject Code",
      align: "center",
      cellClassName: "font-semibold",
    },
    {
      accessorKey: "subjDesc",
      header: "Subject",

      cellClassName: "text-left",
    },
    {
      accessorKey: "marks",

      header: "Mark",
    },
    {
      accessorKey: "subjGpa",
      header: "GPA",
      align: "center",
    },
    {
      accessorKey: "subjGrade",
      header: "Grade",
      align: "center",
    },
    {
      accessorKey: "subjResult",
      header: "Result",
      cellClassName: "text-left",
    },
    {
      accessorKey: "isRetake",
      header: "Retake",
      align: "center",

      render: (row) => {
        return (
          <div className='flex justify-center'>
            {row.isRetake ? (
              <CheckCircle2Icon className='text-green-800' />
            ) : (
              <XCircleIcon className='text-red-800' />
            )}
          </div>
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

  if (!loadStudent && !student) {
    return (
      <ResourceNotFound
        title='Student Not Found'
        message={`No student found with ID: ${studentId}. It may have been deleted or the ID is incorrect.`}
        backTo='/students'
      />
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto'>
        <PageHeader
          title={`Student Details - ${student?.studentName || "Loading..."}`}
          subtitle={`Student ID: ${student?.studentIdNo || ""}`}
          primaryAction={{
            label: "Add Grades",
            onClick: () => {
              setModalMode("create");
              setInitialFormValues({
                studentId: student?.studentId,
                studentName: student?.studentName,
              });
              setIsModalOpen(true);
            },
          }}
        />

        <DetailsInfoCard
          title='Student Information'
          fields={[
            {
              label: "Student ID",
              value: student?.studentIdNo,
            },
            {
              label: "Student Name",
              value: student?.studentName,
            },
          ]}
          columnSize={2}
          isLoading={loadStudent}
          className='mb-6'
        />

        <PageHeader
          title=''
          subtitle=''
          showSearch={true}
          searchPlaceholder='Search exam result...'
          onSearch={onSearch}
          searchMaxLength={50}>
          <ExamSeriesFilter
            data={studentsExamSeries}
            valueKey='seriesId'
            labelKey='seriesDesc'
            filterKey='bySeries'
            placeholder='Filter by Series'
            initialFilters={params}
            onFilterChange={onFilterChange}
            isLoading={isLoading}
          />
        </PageHeader>

        <DataTable
          data={examsResult}
          columns={columns}
          idAccessor='resultId'
          onEdit={(result) => {
            setModalMode("edit");
            setInitialFormValues({
              resultId: result.resultId,
              studentId: student?.studentId,
              studentName: student?.studentName,
              examSeriesId: result.seriesId,
              seriesDesc: result.seriesDesc,
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
            title='Delete Exam Result'
            confirmationText={`Are you sure you want to delete exam result "${selectedExamsResult.subjDesc}"? This action cannot be undone.`}
          />
        )}
      </div>
    </div>
  );
}
