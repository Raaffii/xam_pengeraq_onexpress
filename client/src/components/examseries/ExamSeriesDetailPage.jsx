import { useParams } from "react-router-dom";
import { useExamSeries } from "@/hooks/useExamsSeries";
import { useEffect, useRef, useState } from "react";
import PageHeader from "../common/PageHeader";
import { Edit } from "lucide-react";
import { DetailsInfoCard } from "../common";
import { SeriesModal } from ".";
import { useExams } from "@/hooks/useExams";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubjectSection from "../subjects/SubjectSection";
import GradeSections from "./GradeSections";
import { usePageTitle } from "@/hooks/usePageTitle";
import { ResourceNotFound } from "../layout";

export default function ExamSeriesDetailPage() {
  const { id } = useParams();
  const hasFetchedData = useRef(false);
  const {
    fetchExamSeriesByid,
    seriesDetail,
    isLoading,
    updateExamsSeries,
    setSeriesDetail,
    isSubmitting,
  } = useExamSeries();
  const { fetchExams, exams } = useExams();
  const [isSeriesModalOpen, setIsSeriesModalOpen] = useState(false);

  usePageTitle(seriesDetail ? `Series - ${seriesDetail?.seriesDesc}` : "");

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    if (id) {
      fetchExamSeriesByid(id);
      fetchExams();
    }
  }, [fetchExamSeriesByid, id, fetchExams]);

  const seriesDetailFields = [
    {
      label: "Series ID",
      value: seriesDetail?.seriesId,
    },
    {
      label: "Description",
      value: seriesDetail?.seriesDesc,
    },
    {
      label: "Credit",
      value: seriesDetail?.seriesCredit,
    },
    {
      label: "Exam",
      value: seriesDetail?.examName,
    },
    {
      label: "Start Date",
      value: seriesDetail?.seriesStartDate,
    },
    {
      label: "End Date",
      value: seriesDetail?.seriesEndDate,
    },
  ];

  const handleUpdateSeries = async (formData) => {
    const response = await updateExamsSeries(id, formData);

    if (response?.success) {
      setSeriesDetail((prev) => ({
        ...prev,
        ...formData,
      }));
      setIsSeriesModalOpen(false);
    }
  };

  const examOptions =
    Array.isArray(exams) ?
      exams.map((item) => ({
        value: item.examId,
        label: item.examName,
      }))
    : [];

  if (!isLoading && !seriesDetail) {
    return (
      <ResourceNotFound
        title="Exam Series Not Found"
        message={`No exam series found with ID: ${id}. It may have been deleted or the ID is incorrect.`}
        backTo="/series"
      />
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title={`${seriesDetail?.seriesDesc || ""}`}
        subtitle={"Manage exam series details"}
        actions={[
          {
            variant: "default",
            label: "Edit Details",
            onClick: () => {
              setIsSeriesModalOpen(true);
            },
            icon: Edit,
          },
        ]}
      />
      <DetailsInfoCard
        title="Series Details"
        fields={seriesDetailFields}
        columnSize={3}
        isLoading={isLoading}
        className="mb-6"
      />

      <Tabs defaultValue="subjects" className="w-full">
        <TabsList>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>
        <TabsContent value="subjects">
          <SubjectSection
            customParams={{ bySeries: id }}
            seriesId={id}
            examSeriesOptions={[
              {
                value: seriesDetail?.seriesId,
                label: seriesDetail?.seriesDesc,
              },
            ]}
          />
        </TabsContent>
        <TabsContent value="grades">
          <GradeSections
            customParams={{ bySeries: id }}
            seriesId={id}
            examSeriesOptions={[
              {
                value: seriesDetail?.seriesId,
                label: seriesDetail?.seriesDesc,
              },
            ]}
          />
        </TabsContent>
      </Tabs>

      <SeriesModal
        open={isSeriesModalOpen}
        onOpenChange={setIsSeriesModalOpen}
        initialValues={seriesDetail}
        onSubmit={handleUpdateSeries}
        isSubmitting={isSubmitting}
        mode={"edit"}
        examOptions={examOptions}
      />
    </div>
  );
}
