import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Form,
  FormField,
  SearchableDropdown,
  Input,
  Checkbox,
} from "../custom";
import {
  useStudents,
  useExamSubjects,
  useSubjectGrades,
  useExamResults,
} from "@/app/hooks";
import { useFormSubmission } from "@/app/hooks/useFormSubmission";
import GradeInformations from "../exam/GradeInformations";

export default function Add_exams_grades({
  open,
  setOpen,
  onGradeAdded,
  studentId = null,
  selectedStudentData = {},
  selectedSeriesData = {},
  examSeriesOptions = [],
}) {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("");
  const [subjectID, setSubjectID] = useState("");
  const [mark, setMark] = useState("");
  const [retake, setRetake] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState({});

  const { getStudentsByExamSeries } = useStudents();
  const { getExamSubjectsByExamSeries } = useExamSubjects();
  const { getSubjectGradesBySubjectId, findGradeByMark } = useSubjectGrades();
  const { createExamResult } = useExamResults();
  const { handleSubmit: submitForm, isSubmitting } = useFormSubmission();

  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);

  const preferredStudentId = useMemo(() => {
    return studentId || selectedStudentData?.studentid || null;
  }, [studentId, selectedStudentData?.studentid]);

  const preferredSeriesId = useMemo(() => {
    return selectedSeriesData?.examseriesid || null;
  }, [selectedSeriesData?.examseriesid]);

  useEffect(() => {
    if (open) {
      setSelectedStudent(preferredStudentId || "");
      setSelectedSeries(preferredSeriesId || "");
      setSubjectID("");
      setMark("");
      setRetake(false);
      setSelectedGrade({});
      setFilteredStudents([]);
      setFilteredSubjects([]);
      setFilteredGrades([]);
    }
  }, [open, preferredStudentId, preferredSeriesId]);

  useEffect(() => {
    if (
      open &&
      examSeriesOptions.length > 0 &&
      (!selectedSeries || selectedSeries === "") &&
      !preferredSeriesId
    ) {
      setSelectedSeries(examSeriesOptions[0].value);
    }
  }, [open, examSeriesOptions, selectedSeries, preferredSeriesId]);

  useEffect(() => {
    const fetchStudentsByExamSeries = async () => {
      if (selectedSeries) {
        if (preferredStudentId && selectedStudentData?.studentname) {
          const preferredStudent = {
            studentid: preferredStudentId,
            studentname: selectedStudentData.studentname,
            examseriesid: selectedSeries,
          };
          setFilteredStudents([preferredStudent]);
          setSelectedStudent(String(preferredStudentId));
          return;
        }

        // Otherwise, fetch all students for this exam series
        const result = await getStudentsByExamSeries(selectedSeries);
        if (result.success && result.data) {
          const sortedStudents = result.data.sort((a, b) =>
            a.studentname.localeCompare(b.studentname)
          );
          setFilteredStudents(sortedStudents);

          // Only auto-select first student if no preferred student
          if (!preferredStudentId) {
            if (sortedStudents.length > 0) {
              setSelectedStudent(String(sortedStudents[0].studentid));
            } else {
              setSelectedStudent("");
            }
          } else {
            setSelectedStudent(String(preferredStudentId));
          }
        } else {
          setFilteredStudents([]);
          setSelectedStudent("");
        }
      } else {
        setFilteredStudents([]);
        setSelectedStudent("");
      }
    };

    fetchStudentsByExamSeries();
  }, [selectedSeries, preferredStudentId, selectedStudentData?.studentname]);

  // Fetch subjects when exam series changes
  useEffect(() => {
    const fetchSubjectsByExamSeries = async () => {
      if (selectedSeries) {
        const result = await getExamSubjectsByExamSeries(selectedSeries);
        if (result.success && result.data) {
          setFilteredSubjects(result.data);

          if (result.data.length > 0) {
            setSubjectID(result.data[0].examsubjid);
          } else {
            setSubjectID("");
          }
        } else {
          setFilteredSubjects([]);
          setSubjectID("");
        }
      } else {
        setFilteredSubjects([]);
        setSubjectID("");
      }
    };

    fetchSubjectsByExamSeries();
  }, [selectedSeries]);

  // Fetch grades when subject changes
  useEffect(() => {
    const fetchGradesBySubject = async () => {
      if (subjectID) {
        const result = await getSubjectGradesBySubjectId(subjectID, subjectID);
        if (result.success) {
          setFilteredGrades(result.data);
        } else {
          setFilteredGrades([]);
        }
      } else {
        setFilteredGrades([]);
      }
    };

    fetchGradesBySubject();
  }, [subjectID]);

  const handleSeriesChange = (e) => {
    const newSeriesId = e.target.value;
    setSelectedSeries(newSeriesId);

    if (!preferredStudentId) {
      setSelectedStudent("");
    }
    setSubjectID("");
    setMark("");
    setRetake(false);
    setSelectedGrade({});
    setFilteredStudents([]);
    setFilteredSubjects([]);
    setFilteredGrades([]);
  };

  const handleSubjectChange = (e) => {
    const newSubjectId = e.target.value;
    setSubjectID(newSubjectId);

    setMark("");
    setRetake(false);
    setSelectedGrade({});
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      setMark("");
      setSelectedGrade({});
      return;
    }

    let mark = parseFloat(inputValue);

    // Validate range
    if (isNaN(mark)) {
      return;
    }

    if (mark < 0) {
      mark = 0;
    } else if (mark > 100) {
      mark = 100;
    }

    setMark(mark);

    // Calculate grade
    const calculationMark = retake ? Math.min(mark, 50) : mark;
    const foundGrade = findGradeByMark(calculationMark, filteredGrades);
    setSelectedGrade(foundGrade);
  };

  const handleRetakeChange = (e) => {
    const newRetake = e.target.checked;
    setRetake(newRetake);

    // Recalculate grade based on new retake status
    if (mark !== "" && !isNaN(mark) && mark >= 0) {
      const calculationMark = newRetake ? Math.min(mark, 50) : mark;
      const foundGrade = findGradeByMark(calculationMark, filteredGrades);
      setSelectedGrade(foundGrade);
    }
  };

  // Form validation
  const isFormValid = useMemo(() => {
    return (
      selectedSeries &&
      selectedSeries !== "" &&
      subjectID &&
      subjectID !== "" &&
      selectedStudent &&
      selectedStudent !== "" &&
      mark !== "" &&
      !isNaN(mark) &&
      mark >= 0 &&
      mark <= 100 &&
      selectedGrade &&
      Object.keys(selectedGrade).length > 0
    );
  }, [selectedSeries, subjectID, selectedStudent, mark, selectedGrade]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const examResultData = {
      examseriesid: selectedSeries,
      examsubjid: subjectID,
      studentid: selectedStudent,
      marks: parseFloat(mark),
      subjgpa: selectedGrade.subjgpa,
      subjgrade: selectedGrade.subjgrade,
      subjresults: selectedGrade.subjresult,
      retake: retake ? 1 : 0,
    };

    const result = await submitForm(createExamResult, examResultData, {
      successMessage: "Exam grade added successfully",
      errorMessage: "Failed to add exam grade",
      onSuccess: () => {
        onGradeAdded && onGradeAdded();
        setOpen(false);
      },
    });
  };

  const studentOptions = (() => {
    if (preferredStudentId) {
      const preferredStudent = {
        studentid: preferredStudentId,
        studentname:
          selectedStudentData?.studentname || `Student ${preferredStudentId}`,
      };

      const isInFilteredList = filteredStudents.find(
        (s) => String(s.studentid) === String(preferredStudentId)
      );

      if (isInFilteredList) {
        return filteredStudents.map((student) => ({
          value: String(student.studentid),
          label: student.studentname,
        }));
      } else {
        return [
          {
            value: String(preferredStudent.studentid),
            label: preferredStudent.studentname,
          },
          ...filteredStudents.map((student) => ({
            value: String(student.studentid),
            label: student.studentname,
          })),
        ];
      }
    }

    return filteredStudents.map((student) => ({
      value: String(student.studentid),
      label: student.studentname,
    }));
  })();

  const subjectOptions = filteredSubjects.map((sub) => ({
    value: sub.examsubjid,
    label: `(${sub.subjcode}) ${sub.subjdesc}`,
  }));

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title='Add Exam Grades'
      size='md'>
      <Form
        onSubmit={handleSubmit}
        onCancel={() => setOpen(false)}
        isSubmitting={isSubmitting}
        submitText='Submit Grade'
        cancelText='Cancel'
        submitDisabled={!isFormValid || isSubmitting}>
        {/* Exam Series */}
        <FormField label='Exam Series' required>
          <SearchableDropdown
            id='examSeries'
            name='examSeries'
            options={examSeriesOptions}
            value={selectedSeries}
            onChange={handleSeriesChange}
            placeholder='Select exam series...'
            required={true}
          />
        </FormField>

        {/* Subject */}
        <FormField label='Subject' required>
          <SearchableDropdown
            id='subject'
            name='subject'
            options={subjectOptions}
            value={subjectID}
            onChange={handleSubjectChange}
            placeholder='Select subject...'
            required={true}
          />
        </FormField>

        {/* Student */}
        <FormField label='Student' required>
          <SearchableDropdown
            id='student'
            name='student'
            options={studentOptions}
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            placeholder='Select student...'
            required={true}
            disabled={!!preferredStudentId}
          />
        </FormField>

        {/* Marks Input */}
        <FormField label='Marks' required>
          <Input
            id='mark'
            name='mark'
            type='number'
            value={mark}
            onChange={handleInputChange}
            placeholder='Enter marks (0-100)'
            required={true}
            min={0}
            max={100}
            step='0.01'
          />
        </FormField>

        {/* Retake Checkbox */}
        <FormField label='Retake'>
          <Checkbox
            id='retake'
            name='retake'
            label='This is a retake exam'
            checked={retake}
            onChange={handleRetakeChange}
          />
          {retake && (
            <p className='mt-2 text-sm text-amber-600'>
              Note: For retake exams, grade calculation is capped at 50 marks
              regardless of actual score.
            </p>
          )}
        </FormField>

        {/* Grade Information Section */}
        {/* <GradeInformations
          grade={selectedGrade.subjgrade}
          gpa={selectedGrade.subjgpa}
          rank={selectedGrade.subjresult}
          title="Grade Information"
          isRetake={retake}
          actualMarks={mark !== "" ? parseFloat(mark) : 0}
          calculatedMarks={
            mark !== "" && !isNaN(mark)
              ? retake
                ? Math.min(parseFloat(mark), 50)
                : parseFloat(mark)
              : 0
          }
        /> */}
      </Form>
    </Modal>
  );
}

Add_exams_grades.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  onGradeAdded: PropTypes.func,
  studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedStudentData: PropTypes.shape({
    studentid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    studentname: PropTypes.string,
  }),
  selectedSeriesData: PropTypes.shape({
    examseriesid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    examseriesdescription: PropTypes.string,
  }),
  examSeriesOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};
