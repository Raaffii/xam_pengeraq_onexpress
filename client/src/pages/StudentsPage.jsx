import { useEffect, useState, useRef } from "react";
import PageHeader from "@/components/common/PageHeader";

import { DataTable } from "@/components/table";

import Delete_modal from "@/components/modals/Delete_modal";
import { useStudents } from "@/hooks/useStudents";

import AddStudent from "@/components/student/AddStudent";
import EditStudent from "@/components/student/EditStudent";
import { useExamSeries } from "@/hooks/useExamsSeries";

const StudentsPage = () => {
  const hasFetchedData = useRef(false);
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
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    const fetchData = async () => {
      await fetchStudents();
    };

    fetchData();
    fetchExamSeries();
  }, [fetchStudents, fetchExamSeries]);

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
      render: (row) => (
        <div className='flex flex-wrap gap-1'>
          {row.examSeries?.map((item, index) => (
            <span
              key={index}
              className='px-2 py-0.5 text-xs rounded-full
                   bg-blue-50 text-blue-700 border border-blue-200'>
              {item.examSeriesDescription}
            </span>
          ))}
        </div>
      ),
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
          onClick: () => setIsModalOpen(true),
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
      />

      {isModalOpen && (
        <AddStudent
          open={isModalOpen}
          setOpen={setIsModalOpen}
          onSubmit={handleStudentSubmit}
          fields={fields}
          title='Add New Student'
          fetchStudents={fetchStudents}
          seriesOptions={optionSeries}
        />
      )}

      {isEditModalOpen && selectedStudent && (
        <EditStudent
          open={isEditModalOpen}
          setOpen={setIsEditModalOpen}
          onSubmit={handleStudentEdit}
          fields={fields}
          entityData={selectedStudent}
          title='Edit Student'
          fetchStudents={fetchStudents}
          seriesOptions={optionSeries}
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
