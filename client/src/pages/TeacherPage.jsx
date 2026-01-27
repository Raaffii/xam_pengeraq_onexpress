import { useTeacher } from "@/hooks/useTeacher";
import PageHeader from "@/components/common/PageHeader";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/table";
import AddTeacher from "@/components/teachers/AddTeacher";
import EditTeacher from "@/components/teachers/EditTeacher";
import Delete_modal from "@/components/modals/Delete_modal";

export default function TeacherPage() {
  const hasFetchedData = useRef(false);
  const {
    fetchTeacher,
    teacher,
    deleteTeacher,
    pagination,
    onPageChange,
    onPageSizeChange,
    onSearch,
  } = useTeacher();
  const [isModalOpen, setIsModalOpen] = useState();
  const [isModalEditOpen, setIsModalEditOpen] = useState();
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState();
  const [selectedTeacher, setSelectedTeacher] = useState();

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    const fetchData = async () => {
      await fetchTeacher();
    };

    fetchData();
  }, [fetchTeacher]);

  const columns = [
    {
      accessorKey: "teacherName",
      header: <div className='text-left w-full'>Teacher Name</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "emailAddress",
      header: <div className='text-left w-full'>Email Address</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "userName",
      header: <div className='text-left w-full'>Account</div>,
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

  const handleTeacherSubmit = () => {
    alert("cek");
  };
  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalEditOpen(true);
  };

  const openDeleteModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalDeleteOpen(true);
  };

  const handleTeacherDelete = async (teacher) => {
    const result = await deleteTeacher(teacher.teacherId);
    if (result.success) {
      // setParams((prev) => ({ ...prev, page: 1 }));
      fetchTeacher();
    }
    return result.success;
  };

  return (
    <div className='min-h-screen '>
      <PageHeader
        title='Teacher'
        subtitle='Manage student records and exam series assignments'
        primaryAction={{
          label: "Add Teacher",
          onClick: () => setIsModalOpen(true),
        }}
        showSearch={true}
        searchPlaceholder='Search by name..'
        onSearch={onSearch}
        searchMaxLength={50}>
        {" "}
      </PageHeader>{" "}
      <DataTable
        data={teacher}
        columns={columns}
        idAccessor='teacherId'
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onPageChange={onPageChange}
        onSizeChange={onPageSizeChange}
        pagination={pagination}
      />
      {isModalOpen && (
        <AddTeacher
          open={isModalOpen}
          setOpen={setIsModalOpen}
          onSubmit={handleTeacherSubmit}
          fields={fields}
          title='Add New Student'
          fetchTeacher={fetchTeacher}
        />
      )}
      {isModalEditOpen && (
        <EditTeacher
          open={isModalEditOpen}
          setOpen={setIsModalEditOpen}
          onSubmit={handleTeacherSubmit}
          fields={fields}
          title='Add Edit Student'
          fetchTeacher={fetchTeacher}
          selectedTeacher={selectedTeacher}
        />
      )}
      {isModalDeleteOpen && selectedTeacher && (
        <Delete_modal
          open={isModalDeleteOpen}
          setOpen={setIsModalDeleteOpen}
          onSubmit={handleTeacherDelete}
          entityData={selectedTeacher}
          title='Delete Schedule'
          confirmationText={`Are you sure you want to delete teacher "${selectedTeacher?.teacherName}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
