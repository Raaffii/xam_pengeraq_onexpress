import { DataTable } from "@/components/table";
import { useClassSchedule } from "@/hooks/useClassSchedule";
import { useEffect, useState, useRef } from "react";
import PageHeader from "@/components/common/PageHeader";
import { useNavigate, useLocation } from "react-router-dom";
import Delete_modal from "@/components/modals/Delete_modal";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useExamSeries } from "@/hooks/useExamsSeries";
import { ScheduleModal } from "@/components/schedule/ScheduleModal";
import { SearchableDropdown } from "@/components/common";
import { Filter } from "lucide-react";
import { formatDateTimeV2 } from "@/utils";

export default function SchedulesPages() {
  usePageTitle("Schedules");
  const {
    fetchClassSchedule,
    deleteClassSchedule,
    onSearch,
    classSchedule,
    pagination,
    onPageChange,
    onPageSizeChange,
    isLoading,
    postClassSchedule,
    putClassSchedule,
    setParams,
    isSubmitting,
  } = useClassSchedule();
  const {
    fetchExamSeries,
    examSeries,
    isLoading: seriesLoad,
  } = useExamSeries();
  const hasFetchedData = useRef(false);
  const hasFetchedExamSeries = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const currentView =
    location.pathname === "/schedule/calendar" ? "calendar" : "list";

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    fetchClassSchedule();
  }, [fetchClassSchedule]);

  useEffect(() => {
    if (isModalOpen && !hasFetchedExamSeries.current) {
      hasFetchedExamSeries.current = true;
      fetchExamSeries();
    }
  }, [isModalOpen, fetchExamSeries]);

  const openDeleteModal = (schedule) => {
    setSelectedSchedule(schedule);
    setIsDeleteModalOpen(true);
  };

  const handleScheduleDelete = async (schedule) => {
    const result = await deleteClassSchedule(schedule.classschhdid);
    if (result.success) {
      fetchClassSchedule({ page: 1 });
    }
    return result.success;
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
      header: "Frequency",
      cellClassName: "text-left",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          <span
            className="px-2 py-0.5 text-xs rounded-full
                   bg-blue-50 text-blue-700 border border-blue-200"
          >
            {row.repeatValue || "One-time"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "startDateTime",
      header: "Start Date",
      align: "center",
      render: (row) => (row.startDateTime ? row.startDateTime : "N/A"),
    },
    {
      accessorKey: "endDateTime",
      header: "End Date",
      align: "center",
      render: (row) =>
        row.endDateTime ?
          formatDateTimeV2(row.endDateTime, "yyyy-MM-dd")
        : formatDateTimeV2(row.startDateTime, "yyyy-MM-dd"),
    },
  ];

  const optionsExamSeries = examSeries?.map((item) => ({
    value: item.seriesId,
    label: item.seriesDesc,
  }));

  const handleFormSubmit = async (formData) => {
    let result;
    if (modalMode === "create") {
      result = await postClassSchedule(formData);
    } else {
      result = await putClassSchedule(selectedSchedule?.classschhdid, formData);
    }

    if (result.success) {
      setIsModalOpen(false);
      setSelectedSchedule(null);
      setParams((prev) => ({ ...prev, page: 1 }));
      await fetchClassSchedule({ page: 1 });
    }
    return result.success;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Schedule"
        subtitle="Manage schedule records"
        showSearch={true}
        onSearch={onSearch}
        searchPlaceholder="Search by teacher name or subject"
        searchMaxLength={50}
        primaryAction={{
          label: "New Schedule",
          onClick: () => {
            setSelectedSchedule(null);
            setModalMode("create");
            setIsModalOpen(true);
          },
        }}
      >
        <div className="w-full md:min-w-[200px] md:w-auto">
          <SearchableDropdown
            id={"value"}
            name={"value"}
            value={currentView}
            onChange={(e) => {
              const { value } = e.target;
              if (value === "list") {
                navigate("/schedule");
              }

              if (value === "calendar") {
                navigate("/schedule/calendar");
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
        onDelete={openDeleteModal}
        onEdit={(data) => {
          setSelectedSchedule(data);
          setModalMode("edit");
          setIsModalOpen(true);
        }}
        onPageChange={onPageChange}
        onSizeChange={onPageSizeChange}
        pagination={pagination}
        detailPage="schedule"
        idAccessor="classschhdid"
        isLoading={isLoading}
      />

      <ScheduleModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialValues={selectedSchedule || {}}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        seriesOptions={optionsExamSeries}
        mode={modalMode}
        isLoadingSeries={seriesLoad}
      />

      {isDeleteModalOpen && selectedSchedule && (
        <Delete_modal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onSubmit={handleScheduleDelete}
          entityData={selectedSchedule}
          title="Delete Schedule"
          confirmationText={`Are you sure you want to delete this schedule? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
