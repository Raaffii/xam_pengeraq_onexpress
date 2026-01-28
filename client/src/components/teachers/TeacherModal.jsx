import { User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { InputField } from "../common";
import { Button } from "../custom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useEffect, useMemo, useState } from "react";

export const TeacherModal = ({
  open = false,
  onOpenChange,
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  mode = "create",
}) => {
  const [formData, setFormData] = useState({
    teacherName: "",
    teacherEmail: "",
    addAccount: false,
    password: "",
    confirmPassword: "",
    ...initialValues,
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const hasChanges = useMemo(() => {
    if (mode === "create") return true;

    return (
      formData.teacherName !== originalData.teacherName ||
      formData.teacherEmail !== originalData.teacherEmail
    );
  }, [formData, originalData, mode]);

  useEffect(() => {
    const resetData = {
      teacherName: "",
      teacherEmail: "",
      addAccount: false,
      password: "",
      confirmPassword: "",
      ...initialValues,
    };

    setFormData(resetData);
    setOriginalData(resetData);
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [initialValues, open]);

  const getChangedData = () => {
    if (mode === "create") {
      const data = {
        teacherName: formData.teacherName,
        teacherEmail: formData.teacherEmail,
        addAccount: formData.addAccount,
      };

      if (formData.addAccount) {
        data.password = formData.password;
        data.confirmPassword = formData.confirmPassword;
      }

      return data;
    }

    // For edit mode, only return changed fields
    const changes = {};

    if (formData.teacherName !== originalData.teacherName) {
      changes.teacherName = formData.teacherName;
    }
    if (formData.teacherEmail !== originalData.teacherEmail) {
      changes.teacherEmail = formData.teacherEmail;
    }

    return changes;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue };

      if (name === "addAccount" && !checked) {
        updated.password = "";
        updated.confirmPassword = "";
      }

      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    if (name === "addAccount" && !checked) {
      setErrors((prev) => ({
        ...prev,
        password: null,
        confirmPassword: null,
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.teacherName.trim()) {
      newErrors.teacherName = "Teacher Name is required";
    }

    if (!formData.teacherEmail.trim()) {
      newErrors.teacherEmail = "Teacher Email is required";
    } else if (!validateEmail(formData.teacherEmail)) {
      newErrors.teacherEmail = "Please enter a valid email address";
    }

    if (mode === "create" && formData.addAccount) {
      if (!formData.password.trim()) {
        newErrors.password = "Password is required when creating an account";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSubmit = getChangedData();
    onSubmit(dataToSubmit);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-700">
            {mode === "create" ? "Add New Teacher" : "Edit Teacher"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" ?
              "Create a new teacher record"
            : "Update teacher information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Teacher Name */}
          <div className="relative">
            <InputField
              id="teacherName"
              name="teacherName"
              label="Teacher Name"
              value={formData.teacherName}
              onChange={handleChange}
              placeholder="Enter teacher name"
              isRequired
              error={errors.teacherName}
              onError={(error) =>
                setErrors((prev) => ({ ...prev, teacherName: error }))
              }
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
              maxLength={50}
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <User className="w-5 h-5" />
            </div>
          </div>

          {/* Teacher Email */}
          <div className="relative">
            <InputField
              id="teacherEmail"
              name="teacherEmail"
              label="Teacher Email"
              value={formData.teacherEmail}
              onChange={handleChange}
              placeholder="Enter teacher email"
              isRequired
              error={errors.teacherEmail}
              onError={(error) =>
                setErrors((prev) => ({ ...prev, teacherEmail: error }))
              }
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
              type="email"
              maxLength={50}
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <Mail className="w-5 h-5" />
            </div>
          </div>

          {/* Add Account Checkbox - Only in Create Mode */}
          {mode === "create" && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <input
                  type="checkbox"
                  id="addAccount"
                  name="addAccount"
                  checked={formData.addAccount}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label
                    htmlFor="addAccount"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-blue-600" />
                    Create Login Account
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Enable this to create a login account for this teacher with
                    a password
                  </p>
                </div>
              </div>

              {/* Password Fields - Only show when addAccount is checked */}
              {formData.addAccount && (
                <div className="space-y-4 pl-4 border-l-2 border-blue-300">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Password */}
                    <div className="relative">
                      <InputField
                        id="password"
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password (min 8 characters)"
                        isRequired
                        error={errors.password}
                        onError={(error) =>
                          setErrors((prev) => ({ ...prev, password: error }))
                        }
                        disabled={isSubmitting}
                        inputClassName="pl-10 pr-10 bg-gray-50"
                        maxLength={50}
                      />
                      <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
                        <Lock className="w-5 h-5" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-[46px] text-gray-400 hover:text-gray-600 focus:outline-none"
                        disabled={isSubmitting}
                        tabIndex={-1}
                      >
                        {showPassword ?
                          <EyeOff className="w-5 h-5" />
                        : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                      <InputField
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        isRequired
                        error={errors.confirmPassword}
                        onError={(error) =>
                          setErrors((prev) => ({
                            ...prev,
                            confirmPassword: error,
                          }))
                        }
                        disabled={isSubmitting}
                        inputClassName="pl-10 pr-10 bg-gray-50"
                        maxLength={50}
                      />
                      <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
                        <Lock className="w-5 h-5" />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-[46px] text-gray-400 hover:text-gray-600 focus:outline-none"
                        disabled={isSubmitting}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ?
                          <EyeOff className="w-5 h-5" />
                        : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === "edit" && !hasChanges && (
            <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
              No changes detected. Modify the form to enable submission.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                onOpenChange(false);
              }}
              disabled={isSubmitting}
              className="h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (mode === "edit" && !hasChanges)}
              className="h-10 bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ?
                mode === "create" ?
                  "Creating..."
                : "Updating..."
              : mode === "create" ?
                "Add Teacher"
              : "Update Teacher"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
