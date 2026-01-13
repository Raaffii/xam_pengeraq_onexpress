import { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Form,
  FormField,
  Input,
  SearchableDropdown,
} from "@/components/custom";
import { useStudents } from "@/hooks/useStudents";

export default function AddStudent({
  open,
  setOpen,
  fetchStudents,
  seriesOptions,
}) {
  const [formData, setFormData] = useState({
    studentIdNo: "",
    studentName: "",
    examSeries: [],
  });

  const { createStudents, isSubmitting } = useStudents();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createStudents(formData);
    if (result.success) {
      fetchStudents({ page: 1 });
    }
    setOpen(false);
    return result.success;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addExamSeries = () => {
    setFormData((prev) => ({
      ...prev,
      examSeries: [...prev.examSeries, ""],
    }));
  };

  const removeExamSeries = (index) => {
    setFormData((prev) => ({
      ...prev,
      examSeries: prev.examSeries.filter((_, i) => i !== index),
    }));
  };

  const handleExamSeriesChange = (index, input) => {
    const value = input?.target ? input.target.value : input;

    setFormData((prev) => {
      const updated = [...prev.examSeries];
      updated[index] = value;

      return {
        ...prev,
        examSeries: updated,
      };
    });
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      title={<div className="flex items-center">Add Student</div>}
      size="lg"
    >
      <Form
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitText="Submit"
        cancelText="Cancel"
        onCancel={() => setOpen(false)}
      >
        {" "}
        <FormField label="Student">
          <Input
            type="text"
            className="bg-gray-100 text-gray-600"
            placeholder="student id"
            name="studentIdNo"
            onChange={handleInputChange}
          />
        </FormField>
        <FormField label="Student">
          <Input
            type="text"
            className="bg-gray-100 text-gray-600"
            placeholder="student name"
            name="studentName"
            onChange={handleInputChange}
          />
        </FormField>
        <FormField label="Exam Series">
          {formData.examSeries.map((value, index) => (
            <div key={index} className="grid grid-cols-10 gap-2">
              <SearchableDropdown
                id={`examseries-${index}`}
                options={seriesOptions}
                value={value}
                placeholder="Select exam series"
                onChange={(val) => handleExamSeriesChange(index, val)}
                className="col-span-9"
              />

              {formData.examSeries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExamSeries(index)}
                  className="px-3 border rounded text-red-600 col-span-1"
                >
                  -
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addExamSeries}
            className="px-3 py-1 border rounded text-blue-600"
          >
            + Add Exam Series
          </button>
        </FormField>
      </Form>
    </Modal>
  );
}

AddStudent.propTypes = {
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
  fetchStudents: PropTypes.func,
};
