import { useEffect, useRef, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { DataTable } from "@/components/table";
import Delete_modal from "@/components/modals/Delete_modal";
import { useExams } from "@/hooks/useExams";
import { useExamSeries } from "@/hooks/useExamsSeries";
import { ExamSeriesFilter, SeriesModal } from "@/components/examseries";
import { usePageTitle } from "@/hooks/usePageTitle";

const ExamsSeriesPage = () => {
  const hasFetchedData = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [initialFormValues, setInitialFormValues] = useState({});
  usePageTitle("Series");

  const { fetchExams, exams, isLoading: examLoad } = useExams();

  const {
    fetchExamSeries,
    createExamsSeries,
    updateExamsSeries,
    deleteExamsSeries,
    examSeries,
    pagination,
    onFilterChange,
    setParams,
    onSearch,
    onPageChange,
    onPageSizeChange,
    params,
    isSubmitting,
    isLoading,
  } = useExamSeries();

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    const fetchData = async () => {
      await fetchExamSeries({ page: 1 });
      await fetchExams();
    };

    fetchData();
  }, [fetchExamSeries, fetchExams]);

  const openCreateModal = () => {
    setModalMode("create");
    setInitialFormValues({});
    setIsModalOpen(true);
  };

  const openEditModal = (data) => {
    setModalMode("edit");
    setInitialFormValues({
      seriesId: data.seriesId,
      examId: data.examId,
      examName: data.examName,
      seriesDesc: data.seriesDesc,
      seriesStartDate: data.seriesStartDate,
      seriesEndDate: data.seriesEndDate,
      seriesCredit: data.seriesCredit,
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (data) => {
    setSelectedSeries(data);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    let result;
    if (modalMode === "create") {
      result = await createExamsSeries(formData);
    } else {
      result = await updateExamsSeries(formData.seriesId, formData);
    }

    if (result.success) {
      setIsModalOpen(false);
      setParams((prev) => ({ ...prev, page: 1 }));
      await fetchExamSeries({ page: 1 });
    }
    return result.success;
  };

  const handleExamSeriesDelete = async (entityData) => {
    const result = await deleteExamsSeries(entityData.seriesId);
    if (result.success) {
      setParams((prev) => ({ ...prev, page: 1 }));
      fetchExamSeries({ page: 1 });
    }
    return result.success;
  };

  const columns = [
    {
      accessorKey: "examName",
      header: <div className="text-left w-full">Exam</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "seriesDesc",
      header: <div className="text-left w-full">Description</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "seriesStartDate",
      header: <div className="text-left w-full">Start Date</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "seriesEndDate",
      header: <div className="text-left w-full">End Date</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "seriesCredit",
      header: <div className="text-left w-full">Credits</div>,
      cellClassName: "text-left",
    },
  ];

  const examOptions =
    Array.isArray(exams) ?
      exams.map((item) => ({
        value: item.examId,
        label: item.examName,
      }))
    : [];

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Exams"
        subtitle="Manage exams series records and exam item assignments"
        primaryAction={{
          label: "Add Exam Series",
          onClick: openCreateModal,
        }}
        showSearch={true}
        searchPlaceholder="Search by Exam Series Name"
        onSearch={onSearch}
        searchMaxLength={50}
      >
        <ExamSeriesFilter
          data={exams}
          valueKey="examId"
          labelKey="examName"
          filterKey="byExam"
          placeholder="Filter by Exam"
          initialFilters={{ byExam: params.byExam }}
          onFilterChange={onFilterChange}
          isLoading={examLoad}
        />
      </PageHeader>

      <DataTable
        data={examSeries}
        columns={columns}
        detailPage="series"
        idAccessor="seriesId"
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onPageChange={onPageChange}
        onSizeChange={onPageSizeChange}
        pagination={pagination}
        isLoading={isLoading}
      />

      <SeriesModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        mode={modalMode}
        examOptions={examOptions}
      />

      {isDeleteModalOpen && selectedSeries && (
        <Delete_modal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onSubmit={handleExamSeriesDelete}
          entityData={selectedSeries}
          title="Delete Exam Series"
          confirmationText={`Are you sure you want to delete series "${selectedSeries.seriesDesc}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default ExamsSeriesPage;
