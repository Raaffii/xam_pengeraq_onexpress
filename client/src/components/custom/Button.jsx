import React from "react";
import PropTypes from "prop-types";

import { RotateCcw } from "lucide-react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  ...props
}) {
  const baseClasses =
    "inline-flex justify-center items-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-blue-600 text-white border border-transparent hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 shadow-sm hover:shadow-md",
    danger:
      "bg-red-600 text-white border border-transparent hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md",
    success:
      "bg-green-600 text-white border border-transparent hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md",
    outline:
      "bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    ghost:
      "bg-transparent text-gray-600 border border-transparent hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizeClasses = {
    xs: "px-2 py-1 text-xs rounded-md",
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-md",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-lg",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={combinedClasses}
      {...props}>
      {loading && <RotateCcw className='animate-spin -ml-1 mr-2 h-4 w-4' />}
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "success",
    "warning",
    "ghost",
    "info",
  ]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};
