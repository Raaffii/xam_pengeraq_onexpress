import PageHeader from "@/components/common/PageHeader";
import Add_modal from "@/components/modals/Add_modal";
import Delete_modal from "@/components/modals/Delete_modal";
import Edit_modal from "@/components/modals/Edit_modal";
import { DataTable } from "@/components/table";
import { useUser } from "@/hooks/useUsers";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

const UsersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    fetchUsers,
    newUser,
    updateDetails,
    removeUser,
    users,
    pagination,
    onPageChange,
    onPageSizeChange,
    setParams,
    onSearch,
    isLoading,
  } = useUser();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = [
    {
      accessorKey: "userName",
      header: "Name",
      cellClassName: "text-left",
    },
    {
      accessorKey: "emailAddress",
      header: "Email",
      cellClassName: "text-left",
    },
    {
      header: "Student",
      accessorKey: "studentId",
      align: "center",
      cell: (row) => (
        <div className="flex justify-center">
          {row.studentId && row.studentName ? (
            <CheckCircle2Icon className="text-green-800" />
          ) : (
            <XCircleIcon className="text-red-800" />
          )}
        </div>
      ),
    },
  ];

  const fields = [
    {
      label: "",
      name: "userId",
      type: "hidden",
    },
    {
      label: "Name",
      name: "userName",
      type: "text",
      required: true,
    },
    {
      label: "Email",
      name: "emailAddress",
      type: "email",
      required: true,
    },
  ];

  const openEditModal = (data) => {
    setSelectedUser(data);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (data) => {
    setSelectedUser(data);
    setIsDeleteModalOpen(true);
  };

  const handleUserSubmit = async (formData) => {
    const result = await newUser(formData);
    if (result.success) {
      setParams((prev) => ({ ...prev, page: 1 }));
      fetchUsers({ page: 1 });
    }
    return result.success;
  };

  const handleEdit = async (formData) => {
    const result = await updateDetails(selectedUser.userId, formData);
    if (result.success) {
      fetchUsers();
    }
    return result.success;
  };

  const handleDelete = async () => {
    const result = await removeUser(selectedUser.userId);
    if (result.success) {
      setParams((prev) => ({ ...prev, page: 1 }));
      fetchUsers({ page: 1 });
    }
    return result.success;
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Users"
        subtitle="Manage system users and their access"
        primaryAction={{
          label: "Add User",
          onClick: () => setIsModalOpen(true),
        }}
        showSearch={true}
        searchPlaceholder="Search by name or email"
        onSearch={onSearch}
        searchMaxLength={50}
      />
      <DataTable
        data={users}
        isLoading={isLoading}
        columns={columns}
        idAccessor="userId"
        onPageChange={onPageChange}
        onSizeChange={onPageSizeChange}
        pagination={pagination}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />
      {isModalOpen && (
        <Add_modal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          onSubmit={handleUserSubmit}
          fields={[
            ...fields,
            {
              label: "Password",
              name: "password",
              type: "password",
              required: true,
              minLength: 6,
              maxLength: 100,
            },
          ]}
          title="Add New User"
        />
      )}

      {isEditModalOpen && selectedUser && (
        <Edit_modal
          open={isEditModalOpen}
          setOpen={setIsEditModalOpen}
          onSubmit={handleEdit}
          fields={fields}
          entityData={selectedUser}
          title="Edit User"
        />
      )}

      {isDeleteModalOpen && selectedUser && (
        <Delete_modal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onSubmit={handleDelete}
          entityData={selectedUser}
          title="Delete User"
          confirmationText={`Are you sure you want to delete user "${selectedUser.userName}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default UsersPage;
