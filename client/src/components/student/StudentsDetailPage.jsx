import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStudents } from "@/hooks/useStudents";
import { useExamsResult } from "@/hooks/useExamResult";
import { DataTable } from "@/components/table";
import PageHeader from "../common/PageHeader";
import AddExamsGrades from "../modals/addExamGrades";
import EditExamsGrades from "../modals/editExamGrades";
import TableHeader from "../common/TableHeader";
import { useStudentsExamSeries } from "@/hooks/useStudentsExamSeries";
import Delete_modal from "../modals/Delete_modal";
import { DetailsInfoCard } from "../common";

export default function StudentsDetailPage() {
  const { id } = useParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState("all");
  const [selectedExamsResult, setSelectedExamsResult] = useState();
  const [searchKeyword, setSearchKeyword] = useState("");
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
  } = useExamsResult();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const student = await getStudentById(id);

        if (!student?.data?.studentId) return;
        // setParams({ studentId: id });
        await fetchStudentExamSeriesById(id);
        await fetchExamsResult({ studentId: student.data.studentId });
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, getStudentById, fetchStudentExamSeriesById, fetchExamsResult]);

  const loadExamResults = async (examseriesid = null) => {
    const params = { studentId: id };
    if (examseriesid && examseriesid !== "all") {
      params.byExamSeriesId = examseriesid;
    }

    await onFilterChange(params);
  };

  const handleSeriesChange = async (value) => {
    setSelectedSeries(value);

    await loadExamResults(value);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    onSearch(e.target.value);
  };

  const openEditModal = (examsResult) => {
    setIsEditModalOpen(true);
    setSelectedExamsResult(examsResult);
  };

  const openDeleteModal = (examsResult) => {
    setIsDeleteModalOpen(true);
    setSelectedExamsResult(examsResult);
  };

  const handleExamResultDelete = async () => {
    await deleteExamResult(selectedExamsResult.examResultsId);
    setIsDeleteModalOpen(false);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
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
      accessorKey: "subjResults",
      header: <div className="text-left w-full">Rank</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "retake",
      header: <div className="text-left w-full">Retake</div>,
      cellClassName: "text-left",
      render: (row) => {
        const isRetake = row.retake === "Yes";

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

  console.log("student exam series", studentsExamSeries);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <PageHeader
          title={`Student Details - ${students.studentName || "Loading..."}`}
          subtitle={`Student ID: ${students.studentIdNo || ""}`}
          primaryAction={{
            label: "Add Grades",
            onClick: openAddModal,
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

        <TableHeader
          search={{
            enabled: true,
            placeholder: "Search exam results...",
            value: searchKeyword,
            onChange: handleSearchChange,
          }}
          filters={[
            {
              id: "examSeries",
              label: "Exam Series",
              type: "dropdown",
              value: selectedSeries,
              onChange: handleSeriesChange,
              options: [
                { value: "all", label: "All Exam Series" },
                ...studentsExamSeries.map((item) => ({
                  value: item.examSeriesId,
                  label: item.examSeriesDescription,
                })),
              ],
              hideAllOption: true,
            },
          ]}
        />

        <DataTable
          data={examsResult}
          columns={columns}
          idAccessor="examResultsId"
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onPageChange={onPageChange}
          onSizeChange={onPageSizeChange}
          pagination={pagination}
          isLoading={isLoading}
        />

        {isAddModalOpen && (
          <AddExamsGrades
            open={isAddModalOpen}
            setOpen={setIsAddModalOpen}
            student={students}
            fetchExamsResult={fetchExamsResult}
            selectedExamsResult={selectedExamsResult}
          />
        )}

        {isEditModalOpen && (
          <EditExamsGrades
            open={isEditModalOpen}
            setOpen={setIsEditModalOpen}
            student={students}
            fetchExamsResult={fetchExamsResult}
            selectedExamsResult={selectedExamsResult}
            selectedEdit={selectedExamsResult}
          />
        )}

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
