import { DataTable } from "@/components/table";
import { useClassSchedule } from "@/hooks/useClassSchedule";
import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { useNavigate } from "react-router-dom";
import AddSchedule from "@/components/schedule/AddSchedule";
import EditSchedule from "@/components/schedule/EditSchedule";
import Delete_modal from "@/components/modals/Delete_modal";

import { QrCode, Flag } from "lucide-react";
import QrCodeModal from "@/components/teacher/QrCodeModal";

export default function TeacherSchedulesPages() {
  const {
    fetchClassSchedule,
    deleteClassSchedule,
    classSchedule,
    pagination,
    onSearch,
    onPageChange,
    onPageSizeChange,
  } = useClassSchedule();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState();
  const [isOpenQrCode, setIsOpenQrCode] = useState(false);
  const [selectedClass, setSelectedClass] = useState({});

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

  const isClassToday = (row) => {
    const today = new Date();
    const classDate = new Date(row.startDateTime);

    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayDay = today.getDay();

    const classDateOnly = classDate.getDate();
    const classMonth = classDate.getMonth();
    const classDay = classDate.getDay();

    if (row.repeatValue === "daily") {
      return true;
    }

    if (row.repeatValue === "weekly") {
      return todayDay === classDay;
    }

    if (row.repeatValue === "monthly") {
      return todayDate === classDateOnly;
    }

    return todayDate === classDateOnly && todayMonth === classMonth;
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
      header: <div className='text-center w-full'>Class Today</div>,
      cellClassName: "text-left",
      render: (row) => {
        const canStart = isClassToday(row);

        return (
          <div className='flex items-center justify-center gap-3 w-full'>
            {/* Status Badge */}
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-sm border
      ${
        canStart
          ? "bg-green-100 text-green-800 border-green-300"
          : "bg-red-100 text-red-800 border-red-300"
      }
    `}>
              {canStart ? "Class Today" : "No Class Today"}
            </span>
          </div>
        );
      },
    },
  ];

  const actions = [
    {
      label: "table",
      onClick: () => navigate("/teacher/schedule"),
    },
    {
      label: "calendar",
      onClick: () => navigate("/teacher/schedule/calendar"),
    },
  ];

  const handleStartClass = (row) => {
    const canStart = isClassToday(row);

    if (!canStart) {
      alert("No Class Today");
    } else {
      setIsOpenQrCode(true);
      setSelectedClass(row);
    }
  };

  const startClassAction = [
    {
      title: "Start",
      onClick: (row) => handleStartClass(row),
      render: (row) => {
        const canStart = isClassToday(row);
        return (
          <button>
            {canStart ? (
              <div className='relative bg-green-200 rounded-lg p-1'>
                {/* Flag Badge */}
                <div className='absolute -top-1 -right-1 bg-green-500/50 rounded-full p-[2px] shadow'>
                  <Flag size={10} className='text-white' />
                </div>

                {/* QR Icon */}
                <QrCode size={18} />
              </div>
            ) : (
              <div className='relative bg-red-200 rounded-lg p-1'>
                {/* Flag Badge */}

                {/* QR Icon */}
                <QrCode size={18} />
              </div>
            )}
          </button>
        );
      },
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto'>
        <PageHeader
          title='Teacher Schedules'
          subtitle='Your Schedule'
          showSearch={true}
          searchPlaceholder='Search by subject'
          searchMaxLength={50}
          actions2={actions}
          onSearch={onSearch}
        />

        <DataTable
          data={classSchedule}
          columns={columns}
          onDelete={openDeleteModal}
          onEdit={openEditModal}
          onPageChange={onPageChange}
          onSizeChange={onPageSizeChange}
          pagination={pagination}
          detailPage='teacher/scheduledetail'
          idAccessor='classschhdid'
          additionalActions={startClassAction}
        />

        {isModalOpen && (
          <AddSchedule
            open={isModalOpen}
            setOpen={setIsModalOpen}
            title='Add New Student'
            fetchClassSchedule={fetchClassSchedule}
          />
        )}

        <QrCodeModal
          open={isOpenQrCode}
          setOpen={setIsOpenQrCode}
          link={"www.youtube.com"}
          subjectName={selectedClass?.subjDesc}
          teacherName={selectedClass?.teacherName}
          classschhdid={selectedClass?.classschhdid}
          classStartDateTime={selectedClass?.classStartDateTime}
        />

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
