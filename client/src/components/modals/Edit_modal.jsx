import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Form,
  FormField,
  Input,
  TextareaInput,
  SearchableDropdown,
} from "@/components/custom";

export default function Edit_modal({
  open,
  setOpen,
  onSubmit,
  fields,
  entityData,
  dropdowns,
  title = "Edit Data",
  validateForm,
}) {
  const initialFormData = fields.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]:
        field.value !== undefined ? field.value : entityData[field.name] || "",
    }),
    {}
  );
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

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
          updatedFormData[field.name] =
            entityData[field.name] || dropdowns[field.name][0].value;
        }

        if (field.type === "date") {
          updatedFormData[field.name] = entityData[field.name]
            ? new Date(entityData[field.name]).toISOString().split("T")[0]
            : "";
        }
      });

      setFormData(updatedFormData);
    }
  }, [open, fields, dropdowns, entityData]);

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
      onClose={() => setOpen(false)}
      title={<div className='flex items-center'>{title}</div>}
      size='lg'>
      <Form
        onSubmit={handleSubmit}
        isSubmitting={loading}
        submitText='Update'
        cancelText='Cancel'
        onCancel={() => setOpen(false)}>
        {fields.map((field, index) => (
          <FormField key={index} label={field.label} required={true}>
            {dropdowns && dropdowns[field.name] ? (
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

Edit_modal.propTypes = {
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
    })
  ).isRequired,
  entityData: PropTypes.object.isRequired,
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
