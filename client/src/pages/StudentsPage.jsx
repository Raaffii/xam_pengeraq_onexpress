import { useEffect, useState, useRef } from "react";
import PageHeader from "@/components/common/PageHeader";
import { DataTable } from "@/components/table";
import Delete_modal from "@/components/modals/Delete_modal";
import { useStudents } from "@/hooks/useStudents";
import { StudentModal } from "@/components/student/StudentModal";
import { useExamSeries } from "@/hooks/useExamsSeries";
import { usePageTitle } from "@/hooks/usePageTitle";
import { ExamSeriesFilter } from "@/components/examseries";
import { StatusBadge } from "@/components/common";
import { SeriesBadge } from "@/components/student/SeriesBadge";
import MemberModal from "@/components/student/MemberModal";

const StudentsPage = () => {
  const hasFetchedData = useRef(false);
  usePageTitle("Students");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemberOpen, setIsMemberOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalMode, setModalMode] = useState("create");

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
    isLoading,
    onFilterChange,
    params,
  } = useStudents();
  const {
    fetchExamSeries,
    examSeries,
    isLoading: isLoadingSeries,
  } = useExamSeries();

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    const fetchData = async () => {
      await fetchStudents();
    };

    fetchData();
    fetchExamSeries();
  }, [fetchStudents, fetchExamSeries]);

  const openCreateModal = () => {
    setSelectedStudent(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const openMemberModal = (student) => {
    setSelectedStudent(student);
    if (
      student?.member?.status === "FOUND_APPROVED" ||
      student?.member?.status === "FOUND_NOT_APPROVED"
    ) {
      setIsMemberOpen(true);
    }
  };

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    let response;
    if (modalMode === "create") {
      response = await createStudents(formData);
    } else {
      response = await updateStudents(selectedStudent.studentId, formData);
    }

    if (response?.success) {
      if (modalMode === "create") {
        setParams((prev) => ({ ...prev, page: 1 }));
        fetchStudents({ page: 1 });
      } else {
        fetchStudents();
      }
      setIsModalOpen(false);
      setSelectedStudent(null);
    }
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
      header: "ID",
      cellClassName: "text-left",
    },
    {
      accessorKey: "studentName",
      header: "Name",
      cellClassName: "text-left",
    },
    {
      accessorKey: "examSeriesDescription",
      header: "Exam Series",
      cellClassName: "text-left",
      render: (row) => {
        return <SeriesBadge series={row.examSeries} rowId={row.id} />;
      },
    },
    ...(params.isMember ?
      [
        {
          header: "Member Status",
          cellClassName: "text-left",
          render: (row) => {
            return (
              <StatusBadge
                key={`${row.studentId}`}
                label={row.member?.status || "NOT_FOUND"}
                variant={row.member?.isMemberApproved ? "green" : "default"}
                size="xs"
                onClick={() => openMemberModal(row)}
              />
            );
          },
        },
      ]
    : []),
  ];

  const optionSeries = examSeries?.map((item) => ({
    value: item.seriesId,
    label: item.seriesDesc,
  }));

  return (
    <div className="min-h-screen ">
      <PageHeader
        title="Students"
        subtitle="Manage student records and exam series assignments"
        primaryAction={{
          label: "Add Student",
          onClick: openCreateModal,
        }}
        showSearch={true}
        searchPlaceholder="Search by name"
        onSearch={onSearch}
        searchMaxLength={50}
      >
        <ExamSeriesFilter
          data={[
            {
              value: true,
              label: "Check Membership Status",
            },
            {
              value: false,
              label: "Uncheck Membership Status",
            },
          ]}
          valueKey="value"
          labelKey="label"
          filterKey="isMember"
          placeholder="Show Membership Status"
          initialFilters={{ isMember: params.isMember }}
          onFilterChange={onFilterChange}
          isLoading={isLoading}
        />
      </PageHeader>

      <DataTable
        data={students}
        columns={columns}
        detailPage="students"
        idAccessor="studentId"
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onPageChange={onPageChange}
        onSizeChange={onPageSizeChange}
        pagination={pagination}
        isLoading={isLoading}
      />

      <StudentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialValues={selectedStudent || {}}
        onSubmit={handleFormSubmit}
        mode={modalMode}
        examSeriesOptions={optionSeries}
        isLoadingSeries={isLoadingSeries}
      />

      {isDeleteModalOpen && selectedStudent && (
        <Delete_modal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onSubmit={handleStudentDelete}
          entityData={selectedStudent}
          title="Delete Student"
          confirmationText={`Are you sure you want to delete student "${selectedStudent.studentName}"? This action cannot be undone.`}
        />
      )}
      {isMemberOpen && (
        <MemberModal
          open={isMemberOpen}
          onOpenChange={setIsMemberOpen}
          data={selectedStudent}
        />
      )}
    </div>
  );
};

export default StudentsPage;
