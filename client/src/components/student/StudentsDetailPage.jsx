import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStudents } from "@/hooks/useStudents";
import { useExamsResult } from "@/hooks/useExamResult";
import { DataTable } from "@/components/table";
import PageHeader from "../common/PageHeader";
import Add_exams_grades from "../modals/add_exam_grades";
// import Add_exams_grades from "../modals/add_exam_grades";

export default function StudentsDetailPage() {
  const { id } = useParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { getStudentById, students } = useStudents();
  const {
    fetchExamsResult,
    examsResult,
    onPageChange,
    onPageSizeChange,
    pagination,
  } = useExamsResult();

  useEffect(() => {
    const fetchData = async () => {
      const student = await getStudentById(id);

      await fetchExamsResult({ studentId: student.data.studentId });
    };

    fetchData();
  }, [getStudentById, id, fetchExamsResult]);

  const loadExamResults = async (examseriesid = null) => {
    const params = { studentid: id };
    if (examseriesid && examseriesid !== "all") {
      params.examseriesid = examseriesid;
    }
    await fetchExamsResult(params);
  };
  const columns = [
    {
      accessorKey: "subjCode",
      header: <div className='text-left w-full'>Subject Code</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "subjDesc",
      header: <div className='text-left w-full'>Subject</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "marks",
      header: <div className='text-left w-full'>Marks</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "subjGpa",
      header: <div className='text-left w-full'>GPA</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "subjGrade",
      header: <div className='text-left w-full'>Grade</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "subjResults",
      header: <div className='text-left w-full'>Rank</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "retake",
      header: <div className='text-left w-full'>Retake</div>,
      cellClassName: "text-left",
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto'>
        <PageHeader
          title={`Student Details - ${students.studentName || "Loading..."}`}
          subtitle={`Student ID: ${students.studentIdNo || ""}`}
          primaryAction={{
            label: "Add Grades",
            onClick: () => setIsAddModalOpen(true),
          }}
        />
        <div className=''>
          <div className='bg-white overflow-hidden shadow-sm ring-1 ring-gray-200 rounded-sm border border-gray-100 mb-6'>
            <div className='px-6 py-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Student Information
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Student ID
                  </label>
                  <div className='bg-gray-50 rounded-lg px-4 py-3 border border-gray-200'>
                    <span className='text-gray-900 font-medium'>
                      {students.studentIdNo || "Loading..."}
                    </span>
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Student Name
                  </label>
                  <div className='bg-gray-50 rounded-lg px-4 py-3 border border-gray-200'>
                    <span className='text-gray-900 font-medium'>
                      {students.studentName || "Loading..."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* cecleclelc */}
        <DataTable
          data={examsResult}
          columns={columns}
          idAccessor='studentId'
          onPageChange={onPageChange}
          onSizeChange={onPageSizeChange}
          pagination={pagination}
        />

        {isAddModalOpen && (
          <Add_exams_grades open={isAddModalOpen} setOpen={setIsAddModalOpen} />
        )}
      </div>
    </div>
  );
}
