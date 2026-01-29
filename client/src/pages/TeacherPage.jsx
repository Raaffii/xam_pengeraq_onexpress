import { useTeacher } from "@/hooks/useTeacher";
import PageHeader from "@/components/common/PageHeader";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/table";
import Delete_modal from "@/components/modals/Delete_modal";
import { TeacherModal } from "@/components/teachers";
import { usePageTitle } from "@/hooks/usePageTitle";
export default function TeacherPage() {
  const hasFetchedData = useRef(false);
  usePageTitle("Teacher");
  const {
    fetchTeacher,
    teacher,
    deleteTeacher,
    pagination,
    onPageChange,
    onPageSizeChange,
    onSearch,
    isLoading,
    createTeacher,
    updateTeacher,
    isSubmitting,
    setParams,
  } = useTeacher();
  const [isModalOpen, setIsModalOpen] = useState();
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState();
  const [selectedTeacher, setSelectedTeacher] = useState({});
  const [modalMode, setModalMode] = useState("create");

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
      header: "Teacher Name",
      cellClassName: "text-left",
    },
    {
      accessorKey: "teacherEmail",
      header: "Email",
      cellClassName: "text-left",
    },
  ];

  const openDeleteModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalDeleteOpen(true);
  };

  const handleTeacherDelete = async (teacher) => {
    const result = await deleteTeacher(teacher.teacherId);
    if (result.success) {
      fetchTeacher();
    }
    return result.success;
  };

  const handleFormSubmit = async (formData) => {
    let result;
    if (modalMode === "create") {
      result = await createTeacher(formData);
    } else {
      result = await updateTeacher(formData, selectedTeacher?.teacherId);
    }

    if (result.success) {
      setIsModalOpen(false);
      setParams((prev) => ({ ...prev, page: 1 }));
      await fetchTeacher({ page: 1 });
    }
    return result.success;
  };

  return (
    <div className='min-h-screen '>
      <PageHeader
        title='Teacher'
        subtitle='Manage teacher records and exam series assignments'
        primaryAction={{
          label: "Add Teacher",
          onClick: () => {
            setIsModalOpen(true);
            setModalMode("create");
          },
        }}
        showSearch={true}
        searchPlaceholder='Search by name..'
        onSearch={onSearch}
        searchMaxLength={50}
      />
      <DataTable
        data={teacher}
        columns={columns}
        idAccessor='teacherId'
        onEdit={(data) => {
          setSelectedTeacher(data);
          setModalMode("edit");
          setIsModalOpen(true);
        }}
        onDelete={openDeleteModal}
        onPageChange={onPageChange}
        onSizeChange={onPageSizeChange}
        pagination={pagination}
        isLoading={isLoading}
      />
      <TeacherModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialValues={selectedTeacher}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        mode={modalMode}
      />
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
