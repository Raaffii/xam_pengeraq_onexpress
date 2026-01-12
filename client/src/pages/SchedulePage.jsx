import { DataTable } from "@/components/table";
import { useClassSchedule } from "@/hooks/useClassSchedule";
import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { useNavigate } from "react-router-dom";
import AddSchedule from "@/components/schedule/AddSchedule";
import EditSchedule from "@/components/schedule/EditSchedule";
import Delete_modal from "@/components/modals/Delete_modal";

export default function SchedulesPages() {
  const {
    fetchClassSchedule,
    deleteClassSchedule,
    classSchedule,
    pagination,
    onPageChange,
    onPageSizeChange,
  } = useClassSchedule();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      await fetchClassSchedule();
    };

    fetchData();
  }, [fetchClassSchedule]);

  const openEditModal = (schedule) => {
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (student) => {
    setSelectedSchedule(student);
    setIsDeleteModalOpen(true);
  };

  const handleScheduleDelete = async (schedule) => {
    const result = await deleteClassSchedule(schedule.classschhdid);
    if (result.success) {
      // setParams((prev) => ({ ...prev, page: 1 }));
      fetchClassSchedule({ page: 1 });
    }
    return result.success;
  };

  const columns = [
    {
      accessorKey: "teacherName",
      header: <div className='text-left w-full'>Teacher Name</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "subjDesc",
      header: <div className='text-left w-full'>Subject</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "examSeriesDescription",
      header: <div className='text-left w-full'>Exam Series</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "startDateTime",
      header: <div className='text-left w-full'>Start Date</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "repeatValue",
      header: <div className='text-left w-full'>Repeat Value</div>,
      cellClassName: "text-left",
      render: (row) => (
        <div className='flex flex-wrap gap-1'>
          <span
            className='px-2 py-0.5 text-xs rounded-full
                   bg-blue-50 text-blue-700 border border-blue-200'>
            {row.repeatValue || "No"}
          </span>
        </div>
      ),
    },
    {
      header: <div className='text-left w-full'>End Date</div>,
      cellClassName: "text-left",
      render: (row) => (
        <div className='flex flex-wrap gap-1'>
          <span
            className='px-2 py-0.5 text-xs rounded-full
                   bg-blue-50 text-blue-700 border border-blue-200'>
            {row.endDateTime}
          </span>
        </div>
      ),
    },
  ];

  const actions = [
    {
      label: "table",
      onClick: () => alert("cek1"),
    },
    {
      label: "calendar",
      onClick: () => navigate("/schedule/calendar"),
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto'>
        <PageHeader
          title='Schedule'
          subtitle='Manage student records and exam series assignments'
          showSearch={true}
          searchPlaceholder='Search by name'
          searchMaxLength={50}
          actions2={actions}
          primaryAction={{
            label: "Add Schedule",
            onClick: () => setIsModalOpen(true),
          }}
        />

        <DataTable
          data={classSchedule}
          columns={columns}
          onDelete={openDeleteModal}
          onEdit={openEditModal}
          onPageChange={onPageChange}
          onSizeChange={onPageSizeChange}
          pagination={pagination}
          detailPage='schedule'
          idAccessor='classschhdid'
        />

        {isModalOpen && (
          <AddSchedule
            open={isModalOpen}
            setOpen={setIsModalOpen}
            title='Add New Student'
            fetchClassSchedule={fetchClassSchedule}
          />
        )}

        {isEditModalOpen && (
          <EditSchedule
            open={isEditModalOpen}
            setOpen={setIsEditModalOpen}
            title='Add New Student'
            fetchClassSchedule={fetchClassSchedule}
            selectedSchedule={selectedSchedule}
          />
        )}

        {isDeleteModalOpen && selectedSchedule && (
          <Delete_modal
            open={isDeleteModalOpen}
            setOpen={setIsDeleteModalOpen}
            onSubmit={handleScheduleDelete}
            entityData={selectedSchedule}
            title='Delete Student'
            confirmationText={`Are you sure you want to delete student "${selectedSchedule.classschhdid}"? This action cannot be undone.`}
          />
        )}
      </div>
    </div>
  );
}
