import { useParams } from "react-router-dom";
import { useState } from "react";
import PageHeader from "../common/PageHeader";
import { useStudentClass } from "@/hooks/useStudentClass";
import { DataTable } from "../table";
import { useEffect } from "react";
import AddStudentClass from "./AddStudenctClass";
import { useNavigate } from "react-router-dom";
import { useStudents } from "@/hooks/useStudents";
import { Button } from "../custom";

export default function ScheduleDetailPage() {
  const { id } = useParams();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [enrolledMode, setEnrolledMode] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  const { fetchStudentClass, studenctClass, pagination } = useStudentClass();
  const {
    fetchStudents,
    students,
    pagination: paginationStudents,
  } = useStudents();

  const navigate = useNavigate();

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchStudentClass({ schedule: id });
    };

    fetchData();
  }, [fetchStudentClass, id]);

  const columns = [
    {
      accessorKey: "studentName",
      header: <div className='text-left w-full'>Subject Code</div>,
      cellClassName: "text-left",
    },
  ];

  const columnStudent = [
    {
      accessorKey: "studentIdNo",
      header: <div className='text-left w-full'>ID</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "studentName",
      header: <div className='text-left w-full'>Student Name</div>,
      cellClassName: "text-left",
    },
    {
      accessorKey: "examSeriesDescription",
      header: <div className='text-left w-full'>Curent Series</div>,
      cellClassName: "text-left",
      render: (row) => (
        <div className='flex flex-wrap gap-1'>
          {row.examSeries?.map((item) => (
            <span
              key={item.examSeriesId}
              className='px-2 py-0.5 text-xs rounded-full
                   bg-blue-50 text-blue-700 border border-blue-200'>
              {item.examSeriesDescription}
            </span>
          ))}
        </div>
      ),
    },
  ];

  const changeMode = async (bool) => {
    if (bool) {
      setEnrolledMode(bool);
      await fetchStudentClass({ schedule: id });
    } else {
      setEnrolledMode(bool);
      await fetchStudents();
    }
  };

  const actions = [
    {
      label: "Enrolled Students",
      onClick: () => changeMode(true),
    },
    {
      label: "All Students",
      onClick: () => changeMode(false),
    },
  ];

  const handleSelectRow = (row) => {
    setSelectedRows((prev) => {
      if (prev.includes(row)) {
        return prev.filter((r) => r !== row);
      }

      return [...prev, row];
    });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto'>
        <PageHeader
          title={`Student Details - ${id || "Loading..."}`}
          subtitle={`Student ID: ${id || ""}`}
          showSearch={true}
          actions2={actions}
        />

        {enrolledMode ? (
          <DataTable
            data={studenctClass}
            columns={columns}
            idAccessor='examResultsId'
            pagination={pagination}
          />
        ) : (
          <>
            {/* Action Bar */}
            <div className='flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-sm border'>
              <div>
                <h2 className='text-lg font-semibold text-gray-800'>
                  Assign Students to Class
                </h2>
                <p className='text-sm text-gray-500'>
                  Select students from the table below
                </p>
              </div>

              <div className='flex items-center gap-3'>
                <span className='text-sm text-gray-600'>
                  {selectedRows.length} selected
                </span>

                <Button className='px-4 py-2'>Assign to Class</Button>
              </div>
            </div>

            {/* Table */}
            <div className='bg-white rounded-lg shadow-sm border'>
              <DataTable
                data={students}
                columns={columnStudent}
                idAccessor='studentClassId'
                pagination={paginationStudents}
                selectable
                selectedRows={selectedRows}
                onSelectRow={handleSelectRow}
                showActions={false}
              />
            </div>
          </>
        )}

        {isAddModalOpen && (
          <AddStudentClass
            open={isAddModalOpen}
            setOpen={setIsAddModalOpen}

            // student={students}
            // fetchExamsResult={fetchExamsResult}
            // selectedExamsResult={selectedExamsResult}
          />
        )}
      </div>
    </div>
  );
}
