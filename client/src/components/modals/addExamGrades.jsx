import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useStudentsExamSeries } from "@/hooks/useStudentsExamSeries";
import { useSubject } from "@/hooks/useSubject";
import { useSubjectGrade } from "@/hooks/useSubjectGrade";
import { useExamsResult } from "@/hooks/useExamResult";
import { useExamSubject } from "@/hooks/useExamSubj";

import {
  Modal,
  Form,
  FormField,
  Input,
  SearchableDropdown,
} from "@/components/custom";

export default function AddExamsGrades({
  open,
  setOpen,
  fetchExamsResult,
  student,
}) {
  const { fetchStudentExamSeriesById, studentsExamSeries } =
    useStudentsExamSeries();
  const { fetchSubjectByExamSeriesId, subject } = useSubject();
  const { postExamResult } = useExamsResult();
  const { fetchSubjectGradeByExamSubjectId, subjectGrade } = useSubjectGrade();
  const { fetchSubjects, examSubj } = useExamSubject();

  useEffect(() => {
    const fetch = async () => {
      if (student.studentId) {
        await fetchStudentExamSeriesById(student.studentId);
      }
    };

    fetch();
  }, [student.studentId, fetchStudentExamSeriesById]);

  const [formData, setFormData] = useState({
    studentId: student.studentId,
    examSeriesId: "",
    examSubjId: "",
    retake: 0,
    marks: "",
    subjGpa: "",
    subjGrade: "",
    subjResults: "",
  });

  const optionsExamSeries = studentsExamSeries.map((item) => ({
    value: item.examSeriesId,
    label: item.examSeriesDescription,
  }));

  const optionsSubject = examSubj?.map((item) => ({
    value: item.subjId,
    label: item.subjDesc,
  }));

  const manageMarks = async (retake, marks) => {
    if (!retake) {
      for (const item of subjectGrade.grades) {
        const min = Number(item.subjMin);
        const max = Number(item.subjMax);

        if (min <= marks && marks <= max) {
          setFormData((prev) => ({
            ...prev,
            subjGrade: item.subjGrade,
            subjGpa: item.subjGpa,
            subjResults: item.subjResult,
          }));
          break;
        }
      }
    } else {
      if (marks >= 50) {
        setFormData((prev) => ({
          ...prev,
          subjGrade: "C",
          subjResults: "MEMUASKAN",
          subjGpa: "2.0",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          subjGrade: "F",
          subjResults: "GAGAL",
          subjGpa: "0.0",
        }));
      }
    }
  };

  const handleRetake = async () => {
    const newRetake = formData.retake === 1 ? 0 : 1;

    setFormData((prev) => ({
      ...prev,
      retake: newRetake,
    }));

    await manageMarks(newRetake, formData.marks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postExamResult(formData);
    await fetchExamsResult({ studentId: student.studentId });
    setOpen(false);
  };

  const handlechange = async (e) => {
    const { name, value } = e.target;

    const parsedValue =
      name === "marks" && value !== "" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    if (name == "examSeriesId") {
      await fetchSubjects({ bySeries: value });
    } else if (name == "examSubjId") {
      await fetchSubjectGradeByExamSubjectId(value);
    } else if (name == "marks") {
      await manageMarks(formData.retake, value);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title='Add Exam Grades'
      size='xl'>
      <Form
        cancelText='Cancel'
        onCancel={() => setOpen(false)}
        onSubmit={handleSubmit}>
        <div className='space-y-6'>
          {/* Dropdown Section */}
          <div className='grid grid-cols-2 gap-4'>
            <FormField label='Exam Series' required>
              <SearchableDropdown
                id='examSeries'
                name='examSeriesId'
                options={optionsExamSeries}
                value={formData.examSeriesId}
                placeholder='Select exam series...'
                onChange={handlechange}
              />
            </FormField>

            <FormField label='Subject' required>
              <SearchableDropdown
                id='subject'
                name='examSubjId'
                options={optionsSubject}
                value={formData.examSubjId}
                placeholder={
                  formData.examSeriesId
                    ? "Select subject..."
                    : "Select Exam Series First"
                }
                onChange={handlechange}
                disabled={!formData.examSeriesId}
              />
            </FormField>
          </div>

          {/* Student Info */}
          <FormField label='Student'>
            <Input
              type='text'
              value={student.studentName}
              disabled
              className='bg-gray-100 text-gray-600'
            />
          </FormField>

          {/* Marks Input */}
          <FormField label='Marks' required>
            <Input
              type='number'
              name='marks'
              placeholder='Enter marks (0 - 100)'
              className='text-lg font-semibold'
              onChange={handlechange}
              max={100}
              min={0}
              disabled={!formData.examSubjId}
            />
          </FormField>

          <FormField label='Retake'>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={formData.retake}
                onChange={handleRetake}
                className='w-4 h-4'
                disabled={!formData.marks}
              />
              <span className='text-sm'>Retake</span>
            </label>
          </FormField>

          {/* Result Summary */}
          <div className='grid grid-cols-3 gap-4'>
            <div className='rounded-lg border-2 bg-primaryblue/10 p-4 text-center border-primaryblue'>
              <p className='text-sm text-gray-500'>Grade</p>
              <p className='text-3xl font-bold text-primaryblue'>
                {formData?.subjGrade || "-"}
              </p>
            </div>

            <div className='rounded-lg border-2 p-4 text-center'>
              <p className='text-sm text-gray-500'>GPA</p>
              {formData?.subjGpa || "-"}
            </div>

            <div className='rounded-lg border-2 p-4 text-center'>
              <p className='text-sm text-gray-500'>Rank</p>
              {formData?.subjResults || "-"}
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
}

AddExamsGrades.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  fetchExamsResult: PropTypes.func.isRequired,
  student: PropTypes.shape({
    studentId: PropTypes.number.isRequired,
    studentName: PropTypes.string.isRequired,
  }).isRequired,
};
