import { useParams } from "react-router-dom";
import { useState } from "react";
import PageHeader from "../common/PageHeader";
import { useStudentClass } from "@/hooks/useStudentClass";
import { DataTable } from "../table";
import { useEffect } from "react";
import AddStudentClass from "./AddStudenctClass";

import { useStudents } from "@/hooks/useStudents";
import { Button } from "../custom";
import toast from "react-hot-toast";

export default function ScheduleDetailPage() {
  const { id } = useParams();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [enrolledMode, setEnrolledMode] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [curentEnroled, setCurentEnroled] = useState([]);

  const {
    fetchStudentClass,
    assignStudentClass,
    removeStudentFromClass,
    studenctClass,
    pagination,
  } = useStudentClass();

  const {
    fetchStudents,
    students,
    pagination: paginationStudents,
  } = useStudents();

  useEffect(() => {
    const fetchData = async () => {
      await fetchStudentClass({ schedule: id });
    };

    fetchData();
  }, [fetchStudentClass, id]);

  const columns = [
    {
      accessorKey: "studentIdNo",
      header: <div className='text-left w-full'>ID</div>,
      cellClassName: "text-left",
    },
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
          {row.examSeries?.map((item, index) => (
            <span
              key={index}
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
      const result = await fetchStudents();

      const array = result.data.flatMap((student) =>
        student.studentClass.flatMap((sc) =>
          id == sc.classSchedule ? [sc.classStudent] : []
        )
      );
      setSelectedRows(array);
      setCurentEnroled(array);
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

  const diffIds = (current = [], selected = []) => {
    const currentSet = new Set(current);
    const selectedSet = new Set(selected);

    const toAdd = [...selectedSet].filter((id) => !currentSet.has(id));
    const toRemove = [...currentSet].filter((id) => !selectedSet.has(id));

    return { toAdd, toRemove };
  };

  const assignToClass = async () => {
    const { toAdd, toRemove } = diffIds(curentEnroled, selectedRows);

    if (toAdd.length === 0 && toRemove.length === 0) {
      toast.error("no change");
      return;
    }

    const submitData = {
      scheduleId: id,
      addStudents: toAdd,
      removeStudents: toRemove,
    };

    await assignStudentClass(submitData);
  };

  const handleSelectRow = (row) => {
    setSelectedRows((prev) => {
      if (prev.includes(row)) {
        return prev.filter((r) => r !== row);
      }

      return [...prev, row];
    });
  };

  console.log("student", selectedRows);
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
            idAccessor='studentClassId'
            pagination={pagination}
            showActions={false}
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

                <Button className='px-4 py-2' onClick={assignToClass}>
                  Assign to Class
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className='bg-white rounded-lg shadow-sm border'>
              <DataTable
                data={students}
                columns={columnStudent}
                idAccessor='studentId'
                pagination={paginationStudents}
                selectable={true}
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
