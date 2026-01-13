import { useParams } from "react-router-dom";
import { useExamSeries } from "@/hooks/useExamsSeries";
import { useExams } from "@/hooks/useExams";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/table";
import PageHeader from "../common/PageHeader";
import Delete_modal from "../modals/Delete_modal";
import { SeriesModal } from "../examseries";
import { Edit } from "lucide-react";
import { DetailsInfoCard } from "../common";
import { ExamModal } from "./ExamModal";

export default function ExamDetailPage() {
  const { id } = useParams();
  const hasFetchedData = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [initialFormValues, setInitialFormValues] = useState({});
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  const {
    fetchExamSeries,
    examSeries,
    pagination,
    createExamsSeries,
    setParams,
    updateExamsSeries,
    deleteExamsSeries,
    onPageChange,
    onPageSizeChange,
    onSearch,
    isSubmitting,
    isLoading: seriesLoad,
  } = useExamSeries();
  const {
    fetchExamsById,
    examDetails,
    isLoading,
    setExamDetails,
    updateExams,
    isSubmitting: examSubmit,
  } = useExams();

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    const fetchData = async () => {
      setParams({ byExam: id });
      await fetchExamsById(id);
      await fetchExamSeries({ byExam: id, page: 1 });
    };

    fetchData();
  }, [fetchExamSeries, id, fetchExamsById, setParams]);

  const openDeleteModal = (student) => {
    setSelectedExam(student);
    setIsDeleteModalOpen(true);
  };

  const handleExamSeriesDelete = async (entityData) => {
    const result = await deleteExamsSeries(entityData.seriesId);
    if (result.success) {
      setParams((prev) => ({ ...prev, page: 1 }));
      fetchExamSeries({ byExam: id });
    }
    return result.success;
  };

  const columns = [
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <PageHeader
          title={`Exam Details - ${examDetails?.examName || "Loading..."}`}
          subtitle={`Exam ID: ${examDetails?.examId || ""}`}
          actions={[
            {
              variant: "default",
              label: "Edit Details",
              onClick: () => {
                setIsExamModalOpen(true);
              },
              icon: Edit,
            },
          ]}
        />
        <DetailsInfoCard
          title="Exam Information"
          fields={[
            {
              label: "Exam ID",
              value: examDetails?.examId,
            },
            {
              label: "Exam Name",
              value: examDetails?.examName,
            },
            {
              label: "Exam Description",
              value: examDetails?.examDesc,
            },
          ]}
          columnSize={3}
          isLoading={isLoading}
          className="mb-6"
        />

        <PageHeader
          title="Exam Series"
          subtitle="Manage exams series records and exam item assignments"
          primaryAction={{
            label: "Add Exam Series",
            onClick: () => {
              setModalMode("create");
              setInitialFormValues({ examId: examDetails?.examId });
              setIsModalOpen(true);
            },
          }}
          showSearch={true}
          searchPlaceholder="Search by series description"
          onSearch={onSearch}
          searchMaxLength={50}
        />
        <DataTable
          data={examSeries}
          columns={columns}
          idAccessor="seriesId"
          detailPage="series"
          onEdit={(data) => {
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
          }}
          onDelete={openDeleteModal}
          onPageChange={onPageChange}
          onSizeChange={onPageSizeChange}
          pagination={pagination}
          isLoading={seriesLoad}
        />

        {isExamModalOpen && (
          <ExamModal
            open={isExamModalOpen}
            onOpenChange={setIsExamModalOpen}
            initialValues={examDetails}
            onSubmit={async (formData) => {
              const response = await updateExams(id, formData);

              if (response?.success) {
                setExamDetails((prev) => ({
                  ...prev,
                  ...formData,
                }));
                setIsExamModalOpen(false);
              }
            }}
            isSubmitting={examSubmit}
            mode={"edit"}
          />
        )}

        <SeriesModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          initialValues={initialFormValues}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          mode={modalMode}
          examOptions={[
            {
              value: examDetails?.examId,
              label: examDetails?.examName,
            },
          ]}
          optionDisabled={true}
        />

        {isDeleteModalOpen && selectedExam && (
          <Delete_modal
            open={isDeleteModalOpen}
            setOpen={setIsDeleteModalOpen}
            onSubmit={handleExamSeriesDelete}
            entityData={selectedExam}
            title="Delete Student"
            confirmationText={`Are you sure you want to delete student "${selectedExam.examName}"? This action cannot be undone.`}
          />
        )}
      </div>
    </div>
  );
}
