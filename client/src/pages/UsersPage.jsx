import PageHeader from "@/components/common/PageHeader";
import Delete_modal from "@/components/modals/Delete_modal";
import { DataTable } from "@/components/table";
import { UserFilter, UserForm } from "@/components/users";
import { useUser } from "@/hooks/useUsers";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const UsersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState("create");

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
    onFilterChange,
    params,
    isSubmitting,
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

  const openEditModal = (data) => {
    setSelectedUser(data);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const openDeleteModal = (data) => {
    setSelectedUser(data);
    setIsDeleteModalOpen(true);
  };

  const initialFormValues = useMemo(() => {
    if (modalMode === "edit" && selectedUser) {
      return {
        userId: selectedUser.userId,
        userName: selectedUser.userName || "",
        emailAddress: selectedUser.emailAddress || "",
        role: selectedUser.role || "",
        studentId: selectedUser.studentId || null,
        studentName: selectedUser.studentName || "",
      };
    }

    return {
      userName: "",
      emailAddress: "",
      password: "",
      role: "",
      studentId: null,
    };
  }, [modalMode, selectedUser]);

  const handleFormSubmit = async (formData) => {
    let response;
    if (modalMode === "create") {
      response = await newUser(formData);
    } else {
      response = await updateDetails(selectedUser.id, formData);
    }

    if (response?.success) {
      if (modalMode === "create") {
        setParams((prev) => ({ ...prev, page: 1 }));
        fetchUsers({ page: 1 });
      } else {
        fetchUsers();
      }
      setIsModalOpen(false);
      setSelectedUser(null);
    }
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
          onClick: () => {
            setModalMode("create");
            setIsModalOpen(true);
            setSelectedUser(null);
          },
        }}
        showSearch={true}
        searchPlaceholder="Search by name or email"
        onSearch={onSearch}
        searchMaxLength={50}
      >
        <UserFilter
          onFilterChange={onFilterChange}
          initialFilters={{
            byRole: params.byRole,
          }}
        />
      </PageHeader>
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
      <UserForm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        mode={modalMode}
      />

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
