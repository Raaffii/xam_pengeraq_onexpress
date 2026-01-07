import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useStudentsExamSeries } from "@/hooks/useStudentsExamSeries";

import { useSubjectGrade } from "@/hooks/useSubjectGrade";
import { useExamsResult } from "@/hooks/useExamResult";
import { Modal, Form, FormField, Input } from "@/components/custom";

export default function EditExamsGrades({
  open,
  setOpen,
  fetchExamsResult,
  student,
  selectedEdit,
}) {
  const { fetchStudentExamSeriesById } = useStudentsExamSeries();

  const { putExamResult } = useExamsResult();
  const { fetchSubjectGradeByExamSubjectId, subjectGrade } = useSubjectGrade();

  useEffect(() => {
    const fetch = async () => {
      if (student.studentId) {
        await fetchStudentExamSeriesById(student.studentId);
        await fetchSubjectGradeByExamSubjectId(selectedEdit.examSubjId);
      }
    };

    fetch();
  }, [
    student.studentId,
    selectedEdit.examSubjId,
    fetchStudentExamSeriesById,
    fetchSubjectGradeByExamSubjectId,
  ]);

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

  const [formData, setFormData] = useState({
    marks: Number(selectedEdit.marks),
    subjGpa: selectedEdit.subjGpa,
    subjGrade: selectedEdit.subjGrade,
    subjResults: selectedEdit.subjResults,
    retake: selectedEdit.retake == "Yes" ? 1 : 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await putExamResult(selectedEdit.examResultsId, formData);
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
    await manageMarks(formData.retake, value);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title='Edit Exam Grades'
      size='xl'>
      <Form
        cancelText='Cancel'
        onCancel={() => setOpen(false)}
        onSubmit={handleSubmit}>
        <div className='space-y-6'>
          {/* Dropdown Section */}
          <div className='grid grid-cols-2 gap-4'>
            <FormField label='Exam Series' required>
              <Input value={selectedEdit.examSeriesDescription} disabled />
            </FormField>

            <FormField label='Subject' required>
              <Input value={selectedEdit.subjDesc} disabled />
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
              value={formData.marks}
              max={100}
              min={0}
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

EditExamsGrades.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  fetchExamsResult: PropTypes.func.isRequired,
  fetchStudentExamSeriesById: PropTypes.func.isRequired,
  fetchSubjectGradeByExamSubjectId: PropTypes.func.isRequired,
  student: PropTypes.shape({
    studentId: PropTypes.number.isRequired,
    studentName: PropTypes.string.isRequired,
  }).isRequired,
  selectedEdit: PropTypes.shape({
    examSubjId: PropTypes.number.isRequired,
    examResultsId: PropTypes.number.isRequired,
    marks: PropTypes.number.isRequired,
    subjGpa: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    subjGrade: PropTypes.string.isRequired,
    subjResults: PropTypes.string.isRequired,
    examSeriesDescription: PropTypes.string.isRequired,
    subjDesc: PropTypes.string.isRequired,
    retake: PropTypes.string.isRequired,
  }).isRequired,
};
