import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";

import { DataTable } from "@/components/table";
import Add_modal from "@/components/modals/Add_modal";
import Edit_modal from "@/components/modals/Edit_modal";
import Delete_modal from "@/components/modals/Delete_modal";
import { useExams } from "@/hooks/useExams";

const ExamsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSExam, setSelectedExam] = useState(null);

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
  } = useExams();

  useEffect(() => {
    const fetchData = async () => {
      await fetchExams();
    };

    fetchData();
  }, [fetchExams]);

  const openEditModal = (student) => {
    setSelectedExam(student);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (student) => {
    setSelectedExam(student);
    setIsDeleteModalOpen(true);
  };

  const handleStudentEdit = async (formData) => {
    const result = await updateExams(selectedSExam.examId, formData);
    if (result.success) {
      fetchExams();
    }
    return result.success;
  };

  const handleExamSubmit = async (formData) => {
    const result = await createExams(formData);

    if (result.success) {
      setParams((prev) => ({ ...prev, page: 1 }));
      fetchExams({ page: 1 });
    }
    return result.success;
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
      accessorKey: "examDescription",
      header: <div className='text-left w-full'>Description</div>,
      cellClassName: "text-left",
    },
  ];

  const fields = [
    {
      label: "",
      name: "examId",
      type: "hidden",
    },
    {
      label: "Name",
      name: "examName",
      type: "text",
      maxLength: 45,
      required: true,
    },
    {
      label: "Description",
      name: "examDescription",
      type: "textarea",
      maxLength: 50,
      required: true,
    },
  ];

  return (
    <div className='min-h-screen '>
      <PageHeader
        title='Exams'
        subtitle='Manage exams records and exam series assignments'
        primaryAction={{
          label: "Add Exam",
          onClick: () => setIsModalOpen(true),
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
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onPageChange={onPageChange}
        onSizeChange={onPageSizeChange}
        pagination={pagination}
      />

      {isModalOpen && (
        <Add_modal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          onSubmit={handleExamSubmit}
          fields={fields}
          title='Add New Exam'
        />
      )}

      {isEditModalOpen && selectedSExam && (
        <Edit_modal
          open={isEditModalOpen}
          setOpen={setIsEditModalOpen}
          onSubmit={handleStudentEdit}
          fields={fields}
          entityData={selectedSExam}
          title='Edit Student'
        />
      )}

      {isDeleteModalOpen && selectedSExam && (
        <Delete_modal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onSubmit={handleExamDelete}
          entityData={selectedSExam}
          title='Delete Student'
          confirmationText={`Are you sure you want to delete student "${selectedSExam.examName}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default ExamsPage;
