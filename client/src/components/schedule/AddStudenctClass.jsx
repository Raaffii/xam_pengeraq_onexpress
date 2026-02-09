import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Form,
  FormField,
  Input,
  SearchableDropdown,
  Checkbox,
} from "@/components/custom";

import { useExamSeries } from "@/hooks/useExamsSeries";
import { useSubject } from "@/hooks/useSubject";
import { useTeacher } from "@/hooks/useTeacher";
import { useClassLocation } from "@/hooks/useClassLocation";
import { useClassSchedule } from "@/hooks/useClassSchedule";

export default function AddStudentClass({ open, setOpen, fetchClassSchedule }) {
  const [formData, setFormData] = useState({
    teacherId: "",
    examSeriesId: "",
    examSubjId: "",
    locationId: "",
    startDateTime: "",
    endDateTime: "",
    repeatValue: "",
    repeatFreq: 1,
  });

  const { fetchExamSeries, examSeries } = useExamSeries();
  const { fetchSubjectByExamSeriesId, subject } = useSubject();
  const { fetchTeacher, teacher } = useTeacher();
  const { fetchClassLocation, classLocation } = useClassLocation();
  const { postClassSchedule, isSubmitting } = useClassSchedule();
  const [repeatCheck, setRepeatCheck] = useState();

  const hasFetchedData = useRef(false);
  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    const fetchData = async () => {
      await fetchExamSeries();
      await fetchTeacher();
      await fetchClassLocation();
    };

    fetchData();
  }, [fetchExamSeries, fetchTeacher, fetchClassLocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = {
      teacherId: formData.teacherId,
      examSeriesId: formData.examSeriesId,
      examSubjId: formData.examSubjId,
      locationId: formData.locationId,
      startDateTime: formData.startDateTime,
      endDateTime: formData.endDateTime || null,
      repeatValue: formData.repeatValue || null,
      repeatFreq: repeatCheck ? 1 : 0,
    };

    const result = await postClassSchedule(dataToSubmit);
    if (result.success) {
      fetchClassSchedule({ page: 1 });
    }
    setOpen(false);
    return result.success;
  };

  const optionsExamSeries = examSeries?.map((item) => ({
    value: item.examSeriesId,
    label: item.examSeriesDescription,
  }));

  const optionsExamSubject = subject?.map((item) => ({
    value: item.examSubjId,
    label: item.subjDesc,
  }));

  const optionsTeacher = teacher?.map((item) => ({
    value: item.teacherId,
    label: item.teacherName,
  }));

  const optionsLocation = classLocation?.map((item) => ({
    value: item.classLocationId,
    label: item.locationName,
  }));

  const optionsRepeat = [
    {
      value: "daily",
      label: "Daily",
    },
    {
      value: "weekly",
      label: "Weekly",
    },
    {
      value: "monthly",
      label: "Monthly",
    },
  ];

  const handlechange = async (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name == "examSeriesId") {
      await fetchSubjectByExamSeriesId(value);
    }
  };

  console.log("cekce", formData);
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      title={<div className='flex items-center'>Add Schedule</div>}
      size='xl'>
      <Form
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitText='Submit'
        cancelText='Cancel'
        onCancel={() => setOpen(false)}>
        {" "}
        <div className='flex w-full gap-2'>
          <FormField label='Teacher' required className='w-full'>
            <SearchableDropdown
              id='teacherId'
              name='teacherId'
              options={optionsTeacher}
              value={formData.teacherId}
              placeholder='Select Teacher...'
              onChange={handlechange}
            />
          </FormField>
          <FormField label='Exam Series' required className='w-full'>
            <SearchableDropdown
              id='examSeries'
              name='examSeriesId'
              options={optionsExamSeries}
              value={formData.examSeriesId}
              placeholder='Select exam series...'
              onChange={handlechange}
            />
          </FormField>
        </div>
        <div className='flex w-full gap-2'>
          <FormField label='Subject' required className='w-full'>
            <SearchableDropdown
              id='examSeries'
              name='examSubjId'
              options={optionsExamSubject}
              value={formData.examSubjId}
              placeholder={
                formData.examSeriesId
                  ? "Select Subject..."
                  : "Select Exam Series First"
              }
              onChange={handlechange}
              disabled={formData.examSeriesId ? false : true}
            />
          </FormField>
          <FormField label='Location' required className='w-full'>
            <SearchableDropdown
              id='locationId'
              name='locationId'
              options={optionsLocation}
              value={formData.locationId}
              placeholder='Select classLocation...'
              onChange={handlechange}
            />
          </FormField>
        </div>
        <FormField label={`${repeatCheck ? "Starting Schedule" : "Schedule"}`}>
          <Input
            type='datetime-local'
            className='bg-gray-100 text-gray-600'
            placeholder='student id'
            name='startDateTime'
            onChange={handlechange}
          />
        </FormField>
        <FormField label='Repeat' required>
          <div className='flex items-start gap-3 rounded-lg border border-gray-200 p-1'>
            <Checkbox
              className='mt-1'
              name='repeatFreq'
              onChange={() => setRepeatCheck((prev) => !prev)}
              checked={repeatCheck}
            />
            <div className='space-y-1'>
              <p className='text-sm font-semibold text-gray-900'>
                Repeat Schedule (Optional)
              </p>
              <p className='text-xs text-gray-500 leading-relaxed'>
                Check this option if you want to create a recurring schedule,
                such as daily, weekly, or monthly.
              </p>
            </div>
          </div>
        </FormField>
        {repeatCheck && (
          <div className='flex w-full gap-2 items-end'>
            <FormField label='Repeat' required className='w-full'>
              <SearchableDropdown
                id='examSeries'
                name='repeatValue'
                options={optionsRepeat}
                value={formData.repeatValue}
                placeholder='Select repeat...'
                onChange={handlechange}
              />
            </FormField>

            <FormField label='End Date' required className='w-full'>
              <Input
                type='datetime-local'
                name='endDateTime'
                onChange={handlechange}
              />
            </FormField>
          </div>
        )}
      </Form>
    </Modal>
  );
}

AddStudentClass.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      type: PropTypes.string,
      required: PropTypes.bool,
      maxLength: PropTypes.number,
      rows: PropTypes.number,
      resize: PropTypes.oneOf(["none", "vertical", "horizontal", "both"]),
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
      ]),
    }),
  ).isRequired,
  dropdowns: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        label: PropTypes.string.isRequired,
      }),
    ),
  ),
  title: PropTypes.string,
  validateForm: PropTypes.func,
  fetchClassSchedule: PropTypes.func,
};
