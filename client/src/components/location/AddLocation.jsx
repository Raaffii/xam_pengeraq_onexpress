import { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Form, FormField, Input } from "@/components/custom";

import { useLocation } from "@/hooks/useLocation";

export default function AddLocation({ open, setOpen, fetchLocation }) {
  const [formData, setFormData] = useState({
    locationName: "",
  });

  const { createLocation, isSubmitting } = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { ...formData };

    const result = await createLocation(data);
    if (result.success) {
      await fetchLocation();
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

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      title={<div className='flex items-center'>Add Location</div>}
      size='xl'>
      <Form
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitText='Submit'
        cancelText='Cancel'
        onCancel={() => setOpen(false)}>
        {" "}
        <div className='gap-3'>
          <FormField label='Location Name'>
            <Input
              type='text'
              className='bg-gray-100 text-gray-600'
              placeholder='location name'
              name='locationName'
              onChange={handleInputChange}
              value={formData?.locationName}
            />
          </FormField>
        </div>
      </Form>
    </Modal>
  );
}

AddLocation.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  fetchLocation: PropTypes.func.isRequired,
};
