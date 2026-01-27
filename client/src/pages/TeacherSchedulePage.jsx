import { DataTable } from "@/components/table";
import { useClassSchedule } from "@/hooks/useClassSchedule";
import { useEffect, useState, useRef } from "react";
import PageHeader from "@/components/common/PageHeader";
import { useNavigate } from "react-router-dom";
import AddSchedule from "@/components/schedule/AddSchedule";
import { QrCode, Flag, UserCheck } from "lucide-react";
import QrCodeModal from "@/components/teacher/QrCodeModal";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TeacherSchedulesPages() {
  const {
    fetchClassSchedule,

    classSchedule,
    pagination,
    onSearch,
    onPageChange,
    onPageSizeChange,
  } = useClassSchedule();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isOpenQrCode, setIsOpenQrCode] = useState(false);
  const [selectedClass, setSelectedClass] = useState({});
  const hasFetchedData = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    const fetchData = async () => {
      await fetchClassSchedule();
    };

    fetchData();
  }, [fetchClassSchedule]);

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
          <div>
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
          </div>
        );
      },
    },
    {
      title: "Attendance",
      onClick: (row) =>
        navigate(`/teacher/schedule/attendance/${row.classschhdid}`),
      render: () => {
        return (
          <div>
            <div className='relative bg-blue-200 rounded-lg p-1'>
              <UserCheck size={18} />
            </div>
          </div>
        );
      },
    },
  ];

  const currentView =
    location.pathname === "/schedule/calendar" ? "calendar" : "list";

  const actionsChildren = (
    <Select
      onValueChange={(value) => {
        if (value === "list") {
          navigate("/teacher/schedule");
        }

        if (value === "calendar") {
          navigate("/teacher/schedule/calendar");
        }
      }}
      value={currentView}>
      <SelectTrigger className='w-full max-w-48'>
        <SelectValue placeholder='View By' />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>View By</SelectLabel>

          <SelectItem value='list'>View By List</SelectItem>
          <SelectItem value='calendar'>View By Calendar</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto'>
        <PageHeader
          title='Teacher Schedules'
          subtitle='Your Schedule'
          showSearch={true}
          searchPlaceholder='Search by subject...'
          searchMaxLength={50}
          onSearch={onSearch}
          childrenCustom={actionsChildren}
        />

        <DataTable
          data={classSchedule}
          columns={columns}
          onPageChange={onPageChange}
          onSizeChange={onPageSizeChange}
          pagination={pagination}
          idAccessor='classschhdid'
          additionalActions={startClassAction}
          detailPage='teacher/schedule/detail'
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
      </div>
    </div>
  );
}
