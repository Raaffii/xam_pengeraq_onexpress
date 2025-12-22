import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";

export default function Form({
  onSubmit,
  children,
  actions,
  isSubmitting = false,
  submitText = "Submit",
  cancelText = "Cancel",
  onCancel,
  showActions = true,
  actionsPosition = "right",
  className = "",
  ...props
}) {
  const actionsPositionClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between",
  };

  const defaultActions = (
    <>
      {onCancel && (
        <Button variant='secondary' onClick={onCancel} disabled={isSubmitting}>
          {cancelText}
        </Button>
      )}
      <Button
        type='submit'
        variant='primary'
        disabled={isSubmitting}
        loading={isSubmitting}>
        {isSubmitting ? "Submitting..." : submitText}
      </Button>
    </>
  );

  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`} {...props}>
      <div className='space-y-4'>{children}</div>

      {showActions && (
        <div
          className={`mt-6 flex space-x-3 ${actionsPositionClasses[actionsPosition]}`}>
          {actions || defaultActions}
        </div>
      )}
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  actions: PropTypes.node,
  isSubmitting: PropTypes.bool,
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  onCancel: PropTypes.func,
  className: PropTypes.string,
};
