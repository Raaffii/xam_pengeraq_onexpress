import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import {
  Modal,
  Form,
  FormField,
  Input,
  TextareaInput,
  SearchableDropdown,
  Checkbox,
} from "@/components/custom";

export default function Add_exams_grades({
  open,
  setOpen,
  onGradeAdded,
  studentId = null,
  selectedStudentData = {},
  selectedSeriesData = {},
  examSeriesOptions = [],
}) {
  const optionsExamSeries = [
    { value: 3, label: "batch 3" },
    { value: 2, label: "batch 2" },
  ];

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title='Add Exam Grades'
      size='xl'>
      <Form cancelText='Cancel' onCancel={() => setOpen(false)}>
        <div className='space-y-6'>
          {/* Dropdown Section */}
          <div className='grid grid-cols-2 gap-4'>
            <FormField label='Exam Series' required>
              <SearchableDropdown
                id='examSeries'
                name='examSeries'
                options={optionsExamSeries}
                value={2}
                placeholder='Select exam series...'
              />
            </FormField>

            <FormField label='Subject' required>
              <SearchableDropdown
                id='subject'
                name='subject'
                options={optionsExamSeries}
                value={2}
                placeholder='Select subject...'
              />
            </FormField>
          </div>

          {/* Student Info */}
          <FormField label='Student'>
            <Input
              type='text'
              value='Student name here'
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
            />
          </FormField>

          {/* Result Summary */}
          <div className='grid grid-cols-3 gap-4'>
            <div className='rounded-lg border-2 bg-primaryblue/10 p-4 text-center border-primaryblue'>
              <p className='text-sm text-gray-500'>Grade</p>
              <p className='text-3xl font-bold text-primaryblue'>A</p>
            </div>

            <div className='rounded-lg border-2 p-4 text-center'>
              <p className='text-sm text-gray-500'>GPA</p>
              <p className='text-3xl font-semibold'>4.0</p>
            </div>

            <div className='rounded-lg border-2 p-4 text-center'>
              <p className='text-sm text-gray-500'>Rank</p>
              <p className='text-xl font-semibold '>Sempurna</p>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
}

// Add_exams_grades.propTypes = {
//   open: PropTypes.bool.isRequired,
//   setOpen: PropTypes.func.isRequired,
//   onGradeAdded: PropTypes.func,
//   studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   selectedStudentData: PropTypes.shape({
//     studentid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     studentname: PropTypes.string,
//   }),
//   selectedSeriesData: PropTypes.shape({
//     examseriesid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     examseriesdescription: PropTypes.string,
//   }),
//   examSeriesOptions: PropTypes.arrayOf(
//     PropTypes.shape({
//       value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
//         .isRequired,
//       label: PropTypes.string.isRequired,
//     })
//   ),
// };
