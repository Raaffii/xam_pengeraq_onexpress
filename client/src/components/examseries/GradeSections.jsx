import { useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "../table";
import Delete_modal from "../modals/Delete_modal";
import PageHeader from "../common/PageHeader";
import { ExamSeriesFilter, GradeModal } from "../examseries";
import { useExamGrades } from "@/hooks/useExamGrades";

export default function GradeSections({
  examSeriesOptions,
  isFilterOpen = false,
  examSeries,
  customParams = {},
  seriesId,
}) {
  const {
    fetchExamGrades,
    onSearch,
    onPageChange,
    onPageSizeChange,
    setParams,
    deleteExamGrades,
    isLoading,
    isSubmitting,
    pagination,
    examGrades,
    createExamGrades,
    updateExamGrades,
    onFilterChange,
    params,
  } = useExamGrades();
  const hasFetchedData = useRef(false);

  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

    setParams(customParams);
    fetchExamGrades({ page: 1, ...customParams });
  }, [fetchExamGrades, customParams, setParams]);

  const gradeColumns = [
    {
      accessorKey: "seriesDesc",
      header: "Exam Series",
      align: "center",
    },
    {
      accessorKey: "gradeSeq",
      header: "Sequence",
      align: "center",
    },
    {
      accessorKey: "finalPercent",
      header: "Final Percent",
      align: "center",
    },
    {
      accessorKey: "grade",
      header: "Overall Grade",
      align: "center",
    },
    {
      accessorKey: "gradePoint",
      header: "Grade Point",
      align: "center",
    },
    {
      accessorKey: "gradeResult",
      header: "Result",
      align: "center",
    },
  ];

  const handleFormSubmit = async (formData) => {
    let response;
    if (modalMode === "create") {
      response = await createExamGrades(formData);
    } else {
      response = await updateExamGrades(selectedGrade.id, formData);
    }

    if (response?.success) {
      if (modalMode === "create") {
        setParams((prev) => ({ ...prev, page: 1 }));
        fetchExamGrades({ page: 1 });
      } else {
        fetchExamGrades();
      }
      setIsGradeModalOpen(false);
      setSelectedGrade(null);
    }
  };

  const handleDelete = async () => {
    const result = await deleteExamGrades(selectedGrade.gradeId);
    if (result.success) {
      setParams((prev) => ({ ...prev, page: 1 }));
      fetchExamGrades({ page: 1 });
    }
    return result.success;
  };

  const initialFormValues = useMemo(() => {
    if (modalMode === "edit" && selectedGrade) {
      return selectedGrade;
    }

    return {
      gradeSeq: 0,
      finalPercent: "",
      grade: "",
      gradePoint: "",
      gradeResult: "",
      seriesId: seriesId || "",
    };
  }, [modalMode, selectedGrade, seriesId]);

  return (
    <div>
      <PageHeader
        title="Exam Grades"
        subtitle="Manage available exam Grades"
        showSearch={true}
        searchPlaceholder="Search by exam series"
        onSearch={onSearch}
        searchMaxLength={50}
        primaryAction={{
          label: "Add Exam Grade",
          onClick: () => {
            setModalMode("create");
            setSelectedGrade(null);
            setIsGradeModalOpen(true);
          },
        }}
      >
        {isFilterOpen && examSeriesOptions && (
          <ExamSeriesFilter
            data={examSeries}
            valueKey="seriesId"
            labelKey="seriesDesc"
            filterKey="bySeries"
            placeholder="Filter by Series"
            initialFilters={{ bySeries: params.bySeries }}
            onFilterChange={onFilterChange}
          />
        )}
      </PageHeader>
      <DataTable
        data={examGrades}
        isLoading={isLoading}
        columns={gradeColumns}
        idAccessor="gradeId"
        onPageChange={onPageChange}
        onSizeChange={onPageSizeChange}
        pagination={pagination}
        onDelete={(e) => {
          setSelectedGrade(e);
          setIsDeleteModalOpen(true);
        }}
        onEdit={(e) => {
          setSelectedGrade(e);
          setModalMode("edit");
          setIsGradeModalOpen(true);
        }}
      />
      <GradeModal
        open={isGradeModalOpen}
        onOpenChange={setIsGradeModalOpen}
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        mode={modalMode}
        examOptions={examSeriesOptions}
      />
      {isDeleteModalOpen && selectedGrade && (
        <Delete_modal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onSubmit={handleDelete}
          entityData={selectedGrade}
          title="Delete Exam Grade"
          confirmationText={
            "Are you sure you want to delete this grade? This action cannot be undone."
          }
        />
      )}
    </div>
  );
}
