import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";

import { DataTable } from "@/components/table";
import Add_modal from "@/components/modals/Add_modal";
import Edit_modal from "@/components/modals/Edit_modal";
import Delete_modal from "@/components/modals/Delete_modal";
import { useExams } from "@/hooks/useExams";
import { useExamSeries } from "@/hooks/useExamsSeries";
import { ExamSeriesFilter } from "@/components/examseries/ExamSeriesFilter";

const ExamsSeriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSExam, setSelectedExam] = useState(null);

  const { fetchExams, exams } = useExams();

  const {
    fetchExamSeries,
    createExamsSeries,
    updateExamsSeries,
    deleteExamsSeries,
    examSeries,
    pagination,
    onFilterChange,
    setParams,
    onSearch,
    onPageChange,
    onPageSizeChange,
    params,
  } = useExamSeries();

  useEffect(() => {
    const fetchData = async () => {
      await fetchExamSeries();
      await fetchExams();
    };

    fetchData();
  }, [fetchExamSeries, fetchExams]);

  const openEditModal = (student) => {
    setSelectedExam(student);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (student) => {
    setSelectedExam(student);
    setIsDeleteModalOpen(true);
  };

  const handleStudentEdit = async (formData) => {
    const result = await updateExamsSeries(
      selectedSExam.examSeriesId,
      formData
    );
    if (result.success) {
      fetchExamSeries();
    }
    return result.success;
  };

  const handleExamSeriesSubmit = async (formData) => {
    const result = await createExamsSeries(formData);
    if (result.success) {
      setParams((prev) => ({ ...prev, page: 1 }));
      fetchExamSeries({ page: 1 });
    }
    return result.success;
  };

  const handleStudentDelete = async (entityData) => {
    const result = await deleteExamsSeries(entityData.examSeriesId);
    if (result.success) {
      setParams((prev) => ({ ...prev, page: 1 }));
      fetchExamSeries({ page: 1 });
    }
    return result.success;
  };

  const columns = [
    {
      accessorKey: "examName",
      header: <div className='text-left w-full'>Exam</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "examSeriesDescription",
      header: <div className='text-left w-full'>Description</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "examSeriesStartDate",
      header: <div className='text-left w-full'>Start Date</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "examSeriesEndDate",
      header: <div className='text-left w-full'>End Date</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "credits",
      header: <div className='text-left w-full'>Credits</div>,
      cellClassName: "text-left",
    },
  ];

  const fields = [
    {
      label: "",
      name: "examSeriesId",
      type: "hidden",
    },
    {
      label: "Exam",
      name: "examId",
      type: "dropdown",
      required: true,
    },
    {
      label: "Description",
      name: "examSeriesDescription",
      type: "text",
      required: true,
    },
    {
      label: "Start Date",
      name: "examSeriesStartDate",
      type: "date",
      required: true,
    },
    {
      label: "End Date",
      name: "examSeriesEndDate",
      type: "date",
      required: true,
    },
    {
      label: "Credits",
      name: "credits",
      type: "number",
      required: true,
    },
  ];

  const examOptions = [
    { value: "all", label: "Exam Series" },
    ...(Array.isArray(examSeries)
      ? exams.map((item) => ({
          value: item.examId,
          label: item.examName,
        }))
      : []),
  ];

  return (
    <div className='min-h-screen '>
      <PageHeader
        title='Exams'
        subtitle='Manage student records and exam item assignments'
        primaryAction={{
          label: "Add Student",
          onClick: () => setIsModalOpen(true),
        }}
        showSearch={true}
        searchPlaceholder='Search by Exam Series Name'
        onSearch={onSearch}
        searchMaxLength={50}>
        <ExamSeriesFilter
          data={exams}
          valueKey='examId'
          labelKey='examName'
          filterKey='byExam'
          placeholder='Filter by exam'
          initialFilters={{ byExam: params.byExam }}
          onFilterChange={onFilterChange}
        />
      </PageHeader>

      <DataTable
        data={examSeries}
        columns={columns}
        detailPage='exams'
        idAccessor='examid'
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
          onSubmit={handleExamSeriesSubmit}
          fields={fields}
          title='Add New Exam Series'
          dropdowns={{
            examId: examOptions,
          }}
        />
      )}

      {isEditModalOpen && selectedSExam && (
        <Edit_modal
          open={isEditModalOpen}
          setOpen={setIsEditModalOpen}
          onSubmit={handleStudentEdit}
          fields={fields}
          entityData={selectedSExam}
          title='Edit Exam Series'
          dropdowns={{
            examId: examOptions,
          }}
        />
      )}

      {isDeleteModalOpen && selectedSExam && (
        <Delete_modal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onSubmit={handleStudentDelete}
          entityData={selectedSExam}
          title='Delete Student'
          confirmationText={`Are you sure you want to delete student "${selectedSExam.examname}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default ExamsSeriesPage;
