import { useEffect, useRef, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { DataTable } from "@/components/table";
import Delete_modal from "@/components/modals/Delete_modal";
import { useExams } from "@/hooks/useExams";
import { ExamModal } from "@/components/exam";
import { usePageTitle } from "@/hooks/usePageTitle";

const ExamsPage = () => {
  const hasFetchedData = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({});
  const [selectedExam, setSelectedExam] = useState(null);
  usePageTitle("Exams");

  const {
    createExams,
    fetchExams,
    onSearch,
    deleteExams,
    updateExams,
    exams,
    pagination,
    setParams,
    onPageChange,
    onPageSizeChange,
    isLoading,
    isSubmitting,
  } = useExams();

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    fetchExams();
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    fetchExams();
  }, [fetchExams]);

  const openDeleteModal = (student) => {
    setSelectedExam(student);
    setIsDeleteModalOpen(true);
  };

  const handleExamDelete = async (entityData) => {
    const result = await deleteExams(entityData.examId);
    if (result.success) {
      setParams((prev) => ({ ...prev, page: 1 }));
      fetchExams({ page: 1 });
    }
    return result.success;
  };

  const columns = [
    {
      accessorKey: "examName",
      header: <div className='text-left w-full'>Name</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "examDesc",

      header: <div className='text-left w-full'>Description</div>,

      cellClassName: "text-left",
    },
  ];

  const handleFormSubmit = async (formData) => {
    let result;
    if (modalMode === "create") {
      result = await createExams(formData);
    } else {
      result = await updateExams(formData.examId, formData);
    }

    if (result.success) {
      setIsModalOpen(false);
      setParams((prev) => ({ ...prev, page: 1 }));
      await fetchExams({ page: 1 });
    }
    return result.success;
  };

  return (
    <div className='min-h-screen '>
      <PageHeader
        title='Exams'
        subtitle='Manage exams records and exam series assignments'
        primaryAction={{
          label: "Add Exam",
          onClick: () => {
            setIsModalOpen(true);
            setModalMode("create");
            setInitialFormValues({});
          },
        }}
        showSearch={true}
        searchPlaceholder='Search by exam name'
        onSearch={onSearch}
        searchMaxLength={50}
      />

      <DataTable
        data={exams}
        columns={columns}
        detailPage='exams'
        idAccessor='examId'
        onEdit={(data) => {
          setModalMode("edit");
          setInitialFormValues({
            examId: data.examId,
            examName: data.examName,
            examDesc: data.examDesc,
          });
          setIsModalOpen(true);
        }}
        onDelete={openDeleteModal}
        onPageChange={onPageChange}
        onSizeChange={onPageSizeChange}
        pagination={pagination}
        isLoading={isLoading}
      />

      <ExamModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        mode={modalMode}
      />

      {isDeleteModalOpen && selectedExam && (
        <Delete_modal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onSubmit={handleExamDelete}
          entityData={selectedExam}
          title='Delete Student'
          confirmationText={`Are you sure you want to delete student "${selectedExam.examName}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default ExamsPage;
