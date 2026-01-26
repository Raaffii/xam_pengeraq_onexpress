import { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Form, FormField, Input } from "@/components/custom";
import { useTeacher } from "@/hooks/useTeacher";
import toast from "react-hot-toast";
import { useLocation } from "@/hooks/useLocation";

export default function EditLocation({
  open,
  setOpen,
  fetchLocation,
  selectedLocation,
}) {
  const [formData, setFormData] = useState({
    locationName: selectedLocation?.locationName,
  });

  const { updateLocation, isSubmitting } = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await updateLocation(
      formData,
      selectedLocation?.classLocationId,
    );
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
      title={<div className='flex items-center'>Edit Teacher</div>}
      size='lg'>
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

EditLocation.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  fetchTeacher: PropTypes.func.isRequired,
  selectedLocation: PropTypes.object,
};
