import { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Form, Button } from "@/components/custom";

export default function Delete_modal({
  open,
  setOpen,
  onSubmit,
  entityData,
  title = "Delete Data",
  confirmationText,
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await onSubmit(entityData);

      if (success) {
        setOpen(false);
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title={<div className="flex items-center">{title}</div>}
      size="md"
    >
      <div className="mb-6">
        <p className="text-sm text-gray-700">
          {confirmationText ||
            "Are you sure you want to delete this item? This action cannot be undone."}
        </p>
      </div>

      <Form
        children={false}
        onSubmit={handleSubmit}
        isSubmitting={loading}
        submitText="Delete"
        cancelText="Cancel"
        onCancel={() => setOpen(false)}
        actions={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              disabled={loading}
              loading={loading}
            >
              Delete
            </Button>
          </>
        }
      ></Form>
    </Modal>
  );
}

Delete_modal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  entityData: PropTypes.object.isRequired,
  title: PropTypes.string,
  confirmationText: PropTypes.string,
};
