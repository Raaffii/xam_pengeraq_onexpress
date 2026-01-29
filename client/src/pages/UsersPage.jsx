import { ResetUserPassword } from "@/components/auth";
import { StatusBadge } from "@/components/common";
import { ActionItem } from "@/components/common/ActionItem";
import PageHeader from "@/components/common/PageHeader";
import Delete_modal from "@/components/modals/Delete_modal";
import { DataTable } from "@/components/table";
import { UserFilter, UserForm } from "@/components/users";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useUser } from "@/hooks/useUsers";
import { capitalizeFirstLetter, getRoleVariant } from "@/utils";
import { LockOpen, Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const UsersPage = () => {
  const hasFetchedData = useRef(false);
  usePageTitle("Users");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetModalOpen, setResetModalOpen] = useState(false);
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
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
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
      header: "Role",
      accessorKey: "role",
      align: "center",
      cell: (row) => (
        <StatusBadge
          label={row.role ? capitalizeFirstLetter(row.role) : "N/A"}
          variant={getRoleVariant(row.role)}
        />
      ),
    },
    {
      header: "Actions",
      align: "center",
      cell: (row) => (
        <div className="flex items-center justify-center gap-1">
          <ActionItem
            label="Edit"
            icon={Pencil}
            onClick={() => {
              setSelectedUser(row);
              setModalMode("edit");
              setIsModalOpen(true);
            }}
            className="text-amber-600 hover:bg-amber-100"
          />
          <ActionItem
            label="Reset Password"
            icon={LockOpen}
            onClick={() => {
              setSelectedUser(row);
              setResetModalOpen(true);
            }}
            className="text-gray-600 hover:bg-gray-200"
          />
          <ActionItem
            label="Delete"
            icon={Trash2}
            onClick={() => {
              setSelectedUser(row);
              setIsDeleteModalOpen(true);
            }}
            className="text-red-600 hover:bg-red-100"
          />
        </div>
      ),
    },
  ];

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
        showActions={false}
      />
      <UserForm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        mode={modalMode}
      />
      <ResetUserPassword
        isOpen={isResetModalOpen}
        onOpenChange={() => {
          setResetModalOpen(false);
          setSelectedUser(null);
        }}
        userId={selectedUser?.id}
      />

      {isDeleteModalOpen && selectedUser && (
        <Delete_modal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onSubmit={handleDelete}
          entityData={selectedUser}
          title="Delete User"
          confirmationText={`Are you sure you want to delete user "${selectedUser?.userName}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default UsersPage;
