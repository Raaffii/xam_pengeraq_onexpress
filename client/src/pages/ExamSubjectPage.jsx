import PageHeader from "@/components/common/PageHeader";
import Delete_modal from "@/components/modals/Delete_modal";
import { SubjectModal } from "@/components/subjects";
import { DataTable } from "@/components/table";
import { useExamSeries } from "@/hooks/useExamsSeries";
import { useExamSubject } from "@/hooks/useExamSubj";
import { useEffect, useMemo, useRef, useState } from "react";

const ExamSubjectPage = () => {
  const hasFetchedData = useRef(false);
  const {
    fetchSubjects,
    onSearch,
    onPageChange,
    onPageSizeChange,
    setParams,
    removeSubject,
    isLoading,
    isSubmitting,
    pagination,
    examSubj,
    newExamSubj,
    updateDetails,
  } = useExamSubject();
  const {
    fetchExamSeries,
    examSeries,
    isLoading: seriesLoading,
  } = useExamSeries();
  const [selectedSubj, setSelectedSubj] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    fetchSubjects({ page: 1 });
  }, [fetchSubjects, fetchExamSeries]);

  const columns = [
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
      setIsModalOpen(false);
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
      seriesId: null,
    };
  }, [modalMode, selectedSubj]);

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

  return (
    <div className='min-h-screen'>
      <PageHeader
        title='Subjects'
        subtitle='Manage available exam subjects'
        showSearch={true}
        searchPlaceholder='Search by subject code or description'
        onSearch={onSearch}
        searchMaxLength={50}
        primaryAction={{
          label: "Add Subject",
          onClick: () => {
            setModalMode("create");
            setIsModalOpen(true);
            setSelectedSubj(null);
          },
        }}
      />
      <DataTable
        data={examSubj}
        isLoading={isLoading}
        columns={columns}
        idAccessor='subjId'
        detailPage='subjects'
        onPageChange={onPageChange}
        onSizeChange={onPageSizeChange}
        pagination={pagination}
        onDelete={(e) => {
          setSelectedSubj(e);
          setIsDeleteModalOpen(true);
        }}
        onEdit={(e) => {
          setSelectedSubj(e);
          setModalMode("edit");
          setIsModalOpen(true);
        }}
      />

      <SubjectModal
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

      {isDeleteModalOpen && selectedSubj && (
        <Delete_modal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onSubmit={handleDelete}
          entityData={selectedSubj}
          title='Delete Subject'
          confirmationText={`Are you sure you want to delete "${selectedSubj.subjDesc}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default ExamSubjectPage;
