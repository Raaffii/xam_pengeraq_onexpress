import { useParams } from "react-router-dom";

import { useExamSeries } from "@/hooks/useExamsSeries";
import { useEffect } from "react";
import { DataTable } from "@/components/table";

export default function ExamSeriesDetailPage() {
  const { id } = useParams();

  const { fetchExamSeriesById, examSeries, pagination } = useExamSeries();

  useEffect(() => {
    const fetchData = async () => {
      console.log("cek", id);
      const student = await fetchExamSeriesById({ byExam: id });
      console.log("");
    };

    fetchData();
  }, []);

  console.log("cekcekc", examSeries);

  const columns = [
    {
      accessorKey: "examName",
      header: <div className='text-left w-full'>Exam</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "examSeriesDescription",
      header: <div className='text-left w-full'>Description</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "examSeriesStartDate",
      header: <div className='text-left w-full'>Start Date</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "examSeriesEndDate",
      header: <div className='text-left w-full'>End Date</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "credits",
      header: <div className='text-left w-full'>Credits</div>,
      cellClassName: "text-left",
    },
  ];

  const fields = [
    {
      label: "",
      name: "examSeriesId",
      type: "hidden",
    },
    {
      label: "Exam",
      name: "examId",
      type: "dropdown",
      required: true,
    },
    {
      label: "Description",
      name: "examSeriesDescription",
      type: "text",
      required: true,
    },
    {
      label: "Start Date",
      name: "examSeriesStartDate",
      type: "date",
      required: true,
    },
    {
      label: "End Date",
      name: "examSeriesEndDate",
      type: "date",
      required: true,
    },
    {
      label: "Credits",
      name: "credits",
      type: "number",
      required: true,
    },
  ];

  return (
    <>
      <DataTable
        data={examSeries}
        columns={columns}
        detailPage='series'
        idAccessor='examSeriesId'
        // onEdit={openEditModal}
        // onDelete={openDeleteModal}
        // onPageChange={onPageChange}
        // onSizeChange={onPageSizeChange}
        pagination={pagination}
      />
    </>
  );
}
