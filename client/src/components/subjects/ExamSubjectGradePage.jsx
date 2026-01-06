import { useExamSubject } from "@/hooks/useExamSubj";
import { useParams } from "react-router-dom";
import PageHeader from "../common/PageHeader";
import { useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "../table";
import { Edit } from "lucide-react";
import { SubjectGradeModal, SubjectModal } from ".";
import { useExamSeries } from "@/hooks/useExamsSeries";
import Delete_modal from "../modals/Delete_modal";

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
    }
  }, [fetchSubjectById, subjectId]);

  const initialFormValues = useMemo(() => {
    if (modalMode === "edit" && selectedGrade) {
      return {
        gradeSeq: selectedGrade.gradeSeq,
        subjMin: selectedGrade.minScore,
        subjMax: selectedGrade.maxScore,
        subjGrade: selectedGrade.grade,
        subjGpa: selectedGrade.gpa,
        subjResult: selectedGrade.result,
      };
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

  const columns = [
    {
      accessorKey: "gradeSeq",
      header: "Sequence",
      align: "center",
    },
    {
      accessorKey: "grade",
      header: "Grade",
      align: "center",
    },
    {
      accessorKey: "minScore",
      header: "Min Marks",
      align: "center",
    },
    {
      accessorKey: "maxScore",
      header: "Max Mark",
      align: "center",
    },
    {
      accessorKey: "gpa",
      header: "GPA",
      align: "center",
    },
    {
      accessorKey: "result",
      header: "Result",
      align: "center",
    },
  ];

  const handleSeriesSearch = async (searchTerm) => {
    if (seriesLoading) return;
    await fetchExamSeries({
      searchTerm: searchTerm,
      page: 1,
      limit: 5,
    });
  };

  const seriesOptions = Array.isArray(examSeries)
    ? examSeries.map((item) => ({
        value: item.examSeriesId,
        label: item.examSeriesDescription,
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
      {/* DetailsCard */}
      <div className="bg-white overflow-hidden shadow-md ring-1 ring-gray-200 rounded-md border border-gray-100 mb-6">
        <div className="px-6 py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Subject Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject ID
              </label>
              <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <span className="text-gray-900 font-medium">
                  {examSubjDetail.subjId || ""}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Code
              </label>
              <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <span className="text-gray-900 font-medium">
                  {examSubjDetail.subjCode || ""}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <span className="text-gray-900 font-medium">
                  {examSubjDetail.subjDesc || ""}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Series
              </label>
              <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <span className="text-gray-900 font-medium">
                  {examSubjDetail.seriesDesc || ""}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Earned Credit
              </label>
              <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <span className="text-gray-900 font-medium">
                  {examSubjDetail.subjCredit || ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
          onSeriesSearch={handleSeriesSearch}
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
        onSeriesSearch={handleSeriesSearch}
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
