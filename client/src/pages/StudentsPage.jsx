import { useEffect, useState, useRef } from "react";
import PageHeader from "@/components/common/PageHeader";
import { DataTable } from "@/components/table";
import Delete_modal from "@/components/modals/Delete_modal";
import { useStudents } from "@/hooks/useStudents";
import { StudentModal } from "@/components/student/StudentModal";
import { useExamSeries } from "@/hooks/useExamsSeries";
import { usePageTitle } from "@/hooks/usePageTitle";

const StudentsPage = () => {
  const hasFetchedData = useRef(false);
  usePageTitle("Students");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalMode, setModalMode] = useState("create");

  const {
    createStudents,
    fetchStudents,
    updateStudents,
    deleteStudent,
    onSearch,
    students,
    pagination,
    setParams,
    onPageChange,
    onPageSizeChange,
    isLoading,
  } = useStudents();
  const {
    fetchExamSeries,
    examSeries,
    isLoading: isLoadingSeries,
  } = useExamSeries();

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    const fetchData = async () => {
      await fetchStudents();
    };

    fetchData();
    fetchExamSeries();
  }, [fetchStudents, fetchExamSeries]);

  const openCreateModal = () => {
    setSelectedStudent(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    let response;
    if (modalMode === "create") {
      response = await createStudents(formData);
    } else {
      response = await updateStudents(selectedStudent.studentId, formData);
    }

    if (response?.success) {
      if (modalMode === "create") {
        setParams((prev) => ({ ...prev, page: 1 }));
        fetchStudents({ page: 1 });
      } else {
        fetchStudents();
      }
      setIsModalOpen(false);
      setSelectedStudent(null);
    }
  };

  const handleStudentDelete = async (entityData) => {
    const result = await deleteStudent(entityData.studentId);
    if (result.success) {
      setParams((prev) => ({ ...prev, page: 1 }));
      fetchStudents({ page: 1 });
    }
    return result.success;
  };

  const columns = [
    {
      accessorKey: "studentIdNo",
      header: "ID",
      cellClassName: "text-left",
    },
    {
      accessorKey: "studentName",
      header: "Name",
      cellClassName: "text-left",
    },
    {
      accessorKey: "examSeriesDescription",
      header: "Exam Series",
      cellClassName: "text-left",
      render: (row) => {
        const maxVisible = 3;
        const examSeries = row.examSeries || [];
        const visibleSeries = examSeries.slice(0, maxVisible);
        const remaining = examSeries.length - maxVisible;

        return (
          <div className='flex flex-wrap gap-1 max-w-md items-center'>
            {visibleSeries.map((item) => (
              <span
                key={item.examSeriesId}
                className='px-2 py-0.5 text-xs rounded-full
             bg-blue-50 text-blue-700 border border-blue-200
             inline-block max-w-[180px]'
                title={item.examSeriesDescription}>
                <span className='truncate block'>
                  {item.examSeriesDescription}
                </span>
              </span>
            ))}
            {remaining > 0 && (
              <span className='px-2 py-0.5 text-xs text-gray-600'>
                +{remaining} more
              </span>
            )}
          </div>
        );
      },
    },
  ];

  const optionSeries = examSeries?.map((item) => ({
    value: item.seriesId,
    label: item.seriesDesc,
  }));

  return (
    <div className='min-h-screen '>
      <PageHeader
        title='Students'
        subtitle='Manage student records and exam series assignments'
        primaryAction={{
          label: "Add Student",
          onClick: openCreateModal,
        }}
        showSearch={true}
        searchPlaceholder='Search by name'
        onSearch={onSearch}
        searchMaxLength={50}>
        {" "}
      </PageHeader>

      <DataTable
        data={students}
        columns={columns}
        detailPage='students'
        idAccessor='studentId'
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onPageChange={onPageChange}
        onSizeChange={onPageSizeChange}
        pagination={pagination}
        isLoading={isLoading}
      />

      <StudentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialValues={selectedStudent || {}}
        onSubmit={handleFormSubmit}
        mode={modalMode}
        examSeriesOptions={optionSeries}
        isLoadingSeries={isLoadingSeries}
      />

      {isDeleteModalOpen && selectedStudent && (
        <Delete_modal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onSubmit={handleStudentDelete}
          entityData={selectedStudent}
          title='Delete Student'
          confirmationText={`Are you sure you want to delete student "${selectedStudent.studentName}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default StudentsPage;
