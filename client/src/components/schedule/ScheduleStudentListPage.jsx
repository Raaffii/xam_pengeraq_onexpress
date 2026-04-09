import { useParams } from "react-router-dom";
import { useRef, useState } from "react";
import PageHeader from "../common/PageHeader";
import { useStudentClass } from "@/hooks/useStudentClass";
import { DataTable } from "../table";
import { useEffect } from "react";
import { useClassSchedule } from "@/hooks/useClassSchedule";
import { useStudents } from "@/hooks/useStudents";
import { Button } from "../custom";
import toast from "react-hot-toast";
import { SearchableDropdown } from "../common";
import { Trash } from "lucide-react";
import Delete_modal from "../modals/Delete_modal";
import { useRowSelection } from "@/hooks";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function ScheduleStudentListPage() {
  const { id } = useParams();
  const hasFetchedData = useRef(false);
  const [enrolledMode, setEnrolledMode] = useState(true);
  const [curentEnroled, setCurentEnroled] = useState([]);
  const [selectedDropStudent, setSelectedDropStudent] = useState();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState();
  const [value, setValue] = useState();
  usePageTitle(enrolledMode ? "Enrolled Student" : "Assign Student");

  const {
    fetchStudentClass,
    assignStudentClass,
    studenctClass,
    pagination,
    onPageChange,
    onPageSizeChange,
    onFilterChange: fetchWithParamsChange,
    isLoading: classLoad,
  } = useStudentClass();

  const { getClassScheduleById, classSchedule } = useClassSchedule();

  const {
    fetchStudents,
    students,
    pagination: paginationStudents,
    onPageChange: onPageChangeStudents,
    onPageSizeChange: onPageSizeChangeStudents,
    onSearch: onSearchStudents,
    onFilterChange: fetchStudentWithParamChange,
    isLoading,
  } = useStudents();

  const { selectedRows, handleSelectRow, handleSelectAll, setSelectedRows } =
    useRowSelection({
      rowIdKey: "studentId",
    });

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

    const fetchData = async () => {
      await fetchWithParamsChange({ schedule: id });
      await getClassScheduleById(id);
    };

    fetchData();
  }, [fetchWithParamsChange, getClassScheduleById, id]);

  useEffect(() => {
    if (!students?.length) return;

    const array = students.flatMap((student) =>
      student.studentClass.flatMap((sc) =>
        id == sc.classSchedule ? [sc.classStudent] : [],
      ),
    );

    setSelectedRows(array);
    setCurentEnroled(array);
  }, [students, id, setSelectedRows]);

  const columns = [
    {
      accessorKey: "studentIdNo",
      header: "ID",
      cellClassName: "text-left",
    },
    {
      accessorKey: "studentName",
      header: "Student Name",
      cellClassName: "text-left",
    },
    {
      accessorKey: "enteredDate",
      header: "Entered Date",
      align: "center",
    },
    {
      accessorKey: "attendancePercentage",
      header: "Attendance",
      align: "center",
      render: (row) => (
        <div className="flex w-full justify-center">
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full border
      ${
        row.attendancePercentage == 0
          ? "bg-red-100 text-red-700 border-red-300"
          : "bg-blue-100 text-blue-700 border-blue-300"
      }
    `}>
            {row.attendancePercentage}%
          </span>
        </div>
      ),
    },
    {
      header: "Drop Student",
      align: "center",
      render: (row) => (
        <div className="flex w-full justify-center">
          <button
            onClick={() => handleDropStudent(row.studentId, row.studentName)}
            className="group p-0 w-9 h-9 rounded-lg
             bg-red-50 text-red-600
             hover:bg-red-100
             flex items-center justify-center
             transition-all duration-200
             hover:shadow-sm">
            <Trash className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          </button>
        </div>
      ),
    },
  ];

  const handleDropStudent = (studentId, studentName) => {
    setSelectedDropStudent({ studentId, studentName });
    setIsDeleteModalOpen(true);
  };
  const handleConfirmDropStudent = async () => {
    const submitData = {
      scheduleId: id,
      removeStudents: [selectedDropStudent.studentId],
    };

    const result = await assignStudentClass(submitData);
    if (result.success) {
      await fetchStudentClass({
        schedule: id,
      });
      setIsDeleteModalOpen(false);
    }
  };

  const columnStudent = [
    {
      accessorKey: "studentIdNo",
      header: "ID",
      cellClassName: "text-left",
    },
    {
      accessorKey: "studentName",
      header: "Student Name",
      cellClassName: "text-left",
    },
    {
      accessorKey: "examSeriesDescription",
      header: "Exam Series",
      cellClassName: "text-left",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.examSeries?.map((item, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs rounded-full
                   bg-blue-50 text-blue-700 border border-blue-200">
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
      await fetchStudentClass({
        schedule: id,
      });
    } else {
      setEnrolledMode(bool);
      const result = await fetchStudentWithParamChange({
        // subject: classSchedule?.examSubjId,
      });

      const array = result.data.flatMap((student) =>
        student.studentClass.flatMap((sc) =>
          id == sc.classSchedule ? [sc.classStudent] : [],
        ),
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
      label: "Assign Students",
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

  const options = [
    { value: "selected", label: "Selected" },
    { value: "unselected", label: "All" },
  ];

  const handleChange = async (val) => {
    setValue(val);
    if (val.target.value == "selected") {
      await fetchStudents({ enrolledClass: id, enrolledSelected: "SELECTED" });
    } else {
      await fetchStudents({
        enrolledClass: id,
        enrolledSelected: "NOT_SELECTED",
      });
    }
  };

  const pageTitle = (
    <div className="text-xl font-semibold flex items-baseline gap-2">
      <span>Class Subject - {classSchedule?.subjDesc || "Loading..."}</span>

      <span className="text-lg text-gray-500 font-normal">
        Conducted By - {classSchedule?.teacherName || "Loading..."}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <PageHeader
          title={pageTitle}
          subtitle={``}
          showSearch={true}
          onSearch={onSearchStudents}
          actions2={actions}
        />

        {enrolledMode ? (
          <DataTable
            data={studenctClass}
            columns={columns}
            idAccessor="studentClassId"
            pagination={pagination}
            showActions={false}
            onPageChange={onPageChange}
            onSizeChange={onPageSizeChange}
            isLoading={classLoad}
          />
        ) : (
          <>
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-sm border">
              <div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Assign Students to Class
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  Select students from the table below
                </p>
              </div>

              <div className="flex items-center gap-2">
                <SearchableDropdown
                  value={value}
                  options={options}
                  onChange={handleChange}
                  searchPlaceholder="Search..."
                  emptyMessage="No items found"
                  minSearchLength={0}
                  className="h-10"
                />
                <span className="text-sm text-gray-60 w-full">
                  {selectedRows.length} selected
                </span>

                <Button className="px-4 py-2" onClick={assignToClass}>
                  Assign
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border">
              <DataTable
                data={students}
                columns={columnStudent}
                idAccessor="studentId"
                pagination={paginationStudents}
                selectable={true}
                selectedRows={selectedRows}
                onSelectRow={handleSelectRow}
                showActions={false}
                onPageChange={onPageChangeStudents}
                onSizeChange={onPageSizeChangeStudents}
                onSelectAll={handleSelectAll}
                isLoading={isLoading}
              />
            </div>
          </>
        )}

        {isDeleteModalOpen && (
          <Delete_modal
            open={isDeleteModalOpen}
            setOpen={setIsDeleteModalOpen}
            onSubmit={handleConfirmDropStudent}
            title="Delete Student"
            confirmationText={`Are you sure you want to delete student "${selectedDropStudent?.studentName}"? This action cannot be undone.`}
          />
        )}
      </div>
    </div>
  );
}
