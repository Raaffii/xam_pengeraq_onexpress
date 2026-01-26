import { useParams } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import { useStudentClass } from "@/hooks/useStudentClass";
import { DataTable } from "@/components/table";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useClassSchedule } from "@/hooks/useClassSchedule";

export default function TeacherAttendance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hasFetchedData = useRef(false);

  const {
    studenctClass,
    pagination,
    onSearch,
    onPageChange,
    onPageSizeChange,
    onFilterChange: fetchWithParamsChange,
  } = useStudentClass();

  const { getClassScheduleById, classSchedule } = useClassSchedule();

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    const fetchData = async () => {
      await fetchWithParamsChange({ schedule: id });
      await getClassScheduleById(id);
    };

    fetchData();
  }, []);

  const columns = [
    {
      accessorKey: "studentIdNo",
      header: <div className='text-left w-full'>ID</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "studentName",
      header: <div className='text-left w-full'>Student Name</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "-",
      header: <div className='text-left w-full'>Exam Series</div>,
      cellClassName: "text-left",
      render: () => <div>{classSchedule?.examSeriesDescription}</div>,
    },
    {
      accessorKey: "-",
      header: <div className='text-left w-full'>Exam Subject</div>,
      cellClassName: "text-left",
      render: () => <div>{classSchedule?.subjDesc}</div>,
    },
    {
      accessorKey: "enteredDate",
      header: <div className='text-left w-full'>Entered Datetime</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "attendancePercentage",
      header: <div className='text-center w-full'>Attendance</div>,
      cellClassName: "text-left",
      render: (row) => (
        <div className='flex w-full justify-center'>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full border
      ${
        row.attendancePercentage == 0
          ? "bg-red-100 text-red-700 border-red-300"
          : "bg-blue-100 text-blue-700 border-blue-300"
      }
    `}>
            {row.totalAttend}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "attendancePercentage",
      header: <div className='text-center w-full'>Percentage</div>,
      cellClassName: "text-left",
      render: (row) => (
        <div className='flex w-full justify-center'>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full border
      ${
        row.attendancePercentage == 0
          ? "bg-red-100 text-red-700 border-red-300"
          : "bg-blue-100 text-blue-700 border-blue-300"
      }
    `}>
            {row.attendancePercentage}%
          </span>
        </div>
      ),
    },
  ];

  const actions = [
    {
      label: "<- Back",
      onClick: () => navigate(-1),
    },
  ];

  const pageTitle = (
    <div className='text-xl font-semibold flex items-baseline gap-2'>
      <span>Class Subject - {classSchedule?.subjDesc || "Loading..."}</span>

      <span className='text-lg text-gray-500 font-normal'>
        Conducted By - {classSchedule?.teacherName || "Loading..."}
      </span>
    </div>
  );

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto'>
        <PageHeader
          title={pageTitle}
          subtitle={`student attandeance`}
          showSearch={true}
          onSearch={onSearch}
          actions2={actions}
        />

        <DataTable
          data={studenctClass}
          columns={columns}
          idAccessor='studentClassId'
          pagination={pagination}
          showActions={false}
          onPageChange={onPageChange}
          onSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
}
