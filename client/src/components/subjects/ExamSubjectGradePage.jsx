import { useExamSubject } from "@/hooks/useExamSubj";
import { useParams } from "react-router-dom";
import PageHeader from "../common/PageHeader";
import { useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "../table";
import { Edit } from "lucide-react";
import { SubjectGradeModal, SubjectModal } from ".";
import { useExamSeries } from "@/hooks/useExamsSeries";
import Delete_modal from "../modals/Delete_modal";
import { DetailsInfoCard } from "../common";

export const ExamSubjectGradePage = () => {
  const hasFetchedData = useRef(false);
  const { subjectId } = useParams();
  const {
    fetchSubjectById,
    examSubjDetail,
    isLoading,
    isSubmitting,
    updateDetails,
    setExamSubjDetail,
    removeSubjGrade,
    updateSubjGrade,
    newSubjGrade,
  } = useExamSubject();
  const {
    fetchExamSeries,
    examSeries,
    isLoading: seriesLoading,
  } = useExamSeries();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

    if (subjectId) {
      fetchSubjectById(subjectId);
      fetchExamSeries();
    }
  }, [fetchSubjectById, subjectId, fetchExamSeries]);

  const initialFormValues = useMemo(() => {
    if (modalMode === "edit" && selectedGrade) {
      return selectedGrade;
    }

    return {
      gradeSeq: 0,
      subjMin: "",
      subjMax: "",
      subjGrade: "",
      subjGpa: "",
      subjResult: "",
    };
  }, [modalMode, selectedGrade]);

  const subjectDetailFields = [
    {
      label: "Subject ID",
      value: examSubjDetail.subjId,
    },
    {
      label: "Subject Code",
      value: examSubjDetail.subjCode,
    },
    {
      label: "Description",
      value: examSubjDetail.subjDesc,
    },
    {
      label: "Exam Series",
      value: examSubjDetail.seriesDesc,
    },
    {
      label: "Earned Credit",
      value: examSubjDetail.subjCredit,
    },
  ];

  const columns = [
    {
      accessorKey: "gradeSeq",
      header: "Sequence",
      align: "center",
    },
    {
      accessorKey: "subjGrade",
      header: "Grade",
      align: "center",
    },
    {
      accessorKey: "subjMin",
      header: "Min Marks",
      align: "center",
    },
    {
      accessorKey: "subjMax",
      header: "Max Mark",
      align: "center",
    },
    {
      accessorKey: "subjGpa",
      header: "GPA",
      align: "center",
    },
    {
      accessorKey: "subjResult",
      header: "Result",
      align: "center",
    },
  ];

  const seriesOptions = Array.isArray(examSeries)
    ? examSeries.map((item) => ({
        value: item.seriesId,
        label: item.seriesDesc,
      }))
    : [];

  const handleUpdateSubject = async (formData) => {
    const response = await updateDetails(subjectId, formData);

    if (response?.success) {
      setExamSubjDetail((prev) => ({
        ...prev,
        ...formData,
      }));
      setIsSubjectModalOpen(false);
    }
  };

  const handleDelete = async () => {
    const result = await removeSubjGrade(selectedGrade.gradeId);
    if (result.success) {
      fetchSubjectById(subjectId);
    }
    return result.success;
  };

  const handleFormSubmit = async (formData) => {
    let response;
    if (modalMode === "create") {
      response = await newSubjGrade({
        ...formData,
        seriesId: examSubjDetail.seriesId,
        subjId: parseInt(subjectId),
      });
    } else {
      response = await updateSubjGrade(selectedGrade.gradeId, formData);
    }

    if (response?.success) {
      fetchSubjectById(subjectId);
      setIsModalOpen(false);
      setSelectedGrade(null);
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title={`${examSubjDetail.subjCode || ""} - ${
          examSubjDetail.subjDesc || ""
        }`}
        subtitle={`Subject ID: ${examSubjDetail.subjId || ""}`}
        actions={[
          {
            variant: "default",
            label: "Edit Details",
            onClick: () => {
              setIsSubjectModalOpen(true);
            },
            icon: Edit,
          },
        ]}
      />

      <DetailsInfoCard
        title="Subject Details"
        fields={subjectDetailFields}
        columnSize={3}
        isLoading={isLoading}
        className="mb-6"
      />

      <PageHeader
        title={"Subject Grade"}
        primaryAction={{
          label: "Add Grade",
          onClick: () => {
            setModalMode("create");
            setIsModalOpen(true);
            setSelectedGrade(null);
          },
        }}
      />

      <DataTable
        data={examSubjDetail.grades}
        isLoading={isLoading}
        columns={columns}
        idAccessor="gradeId"
        showPagination={false}
        onDelete={(e) => {
          setSelectedGrade(e);
          setIsDeleteModalOpen(true);
        }}
        onEdit={(e) => {
          setSelectedGrade(e);
          setModalMode("edit");
          setIsModalOpen(true);
        }}
      />

      {isSubjectModalOpen && (
        <SubjectModal
          open={isSubjectModalOpen}
          onOpenChange={setIsSubjectModalOpen}
          initialValues={examSubjDetail}
          onSubmit={handleUpdateSubject}
          isSubmitting={isSubmitting}
          mode={"edit"}
          examSeriesOptions={seriesOptions}
          isLoadingSeries={seriesLoading}
        />
      )}

      <SubjectGradeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        mode={modalMode}
        examSeriesOptions={seriesOptions}
        isLoadingSeries={seriesLoading}
      />

      {isDeleteModalOpen && selectedGrade && (
        <Delete_modal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onSubmit={handleDelete}
          entityData={selectedGrade}
          title="Delete Subject Grade"
          confirmationText={
            "Are you sure you want to delete this grade? This action cannot be undone."
          }
        />
      )}
    </div>
  );
};
