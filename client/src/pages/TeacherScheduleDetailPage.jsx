import { DataTable } from "@/components/table";
import { useClassSchedule } from "@/hooks/useClassSchedule";
import { useEffect, useState, useRef } from "react";
import PageHeader from "@/components/common/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import AddSchedule from "@/components/schedule/AddSchedule";

import { useClassScheduleDetail } from "@/hooks/useClassScheduleDetail";

import { UserCheck } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TeacherScheduleDetailPage() {
  const { id } = useParams();
  const { fetchClassSchedule, onSearch, onPageSizeChange } = useClassSchedule();

  const {
    fetchClassScheduleDetail,
    classScheduleDetail,
    pagination,
    onPageChange,
  } = useClassScheduleDetail();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasFetchedData = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    const fetchData = async () => {
      await fetchClassScheduleDetail({ scheduleId: id });
    };

    fetchData();
  }, [fetchClassSchedule]);

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
      accessorKey: "classDateTime",
      header: <div className='text-left w-full'>Start Date</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "classStartDateTime",
      header: <div className='text-left w-full'>Start Date</div>,
      cellClassName: "text-left",
      render: (row) => <>{row.classStartDateTime || "Class Not Started yet"}</>,
    },
  ];

  const startClassAction = [
    {
      title: "Attendance",
      onClick: (row) =>
        navigate(`/teacher/class-attendance/${row.classschhdid}`),
      render: () => {
        return (
          <div>
            <div className='relative bg-blue-200 rounded-sm p-2 flex hover:bg-blue-400 shadow-lg'>
              <UserCheck size={18} /> Atendance
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
          navigate(`/teacher/schedule/calendar/${id}`);
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

  const actions = [
    {
      label: "<- Back",
      onClick: () => navigate(`/teacher/schedule`),
    },
  ];
  console.log("pagi2", pagination);
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto'>
        <PageHeader
          title={`Teacher Schedules Detail - ${classScheduleDetail[0]?.subjDesc || "loading"}`}
          subtitle='Your Schedule'
          showSearch={true}
          searchPlaceholder='Search by subject...'
          searchMaxLength={50}
          onSearch={onSearch}
          childrenCustom={actionsChildren}
          actions2={actions}
        />

        <DataTable
          data={classScheduleDetail}
          columns={columns}
          idAccessor='classschhdid'
          additionalActions={startClassAction}
          onPageChange={onPageChange}
          onSizeChange={onPageSizeChange}
          pagination={pagination}
        />

        {isModalOpen && (
          <AddSchedule
            open={isModalOpen}
            setOpen={setIsModalOpen}
            title='Add New Student'
            fetchClassSchedule={fetchClassSchedule}
          />
        )}
      </div>
    </div>
  );
}
