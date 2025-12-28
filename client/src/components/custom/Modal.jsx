import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  className = "",
}) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className={`w-full ${sizeClasses[size]} max-h-[90vh] overflow-y px-6 sm:px-8 pt-6 pb-6 ${className}`}>
        {title && (
          <DialogHeader>
            <DialogTitle
              className={`text-lg font-semibold leading-6 text-gray-900 ${
                showCloseButton ? "pr-8" : ""
              }`}>
              {title}
            </DialogTitle>

            <DialogDescription className='sr-only'>
              Dialog form
            </DialogDescription>
          </DialogHeader>
        )}

        <div className='w-full'>{children}</div>
      </DialogContent>
    </Dialog>
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf([
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "4xl",
    "5xl",
    "6xl",
    "7xl",
    "full",
  ]),
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
};
