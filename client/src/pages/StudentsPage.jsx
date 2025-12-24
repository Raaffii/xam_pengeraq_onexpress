import { useEffect, useState, useRef } from "react";
import PageHeader from "@/components/common/PageHeader";

import { Input } from "@/components/ui/input";
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
  const typingTimeoutRef = useRef(null);
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
    const result = await updateStudents(selectedStudent.studentid, formData);
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
    const result = await deleteStudent(entityData.studentid);
    if (result.success) {
      setParams((prev) => ({ ...prev, page: 1 }));
      fetchStudents({ page: 1 });
    }
    return result.success;
  };

  const columns = [
    {
      accessorKey: "studentidno",
      header: <div className='text-left w-full'>ID</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "studentname",
      header: <div className='text-left w-full'>Student Name</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "currentexamseries",
      header: <div className='text-left w-full'>Curent Series</div>,
      cellClassName: "text-left",
    },
  ];

  const fields = [
    {
      label: "",
      name: "studentid",
      type: "hidden",
    },
    {
      label: "ID",
      name: "studentidno",
      type: "text",
      required: true,
      maxLength: 4,
    },
    {
      label: "Name",
      name: "studentname",
      type: "text",
      required: true,
    },
    {
      label: "Exam Series",
      name: "examseriesid",
      type: "dropdown",
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

  const examSeriesOptions = [
    { value: "all", label: "Exam Series" },
    ...(Array.isArray(examSeries)
      ? examSeries.map((series) => ({
          value: series.examseriesid,
          label: series.examseriesdescription,
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
      />

      <Input
        type='search'
        placeholder={"Search..."}
        className='pl-8 w-full bg-background h-10 my-5'
        maxLength={50}
        onChange={handleSearch}
      />

      <DataTable
        data={students}
        columns={columns}
        detailPage='students'
        idAccessor='studentid'
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
            examseriesid: examSeriesOptions,
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
            examseriesid: examSeriesOptions,
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
          confirmationText={`Are you sure you want to delete student "${selectedStudent.studentname}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default StudentsPage;
