import { useParams } from "react-router-dom";
import Edit_modal from "@/components/modals/Edit_modal";
import { useExamSeries } from "@/hooks/useExamsSeries";
import { useExams } from "@/hooks/useExams";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/table";
import PageHeader from "../common/PageHeader";
import Add_exam_series from "@/components/modals/Add_exam_series";
import Delete_modal from "../modals/Delete_modal";

export default function ExamDetailPage() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSExam, setSelectedExam] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    fetchExamSeries,
    examSeries,
    pagination,
    createExamsSeries,
    setParams,
    updateExamsSeries,
    deleteExamsSeries,
    onPageChange,
    onPageSizeChange,
  } = useExamSeries();
  const { fetchExamsById, exams } = useExams();

  useEffect(() => {
    const fetchData = async () => {
      await fetchExamsById(id);

      await fetchExamSeries({ byExam: id });
    };

    fetchData();
  }, []);

  const openEditModal = (student) => {
    setSelectedExam(student);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (student) => {
    setSelectedExam(student);
    setIsDeleteModalOpen(true);
  };

  const handleExamSeriesSubmit = async (formData) => {
    const result = await createExamsSeries(formData);
    if (result.success) {
      setParams((prev) => ({ ...prev, page: 1 }));
      fetchExamSeries({ byExam: id });
    }
    return result.success;
  };

  const handleExamSeriesEdit = async (formData) => {
    const result = await updateExamsSeries(
      selectedSExam.examSeriesId,
      formData
    );
    if (result.success) {
      fetchExamSeries();
    }
    return result.success;
  };

  const handleExamSeriesDelete = async (entityData) => {
    const result = await deleteExamsSeries(entityData.examSeriesId);
    if (result.success) {
      setParams((prev) => ({ ...prev, page: 1 }));
      fetchExamSeries({ byExam: id });
    }
    return result.success;
  };

  const columns = [
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
      label: "",
      name: "examId",
      type: "hidden",
      required: true,
      value: id,
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
    {
      label: "Import",
      name: "importExamSeries",
      type: "optionalSelection",
      required: true,
    },
  ];

  const examSeriesOptions = [
    { value: "all", label: "Exam Series" },
    ...(Array.isArray(examSeries)
      ? examSeries.map((series) => ({
          value: series.examSeriesId,
          label: series.examSeriesDescription,
        }))
      : []),
  ];
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto'>
        <PageHeader
          title={`Student Details - ${exams.examname || "Loading..."}`}
          subtitle={`Student ID: ${exams.examid || ""}`}
          primaryAction={{
            label: "Add Series",
            onClick: () => setIsModalOpen(true),
          }}
        />
        {/* 
        
        Info ----------- */}
        <div className=''>
          <div className='bg-white overflow-hidden shadow-sm ring-1 ring-gray-200 rounded-sm border border-gray-100 mb-6'>
            <div className='px-6 py-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Exam Information
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Exam ID
                  </label>
                  <div className='bg-gray-50 rounded-lg px-4 py-3 border border-gray-200'>
                    <span className='text-gray-900 font-medium'>
                      {exams?.examid || "Loading..."}
                    </span>
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Exam Name
                  </label>
                  <div className='bg-gray-50 rounded-lg px-4 py-3 border border-gray-200'>
                    <span className='text-gray-900 font-medium'>
                      {exams?.examname || "Loading..."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DataTable
          data={examSeries}
          columns={columns}
          idAccessor='examSeriesId'
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onPageChange={onPageChange}
          onSizeChange={onPageSizeChange}
          pagination={pagination}
        />

        {isModalOpen && (
          <Add_exam_series
            open={isModalOpen}
            setOpen={setIsModalOpen}
            onSubmit={handleExamSeriesSubmit}
            fields={fields}
            title='Add New Exam Series'
            dropdowns={{
              importExamSeries: examSeriesOptions,
            }}
          />
        )}

        {isEditModalOpen && selectedSExam && (
          <Edit_modal
            open={isEditModalOpen}
            setOpen={setIsEditModalOpen}
            onSubmit={handleExamSeriesEdit}
            fields={fields}
            entityData={selectedSExam}
            title='Edit Exam Series'
          />
        )}

        {isDeleteModalOpen && selectedSExam && (
          <Delete_modal
            open={isDeleteModalOpen}
            setOpen={setIsDeleteModalOpen}
            onSubmit={handleExamSeriesDelete}
            entityData={selectedSExam}
            title='Delete Student'
            confirmationText={`Are you sure you want to delete student "${selectedSExam.examname}"? This action cannot be undone.`}
          />
        )}
      </div>
    </div>
  );
}
