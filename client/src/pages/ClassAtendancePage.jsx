import { useParams } from "react-router-dom";
import { useClassAttendance } from "@/hooks/useClassAttendance";
import { useEffect } from "react";
import { DataTable } from "@/components/table";
import PageHeader from "@/components/common/PageHeader";
import { useNavigate } from "react-router-dom";
import { useClassScheduleDetail } from "@/hooks/useClassScheduleDetail";
import { AlertTriangle } from "lucide-react";

export default function ClassAttendancePage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { fetchClassAttendance, classAttendance, pagination } =
    useClassAttendance();

  const { fetchClassScheduleDetailById, classScheduleDetail } =
    useClassScheduleDetail();
  useEffect(() => {
    const fetchData = async () => {
      await fetchClassAttendance({ classSchDetailsId: id });
      await fetchClassScheduleDetailById(id);
      //   await handleEvent(result.data);
    };

    fetchData();
  }, [fetchClassAttendance, id, fetchClassScheduleDetailById]);

  const columns = [
    {
      accessorKey: "studentName",
      header: <div className='text-left w-full'>Student Name</div>,
      cellClassName: "text-left",
    },

    {
      header: <div className='text-left w-full'>Teacher Name</div>,
      cellClassName: "text-left",
      render: (row) => (
        <div className='flex flex-wrap gap-1'>
          <span
            className={`font-semibold p-1 rounded-sm ${
              row.attend
                ? "text-green-600 bg-green-200 "
                : "text-red-600 bg-red-200"
            }`}>
            {row.attend ? "Present" : "Absent"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "checkInDateTime",
      header: <div className='text-center w-full'>Check In Date Time</div>,
      cellClassName: "text-center",
      render: (row) => (
        <div className='flex flex-wrap gap-1 w-full items-center justify-center'>
          <span>{row.checkInDateTime ? row.checkInDateTime : "-"}</span>
        </div>
      ),
    },
  ];

  const actions = [
    {
      label: "<- back",
      onClick: () => navigate("/teacher/schedule/calendar"),
    },
  ];

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const classDetail = classScheduleDetail?.classStartDateTime ? (
    <h1>
      {`Class Attendance — ${formatDate(classScheduleDetail?.classDateTime)}`}
    </h1>
  ) : (
    <div className='flex flex-col gap-2'>
      <h1 className='text-2xl font-semibold tracking-tight'>
        {`Class Attendance — ${formatDate(classScheduleDetail?.classDateTime)}`}
      </h1>

      <div className='inline-flex items-center gap-2 bg-red-100 text-red-700 border border-red-300 px-3 py-1.5 rounded-md w-fit shadow-sm'>
        <AlertTriangle className='w-4 h-4' />
        <span className='text-sm font-semibold'>
          Class Has Never Been Started
        </span>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto'>
        <PageHeader
          title={classDetail}
          subtitle={`Teacher: ${classScheduleDetail?.teacherName} • Subject: ${classScheduleDetail?.subjDesc}`}
          showSearch={true}
          searchPlaceholder='Search student name...'
          searchMaxLength={50}
          actions2={actions}
        />

        <DataTable
          data={classAttendance}
          columns={columns}
          pagination={pagination}
          showActions={false}
        />
      </div>
    </div>
  );
}
