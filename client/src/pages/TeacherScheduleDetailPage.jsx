import { DataTable } from "@/components/table";

import { useEffect, useRef } from "react";
import PageHeader from "@/components/common/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { useClassScheduleDetail } from "@/hooks/useClassScheduleDetail";
import { Filter, Undo2, UserCheck } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { SearchableDropdown, StatusBadge } from "@/components/common";
import { ActionItem } from "@/components/common/ActionItem";
import { Button } from "@/components/ui/button";

export default function TeacherScheduleDetailPage() {
  const { id } = useParams();
  usePageTitle("Schedule Detail");
  const {
    classScheduleDetail,
    pagination,
    fetchClassScheduleDetail,
    onSearch,
    onPageChange,

    onPageSizeChange,
    setParams,
    params,
  } = useClassScheduleDetail();

  const hasFetchedData = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    const fetchData = async () => {
      await fetchClassScheduleDetail({ scheduleId: id });
      setParams({ ...params, scheduleId: id });
    };

    fetchData();
  }, [fetchClassScheduleDetail]);

  const isToday = (date) => {
    const today = new Date();
    const target = new Date(date);

    return (
      today.getDate() === target.getDate() &&
      today.getMonth() === target.getMonth() &&
      today.getFullYear() === target.getFullYear()
    );
  };

  const columns = [
    {
      accessorKey: "teacherName",
      header: "Teacher Name",
      cellClassName: "text-left",
    },
    {
      accessorKey: "subjDesc",
      header: "Subject",
      cellClassName: "text-left",
    },
    {
      accessorKey: "examSeriesDescription",
      header: "Exam Series",
      cellClassName: "text-left",
    },
    {
      accessorKey: "classDateTime",
      header: "Scheduled Date",
      cellClassName: "text-left",
      render: (row) => {
        const today = isToday(row.classDateTime);

        return (
          <div className='flex items-center gap-2'>
            <span>{row.classDateTime}</span>

            {today && (
              <StatusBadge label={"Today"} variant={"green"} size='xs' />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "classStartDateTime",
      header: "Start Date",
      cellClassName: "text-left",
      render: (row) => (
        <>
          {row.classStartDateTime || (
            <span className='text-red-600 font-semibold'>
              Class Not Started yet
            </span>
          )}
        </>
      ),
    },
    {
      header: "Actions",
      align: "center",
      cell: (row) => (
        <div className='flex items-center justify-center gap-1'>
          <ActionItem
            label='Attendance'
            icon={UserCheck}
            onClick={() =>
              navigate(`/teacher/class-attendance/${row.classSchDetailsId}`)
            }
            className='text-blue-600 hover:bg-blue-100'
          />
        </div>
      ),
    },
  ];

  const currentView =
    location.pathname === "/schedule/calendar" ? "calendar" : "list";

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto'>
        <PageHeader
          title={`Teacher Schedules Detail - ${classScheduleDetail[0]?.subjDesc || "loading"}`}
          subtitle='Your Schedule'
          showSearch={true}
          searchPlaceholder='Search by subject...'
          searchMaxLength={50}
          onSearch={onSearch}>
          <div className='flex items-center gap-2'>
            <Button
              variant={"outline"}
              onClick={() => navigate(`/teacher/schedule`)}
              className='h-10'>
              <Undo2 className='h-4 w-4 mr-1' />
              Back
            </Button>
            <div className='w-full md:min-w-[200px] md:w-auto'>
              <SearchableDropdown
                id={"value"}
                name={"value"}
                value={currentView}
                onChange={(e) => {
                  const { value } = e.target;
                  if (value === "list") {
                    navigate("/teacher/schedule");
                  }

                  if (value === "calendar") {
                    navigate(`/teacher/schedule/calendar/${id}`);
                  }
                }}
                options={[
                  { value: "list", label: "View By List" },
                  { value: "calendar", label: "View By Calendar" },
                ]}
                placeholder={"View By"}
                searchPlaceholder='Search...'
                emptyMessage='No items found'
                icon={Filter}
                minSearchLength={0}
                className='h-10'
              />
            </div>
          </div>
        </PageHeader>

        <DataTable
          data={classScheduleDetail}
          columns={columns}
          idAccessor='classschhdid'
          onPageChange={onPageChange}
          onSizeChange={onPageSizeChange}
          pagination={pagination}
          showActions={false}
        />
      </div>
    </div>
  );
}
