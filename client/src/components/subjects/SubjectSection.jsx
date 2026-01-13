import { useEffect, useMemo, useRef, useState } from "react";
import { useExamSubject } from "@/hooks/useExamSubj";
import { DataTable } from "../table";
import { SubjectModal } from "../subjects";
import Delete_modal from "../modals/Delete_modal";
import PageHeader from "../common/PageHeader";
import { ExamSeriesFilter } from "../examseries";

export default function SubjectSection({
  subjId,
  examSeriesOptions,
  isFilterOpen = false,
  examSeries,
  customParams = {},
  seriesId,
}) {
  const {
    fetchSubjects,
    fetchSubjectById,
    onSearch,
    onPageChange,
    onPageSizeChange,
    setParams,
    removeSubject,
    isLoading: subjLoad,
    isSubmitting: subjSubmit,
    pagination: subjPagination,
    examSubj,
    newExamSubj,
    updateDetails,
    onFilterChange,
    params,
  } = useExamSubject();
  const hasFetchedData = useRef(false);

  const [selectedSubj, setSelectedSubj] = useState(null);
  const [isSubjModalOpen, setIsSubjModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

    if (subjId) {
      fetchSubjectById(subjId);
    } else {
      setParams((prev) => ({ ...prev, ...customParams }));
      fetchSubjects({ page: 1, ...customParams });
    }
  }, [fetchSubjects, fetchSubjectById, subjId, customParams, setParams]);

  const subjColumns = [
    {
      accessorKey: "seriesDesc",
      header: "Exam Series",
      align: "center",
    },
    {
      accessorKey: "subjCode",
      header: "Subject Code",
      align: "center",
    },
    {
      accessorKey: "subjDesc",
      header: "Description",
    },
    {
      accessorKey: "subjCredit",
      header: "Earned Credit",
      align: "center",
    },
  ];

  const handleFormSubmit = async (formData) => {
    let response;
    if (modalMode === "create") {
      response = await newExamSubj(formData);
    } else {
      response = await updateDetails(selectedSubj.id, formData);
    }

    if (response?.success) {
      if (modalMode === "create") {
        setParams((prev) => ({ ...prev, page: 1 }));
        fetchSubjects({ page: 1 });
      } else {
        fetchSubjects();
      }
      setIsSubjModalOpen(false);
      setSelectedSubj(null);
    }
  };

  const handleDelete = async () => {
    const result = await removeSubject(selectedSubj.subjId);
    if (result.success) {
      setParams((prev) => ({ ...prev, page: 1 }));
      fetchSubjects({ page: 1 });
    }
    return result.success;
  };

  const initialFormValues = useMemo(() => {
    if (modalMode === "edit" && selectedSubj) {
      return selectedSubj;
    }

    return {
      subjCode: "",
      subjDesc: "",
      subjCredit: 0,
      seriesId: parseInt(seriesId) || "",
    };
  }, [modalMode, selectedSubj, seriesId]);

  return (
    <div>
      <PageHeader
        title="Subjects"
        subtitle="Manage available exam subjects"
        showSearch={true}
        searchPlaceholder="Search by subject code or description"
        onSearch={onSearch}
        searchMaxLength={50}
        primaryAction={{
          label: "Add Subject",
          onClick: () => {
            setModalMode("create");
            setSelectedSubj(null);
            setIsSubjModalOpen(true);
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
        data={examSubj}
        isLoading={subjLoad}
        columns={subjColumns}
        idAccessor="subjId"
        detailPage="subjects"
        onPageChange={onPageChange}
        onSizeChange={onPageSizeChange}
        pagination={subjPagination}
        onDelete={(e) => {
          setSelectedSubj(e);
          setIsDeleteModalOpen(true);
        }}
        onEdit={(e) => {
          setSelectedSubj(e);
          setModalMode("edit");
          setIsSubjModalOpen(true);
        }}
      />
      <SubjectModal
        open={isSubjModalOpen}
        onOpenChange={setIsSubjModalOpen}
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}
        isSubmitting={subjSubmit}
        mode={modalMode}
        examSeriesOptions={examSeriesOptions}
        optionDisabled={!!seriesId}
      />
      {isDeleteModalOpen && selectedSubj && (
        <Delete_modal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onSubmit={handleDelete}
          entityData={selectedSubj}
          title="Delete Subject"
          confirmationText={`Are you sure you want to delete "${selectedSubj.subjDesc}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
