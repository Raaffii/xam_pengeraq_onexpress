import { useState, useEffect } from "react";
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

export default function Add_exam_series({
  open,
  setOpen,
  onSubmit,
  fields,
  dropdowns,
  title = "Add New Data",
  validateForm,
  optionalDropDown = true,
}) {
  const initialFormData = fields.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]: field.value !== undefined ? field.value : "",
    }),
    {}
  );

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [optionalCheck, setOptionalCheck] = useState(false);

  useEffect(() => {
    if (open) {
      const updatedFormData = { ...initialFormData };
      fields.forEach((field) => {
        if (field.value !== undefined) {
          updatedFormData[field.name] = field.value;
        } else if (
          dropdowns &&
          dropdowns[field.name] &&
          dropdowns[field.name].length > 0
        ) {
          updatedFormData[field.name] = dropdowns[field.name][0].value;
        }
      });

      setFormData((prevData) => {
        const isEmpty = Object.values(prevData).every(
          (value) => value === "" || value === null || value === undefined
        );
        return isEmpty ? updatedFormData : prevData;
      });
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm && !validateForm(formData)) {
      return;
    }

    setLoading(true);

    try {
      const processedFormData = { ...formData };
      fields.forEach((field) => {
        if (field.type === "number" && processedFormData[field.name] !== "") {
          processedFormData[field.name] = Number(processedFormData[field.name]);
        }
      });

      const success = await onSubmit(processedFormData);

      if (success) {
        setOpen(false);
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
        setFormData(initialFormData);
      }}
      title={<div className='flex items-center'>{title}</div>}
      size='lg'>
      <Form
        onSubmit={handleSubmit}
        isSubmitting={loading}
        submitText='Submit'
        cancelText='Cancel'
        onCancel={() => setOpen(false)}>
        {fields.map((field, index) => (
          <FormField key={index} label={field.label} required={true}>
            {dropdowns && dropdowns[field.name] && field.type === "dropdown" ? (
              <SearchableDropdown
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={(e) =>
                  handleInputChange({
                    target: { name: field.name, value: e.target.value },
                  })
                }
                options={dropdowns[field.name]}
                required={true}
                placeholder={`Select ${field.label}`}
              />
            ) : field.type === "textarea" ? (
              <TextareaInput
                name={field.name}
                id={field.name}
                required={field.required || false}
                value={formData[field.name]}
                onChange={handleInputChange}
                placeholder={`Enter ${field.label}`}
                maxLength={field.maxLength || 500}
                rows={field.rows || 4}
                resize={field.resize || "vertical"}
              />
            ) : field.type === "optionalSelection" && optionalDropDown ? (
              <>
                <div className='space-y-3'>
                  <div className='flex items-start gap-3'>
                    <Checkbox
                      checked={optionalCheck}
                      onChange={() => setOptionalCheck((p) => !p)}
                      disabled={optionalDropDown ? false : true}
                    />

                    <div>
                      <p className='text-sm font-medium text-gray-900'>
                        Import Subject from Existing Exam Series{" "}
                      </p>
                      <p className='text-xs text-gray-500'>
                        Showing exam series from Mock Examination 25/02 only
                      </p>
                    </div>
                  </div>

                  {optionalCheck && (
                    <div className='pl-7'>
                      <SearchableDropdown
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={(e) =>
                          handleInputChange({
                            target: { name: field.name, value: e.target.value },
                          })
                        }
                        options={dropdowns[field.name]}
                        required
                        placeholder={`Select ${field.label}`}
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Input
                type={field.type}
                name={field.name}
                id={field.name}
                required={true}
                value={formData[field.name]}
                onChange={handleInputChange}
                placeholder={`Enter ${field.label}`}
                maxLength={field.maxLength || 255}
              />
            )}
          </FormField>
        ))}
      </Form>
    </Modal>
  );
}

Add_exam_series.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  optionalDropDown: PropTypes.bool,
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
    })
  ).isRequired,
  dropdowns: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        label: PropTypes.string.isRequired,
      })
    )
  ),
  title: PropTypes.string,
  validateForm: PropTypes.func,
};
