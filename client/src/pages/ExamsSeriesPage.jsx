import { useEffect, useState, useRef } from "react";
import PageHeader from "@/components/common/PageHeader";

import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/table";
import Add_modal from "@/components/modals/Add_modal";
import Edit_modal from "@/components/modals/Edit_modal";
import Delete_modal from "@/components/modals/Delete_modal";
import { useExams } from "@/hooks/useExams";
import { useExamSeries } from "@/hooks/useExamsSeries";

const ExamsSeriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSExam, setSelectedExam] = useState(null);
  const typingTimeoutRef = useRef(null);

  const { fetchExams, exams } = useExams();

  const {
    fetchExamSeries,
    createExamsSeries,
    updateExamsSeries,
    deleteExamsSeries,
    examSeries,
    pagination,
    onSearch,
    onPageChange,
    onPageSizeChange,
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
    console.log("formdata edit", formData);
    const result = await updateExamsSeries(
      selectedSExam.examseriesid,
      formData
    );
    return result.success;
  };

  const handleExamSeriesSubmit = async (formData) => {
    console.log("formdata create", formData);
    const result = await createExamsSeries(formData);
    if (result.success) {
      // setCurrentPage(1);
    }
    return result.success;
  };

  const handleStudentDelete = async (entityData) => {
    const result = await deleteExamsSeries(entityData.examseriesid);
    if (result.success) {
      // const totalAfterDelete = filteredStudents.length - 1;
      // const maxPage = Math.ceil(totalAfterDelete / pageLimit);
      // if (currentPage > maxPage && maxPage > 0) {
      //   setCurrentPage(maxPage);
      // }
    }
    return result.success;
  };

  const columns = [
    {
      accessorKey: "examname",
      header: <div className='text-left w-full'>Exam</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "examseriesdescription",
      header: <div className='text-left w-full'>Description</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "examseriesstartdate",
      header: <div className='text-left w-full'>Start Date</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "examseriesenddate",
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
      name: "examseriesid",
      type: "hidden",
    },
    {
      label: "Exam",
      name: "examid",
      type: "dropdown",
      required: true,
    },
    {
      label: "Description",
      name: "examseriesdescription",
      type: "text",
      required: true,
    },
    {
      label: "Start Date",
      name: "examseriesstartdate",
      type: "date",
      required: true,
    },
    {
      label: "End Date",
      name: "examseriesenddate",
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

  const handleSearch = (e) => {
    const search = e.target.value;
    const words = search.length;

    if (words >= 3 || words === 0) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        onSearch(search);
      }, 1000);
    }
  };

  const examOptions = [
    { value: "all", label: "Exam Series" },
    ...(Array.isArray(examSeries)
      ? exams.map((item) => ({
          value: item.examid,
          label: item.examname,
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
      />

      <Input
        type='search'
        placeholder={"Search..."}
        className='pl-8 w-full bg-background h-10 my-5'
        maxLength={50}
        onChange={handleSearch}
      />

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
            examid: examOptions,
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
            examid: examOptions,
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
