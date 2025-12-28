import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";

import { DataTable } from "@/components/table";
import Add_modal from "@/components/modals/Add_modal";
import Edit_modal from "@/components/modals/Edit_modal";
import Delete_modal from "@/components/modals/Delete_modal";
import { useStudents } from "@/hooks/useStudents";
import { useExamSeries } from "@/hooks/useExamsSeries";

const StudentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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
  } = useStudents();

  const { fetchExamSeries, examSeries } = useExamSeries();

  useEffect(() => {
    const fetchData = async () => {
      await fetchStudents();
      await fetchExamSeries();
    };

    fetchData();
  }, [fetchExamSeries, fetchStudents]);

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleStudentEdit = async (formData) => {
    const result = await updateStudents(selectedStudent.studentId, formData);
    if (result.success) {
      fetchStudents();
    }
    return result.success;
  };

  const handleStudentSubmit = async (formData) => {
    const result = await createStudents(formData);
    if (result.success) {
      setParams((prev) => ({ ...prev, page: 1 }));
      fetchStudents({ page: 1 });
    }
    return result.success;
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
      header: <div className='text-left w-full'>ID</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "studentName",
      header: <div className='text-left w-full'>Student Name</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "examSeriesDescription",
      header: <div className='text-left w-full'>Curent Series</div>,
      cellClassName: "text-left",
    },
  ];

  const fields = [
    {
      label: "",
      name: "studentId",
      type: "hidden",
    },
    {
      label: "ID",
      name: "studentIdNo",
      type: "text",
      required: true,
      maxLength: 4,
    },
    {
      label: "Name",
      name: "studentName",
      type: "text",
      required: true,
    },
    {
      label: "Exam Series",
      name: "examSeriesId",
      type: "dropdown",
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
    <div className='min-h-screen '>
      <PageHeader
        title='Students'
        subtitle='Manage student records and exam series assignments'
        primaryAction={{
          label: "Add Student",
          onClick: () => setIsModalOpen(true),
        }}
        showSearch={true}
        searchPlaceholder='Search by name'
        onSearch={onSearch}
        searchMaxLength={50}>
        {" "}
      </PageHeader>
      {/* 
      <Input
        type='search'
        placeholder={"Search..."}
        className='pl-8 w-full bg-background h-10 my-5'
        maxLength={50}
        onChange={handleSearch}
      /> */}

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
      />

      {isModalOpen && (
        <Add_modal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          onSubmit={handleStudentSubmit}
          fields={fields}
          title='Add New Student'
          dropdowns={{
            examSeriesId: examSeriesOptions,
          }}
        />
      )}

      {isEditModalOpen && selectedStudent && (
        <Edit_modal
          open={isEditModalOpen}
          setOpen={setIsEditModalOpen}
          onSubmit={handleStudentEdit}
          fields={fields}
          entityData={selectedStudent}
          title='Edit Student'
          dropdowns={{
            examSeriesId: examSeriesOptions,
          }}
        />
      )}

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
