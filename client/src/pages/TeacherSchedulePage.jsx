import { DataTable } from "@/components/table";
import { useClassSchedule } from "@/hooks/useClassSchedule";
import { useEffect, useState, useRef } from "react";
import PageHeader from "@/components/common/PageHeader";
import { useNavigate } from "react-router-dom";
import { QrCode, Flag, UserCheck, Filter } from "lucide-react";
import QrCodeModal from "@/components/teacher/QrCodeModal";
import { SearchableDropdown, StatusBadge } from "@/components/common";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useExamSeries } from "@/hooks/useExamsSeries";
import { ScheduleModal } from "@/components/schedule/ScheduleModal";

export default function TeacherSchedulesPages() {
  usePageTitle("My Schedules");
  const {
    fetchClassSchedule,
    classSchedule,
    pagination,
    onSearch,
    onPageChange,
    onPageSizeChange,
    postClassSchedule,
    isSubmitting,
    isLoading,
    setParams,
  } = useClassSchedule();
  const {
    fetchExamSeries,
    examSeries,
    isLoading: seriesLoad,
  } = useExamSeries();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenQrCode, setIsOpenQrCode] = useState(false);
  const [selectedClass, setSelectedClass] = useState({});
  const hasFetchedData = useRef(false);
  const hasFetchedExamSeries = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    const fetchData = async () => {
      await fetchClassSchedule();
    };

    fetchData();
  }, [fetchClassSchedule]);

  useEffect(() => {
    if (isModalOpen && !hasFetchedExamSeries.current) {
      hasFetchedExamSeries.current = true;
      fetchExamSeries();
    }
  }, [isModalOpen, fetchExamSeries]);

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
      accessorKey: "startDateTime",
      header: "Start Date",
      cellClassName: "text-left",
    },
    {
      accessorKey: "repeatValue",
      header: "Repeat Value",
      align: "center",
      render: (row) => (
        <StatusBadge
          label={row.repeatValue || "No"}
          variant={row.repeatValue ? "blue" : "default"}
        />
      ),
    },
    {
      header: "Class Today",
      align: "center",
      render: (row) => {
        const canStart = isClassToday(row);

        return (
          <StatusBadge
            label={canStart ? "Class Today" : "No Class Today"}
            variant={canStart ? "green" : "default"}
          />
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
            {canStart ?
              <div className="relative bg-green-200 rounded-lg p-1">
                {/* Flag Badge */}
                <div className="absolute -top-1 -right-1 bg-green-500/50 rounded-full p-[2px] shadow">
                  <Flag size={10} className="text-white" />
                </div>

                {/* QR Icon */}
                <QrCode size={18} />
              </div>
            : <div className="relative bg-red-200 rounded-lg p-1">
                {/* Flag Badge */}

                {/* QR Icon */}
                <QrCode size={18} />
              </div>
            }
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
            <div className="relative bg-blue-200 rounded-lg p-1">
              <UserCheck size={18} />
            </div>
          </div>
        );
      },
    },
  ];

  const currentView =
    location.pathname === "/schedule/calendar" ? "calendar" : "list";

  const optionsExamSeries = examSeries?.map((item) => ({
    value: item.seriesId,
    label: item.seriesDesc,
  }));

  const handleFormSubmit = async (formData) => {
    const result = await postClassSchedule(formData);

    if (result.success) {
      setIsModalOpen(false);
      setParams((prev) => ({ ...prev, page: 1 }));
      await fetchClassSchedule({ page: 1 });
    }
    return result.success;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <PageHeader
          title="Teacher Schedules"
          subtitle="Your Schedule"
          showSearch={true}
          searchPlaceholder="Search by subject..."
          searchMaxLength={50}
          onSearch={onSearch}
        >
          <div className="w-full md:min-w-[200px] md:w-auto">
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
                  navigate("/teacher/schedule/calendar");
                }
              }}
              options={[
                { value: "list", label: "View By List" },
                { value: "calendar", label: "View By Calendar" },
              ]}
              placeholder={"View By"}
              searchPlaceholder="Search..."
              emptyMessage="No items found"
              icon={Filter}
              minSearchLength={0}
              className="h-10"
            />
          </div>
        </PageHeader>

        <DataTable
          data={classSchedule}
          columns={columns}
          onPageChange={onPageChange}
          onSizeChange={onPageSizeChange}
          pagination={pagination}
          idAccessor="classschhdid"
          additionalActions={startClassAction}
          detailPage="teacher/schedule/detail"
          isLoading={isLoading}
        />

        <ScheduleModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          seriesOptions={optionsExamSeries}
          mode={"create"}
          isLoadingSeries={seriesLoad}
        />

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
