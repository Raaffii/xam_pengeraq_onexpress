import { InputField, InputRadio } from "@/components/common/CustomFields";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Lock, EyeOff, Eye, Mail, User } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useStudents } from "@/hooks/useStudents";

export const UserForm = ({
  open = false,
  onOpenChange,
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  mode = "create",
}) => {
  const { fetchStudents } = useStudents();

  const [formData, setFormData] = useState({
    userName: "",
    emailAddress: "",
    password: "",
    role: "",
    studentId: null,
    ...initialValues,
  });

  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [studentSearch, setStudentSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentSearch, setShowStudentSearch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Track if form has been modified
  const hasChanges = useMemo(() => {
    if (mode === "create") return true;

    // Compare studentId properly
    const studentIdChanged =
      (formData.studentId ?? null) !== (originalData.studentId ?? null);

    return (
      formData.userName !== originalData.userName ||
      formData.emailAddress !== originalData.emailAddress ||
      formData.role !== originalData.role ||
      studentIdChanged
    );
  }, [formData, originalData, mode]);

  // Get only the changed fields
  const getChangedData = () => {
    if (mode === "create") return formData;

    const changes = {};

    if (formData.userName !== originalData.userName) {
      changes.userName = formData.userName;
    }
    if (formData.emailAddress !== originalData.emailAddress) {
      changes.emailAddress = formData.emailAddress;
    }
    if (formData.role !== originalData.role) {
      changes.role = formData.role;
    }
    if (formData.studentId !== originalData.studentId) {
      changes.studentId = formData.studentId;
    }

    // Always include the user ID for edit mode
    if (initialValues.userId) {
      changes.userId = initialValues.userId;
    }

    return changes;
  };

  useEffect(() => {
    const resetData = {
      userName: "",
      emailAddress: "",
      password: "",
      role: "",
      studentId: null,
      ...initialValues,
    };

    setFormData(resetData);
    setOriginalData(resetData);

    if (initialValues.studentId && initialValues.studentName) {
      setSelectedStudent({
        studentId: initialValues.studentId,
        studentName: initialValues.studentName,
      });
    } else {
      setSelectedStudent(null);
    }

    setErrors({});
    setStudentSearch("");
    setSearchResults([]);
  }, [initialValues, open]);

  useEffect(() => {
    if (formData.studentId) {
      setShowStudentSearch(true);
      return;
    }

    setShowStudentSearch(formData.role === "student");

    if (formData.role !== "student") {
      setSelectedStudent(null);
      setSearchResults([]);
      setStudentSearch("");
    }
  }, [formData.role, formData.studentId]);

  useEffect(() => {
    if (!showStudentSearch || studentSearch.length < 3) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsSearching(true);
        setErrors((prev) => ({ ...prev, studentSearch: null }));

        const response = await fetchStudents({
          search: studentSearch,
          page: 1,
          pageSize: 5,
        });

        setSearchResults(response);
        if (response.length === 0) {
          setErrors((prev) => ({
            ...prev,
            studentSearch: "No students found",
          }));
        }
      } catch (error) {
        console.error("Error searching students:", error);
        setErrors((prev) => ({
          ...prev,
          studentSearch: "Failed to search students",
        }));
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [studentSearch, showStudentSearch, fetchStudents]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleRadioChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));

    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: null }));
    }
  };

  const handleSelectStudent = (student) => {
    const studentData = {
      studentId: student.studentidno,
      studentName: student.studentname,
    };

    setSelectedStudent(studentData);
    setFormData((prev) => ({ ...prev, studentId: studentData.studentId }));
    setSearchResults([]);
    setStudentSearch("");
    setErrors((prev) => ({ ...prev, studentId: null }));
  };

  const handleClearStudent = () => {
    setSelectedStudent(null);
    setFormData((prev) => ({ ...prev, studentId: null }));
    setSearchResults([]);
    setStudentSearch("");
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const validatePassword = (value) => {
    if (value.length < 8) {
      return "Password must be at least 8 characters";
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = "Name is required";
    }

    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email address is required";
    } else {
      const emailError = validateEmail(formData.emailAddress);
      if (emailError) {
        newErrors.emailAddress = emailError;
      }
    }

    if (mode === "create" && !formData.password) {
      newErrors.password = "Password is required";
    } else if (mode === "create") {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSubmit = getChangedData();
    onSubmit(dataToSubmit);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-700">
            {mode === "create" ? "Create New User" : "Edit User"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new user to the system"
              : "Update user information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <InputField
              id="userName"
              name="userName"
              label="Name"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter user name"
              isRequired
              error={errors.userName}
              onError={(error) =>
                setErrors((prev) => ({ ...prev, userName: error }))
              }
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <User className="w-5 h-5" />
            </div>
          </div>

          <div className="relative">
            <InputField
              id="emailAddress"
              name="emailAddress"
              label="Email Address"
              type="email"
              value={formData.emailAddress}
              onChange={handleChange}
              placeholder="Enter email address"
              isRequired
              error={errors.emailAddress}
              onError={(error) =>
                setErrors((prev) => ({ ...prev, emailAddress: error }))
              }
              validate={validateEmail}
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <Mail className="w-5 h-5" />
            </div>
          </div>

          {mode === "create" && (
            <div className="relative">
              <InputField
                id="password"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                isRequired
                error={errors.password}
                onError={(error) =>
                  setErrors((prev) => ({ ...prev, password: error }))
                }
                validate={validatePassword}
                disabled={isSubmitting}
                inputClassName="pl-10 pr-10"
              />
              <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
                <Lock className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[46px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          )}

          <InputRadio
            label="Role"
            value={formData.role}
            onChange={handleRadioChange}
            options={[
              { label: "Admin", value: "admin" },
              { label: "Teacher", value: "teacher" },
              { label: "Student", value: "student" },
            ]}
            optionsLayout="horizontal"
            isRequired
            error={errors.role}
            onError={(error) => setErrors((prev) => ({ ...prev, role: error }))}
            disabled={isSubmitting}
          />

          {showStudentSearch && (
            <div className="space-y-4 border rounded-xl p-4 bg-gray-50">
              <Label className="text-gray-700 font-medium">
                {selectedStudent ? "Linked Student" : "Link Student"}
              </Label>

              {selectedStudent ? (
                <>
                  <div className="flex items-center justify-between bg-white border rounded-lg p-4">
                    <div>
                      <p className="font-semibold">
                        {selectedStudent.studentName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Student ID: {selectedStudent.studentId}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearStudent}
                      disabled={isSubmitting}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Unlink
                    </Button>
                  </div>

                  {formData.role !== "student" && (
                    <p className="text-sm text-gray-500">
                      This {formData.role} account is currently linked to a
                      student.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="relative">
                    <InputField
                      id="studentSearch"
                      name="studentSearch"
                      label="Search Student"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Search by name or email (min 3 characters)"
                      error={errors.studentSearch}
                      disabled={isSubmitting}
                      inputClassName={isSearching ? "pr-10" : ""}
                    />

                    {isSearching && (
                      <div className="absolute right-3 top-[48px]">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                      </div>
                    )}
                  </div>

                  {isSearching && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Searching students...</span>
                    </div>
                  )}

                  {studentSearch.length > 0 && studentSearch.length < 3 && (
                    <p className="text-sm text-gray-500">
                      Type {3 - studentSearch.length} more character
                      {3 - studentSearch.length > 1 ? "s" : ""}
                    </p>
                  )}

                  {searchResults.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Select a student:</p>

                      <div className="max-h-56 overflow-y-auto space-y-1">
                        {searchResults.map((student) => (
                          <button
                            key={student.studentidno}
                            type="button"
                            onClick={() => handleSelectStudent(student)}
                            disabled={isSubmitting}
                            className="w-full text-left p-3 border rounded-lg bg-white hover:bg-blue-50 hover:border-blue-300 transition"
                          >
                            <p className="font-medium">{student.studentname}</p>
                            <p className="text-sm text-gray-500">
                              ID: {student.studentidno}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {!isSearching &&
                    studentSearch.length >= 3 &&
                    searchResults.length === 0 && (
                      <p className="text-sm text-gray-500">No students found</p>
                    )}
                </>
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
              variant="outline"
              onClick={handleClose}
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
              {isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create User"
                : "Update User"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
