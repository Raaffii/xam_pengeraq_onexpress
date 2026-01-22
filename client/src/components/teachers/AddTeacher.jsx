import { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Form, FormField, Input } from "@/components/custom";
import { useTeacher } from "@/hooks/useTeacher";
import toast from "react-hot-toast";

export default function AddTeacher({ open, setOpen, fetchTeacher }) {
  const [formData, setFormData] = useState({
    teacherName: "",
    teacherEmail: "",
    password: "",
    confirmPassword: "",
    userName: "",
  });
  const [addAccount, setAddAccount] = useState(false);
  const { createTeacher, isSubmitting } = useTeacher();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { ...formData, addAccount: addAccount };

    if (formData.confirmPassword !== formData.password) {
      toast.error("Password do not match");
      return;
    } else if (formData.password.length < 8) {
      toast.error("Password Minimum 8 characters");
      return;
    }

    const result = await createTeacher(data);
    if (result.success) {
      await fetchTeacher();
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
      title={<div className='flex items-center'>Add Teacher</div>}
      size='xl'>
      <Form
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitText='Submit'
        cancelText='Cancel'
        onCancel={() => setOpen(false)}>
        {" "}
        <div className='grid-cols-2 grid gap-3'>
          <FormField label='Teacher Name'>
            <Input
              type='text'
              className='bg-gray-100 text-gray-600'
              placeholder='teacher name'
              name='teacherName'
              onChange={handleInputChange}
            />
          </FormField>
          <FormField label='Teacher Email'>
            <Input
              type='text'
              className='bg-gray-100 text-gray-600'
              placeholder='teacher email'
              name='teacherEmail'
              onChange={handleInputChange}
            />
          </FormField>
        </div>
        <label className='flex items-center gap-3 cursor-pointer select-none'>
          <input
            type='checkbox'
            checked={addAccount}
            onChange={(e) => setAddAccount(e.target.checked)}
            className='w-4 h-4 accent-blue-600'
          />

          <div>
            <p className='font-medium text-gray-800'>
              Create login account for this teacher
            </p>
            <p className='text-sm text-gray-500'>
              Teacher will be able to access the system using email and password
            </p>
          </div>
        </label>
        {addAccount && (
          <>
            <FormField label='Username'>
              <Input
                type='text'
                className='bg-gray-100 text-gray-600'
                placeholder='username'
                name='userName'
                onChange={handleInputChange}
              />
            </FormField>
            <div className='grid-cols-2 grid gap-3 mt-3'>
              <FormField label='Password'>
                <Input
                  type='text'
                  className='bg-gray-100 text-gray-600'
                  placeholder='Password'
                  name='password'
                  onChange={handleInputChange}
                />
              </FormField>

              <FormField label='Confirm Password'>
                <Input
                  type='text'
                  className='bg-gray-100 text-gray-600'
                  placeholder='Confirm Password'
                  name='confirmPassword'
                  onChange={handleInputChange}
                />
              </FormField>
            </div>
          </>
        )}
      </Form>
    </Modal>
  );
}

AddTeacher.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  fetchTeacher: PropTypes.func.isRequired,
  selectedTeacher: PropTypes.object,
};
